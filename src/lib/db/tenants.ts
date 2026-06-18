import { prisma } from "@/lib/prisma";

export const TenantStatus = {
  Active: "active",
  Archived: "archived",
} as const;
export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus];

export interface Tenant {
  id: string;
  tenantId: string;
  name: string;
  themeId: string | null;
  status: string;
  plan: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export async function listTenants(options: { includeInactive?: boolean } = {}): Promise<Tenant[]> {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (options.includeInactive) return tenants;

  return tenants.filter((t) => t.status === TenantStatus.Active);
}

export async function getTenant(id: string): Promise<Tenant | null> {
  return prisma.tenant.findUnique({ where: { id } });
}

export async function getTenantByTenantId(tenantId: string): Promise<Tenant | null> {
  return prisma.tenant.findUnique({ where: { tenantId } });
}

export async function createTenant(data: {
  tenantId: string;
  name: string;
  themeId?: string | null;
}): Promise<Tenant> {
  return prisma.tenant.create({
    data: {
      tenantId: data.tenantId,
      name: data.name,
      themeId: data.themeId || null,
      status: TenantStatus.Active,
    },
  });
}

export async function updateTenant(
  id: string,
  data: { name?: string; themeId?: string | null },
): Promise<Tenant> {
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.themeId !== undefined) updateData.themeId = data.themeId;
  updateData.updatedAt = new Date();

  return prisma.tenant.update({
    where: { id },
    data: updateData,
  });
}

export async function archiveTenant(id: string): Promise<Tenant> {
  return prisma.tenant.update({
    where: { id },
    data: { status: TenantStatus.Archived, updatedAt: new Date() },
  });
}

export async function restoreTenant(id: string): Promise<Tenant> {
  return prisma.tenant.update({
    where: { id },
    data: { status: TenantStatus.Active, updatedAt: new Date() },
  });
}

export async function deleteTenant(id: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.user.deleteMany({ where: { tenantId: id } });
    await tx.tenant.delete({ where: { id } });
  });
}
