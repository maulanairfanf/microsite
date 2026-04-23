"use server";

import { ComponentRenderer } from "@/components/ComponentRenderer";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  loadTenantSections,
  loadTenantTheme,
  loadTenantSectionsFromSheets,
  loadTenantThemeFromSheets,
} from "@/lib/tenantLoader";
import { redirect } from "next/navigation";

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string[] }>
}) {
  const { tenant } = await params;

  if (!tenant || tenant.length === 0) {
    redirect("/");
  }

  const tenantSlug = tenant.join("/");

  let sections = await loadTenantSectionsFromSheets(tenant);
  console.log('sections from sheets', sections);
  let theme = await loadTenantThemeFromSheets(tenant);

  if (sections === null || theme === null) {
    const localSections = loadTenantSections(tenant);
    const localTheme = loadTenantTheme(tenant);

    sections = localSections ?? sections;
    theme = localTheme ?? theme;
  }

  if (!sections) {
    redirect("/");
  }

  return (
    <>
      {theme && <ThemeProvider theme={theme} />}
      <main className="min-h-screen flex items-start justify-center py-0 md:pt-8 bg-page">
        <div className="w-full max-w-lg overflow-hidden container-bg container-border container-shadow header-font">
          {sections?.map((component: any, index: number) => (
            <ComponentRenderer key={component.id ?? index} component={component} />
          ))}
        </div>
      </main>
    </>
  );
}