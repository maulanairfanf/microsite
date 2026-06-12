import { prisma } from "@/lib/prisma";
import { Theme as ThemeType, ThemeTokens } from "@/types/components";
import { defaultTokens } from "@/lib/themeDefaults";

export interface Theme {
  id: string;
  name: string;
  slug: string;
  config: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export function parseThemeConfig(theme: Theme): ThemeType {
  if (!theme.config) {
    return {
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      fontFamily: "Inter",
      theme: defaultTokens,
    };
  }

  try {
    const parsed = JSON.parse(theme.config);
    const cardParsed = { ...(parsed.card || {}) };
    if (cardParsed.hoverOpacity !== undefined) {
      cardParsed.hoverOpacity = Number(cardParsed.hoverOpacity);
    }
    return {
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      fontFamily: parsed.fontFamily || "Inter",
      theme: {
        page: { ...defaultTokens.page, ...(parsed.page || {}) },
        container: { ...defaultTokens.container, ...(parsed.container || {}) },
        card: { ...defaultTokens.card, ...cardParsed },
      },
    };
  } catch {
    return {
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      fontFamily: "Inter",
      theme: defaultTokens,
    };
  }
}

export async function listThemes(): Promise<Theme[]> {
  return prisma.theme.findMany({
    orderBy: { createdAt: "desc" },
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
  data: { name?: string; config?: string },
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

export async function countTenantsUsingTheme(themeId: string): Promise<number> {
  return prisma.tenant.count({ where: { themeId } });
}
