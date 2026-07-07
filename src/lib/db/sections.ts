import { prisma } from "@/lib/prisma";
import type { SectionWithComponent } from "@/lib/db/types";

const sectionSelect = {
  id: true,
  tenantId: true,
  order: true,
  configJson: true,
  createdAt: true,
  updatedAt: true,
  component: {
    select: { id: true, name: true, displayName: true },
  },
} as const;

export async function listSections(
  options: { tenantId?: string } = {},
): Promise<SectionWithComponent[]> {
  return prisma.section.findMany({
    where: options.tenantId ? { tenantId: options.tenantId } : undefined,
    orderBy: { order: "asc" },
    select: sectionSelect,
  });
}

export async function getSection(id: string): Promise<SectionWithComponent | null> {
  return prisma.section.findUnique({
    where: { id },
    select: sectionSelect,
  });
}

export async function getSectionsByTenant(tenantId: string): Promise<SectionWithComponent[]> {
  return listSections({ tenantId });
}

export async function createSection(data: {
  tenantId: string;
  componentId?: string | null;
  order?: number;
  configJson?: string;
}): Promise<SectionWithComponent> {
  return prisma.section.create({
    data: {
      tenantId: data.tenantId,
      componentId: data.componentId || null,
      order: data.order || 0,
      configJson: data.configJson || null,
    },
    select: sectionSelect,
  });
}

export async function updateSection(
  id: string,
  data: { componentId?: string | null; order?: number; configJson?: string },
): Promise<SectionWithComponent> {
  return prisma.section.update({
    where: { id },
    data: {
      ...(data.componentId !== undefined && { componentId: data.componentId }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.configJson !== undefined && { configJson: data.configJson }),
      updatedAt: new Date(),
    },
    select: sectionSelect,
  });
}

export async function deleteSection(id: string): Promise<void> {
  await prisma.section.delete({ where: { id } });
}

export async function findHeroSectionForTenant(
  tenantId: string,
): Promise<SectionWithComponent | null> {
  return prisma.section.findFirst({
    where: {
      tenantId,
      component: { name: "Hero" },
    },
    select: sectionSelect,
  });
}

export async function countHeroSectionsForTenant(
  tenantId: string,
  excludeSectionId?: string,
): Promise<number> {
  return prisma.section.count({
    where: {
      tenantId,
      component: { name: "hero" },
      ...(excludeSectionId ? { NOT: { id: excludeSectionId } } : {}),
    },
  });
}
