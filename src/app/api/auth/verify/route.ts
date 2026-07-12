import { NextRequest, NextResponse } from "next/server";
import { getUserByVerificationToken, verifyUserEmail } from "@/lib/db/users";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?status=error&reason=missing", request.url));
  }

  try {
    const user = await getUserByVerificationToken(token);

    if (!user) {
      return NextResponse.redirect(
        new URL("/verify-email?status=error&reason=invalid", request.url),
      );
    }

    await verifyUserEmail(user.id);

    return NextResponse.redirect(
      new URL("/verify-email?status=success", request.url),
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/verify-email?status=error&reason=server", request.url),
    );
  }
}
