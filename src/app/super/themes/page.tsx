import { listThemes, countTenantsPerTheme } from "@/lib/db/themes";
import { ThemesClient } from "./ThemesCllients";

export const revalidate = 60;

export default async function ThemesPage() {
  const [themes, tenantCounts] = await Promise.all([
    listThemes(),
    countTenantsPerTheme(),
  ]);

  return <ThemesClient initialThemes={themes} tenantCounts={tenantCounts} />;
}
