import fs from "fs";
import path from "path";
import type { Theme } from "@/types/components";

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
    // Return default cleanGray theme if theme.json doesn't exist
    return {
      name: "cleanGray",
      fontFamily: "Inter",
      colorScheme: "gray",
      background: {
        type: "solid",
        color: "#f3f4f6"
      }
    };
  }
  
  const data = fs.readFileSync(themePath, "utf-8");
  return JSON.parse(data);
}
