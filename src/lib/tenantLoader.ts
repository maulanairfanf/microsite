import fs from "fs";
import path from "path";
import type { Theme } from "@/types/components";
import { defaultTheme } from "@/lib/themeDefaults";

export function loadTenantSections(slugParts: string[]) {
  const tenantSlug = slugParts.join("/");
  const base = path.join(process.cwd(), "src", "data", "tenants", tenantSlug, "sections.json");
  if (!fs.existsSync(base)) {
    return null;
  }
  const data = fs.readFileSync(base, "utf-8");
  const parsed = JSON.parse(data);
  return parsed.sections;
}

export function loadTenantTheme(slugParts: string[]): Theme | null {
  const tenantSlug = slugParts.join("/");
  const themePath = path.join(process.cwd(), "src", "data", "tenants", tenantSlug, "theme.json");

  if (!fs.existsSync(themePath)) {
    return defaultTheme;
  }

  try {
    const data = fs.readFileSync(themePath, "utf-8");
    return JSON.parse(data) as Theme;
  } catch (err) {
    console.error("Failed to load tenant theme", err);
    return defaultTheme;
  }
}
