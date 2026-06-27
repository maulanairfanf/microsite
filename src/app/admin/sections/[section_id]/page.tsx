import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { getSession } from "@/lib/auth";
import { getSection, countHeroSectionsForTenant } from "@/lib/db/sections";
import { listComponents } from "@/lib/db/components";
import { TenantSectionForm } from "@/components/admin/TenantSectionForm";
import { ComponentName } from "@/lib/components/componentNames";

interface Props {
  params: Promise<{ section_id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminSectionFormPage({ params }: Props) {
  const { section_id } = await params;
  const session = await getSession();
  const tenantId = session?.tenantId;
  const isEdit = section_id && section_id !== "new";

  if (!tenantId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tenant not found</p>
        <Link href="/admin" className="text-primary hover:underline mt-2 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const [section, components, heroCount] = await Promise.all([
    isEdit ? getSection(section_id) : Promise.resolve(null),
    listComponents(),
    countHeroSectionsForTenant(tenantId, isEdit ? section_id : undefined),
  ]);

  const isEditingHero = section?.component?.name === ComponentName.Hero;
  const hideHeroOption = heroCount > 0 && !isEditingHero;

  const componentOptions = components
    .filter((c) => !(hideHeroOption && c.name === ComponentName.Hero))
    .map((c) => ({
      value: c.id,
      label: c.displayName ?? c.name,
      configSchema: c.configSchema || undefined,
    }));

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Section" : "Add New Section"}
        description="Configure your section component and settings"
      />
      <Card className="p-6 max-w-2xl">
        <TenantSectionForm
          tenantId={tenantId}
          section={
            section
              ? {
                  id: section.id,
                  component: section.component,
                  componentId: section.component?.id || null,
                  order: section.order,
                  configJson: section.configJson || undefined,
                }
              : undefined
          }
          components={componentOptions}
          isEdit={!!isEdit}
        />
      </Card>
    </div>
  );
}
