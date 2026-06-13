import { describe, it, expect } from "vitest";
import {
  parseBorder,
  composeBorder,
  parseRadius,
  formatRadius,
  findShadowPresetKey,
  SHADOW_PRESETS,
  computeHoverBackground,
} from "@/lib/themeTokens";

describe("parseBorder", () => {
  it('returns defaults for empty input', () => {
    expect(parseBorder("")).toEqual({ width: "0", style: "solid", color: "#000000" });
  });

  it('returns defaults for "0"', () => {
    expect(parseBorder("0")).toEqual({ width: "0", style: "solid", color: "#000000" });
  });

  it("parses a standard CSS shorthand", () => {
    expect(parseBorder("1px solid #000000")).toEqual({
      width: "1",
      style: "solid",
      color: "#000000",
    });
  });

  it("parses dashed borders with named colors", () => {
    expect(parseBorder("2px dashed red")).toEqual({
      width: "2",
      style: "dashed",
      color: "red",
    });
  });

  it("parses borders with decimal widths", () => {
    expect(parseBorder("0.5px dotted #fff")).toEqual({
      width: "0.5",
      style: "dotted",
      color: "#fff",
    });
  });

  it("returns defaults for malformed input", () => {
    expect(parseBorder("not-a-border")).toEqual({
      width: "0",
      style: "solid",
      color: "#000000",
    });
  });
});

describe("composeBorder", () => {
  it('returns "0" when width is 0', () => {
    expect(composeBorder("0", "solid", "#000000")).toBe("0");
  });

  it('returns "0" when width is empty', () => {
    expect(composeBorder("", "solid", "#000000")).toBe("0");
  });

  it('returns "0" when style is "none"', () => {
    expect(composeBorder("2", "none", "#000000")).toBe("0");
  });

  it("composes a standard border", () => {
    expect(composeBorder("1", "solid", "#ff0000")).toBe("1px solid #ff0000");
  });

  it("always appends px to the width", () => {
    expect(composeBorder("3", "dashed", "blue")).toBe("3px dashed blue");
  });
});

describe("parseRadius and formatRadius", () => {
  it("parseRadius extracts the numeric prefix", () => {
    expect(parseRadius("16px")).toBe("16");
    expect(parseRadius("8.5rem")).toBe("8.5");
    expect(parseRadius("0")).toBe("0");
  });

  it("parseRadius returns empty string for undefined", () => {
    expect(parseRadius(undefined)).toBe("");
    expect(parseRadius("")).toBe("");
  });

  it("formatRadius strips the unit", () => {
    expect(formatRadius("16px")).toBe("16");
    expect(formatRadius("2.5rem")).toBe("2.5");
  });

  it("formatRadius returns the input unchanged when no match", () => {
    expect(formatRadius(undefined)).toBe("");
  });
});

describe("findShadowPresetKey", () => {
  it("returns the value for a known preset CSS", () => {
    const preset = SHADOW_PRESETS[0];
    if (preset) {
      expect(findShadowPresetKey(preset.css)).toBe(preset.value);
    }
  });

  it("returns null for an unknown shadow", () => {
    expect(findShadowPresetKey("5px 5px 5px rgb(0,0,0)")).toBeNull();
  });

  it("returns null for empty/undefined", () => {
    expect(findShadowPresetKey("")).toBeNull();
    expect(findShadowPresetKey(undefined)).toBeNull();
  });
});

describe("computeHoverBackground", () => {
  it("uses color-mix with hoverOpacity when provided", () => {
    const result = computeHoverBackground(
      { background: "#ffffff", hoverOpacity: 20 },
      "#ffffff",
    );
    expect(result).toBe("color-mix(in srgb, #ffffff 80%, #000000 20%)");
  });

  it("clamps hoverOpacity to 0..100", () => {
    expect(
      computeHoverBackground({ background: "#fff", hoverOpacity: 200 }, "#fff"),
    ).toBe("color-mix(in srgb, #fff 0%, #000000 100%)");
    expect(
      computeHoverBackground({ background: "#fff", hoverOpacity: -50 }, "#fff"),
    ).toBe("color-mix(in srgb, #fff 100%, #000000 0%)");
  });

  it("falls back to cardBg when neither hoverOpacity nor hoverBackground is set", () => {
    expect(computeHoverBackground({ background: "#fff" }, "#fallback")).toBe("#fallback");
  });

  it("uses hoverBackground when set and no hoverOpacity", () => {
    expect(
      computeHoverBackground(
        { background: "#fff", hoverBackground: "#f0f0f0" },
        "#fallback",
      ),
    ).toBe("#f0f0f0");
  });

  it("prefers hoverOpacity over hoverBackground when both are set", () => {
    const result = computeHoverBackground(
      { background: "#fff", hoverOpacity: 10, hoverBackground: "#000" },
      "#fallback",
    );
    expect(result).toContain("color-mix");
    expect(result).not.toBe("#000");
  });
});
