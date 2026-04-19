import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { success: false, error: "Email is already verified" },
        { status: 400 }
      );
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (
      user.verificationCodeExpiry &&
      new Date() > new Date(user.verificationCodeExpiry)
    ) {
      return NextResponse.json(
        { success: false, error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Mark user as verified
    await db
      .update(users)
      .set({
        verified: true,
        verificationCode: null,
        verificationCodeExpiry: null,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email.toLowerCase()));

    // Generate JWT token for mobile auto-login
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev"
    );

    const token = await new SignJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error: any) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
