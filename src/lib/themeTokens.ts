import type { ThemeCard } from "@/types/components";

export const SHADOW_PRESETS: Array<{ value: string; label: string; css: string }> = [
  { value: "none", label: "None", css: "none" },
  { value: "subtle", label: "Subtle", css: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  {
    value: "small",
    label: "Small",
    css: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
  {
    value: "medium",
    label: "Medium",
    css: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  {
    value: "large",
    label: "Large",
    css: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  {
    value: "xl",
    label: "Extra Large",
    css: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  { value: "inner", label: "Inner", css: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)" },
  { value: "neobrutalist", label: "Neobrutalist", css: "3px 4px 0 #000000" },
];

export const BORDER_STYLE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
];

export function findShadowPresetKey(css: string | undefined): string | null {
  if (!css) return null;
  const preset = SHADOW_PRESETS.find((p) => p.css === css);
  return preset?.value ?? null;
}

export function parseRadius(value: string | undefined): string {
  if (!value) return "";
  const match = value.match(/^(-?\d+(?:\.\d+)?)/);
  return match && match[1] ? match[1] : "";
}

export function formatRadius(value: string | undefined): string {
  if (!value) return "";
  const num = value.match(/^(-?\d+(?:\.\d+)?)/);
  if (!num) return value;
  return num[1] ?? value;
}

export interface ParsedBorder {
  width: string;
  style: string;
  color: string;
}

export function parseBorder(border: string | undefined): ParsedBorder {
  if (!border || border === "0") {
    return { width: "0", style: "solid", color: "#000000" };
  }
  const match = border.match(/^(\d+(?:\.\d+)?)(?:px|rem|em|%)?\s+(\w+)\s+(.+)$/);
  if (match && match[1] && match[2] && match[3]) {
    return {
      width: match[1],
      style: match[2],
      color: match[3],
    };
  }
  return { width: "0", style: "solid", color: "#000000" };
}

export function composeBorder(width: string, style: string, color: string): string {
  if (!width || width === "0") return "0";
  if (style === "none") return "0";
  return `${width}px ${style} ${color}`;
}

export function computeHoverBackground(card: ThemeCard, cardBg: string): string {
  if (typeof card.hoverOpacity === "number") {
    const opacity = Math.min(Math.max(card.hoverOpacity, 0), 100);
    const colorPart = card.background || "#000000";
    return `color-mix(in srgb, ${colorPart} ${100 - opacity}%, #000000 ${opacity}%)`;
  }
  if (card.hoverBackground) {
    return card.hoverBackground;
  }
  return cardBg;
}
