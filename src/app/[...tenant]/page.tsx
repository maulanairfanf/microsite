"use server";

import type { Theme } from "@/types/components";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { getSectionsByTenant } from "@/lib/db/sections";
import { getTheme } from "@/lib/db/themes";
import { notFound } from "next/navigation";

export default async function TenantPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string[] }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { tenant } = await params;
  const { preview: previewThemeId } = await searchParams;

  if (!tenant || tenant.length === 0) {
    return notFound();
  }

  const tenantSlug = tenant.join("/");

  const tenantData = await getTenantByTenantId(tenantSlug);
  if (!tenantData) {
    return notFound();
  }

  const sections = await getSectionsByTenant(tenantSlug);

  const themeIdToUse = previewThemeId || tenantData.themeId;

  let theme: Theme | null = null;
  if (themeIdToUse) {
    const themeData = await getTheme(themeIdToUse);
    if (themeData?.config) {
      const parsedConfig = JSON.parse(themeData.config);
      theme = {
        id: themeData.id,
        name: themeData.name,
        fontFamily: parsedConfig.fontFamily || "Inter",
        theme: {
          page: parsedConfig.page,
          container: parsedConfig.container,
          card: parsedConfig.card,
        },
      };
    }
  }

  if (!sections || sections.length === 0) {
    return notFound();
  }

  return (
    <>
      {theme && <ThemeProvider theme={theme} />}
      <main className="min-h-screen flex items-start justify-center py-0 md:pt-8 bg-page">
        <div className="w-full max-w-lg overflow-hidden container-bg container-border container-shadow header-font">
          {sections.map((section: any, index: number) => {
            const componentType = section.component?.name
              ? section.component.name.toLowerCase().replace(/\s+/g, "_")
              : section.component;
            return (
              <ComponentRenderer key={section.id ?? index} component={{
                id: section.id,
                type: componentType,
                ...(section.configJson ? JSON.parse(section.configJson) : {})
              }} />
            );
          })}
        </div>
      </main>
    </>
  );
}
