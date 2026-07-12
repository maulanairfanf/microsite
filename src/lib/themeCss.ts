import type { Theme } from "@/types/components";
import { defaultTokens } from "./themeDefaults";
import { computeHoverBackground } from "./themeTokens";

const FONT_FAMILIES: Record<string, string> = {
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

function normalizeColor(value: string, opacity = 1): string {
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

function resolveFontStack(fontFamily: string): string {
  const known = FONT_FAMILIES[fontFamily];
  if (known) return known;
  const trimmed = fontFamily.trim();
  if (!trimmed) return FONT_FAMILIES.Inter || "'Inter', sans-serif";
  return `'${trimmed}', sans-serif`;
}

export function escapeCssValue(value: string): string {
  return value.replace(/[;{}<>]/g, "");
}

export function themeToCssVars(theme: Theme): string {
  const page = { ...defaultTokens.page, ...(theme.theme?.page || {}) };
  const container = { ...defaultTokens.container, ...(theme.theme?.container || {}) };
  const card = { ...defaultTokens.card, ...(theme.theme?.card || {}) };

  const pageBg = normalizeColor(page.background);
  const cardBg = normalizeColor(card.background);
  const cardHoverBg = computeHoverBackground(card, cardBg);

  const bodyText =
    page.text || card.text || defaultTokens.page.text || "#111827";
  const headerText =
    page.headerText || page.text || defaultTokens.page.headerText || bodyText;
  const headerFont = resolveFontStack(theme.fontFamily || "Inter");

  const entries: Array<[string, string]> = [
    ["--pageBackground", escapeCssValue(pageBg)],
    ["--bodyText", escapeCssValue(bodyText)],
    ["--headerTextColor", escapeCssValue(headerText)],
    ["--headerFontFamily", escapeCssValue(headerFont)],
    ["--containerBackground", escapeCssValue(container.background)],
    ["--containerRadius", escapeCssValue(container.radius || defaultTokens.container.radius || "")],
    ["--containerBorder", escapeCssValue(container.border || defaultTokens.container.border || "")],
    ["--containerShadow", escapeCssValue(container.shadow || defaultTokens.container.shadow || "")],
    ["--cardBackground", escapeCssValue(cardBg)],
    ["--cardHoverBackground", escapeCssValue(cardHoverBg)],
    ["--cardText", escapeCssValue(card.text || defaultTokens.card.text || "")],
    ["--cardBorder", escapeCssValue(card.border || defaultTokens.card.border || "")],
    ["--cardShadow", escapeCssValue(card.shadow || defaultTokens.card.shadow || "")],
    ["--cardRadius", escapeCssValue(card.radius || defaultTokens.card.radius || "")],
  ];

  const body = entries.map(([k, v]) => `${k}:${v}`).join(";");
  return `:root{${body}}`;
}

export function buildGoogleFontHref(fontFamily: string): string {
  const known = FONT_FAMILIES[fontFamily];
  const family = known ? fontFamily : fontFamily.trim() || "Inter";
  const encoded = family.replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`;
}
