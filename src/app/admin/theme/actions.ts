"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateTenant } from "@/lib/db/tenants";

export async function setTenantTheme(tenantId: string, themeId: string) {
  await updateTenant(tenantId, { themeId });
  revalidatePath("/admin/theme");
  redirect("/admin/theme");
}
