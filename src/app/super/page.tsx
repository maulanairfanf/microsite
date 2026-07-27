import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { listTenants } from "@/lib/db/tenants";
import { listThemes } from "@/lib/db/themes";

export const dynamic = "force-dynamic";

export default async function SuperDashboard() {
  const tenants = await listTenants();
  const themes = await listThemes();

  return (
    <div>
      <PageHeader title="Dashboard" description="Welcome back, manage your platform" />

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-6">
          <div className="text-3xl font-bold text-primary">{tenants.length}</div>
          <div className="text-sm text-gray-500 mt-1">Total Tenants</div>
        </Card>
        <Card className="p-6">
          <div className="text-3xl font-bold text-primary">{themes.length}</div>
          <div className="text-sm text-gray-500 mt-1">Available Themes</div>
        </Card>
        <Card className="p-6">
          <div className="text-3xl font-bold text-primary">
            {tenants.filter((t) => t.status === "active").length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Active Tenants</div>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex gap-3">
          <Link href="/super/tenants/new">
            <Button>Add New Tenant</Button>
          </Link>
          <Link href="/super/themes/new">
            <Button variant="secondary">Create Theme</Button>
          </Link>
        </div>
      </Card>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Tenants</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  URL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants.slice(0, 5).map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{tenant.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">/{tenant.tenantId}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={tenant.status === "active" ? "default" : "secondary"}
                      className={tenant.status === "archived" ? "bg-gray-100 text-gray-600" : ""}
                    >
                      {tenant.status === "active" ? (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Archived
                        </span>
                      )}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
