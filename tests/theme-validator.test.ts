import { describe, it, expect } from "vitest";
import { validateTheme } from "@/lib/themeValidator";
import { defaultTokens } from "@/lib/themeDefaults";

const baseValid = {
  name: "Clean Gray",
  slug: "clean-gray",
  fontFamily: "Inter",
  theme: defaultTokens,
};

describe("validateTheme", () => {
  it("accepts a valid full theme", () => {
    const result = validateTheme(baseValid);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("rejects missing name", () => {
    const result = validateTheme({ ...baseValid, name: "" });
    expect(result.success).toBe(false);
    expect(result.errors?.name).toBeDefined();
    expect(result.errors?.name?.[0]).toMatch(/required/i);
  });

  it("rejects name longer than 100 chars", () => {
    const result = validateTheme({ ...baseValid, name: "a".repeat(101) });
    expect(result.success).toBe(false);
    expect(result.errors?.name?.[0]).toMatch(/too long|name/i);
  });

  it("rejects slug with uppercase letters", () => {
    const result = validateTheme({ ...baseValid, slug: "Clean-Gray" });
    expect(result.success).toBe(false);
    expect(result.errors?.slug?.[0]).toMatch(/lowercase|hyphen/i);
  });

  it("rejects slug with invalid characters", () => {
    const result = validateTheme({ ...baseValid, slug: "clean gray!" });
    expect(result.success).toBe(false);
    expect(result.errors?.slug).toBeDefined();
  });

  it("rejects invalid hex color in page.background", () => {
    const result = validateTheme({
      ...baseValid,
      theme: {
        ...defaultTokens,
        page: { ...defaultTokens.page, background: "not-a-color" },
      },
    });
    expect(result.success).toBe(false);
    expect(result.errors?.["theme.page.background"]).toBeDefined();
  });

  it("accepts valid hex colors", () => {
    const result = validateTheme({
      ...baseValid,
      theme: {
        ...defaultTokens,
        page: { ...defaultTokens.page, background: "#abc123" },
        card: { ...defaultTokens.card, background: "#ffffff" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("accepts rgb() and rgba() colors", () => {
    const result = validateTheme({
      ...baseValid,
      theme: {
        ...defaultTokens,
        page: { ...defaultTokens.page, background: "rgb(255, 0, 0)" },
        card: { ...defaultTokens.card, background: "rgba(0, 0, 0, 0.5)" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects hoverOpacity above 100", () => {
    const result = validateTheme({
      ...baseValid,
      theme: {
        ...defaultTokens,
        card: { ...defaultTokens.card, hoverOpacity: 150 },
      },
    });
    expect(result.success).toBe(false);
    expect(result.errors?.["theme.card.hoverOpacity"]?.[0]).toMatch(/between 0 and 100/i);
  });

  it("rejects negative hoverOpacity", () => {
    const result = validateTheme({
      ...baseValid,
      theme: {
        ...defaultTokens,
        card: { ...defaultTokens.card, hoverOpacity: -5 },
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty fontFamily", () => {
    const result = validateTheme({ ...baseValid, fontFamily: "" });
    expect(result.success).toBe(false);
    expect(result.errors?.fontFamily).toBeDefined();
  });

  it("rejects css value longer than 200 chars", () => {
    const result = validateTheme({
      ...baseValid,
      theme: {
        ...defaultTokens,
        container: { ...defaultTokens.container, radius: "a".repeat(201) },
      },
    });
    expect(result.success).toBe(false);
    expect(result.errors?.["theme.container.radius"]?.[0]).toMatch(/200/);
  });
});
