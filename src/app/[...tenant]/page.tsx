"use server";

import { ComponentRenderer } from "@/components/ComponentRenderer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { loadTenantSections, loadTenantTheme } from "@/lib/tenantLoader";
import { redirect } from "next/navigation";

export default async function TenantPage({ 
  params, 
}: { 
  params: Promise<{ tenant: string[] }> 
}) {
  const { tenant } = await params;
  
  // Redirect to home if tenant path is empty
  if (!tenant || tenant.length === 0) {
    redirect("/");
  }

  const sections = loadTenantSections(tenant);
  const theme = loadTenantTheme(tenant);

  return (
    <>
      {theme && <ThemeProvider theme={theme} />}
        <main className="min-h-screen flex items-start justify-center py-0 md:pt-8" style={{ background: "var(--pageBackground)" }}>
            <div className="w-full max-w-lg overflow-hidden container-bg container-border container-shadow" style={{ fontFamily: "var(--headerFontFamily)" }}>
          {sections?.map((component: any, index: number) => (
            <ComponentRenderer key={component.id ?? index} component={component} />
          ))}
        </div>
      </main>
    </>
  );
}
