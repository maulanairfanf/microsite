import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { listThemes } from "@/lib/db/themes";
import { TenantSettingsForm } from "@/components/admin/TenantSettingsForm";

export default async function AdminSettingsPage() {
  const session = await getSession();
  const tenant = session?.tenantId ? await getTenantByTenantId(session.tenantId) : null;
  const themes = await listThemes();

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tenant not found</p>
        <Link href="/admin" className="text-primary hover:underline mt-2 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const themeOptions = themes.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <div>
      <PageHeader title="Settings" description="Manage your tenant settings" />
      <Card className="p-6 max-w-2xl">
        <TenantSettingsForm tenant={tenant} themes={themeOptions} />
      </Card>
    </div>
  );
}
