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

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-5 text-sm font-medium text-muted-foreground">
          Microsite overview
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="mb-1 text-xs text-muted-foreground">Name</div>
            <div className="font-medium text-foreground">{tenant?.name}</div>
          </div>
          <div>
            <div className="mb-1 text-xs text-muted-foreground">Public page</div>
            <Link href={`/${tenant?.tenantId}`} target="_blank">
              <div className="font-medium text-primary hover:underline">/{tenant?.tenantId}</div>
            </Link>
          </div>
          <div>
            <div className="mb-1 text-xs text-muted-foreground">Theme</div>
            <div className="font-medium text-foreground">{currentTheme?.name || "No theme"}</div>
            <Link href="/admin/theme" className="text-xs text-primary hover:underline">
              Change theme →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Next steps
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/sections">
            <Card className="cursor-pointer border border-border p-4 transition-colors hover:bg-muted">
              <div className="font-medium text-foreground">Manage Sections</div>
              <div className="text-sm text-muted-foreground">Add, edit, or reorder sections</div>
            </Card>
          </Link>
          <Link href="/admin/theme">
            <Card className="cursor-pointer border border-border p-4 transition-colors hover:bg-muted">
              <div className="font-medium text-foreground">Change Theme</div>
              <div className="text-sm text-muted-foreground">Customize your microsite appearance</div>
            </Card>
          </Link>
          <Link href="/admin/settings">
            <Card className="cursor-pointer border border-border p-4 transition-colors hover:bg-muted">
              <div className="font-medium text-foreground">Settings</div>
              <div className="text-sm text-muted-foreground">Update tenant information</div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
