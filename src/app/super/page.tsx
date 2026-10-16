import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { listTenants } from "@/lib/db/tenants";
import { listThemes } from "@/lib/db/themes";

export const revalidate = 60;

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
        <h3 className="font-semibold text-foreground mb-4">Recent Tenants</h3>
        <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  URL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tenants.slice(0, 5).map((tenant) => (
                <tr key={tenant.id} className="hover:bg-muted">
                  <td className="px-4 py-3 text-sm text-foreground">{tenant.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">/{tenant.tenantId}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={tenant.status === "active" ? "default" : "secondary"}
                      className={tenant.status === "archived" ? "bg-muted text-muted-foreground" : ""}
                    >
                      {tenant.status === "active" ? (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
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
