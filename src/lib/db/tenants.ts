import { prisma } from '@/lib/prisma';

export interface Tenant {
  id: string;
  tenantId: string;
  name: string;
  themeId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export async function listTenants(options: { includeInactive?: boolean } = {}): Promise<Tenant[]> {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (options.includeInactive) return tenants;

  return tenants.filter((t) => t.status === 'active');
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
      status: 'active',
    },
  });
}

export async function updateTenant(
  id: string,
  data: { name?: string; themeId?: string | null }
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
    data: { status: 'archived', updatedAt: new Date() },
  });
}

export async function restoreTenant(id: string): Promise<Tenant> {
  return prisma.tenant.update({
    where: { id },
    data: { status: 'active', updatedAt: new Date() },
  });
}