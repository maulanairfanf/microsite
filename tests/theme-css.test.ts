import { describe, it, expect } from "vitest";
import { themeToCssVars, buildGoogleFontHref, escapeCssValue } from "@/lib/themeCss";
import type { Theme } from "@/types/components";

const baseTheme: Theme = {
  name: "Clean Gray",
  fontFamily: "Inter",
  theme: {
    page: {
      background: "#e5e7eb",
      text: "#111827",
      headerText: "#111827",
    },
    container: {
      background: "#f3f4f6",
      radius: "16px",
      border: "0",
      shadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
    card: {
      background: "#ffffff",
      hoverBackground: "#f3f4f6",
      text: "#111827",
      radius: "8px",
      border: "0",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
  },
};

describe("themeToCssVars", () => {
  it("starts with :root selector and is a single CSS rule", () => {
    const result = themeToCssVars(baseTheme);
    expect(result.startsWith(":root{")).toBe(true);
    expect(result.endsWith("}")).toBe(true);
  });

  it("includes all 14 expected CSS variables", () => {
    const result = themeToCssVars(baseTheme);
    const expected = [
      "--pageBackground",
      "--bodyText",
      "--headerTextColor",
      "--headerFontFamily",
      "--containerBackground",
      "--containerRadius",
      "--containerBorder",
      "--containerShadow",
      "--cardBackground",
      "--cardHoverBackground",
      "--cardText",
      "--cardBorder",
      "--cardShadow",
      "--cardRadius",
    ];
    for (const v of expected) {
      expect(result).toContain(v);
    }
  });

  it("uses hex values directly for normal hex colors", () => {
    const result = themeToCssVars(baseTheme);
    expect(result).toContain("--pageBackground:#e5e7eb");
    expect(result).toContain("--cardBackground:#ffffff");
  });

  it("wraps font family in single quotes", () => {
    const result = themeToCssVars(baseTheme);
    expect(result).toContain("--headerFontFamily:'Inter', sans-serif");
  });

  it("converts multi-line CSS shadow values safely (no break-out)", () => {
    const result = themeToCssVars(baseTheme);
    expect(result).toContain("--containerShadow:0 25px 50px -12px rgb(0 0 0 / 0.25)");
  });

  it("computes hover background from card.hoverOpacity (default 7) when no opacity override", () => {
    const result = themeToCssVars(baseTheme);
    expect(result).toContain(
      "--cardHoverBackground:color-mix(in srgb, #ffffff 93%, #000000 7%)",
    );
  });

  it("falls back to defaults when theme is partial", () => {
    const partial: Theme = {
      name: "Partial",
      fontFamily: "Inter",
      theme: {
        page: { background: "#000000" } as Theme["theme"]["page"],
        container: {} as Theme["theme"]["container"],
        card: {} as Theme["theme"]["card"],
      },
    };
    const result = themeToCssVars(partial);
    expect(result).toContain("--pageBackground:#000000");
  });
});

describe("buildGoogleFontHref", () => {
  it("returns a Google Fonts URL for a known font", () => {
    expect(buildGoogleFontHref("Inter")).toBe(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    );
  });

  it("URL-encodes spaces in font names with plus signs", () => {
    expect(buildGoogleFontHref("Open Sans")).toContain("family=Open+Sans");
  });

  it("falls back to Inter for empty input", () => {
    expect(buildGoogleFontHref("")).toContain("family=Inter");
  });

  it("falls back to Inter for whitespace-only input", () => {
    expect(buildGoogleFontHref("   ")).toContain("family=Inter");
  });

  it("uses the trimmed family for unknown fonts", () => {
    expect(buildGoogleFontHref("  Fira Code  ")).toContain("family=Fira+Code");
  });

  it("always includes the wght and display params", () => {
    const href = buildGoogleFontHref("Roboto");
    expect(href).toContain("wght@400;500;600;700");
    expect(href).toContain("display=swap");
  });
});

describe("escapeCssValue", () => {
  it("strips semicolons (CSS value separator)", () => {
    expect(escapeCssValue("#fff;background:red")).toBe("#fffbackground:red");
  });

  it("strips closing braces (rule closer)", () => {
    expect(escapeCssValue("#fff}body{}")).toBe("#fffbody");
  });

  it("strips HTML break-out characters", () => {
    expect(escapeCssValue("safe</style>value")).toBe("safe/stylevalue");
  });

  it("preserves safe CSS characters (parens, slashes, spaces, commas)", () => {
    expect(escapeCssValue("rgb(0 0 0 / 0.5), sans-serif")).toBe("rgb(0 0 0 / 0.5), sans-serif");
  });

  it("returns empty string for empty input", () => {
    expect(escapeCssValue("")).toBe("");
  });
});
