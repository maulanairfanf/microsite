import { cookies } from "next/headers";

import type { Session } from "@/lib/constants";
import { Plan, Role } from "@/lib/constants";

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie.value) as Session;
    if (session && !session.tenantPlan) {
      session.tenantPlan = Plan.Free;
    }
    return session;
  } catch {
    return null;
  }
}

export async function setSession(session: Session) {
  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export function isAuthenticated(session: Session | null, requiredRole: Role | "any"): boolean {
  if (!session) return false;
  if (requiredRole === "any") return true;
  return session.role === requiredRole;
}

export function canManageUsers(role: Role): boolean {
  return role === Role.TenantMainAdmin || role === Role.SuperAdmin;
}
