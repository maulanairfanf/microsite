import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/admin/FormFields";
import { getTenant } from "@/lib/db/tenants";
import { listThemes } from "@/lib/db/themes";
import { TenantForm } from "./tenant-form";

interface Props {
  params: Promise<{ tenant_id?: string }>;
}

export const dynamic = "force-dynamic";

export default async function TenantFormPage({ params }: Props) {
  const { tenant_id } = await params;
  const isEdit = tenant_id && tenant_id !== "new";

  const [tenant, themes] = await Promise.all([
    isEdit ? getTenant(tenant_id!) : Promise.resolve(null),
    listThemes(),
  ]);

  const themeOptions = themes.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Tenant" : "Add New Tenant"}
        description={isEdit ? "Update tenant information and settings" : "Create a new tenant for your platform"}
      />
      <Card className="p-6 max-w-2xl">
        <TenantForm
          tenant={tenant ? {
            id: tenant.id,
            tenantId: tenant.tenantId,
            name: tenant.name,
            themeId: tenant.themeId,
          } : undefined}
          themes={themeOptions}
          isEdit={!!isEdit}
        />
      </Card>
    </div>
  );
}