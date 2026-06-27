import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseThemeConfig, type ThemeRecord } from "@/lib/themeConfig";
import { defaultTokens } from "@/lib/themeDefaults";

const baseRecord: ThemeRecord = {
  id: "clean-gray",
  name: "Clean Gray",
  slug: "clean-gray",
  config: null,
  createdAt: new Date(0),
  updatedAt: null,
};

describe("parseThemeConfig", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns defaults when config is null", () => {
    const result = parseThemeConfig(baseRecord);
    expect(result.id).toBe("clean-gray");
    expect(result.name).toBe("Clean Gray");
    expect(result.slug).toBe("clean-gray");
    expect(result.fontFamily).toBe("Inter");
    expect(result.theme).toEqual(defaultTokens);
  });

  it("returns defaults and warns when config is malformed JSON", () => {
    const result = parseThemeConfig({ ...baseRecord, config: "{not valid json" });
    expect(result.theme).toEqual(defaultTokens);
    expect(result.fontFamily).toBe("Inter");
    expect(console.warn).toHaveBeenCalled();
  });

  it("returns defaults and warns when config is not an object", () => {
    const result = parseThemeConfig({ ...baseRecord, config: '"just a string"' });
    expect(result.theme).toEqual(defaultTokens);
    expect(console.warn).toHaveBeenCalled();
  });

  it("parses the FLAT shape (API writer) correctly", () => {
    const flat = {
      page: { background: "#aaaaaa", text: "#222222", headerText: "#333333" },
      container: {
        background: "#bbbbbb",
        radius: "20px",
        border: "1px solid #000",
        shadow: "0 1px 2px #000",
      },
      card: {
        background: "#cccccc",
        radius: "10px",
        border: "0",
        shadow: "none",
      },
      fontFamily: "Roboto",
    };
    const result = parseThemeConfig({ ...baseRecord, config: JSON.stringify(flat) });
    expect(result.fontFamily).toBe("Roboto");
    expect(result.theme.page.background).toBe("#aaaaaa");
    expect(result.theme.page.text).toBe("#222222");
    expect(result.theme.container.radius).toBe("20px");
    expect(result.theme.card.background).toBe("#cccccc");
  });

  it("parses the WRAPPED shape (seed writer) correctly — the bug case", () => {
    const wrapped = {
      id: "clean-gray",
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
    const result = parseThemeConfig({ ...baseRecord, config: JSON.stringify(wrapped) });
    expect(result.fontFamily).toBe("Inter");
    expect(result.theme.page.background).toBe("#e5e7eb");
    expect(result.theme.page.text).toBe("#111827");
    expect(result.theme.container.background).toBe("#f3f4f6");
    expect(result.theme.container.shadow).toBe(
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    );
    expect(result.theme.card.background).toBe("#ffffff");
    expect(result.theme.card.hoverBackground).toBe("#f3f4f6");
  });

  it("prefers wrapped form when both shapes are present (defensive)", () => {
    const mixed = {
      page: { background: "#000000" },
      theme: {
        page: { background: "#ffffff" },
        container: { background: "#111111" },
        card: { background: "#222222" },
      },
    };
    const result = parseThemeConfig({ ...baseRecord, config: JSON.stringify(mixed) });
    expect(result.theme.page.background).toBe("#ffffff");
    expect(result.theme.container.background).toBe("#111111");
  });

  it("falls back to flat shape and warns when wrapped theme is empty", () => {
    const weird = {
      theme: {},
      page: { background: "#abcdef" },
      container: { background: "#000000" },
      card: { background: "#111111" },
    };
    const result = parseThemeConfig({ ...baseRecord, config: JSON.stringify(weird) });
    expect(result.theme.page.background).toBe("#abcdef");
    expect(console.warn).toHaveBeenCalled();
  });

  it("merges partial configs with defaultTokens", () => {
    const partial = JSON.stringify({
      page: { background: "#abcdef" },
    });
    const result = parseThemeConfig({ ...baseRecord, config: partial });
    expect(result.theme.page.background).toBe("#abcdef");
    expect(result.theme.page.text).toBe(defaultTokens.page.text);
    expect(result.theme.container).toEqual(defaultTokens.container);
    expect(result.theme.card).toEqual(defaultTokens.card);
  });

  it("preserves the input id, name, slug (ignores them in the wrapped config)", () => {
    const wrapped = JSON.stringify({
      id: "wrong-id",
      name: "Wrong Name",
      fontFamily: "Inter",
      theme: {
        page: { background: "#fff" },
        container: { background: "#fff" },
        card: { background: "#fff" },
      },
    });
    const result = parseThemeConfig({ ...baseRecord, config: wrapped });
    expect(result.id).toBe("clean-gray");
    expect(result.name).toBe("Clean Gray");
    expect(result.slug).toBe("clean-gray");
  });

  it("coerces hoverOpacity to number when string", () => {
    const flat = JSON.stringify({
      card: { hoverOpacity: "7" },
    });
    const result = parseThemeConfig({ ...baseRecord, config: flat });
    expect(result.theme.card.hoverOpacity).toBe(7);
  });

  it("falls back to Inter when fontFamily is missing", () => {
    const flat = JSON.stringify({ page: { background: "#fff" } });
    const result = parseThemeConfig({ ...baseRecord, config: flat });
    expect(result.fontFamily).toBe("Inter");
  });

  it("falls back to Inter when fontFamily is a non-string", () => {
    const flat = JSON.stringify({ fontFamily: 42 });
    const result = parseThemeConfig({ ...baseRecord, config: flat });
    expect(result.fontFamily).toBe("Inter");
  });
});
