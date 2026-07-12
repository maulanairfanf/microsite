import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ThemeClient } from "@/components/admin/ThemeClient";
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { listThemes, parseThemeConfig } from "@/lib/db/themes";
import { Theme } from "@/types/components";

export default async function AdminThemePage() {
  const session = await getSession();
  const tenant = session?.tenantId ? await getTenantByTenantId(session.tenantId) : null;
  const themes = await listThemes();

  if (!tenant) {
    redirect("/admin");
  }

  const parsedThemes: Theme[] = themes.map((theme) => parseThemeConfig(theme));

  return (
    <div>
      <PageHeader title="Theme" description="Choose a theme for your microsite" />
      <ThemeClient
        themes={parsedThemes}
        currentThemeId={tenant.themeId}
        tenantId={tenant.id}
        tenantSlug={tenant.tenantId}
      />
    </div>
  );
}
