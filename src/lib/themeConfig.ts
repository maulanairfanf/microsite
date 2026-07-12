import type { Theme as ThemeType } from "@/types/components";
import { defaultTokens } from "./themeDefaults";

export interface ThemeRecord {
  id: string;
  name: string;
  slug: string;
  config: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

function defaultTheme(theme: ThemeRecord): ThemeType {
  return {
    id: theme.id,
    name: theme.name,
    slug: theme.slug,
    fontFamily: "Inter",
    theme: defaultTokens,
  };
}

export function parseThemeConfig(theme: ThemeRecord): ThemeType {
  if (!theme.config) {
    return defaultTheme(theme);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(theme.config);
  } catch (err) {
    console.warn(`parseThemeConfig: failed to parse config for theme ${theme.id}`, err);
    return defaultTheme(theme);
  }

  if (!parsed || typeof parsed !== "object") {
    console.warn(`parseThemeConfig: config for theme ${theme.id} is not an object`);
    return defaultTheme(theme);
  }

  const obj = parsed as Record<string, unknown>;

  // Defensive: accept both wrapped ({ theme: { page, container, card } })
  // and flat ({ page, container, card }) shapes.
  let tokens: Record<string, unknown>;
  if (obj.theme && typeof obj.theme === "object") {
    const wrapped = obj.theme as Record<string, unknown>;
    if (wrapped.page || wrapped.container || wrapped.card) {
      tokens = wrapped;
    } else {
      console.warn(
        `parseThemeConfig: theme ${theme.id} config has empty "theme" wrapper; using flat shape`,
      );
      tokens = obj;
    }
  } else {
    tokens = obj;
  }

  const fontFamily = typeof obj.fontFamily === "string" ? obj.fontFamily : "Inter";

  const cardParsed: Record<string, unknown> = {
    ...((tokens.card as Record<string, unknown>) || {}),
  };
  if (cardParsed.hoverOpacity !== undefined) {
    cardParsed.hoverOpacity = Number(cardParsed.hoverOpacity);
  }

  return {
    id: theme.id,
    name: theme.name,
    slug: theme.slug,
    fontFamily,
    theme: {
      page: { ...defaultTokens.page, ...((tokens.page as Record<string, unknown>) || {}) },
      container: {
        ...defaultTokens.container,
        ...((tokens.container as Record<string, unknown>) || {}),
      },
      card: { ...defaultTokens.card, ...cardParsed },
    },
  };
}
