import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getTenantByTenantId } from '@/lib/db/tenants';
import { Sidebar } from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const isTenantUser = session.role === 'tenant_main_admin' || session.role === 'tenant_admin';
  const isImpersonatingSuperAdmin = session.originalRole === 'super_admin' && session.isImpersonating;

  if (!isTenantUser && !isImpersonatingSuperAdmin) {
    redirect('/login');
  }

  const tenant = session.tenantId ? await getTenantByTenantId(session.tenantId) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        role={session.role}
        tenantName={tenant?.name}
        userName={session.name}
        userEmail={session.email}
        isImpersonating={isImpersonatingSuperAdmin}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}