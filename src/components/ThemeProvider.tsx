"use client";

import { Theme } from "@/types/components";
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

// Two initial presets: cleanGray and purplePink
const presets: Record<string, TokenPreset> = {
  cleanGray: {
    "--pageBackground": "#e5e7eb",
    "--bodyText": "#111827",
    "--headerTextColor": "#111827",
    "--headerFontFamily": fontFamilies.Inter,

    // Container (mobile frame)
    "--containerBackground": "#f3f4f6",
    "--containerRadius": "16px",
    "--containerBorder": "0",
    "--containerShadow": "0 25px 50px -12px rgb(0 0 0 / 0.25)",

    // Card/link items
    "--cardBackground": "#ffffff",
    "--cardHoverBackground": "#f3f4f6",
    "--cardText": "#111827",
    "--cardBorder": "0",
    "--cardShadow": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "--cardRadius": "8px",
  },
  purplePink: {
    "--pageBackground": "#7f2aeb",
    "--bodyText": "#ffffff",
    "--headerTextColor": "#ffffff",
    "--headerFontFamily": fontFamilies.Poppins,

    // Container (mobile frame)
    "--containerBackground": "color-mix(in srgb, #7f2aeb 88%, white 12%)",
    "--containerRadius": "18px",
    "--containerBorder": "0",
    "--containerShadow": "0 4px 0 #000000",

    // Card/link items
    "--cardBackground": "#e058d6",
    "--cardHoverBackground": "color-mix(in srgb, #e058d6 93%, #000000 7%)",
    "--cardText": "#000000",
    "--cardBorder": "2px solid #000000",
    "--cardShadow": "3px 4px 0 #000000",
    "--cardRadius": "0px",
  },
};

interface ThemeProviderProps {
  theme: Theme;
}

export function ThemeProvider({ theme }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    // Choose preset by name or colorScheme fallback
    const name = (theme.name || "cleanGray").replace(/\s+/g, "");
    const chosen: TokenPreset =
      presets[name] || (theme.colorScheme === "purple" || theme.colorScheme === "pink" ? presets.purplePink : presets.cleanGray);

    // Apply tokens
    Object.entries(chosen).forEach(([k, v]) => root.style.setProperty(k, v));

    // Load Google Font dynamically for headers
    const headerFont = (theme.fontFamily && fontFamilies[theme.fontFamily]) || chosen["--headerFontFamily"] || fontFamilies.Inter;
    loadGoogleFontFromStack(headerFont);
  }, [theme]);

  return null;
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
