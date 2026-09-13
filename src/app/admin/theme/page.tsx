import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/admin/PageHeader";
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { listThemes } from "@/lib/db/themes";
import { parseThemeConfig } from "@/lib/themeConfig";
import { Theme } from "@/types/components";

const ThemeClient = dynamic(() => import("@/components/admin/ThemeClient").then((mod) => ({ default: mod.ThemeClient })), {
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />,
});

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
