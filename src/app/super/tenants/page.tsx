import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/components-extended";
import { PageHeader } from "@/components/admin/PageHeader";
import { listTenants } from "@/lib/db/tenants";
import { listThemes } from "@/lib/db/themes";
import { TenantsTable } from "./tenants-table";

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
  const tenants = await listTenants({ includeInactive: true });
  const themes = await listThemes();

  const themeMap = new Map(themes.map((t) => [t.id, t]));

  if (tenants.length === 0) {
    return (
      <div>
        <PageHeader
          title="Tenants"
          description="Manage your microsites"
          action={
            <Link href="/super/tenants/new">
              <Button>Add Tenant</Button>
            </Link>
          }
        />
        <Card className="p-6">
          <EmptyState
            title="No tenants yet"
            description="Create your first tenant to get started"
            action={
              <Link href="/super/tenants/new">
                <Button>Add Tenant</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Tenants"
        description={`${tenants.length} tenant${tenants.length !== 1 ? "s" : ""} total`}
        action={
          <Link href="/super/tenants/new">
            <Button>Add Tenant</Button>
          </Link>
        }
      />

      <TenantsTable tenants={tenants} themeMap={themeMap} />
    </div>
  );
}
