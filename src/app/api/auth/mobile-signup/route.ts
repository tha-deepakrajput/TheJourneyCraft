import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (existingUser) {
      // If user exists but is not verified, allow re-registration
      if (!existingUser.verified) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const code = generateVerificationCode();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);

        await db
          .update(users)
          .set({
            name,
            password: hashedPassword,
            verificationCode: code,
            verificationCodeExpiry: expiry,
            updatedAt: new Date(),
          })
          .where(eq(users.email, email.toLowerCase()));

        await sendVerificationEmail(email.toLowerCase(), code, name);

        return NextResponse.json({
          success: true,
          message: "Verification code sent to your email",
          requiresVerification: true,
        });
      }

      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.insert(users).values({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "Explorer",
      verified: false,
      verificationCode: code,
      verificationCodeExpiry: expiry,
    });

    // Send verification email
    await sendVerificationEmail(email.toLowerCase(), code, name);

    return NextResponse.json({
      success: true,
      message: "Account created! Please verify your email.",
      requiresVerification: true,
    });
  } catch (error: any) {
    console.error("Mobile signup error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
