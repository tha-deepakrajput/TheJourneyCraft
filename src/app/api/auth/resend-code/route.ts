import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
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

    const code = generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db
      .update(users)
      .set({
        verificationCode: code,
        verificationCodeExpiry: expiry,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email.toLowerCase()));

    await sendVerificationEmail(email.toLowerCase(), code, user.name);

    return NextResponse.json({
      success: true,
      message: "Verification code resent to your email",
    });
  } catch (error: any) {
    console.error("Resend code error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
