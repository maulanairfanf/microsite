"use client";

import { Theme } from "@/types/components";
import { defaultTokens } from "@/lib/themeDefaults";
import { computeHoverBackground } from "@/lib/themeTokens";
import { useEffect } from "react";

// Google Fonts mapping
const fontFamilies: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  Poppins: "'Poppins', sans-serif",
  Roboto: "'Roboto', sans-serif",
  "Open Sans": "'Open Sans', sans-serif",
  Lato: "'Lato', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
  "Playfair Display": "'Playfair Display', serif",
  Merriweather: "'Merriweather', serif",
  Oxanium: "'Oxanium', sans-serif",
};

type TokenPreset = Record<string, string>;

interface ThemeProviderProps {
  theme: Theme;
}

export function ThemeProvider({ theme }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    const merged = mergeThemeWithDefaults(theme);

    const pageBg = normalizeColor(merged.theme.page.background);

    const cardBg = normalizeColor(merged.theme.card.background);
    const cardHoverBg = computeHoverBackground(merged.theme.card, cardBg);

    const bodyText =
      merged.theme.page.text || merged.theme.card.text || defaultTokens.page.text || "#111827";
    const headerText =
      merged.theme.page.headerText ||
      merged.theme.page.text ||
      defaultTokens.page.headerText ||
      bodyText;
    const headerFont = resolveFontStack(merged.fontFamily || "Inter");

    const tokenMap: TokenPreset = {
      "--pageBackground": pageBg,
      "--bodyText": bodyText,
      "--headerTextColor": headerText,
      "--headerFontFamily": headerFont,
      "--containerBackground": merged.theme.container.background,
      "--containerRadius": merged.theme.container.radius || defaultTokens.container.radius || "",
      "--containerBorder": merged.theme.container.border || defaultTokens.container.border || "",
      "--containerShadow": merged.theme.container.shadow || defaultTokens.container.shadow || "",
      "--cardBackground": cardBg,
      "--cardHoverBackground": cardHoverBg,
      "--cardText": merged.theme.card.text || defaultTokens.card.text || "",
      "--cardBorder": merged.theme.card.border || defaultTokens.card.border || "",
      "--cardShadow": merged.theme.card.shadow || defaultTokens.card.shadow || "",
      "--cardRadius": merged.theme.card.radius || defaultTokens.card.radius || "",
    };

    Object.entries(tokenMap).forEach(([k, v]) => root.style.setProperty(k, v));

    loadGoogleFontFromStack(headerFont);
  }, [theme]);

  return null;
}

function mergeThemeWithDefaults(theme: Theme): Theme {
  const safeTheme =
    theme || ({ name: "cleanGray", fontFamily: "Inter", theme: defaultTokens } as Theme);
  return {
    ...safeTheme,
    theme: {
      page: { ...defaultTokens.page, ...(safeTheme.theme?.page || {}) },
      container: { ...defaultTokens.container, ...(safeTheme.theme?.container || {}) },
      card: { ...defaultTokens.card, ...(safeTheme.theme?.card || {}) },
    },
  };
}

function resolveFontStack(fontFamily: string) {
  const known = fontFamilies[fontFamily];
  if (known) return known;
  const trimmed = fontFamily.trim();
  if (!trimmed) return fontFamilies.Inter || "'Inter', sans-serif";
  return `'${trimmed}', sans-serif`;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const int = parseInt(full, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function normalizeColor(value: string, opacity = 1) {
  if (!value) return "";
  const trimmed = value.trim();

  const rgbMatch = trimmed.match(/^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})$/);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch.slice(1).map(Number);
    return opacity < 1 ? `rgba(${r}, ${g}, ${b}, ${opacity})` : `rgb(${r} ${g} ${b})`;
  }

  const hexMatch = trimmed.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    const { r, g, b } = hexToRgb(trimmed);
    return opacity < 1 ? `rgba(${r}, ${g}, ${b}, ${opacity})` : trimmed;
  }

  if (opacity < 1) {
    const pct = Math.round(opacity * 100);
    return `color-mix(in srgb, ${trimmed} ${pct}%, transparent)`;
  }

  return trimmed;
}

function loadGoogleFontFromStack(fontStack: string) {
  // Extract first family name inside quotes or first token
  const match = fontStack.match(/'([^']+)'|\b([A-Za-z][A-Za-z\s]+)\b/);
  const fam = (match?.[1] || match?.[2] || "Inter").trim();
  const fontName = fam.replace(/\s+/g, "+");
  const linkId = `google-font-${fontName}`;
  if (document.getElementById(linkId)) return;
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
