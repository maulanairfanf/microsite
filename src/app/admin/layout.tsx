import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Role, Plan } from "@/lib/constants";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { getUserById } from "@/lib/db/users";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const isTenantUser = session.role === Role.TenantMainAdmin || session.role === Role.TenantAdmin;
  const isImpersonatingSuperAdmin =
    session.originalRole === Role.SuperAdmin && session.isImpersonating;

  if (!isTenantUser && !isImpersonatingSuperAdmin) {
    redirect("/login");
  }

  const [tenant, user] = await Promise.all([
    session.tenantId ? getTenantByTenantId(session.tenantId) : null,
    getUserById(session.userId),
  ]);

  const tenantPlan = tenant?.plan === Plan.Premium ? Plan.Premium : Plan.Free;
  const emailVerified = Boolean(user?.emailVerified);

  return (
    <AdminShell
      role={session.role}
      tenantName={tenant?.name}
      tenantPlan={tenantPlan}
      userName={session.name}
      userEmail={session.email}
      isImpersonating={isImpersonatingSuperAdmin}
      emailVerified={emailVerified}
    >
      {children}
    </AdminShell>
  );
}
