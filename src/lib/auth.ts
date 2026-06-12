import { cookies } from "next/headers";

export type Role = "super_admin" | "tenant_main_admin" | "tenant_admin";

export interface Session {
  userId: string;
  email: string;
  role: Role;
  name: string;
  tenantId?: string;
  isImpersonating?: boolean;
  originalRole?: Role;
  originalTenantId?: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value);
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
  return role === "tenant_main_admin" || role === "super_admin";
}
