import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Role, Plan } from "@/lib/constants";
import { getTenantByTenantId } from "@/lib/db/tenants";
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

  const tenant = session.tenantId ? await getTenantByTenantId(session.tenantId) : null;
  const tenantPlan = tenant?.plan === Plan.Premium ? Plan.Premium : Plan.Free;

  return (
    <AdminShell
      role={session.role}
      tenantName={tenant?.name}
      tenantPlan={tenantPlan}
      userName={session.name}
      userEmail={session.email}
      isImpersonating={isImpersonatingSuperAdmin}
    >
      {children}
    </AdminShell>
  );
}
