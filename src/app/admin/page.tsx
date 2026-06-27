import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { listThemes } from "@/lib/db/themes";

export default async function AdminDashboard() {
  const session = await getSession();
  const tenant = session?.tenantId ? await getTenantByTenantId(session.tenantId) : null;
  const themes = await listThemes();

  const currentTheme = tenant?.themeId ? themes.find((t) => t.id === tenant.themeId) : null;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Manage your microsite"
        action={
          <Link href="/admin/sections">
            <Button variant="secondary">Manage Sections</Button>
          </Link>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          Your Info
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Name</div>
            <div className="font-medium text-gray-900">{tenant?.name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">URL Slug</div>
            <Link href={`/${tenant?.tenantId}`} target="_blank">
              <div className="font-medium text-purple-600 hover:underline">/{tenant?.tenantId}</div>
            </Link>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Theme</div>
            <div className="font-medium text-gray-900">{currentTheme?.name || "No theme"}</div>
            <Link href="/admin/theme" className="text-xs text-purple-600 hover:underline">
              Change theme →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/sections">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="font-medium text-gray-900">Manage Sections</div>
              <div className="text-sm text-gray-500">Add, edit, or reorder sections</div>
            </Card>
          </Link>
          <Link href="/admin/theme">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="font-medium text-gray-900">Change Theme</div>
              <div className="text-sm text-gray-500">Customize your microsite appearance</div>
            </Card>
          </Link>
          <Link href="/admin/settings">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="font-medium text-gray-900">Settings</div>
              <div className="text-sm text-gray-500">Update tenant information</div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
