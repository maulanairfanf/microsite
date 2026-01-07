import fs from "fs";
import path from "path";

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
