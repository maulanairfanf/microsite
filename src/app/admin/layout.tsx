import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const isTenantUser = session.role === "tenant_main_admin" || session.role === "tenant_admin";
  const isImpersonatingSuperAdmin =
    session.originalRole === "super_admin" && session.isImpersonating;

  if (!isTenantUser && !isImpersonatingSuperAdmin) {
    redirect("/login");
  }

  const tenant = session.tenantId ? await getTenantByTenantId(session.tenantId) : null;

  return (
    <AdminShell
      role={session.role}
      tenantName={tenant?.name}
      userName={session.name}
      userEmail={session.email}
      isImpersonating={isImpersonatingSuperAdmin}
    >
      {children}
    </AdminShell>
  );
}
