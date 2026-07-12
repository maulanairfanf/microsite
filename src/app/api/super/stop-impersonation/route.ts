import { NextResponse } from "next/server";
import { getSession, setSession } from "@/lib/auth";
import { Role } from "@/lib/constants";

export async function POST() {
  try {
    const session = await getSession();

    if (!session || !session.isImpersonating) {
      return NextResponse.json({ error: "Not currently impersonating" }, { status: 400 });
    }

    const restoredSession = {
      userId: session.userId,
      email: session.email,
      role: session.originalRole || Role.SuperAdmin,
      name: session.name,
      tenantId: session.originalTenantId,
      isImpersonating: false,
      originalRole: undefined,
      originalTenantId: undefined,
    };

    await setSession(restoredSession);

    return NextResponse.json({
      success: true,
      redirectUrl: "/super",
    });
  } catch (error) {
    console.error("Stop impersonation error:", error);
    return NextResponse.json({ error: "Failed to stop impersonation" }, { status: 500 });
  }
}
