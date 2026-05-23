import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ThemeClient } from "@/components/admin/ThemeClient";
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { listThemes } from "@/lib/db/themes";
import { Theme } from "@/types/components";
import { defaultTokens } from "@/lib/themeDefaults";

export default async function AdminThemePage() {
  const session = await getSession();
  const tenant = session?.tenantId ? await getTenantByTenantId(session.tenantId) : null;
  const themes = await listThemes();

  if (!tenant) {
    redirect("/admin");
  }

  const parsedThemes: Theme[] = themes.map((theme) => {
    let parsedConfig = {
      page: defaultTokens.page,
      container: defaultTokens.container,
      card: defaultTokens.card,
    };
    let fontFamily = "Inter";

    try {
      if (theme.config) {
        const config = JSON.parse(theme.config);
        fontFamily = config.fontFamily || "Inter";
        parsedConfig = {
          page: { ...defaultTokens.page, ...config.page },
          container: { ...defaultTokens.container, ...config.container },
          card: { ...defaultTokens.card, ...config.card },
        };
      }
    } catch {}

    return {
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      fontFamily,
      theme: parsedConfig,
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt,
    };
  });

  return (
    <div>
      <PageHeader
        title="Theme"
        description="Choose a theme for your microsite"
      />
      <ThemeClient
        themes={parsedThemes}
        currentThemeId={tenant.themeId}
        tenantId={tenant.id}
        tenantSlug={tenant.tenantId}
      />
    </div>
  );
}
