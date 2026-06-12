import { prisma } from "@/lib/prisma";

export interface SectionListItem {
  id: string;
  tenantId: string;
  order: number;
  configJson: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  component: { id: string; name: string } | null;
}

export async function listSections(
  options: { tenantId?: string } = {},
): Promise<SectionListItem[]> {
  return prisma.section.findMany({
    where: options.tenantId ? { tenantId: options.tenantId } : undefined,
    orderBy: { order: "asc" },
    select: {
      id: true,
      tenantId: true,
      order: true,
      configJson: true,
      createdAt: true,
      updatedAt: true,
      component: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function getSection(id: string): Promise<SectionListItem | null> {
  const section = await prisma.section.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true,
      order: true,
      configJson: true,
      createdAt: true,
      updatedAt: true,
      component: {
        select: { id: true, name: true },
      },
    },
  });
  return section;
}

export async function getSectionsByTenant(tenantId: string): Promise<SectionListItem[]> {
  return listSections({ tenantId });
}

export async function createSection(data: {
  tenantId: string;
  componentId?: string | null;
  order?: number;
  configJson?: string;
}): Promise<SectionListItem> {
  return prisma.section.create({
    data: {
      tenantId: data.tenantId,
      componentId: data.componentId || null,
      order: data.order || 0,
      configJson: data.configJson || null,
    },
    select: {
      id: true,
      tenantId: true,
      order: true,
      configJson: true,
      createdAt: true,
      updatedAt: true,
      component: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function updateSection(
  id: string,
  data: { componentId?: string | null; order?: number; configJson?: string },
): Promise<SectionListItem> {
  return prisma.section.update({
    where: { id },
    data: {
      ...(data.componentId !== undefined && { componentId: data.componentId }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.configJson !== undefined && { configJson: data.configJson }),
      updatedAt: new Date(),
    },
    select: {
      id: true,
      tenantId: true,
      order: true,
      configJson: true,
      createdAt: true,
      updatedAt: true,
      component: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function deleteSection(id: string): Promise<void> {
  await prisma.section.delete({ where: { id } });
}

export async function findHeroSectionForTenant(
  tenantId: string,
): Promise<SectionListItem | null> {
  return prisma.section.findFirst({
    where: {
      tenantId,
      component: { name: "Hero" },
    },
    select: {
      id: true,
      tenantId: true,
      order: true,
      configJson: true,
      createdAt: true,
      updatedAt: true,
      component: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function countHeroSectionsForTenant(
  tenantId: string,
  excludeSectionId?: string,
): Promise<number> {
  return prisma.section.count({
    where: {
      tenantId,
      component: { name: "Hero" },
      ...(excludeSectionId ? { NOT: { id: excludeSectionId } } : {}),
    },
  });
}
