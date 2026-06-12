import { listThemes, countTenantsUsingTheme } from "@/lib/db/themes";
import { ThemesClient } from "./themes-client";

export const dynamic = "force-dynamic";

export default async function ThemesPage() {
  const themes = await listThemes();

  const tenantCounts: Record<string, number> = {};
  await Promise.all(
    themes.map(async (t) => {
      tenantCounts[t.id] = await countTenantsUsingTheme(t.id);
    }),
  );

  return <ThemesClient initialThemes={themes} tenantCounts={tenantCounts} />;
}
