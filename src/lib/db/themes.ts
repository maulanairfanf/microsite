import { prisma } from '@/lib/prisma';

export interface Theme {
  id: string;
  name: string;
  slug: string;
  config: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export async function listThemes(): Promise<Theme[]> {
  return prisma.theme.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTheme(id: string): Promise<Theme | null> {
  return prisma.theme.findUnique({ where: { id } });
}

export async function getThemeBySlug(slug: string): Promise<Theme | null> {
  return prisma.theme.findUnique({ where: { slug } });
}

export async function createTheme(data: {
  name: string;
  slug: string;
  config?: string;
}): Promise<Theme> {
  return prisma.theme.create({
    data: {
      name: data.name,
      slug: data.slug,
      config: data.config || null,
    },
  });
}

export async function updateTheme(
  id: string,
  data: { name?: string; config?: string }
): Promise<Theme> {
  return prisma.theme.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.config && { config: data.config }),
      updatedAt: new Date(),
    },
  });
}

export async function deleteTheme(id: string): Promise<void> {
  await prisma.theme.delete({ where: { id } });
}