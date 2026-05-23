'use client';

import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/admin/FormFields";
import { clientApi } from "@/lib/client-api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TenantFormProps {
  tenant?: {
    id: string;
    tenantId: string;
    name: string;
    themeId: string | null;
  };
  themes: { value: string; label: string }[];
  isEdit: boolean;
}

export function TenantForm({ tenant, themes, isEdit }: TenantFormProps) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const tenantId = formData.get("tenantId") as string;
    const name = formData.get("name") as string;
    const themeId = formData.get("themeId") as string;

    if (isEdit && tenant?.id) {
      await clientApi.put(`/api/tenants/${tenant.id}`, { name, themeId: themeId || null });
    } else {
      await clientApi.post('/api/tenants', { tenantId, name, themeId: themeId || null });
    }

    router.push('/super/tenants');
    router.refresh();
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-4">
        <Input
          name="tenantId"
          label="Tenant ID"
          placeholder="my-tenant"
          defaultValue={tenant?.tenantId}
          required
          disabled={isEdit}
        />

        <Input
          name="name"
          label="Name"
          placeholder="My Tenant Name"
          defaultValue={tenant?.name}
          required
        />

        {themes.length > 0 ? (
          <Select
            name="themeId"
            label="Theme"
            options={themes}
            defaultValue={tenant?.themeId ?? undefined}
          />
        ) : (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              No themes available.{" "}
              <Link href="/super/themes/new" className="underline">
                Create a theme first
              </Link>
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="submit">
          {isEdit ? "Save Changes" : "Create Tenant"}
        </Button>
        <Link href="/super/tenants">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}