import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById, setEmailVerificationToken } from "@/lib/db/users";
import {
  generateEmailVerificationToken,
  getEmailVerificationTokenExpiry,
  isEmailConfigured,
  sendVerificationEmail,
} from "@/lib/email";

async function resendEmail(userId: string, email: string, name: string): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn("[email] RESEND_API_KEY not configured, skipping resend");
    return;
  }
  const token = generateEmailVerificationToken();
  const expiresAt = getEmailVerificationTokenExpiry();
  await setEmailVerificationToken(userId, token, expiresAt);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verificationUrl = `${appUrl}/api/auth/verify?token=${token}`;
  try {
    await sendVerificationEmail({ to: email, name, verificationUrl });
  } catch (err) {
    console.error("[email] Failed to resend verification email:", err);
  }
}

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: "Email already verified" });
    }

    await resendEmail(user.id, user.email, user.name);

    return NextResponse.json({ success: true, message: "Verification email sent" });
  } catch (error) {
    console.error("POST /api/auth/resend-verification error:", error);
    return NextResponse.json({ error: "Failed to resend verification email" }, { status: 500 });
  }
}
