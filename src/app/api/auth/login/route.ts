import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/db/users";
import { setSession } from "@/lib/auth";
import { Plan, Role } from "@/lib/constants";
import { getTenant } from "@/lib/db/tenants";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(user, password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    let tenantId: string | undefined;

    if (user.tenantId) {
      const tenant = await getTenant(user.tenantId);
      if (tenant) {
        tenantId = tenant.tenantId;
      }
    }

    const session = {
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      name: user.name,
      tenantId,
      tenantPlan: Plan.Free,
    };

    await setSession(session);

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
