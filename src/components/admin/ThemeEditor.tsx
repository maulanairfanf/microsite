"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/admin/FormFields";
import { ColorInput } from "@/components/admin/ColorInput";
import { MockTenantPreview } from "@/components/admin/MockTenantPreview";
import { clientApi } from "@/lib/client-api";
import { validateTheme, type ThemeFieldErrors } from "@/lib/themeValidator";
import { defaultTokens } from "@/lib/themeDefaults";
import type { Theme } from "@/types/components";

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Oxanium", label: "Oxanium" },
];

const SHADOW_PRESETS = [
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

const BORDER_STYLE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
];

function findShadowPresetKey(css: string | undefined): string | null {
  if (!css) return null;
  const preset = SHADOW_PRESETS.find((p) => p.css === css);
  return preset?.value ?? null;
}

function parseRadius(value: string | undefined): string {
  if (!value) return "";
  const match = value.match(/^(-?\d+(?:\.\d+)?)/);
  return match ? match[1] : "";
}

function formatRadius(value: string | undefined): string {
  if (!value) return "";
  const num = value.match(/^(-?\d+(?:\.\d+)?)/);
  if (!num) return value;
  return num[1];
}

function parseBorder(border: string | undefined): {
  width: string;
  style: string;
  color: string;
} {
  if (!border || border === "0") {
    return { width: "0", style: "solid", color: "#000000" };
  }
  const match = border.match(/^(\d+(?:\.\d+)?)(?:px|rem|em|%)?\s+(\w+)\s+(.+)$/);
  if (match) {
    return {
      width: match[1],
      style: match[2],
      color: match[3],
    };
  }
  return { width: "0", style: "solid", color: "#000000" };
}

function composeBorder(width: string, style: string, color: string): string {
  if (!width || width === "0") return "0";
  if (style === "none") return "0";
  return `${width}px ${style} ${color}`;
}

interface ThemeEditorProps {
  theme: Theme;
  isEdit: boolean;
  themeDbId: string | null;
}

function buildInitialTokens(theme: Theme) {
  return {
    page: { ...defaultTokens.page, ...(theme.theme?.page || {}) },
    container: { ...defaultTokens.container, ...(theme.theme?.container || {}) },
    card: { ...defaultTokens.card, ...(theme.theme?.card || {}) },
  };
}

export function ThemeEditor({ theme, isEdit, themeDbId }: ThemeEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(theme.name);
  const [slug, setSlug] = useState(theme.slug || "");
  const [fontFamily, setFontFamily] = useState(theme.fontFamily || "Inter");
  const [tokens, setTokens] = useState(buildInitialTokens(theme));
  const [errors, setErrors] = useState<ThemeFieldErrors>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  const isDirty =
    name !== theme.name ||
    fontFamily !== (theme.fontFamily || "Inter") ||
    JSON.stringify(tokens.page) !== JSON.stringify(buildInitialTokens(theme).page) ||
    JSON.stringify(tokens.container) !== JSON.stringify(buildInitialTokens(theme).container) ||
    JSON.stringify(tokens.card) !== JSON.stringify(buildInitialTokens(theme).card);

  const updateToken = (
    group: "page" | "container" | "card",
    field: string,
    value: string | number,
  ) => {
    setTokens((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
    setErrors((prev) => {
      const key = `theme.${group}.${field}`;
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  };

  const updateBorder = (
    group: "container" | "card",
    field: "width" | "style" | "color",
    value: string,
  ) => {
    setTokens((prev) => {
      const current = prev[group] as { border?: string };
      const parsed = parseBorder(current.border);
      const next = { ...parsed, [field]: value };
      const composed = composeBorder(next.width, next.style, next.color);
      return {
        ...prev,
        [group]: { ...prev[group], border: composed },
      };
    });
    setErrors((prev) => {
      const key = `theme.${group}.border`;
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  };

  const handleReset = () => {
    setName(theme.name);
    setSlug(theme.slug || "");
    setFontFamily(theme.fontFamily || "Inter");
    setTokens(buildInitialTokens(theme));
    setErrors({});
    setMessage(null);
  };

  const handleSave = () => {
    setMessage(null);
    const validationData = {
      name,
      slug: slug || theme.slug || "",
      fontFamily,
      theme: {
        page: tokens.page,
        container: tokens.container,
        card: tokens.card,
      },
    };

    const validation = validateTheme(validationData);
    if (!validation.success) {
      setErrors(validation.errors || {});
      setMessage({ type: "error", text: "Please fix the validation errors before saving." });
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        if (isEdit) {
          await clientApi.put(`/api/themes/${theme.id}`, {
            name: validation.data!.name,
            slug: validation.data!.slug,
            fontFamily: validation.data!.fontFamily,
            theme: {
              page: validation.data!.theme.page,
              container: validation.data!.theme.container,
              card: validation.data!.theme.card,
            },
          });
          setMessage({ type: "success", text: "Theme saved!" });
          setTimeout(() => setMessage(null), 2500);
        } else {
          const data = await clientApi.post<{ data: { id: string } }>(`/api/themes`, {
            name: validation.data!.name,
            slug: validation.data!.slug,
            fontFamily: validation.data!.fontFamily,
            theme: {
              page: validation.data!.theme.page,
              container: validation.data!.theme.container,
              card: validation.data!.theme.card,
            },
          });
          router.push(`/super/themes/${data.data.id}`);
          router.refresh();
        }
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "Failed to save theme" });
      }
    });
  };

  const handleDelete = async () => {
    if (!themeDbId) return;
    const confirmed = window.confirm(
      `Permanently delete theme "${name}"?\n\nThis cannot be undone.`,
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await clientApi.delete(`/api/themes/${themeDbId}`);
      router.push("/super/themes");
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to delete theme" });
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Theme Info
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Theme Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((p) => {
                    const n = { ...p };
                    delete n.name;
                    return n;
                  });
              }}
              error={errors.name?.[0]}
              placeholder="My Theme"
              required
            />
            <Input
              label="Slug (URL identifier)"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                if (errors.slug)
                  setErrors((p) => {
                    const n = { ...p };
                    delete n.slug;
                    return n;
                  });
              }}
              error={errors.slug?.[0]}
              placeholder="my-theme"
              disabled={isEdit}
              className={isEdit ? "bg-muted" : ""}
              required
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_600px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Page
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <ColorInput
                label="Background"
                value={tokens.page.background}
                onChange={(v) => updateToken("page", "background", v)}
                error={errors["theme.page.background"]?.[0]}
              />
              <ColorInput
                label="Text"
                value={tokens.page.text || "#111827"}
                onChange={(v) => updateToken("page", "text", v)}
                error={errors["theme.page.text"]?.[0]}
              />
              <ColorInput
                label="Header Text"
                value={tokens.page.headerText || "#111827"}
                onChange={(v) => updateToken("page", "headerText", v)}
                error={errors["theme.page.headerText"]?.[0]}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Container
            </h3>
            <div className="space-y-4">
              <ColorInput
                label="Background"
                value={tokens.container.background}
                onChange={(v) => updateToken("container", "background", v)}
                error={errors["theme.container.background"]?.[0]}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5" data-slot="input-wrapper">
                  <label className="text-sm font-semibold text-foreground">Border Radius</label>
                  <div className="relative" data-slot="input-affix-wrapper">
                    <Input
                      type="number"
                      min="0"
                      max="999"
                      value={formatRadius(tokens.container.radius)}
                      onChange={(e) => {
                        const raw = e.target.value;
                        updateToken("container", "radius", raw === "" ? "" : `${raw}px`);
                      }}
                      error={errors["theme.container.radius"]?.[0]}
                      placeholder="16"
                      className="pr-10"
                    />
                    <span
                      data-slot="input-suffix"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none"
                    >
                      px
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground" data-slot="input-helper">
                    Value in pixels
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Select
                    label="Shadow"
                    options={SHADOW_PRESETS}
                    value={findShadowPresetKey(tokens.container.shadow) ?? "none"}
                    onValueChange={(v) => {
                      const preset = SHADOW_PRESETS.find((p) => p.value === v);
                      if (preset) updateToken("container", "shadow", preset.css);
                    }}
                  />
                </div>
              </div>
              {(() => {
                const containerBorder = parseBorder(tokens.container.border);
                return (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-1.5" data-slot="input-wrapper">
                      <label className="text-sm font-semibold text-foreground">Border Width</label>
                      <div className="relative" data-slot="input-affix-wrapper">
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          value={containerBorder.width}
                          onChange={(e) => updateBorder("container", "width", e.target.value)}
                          error={errors["theme.container.border"]?.[0]}
                          placeholder="0"
                          className="pr-10"
                        />
                        <span
                          data-slot="input-suffix"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none"
                        >
                          px
                        </span>
                      </div>
                    </div>
                    <Select
                      label="Border Style"
                      options={BORDER_STYLE_OPTIONS}
                      value={containerBorder.style}
                      onValueChange={(v) => updateBorder("container", "style", v)}
                    />
                    <ColorInput
                      label="Border Color"
                      value={containerBorder.color}
                      onChange={(v) => updateBorder("container", "color", v)}
                    />
                  </div>
                );
              })()}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Card
            </h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <ColorInput
                  label="Background"
                  value={tokens.card.background}
                  onChange={(v) => updateToken("card", "background", v)}
                  error={errors["theme.card.background"]?.[0]}
                />
                <div className="flex flex-col gap-1.5" data-slot="input-wrapper">
                  <label className="text-sm font-semibold text-foreground">Hover Opacity</label>
                  <div className="relative" data-slot="input-affix-wrapper">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        typeof tokens.card.hoverOpacity === "number"
                          ? String(tokens.card.hoverOpacity)
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          setTokens((prev) => {
                            const next = { ...prev.card };
                            delete next.hoverOpacity;
                            return { ...prev, card: next };
                          });
                        } else {
                          updateToken("card", "hoverOpacity", Number(raw));
                        }
                      }}
                      error={errors["theme.card.hoverOpacity"]?.[0]}
                      placeholder="7"
                      className="pr-10"
                    />
                    <span
                      data-slot="input-suffix"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none"
                    >
                      %
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground" data-slot="input-helper">
                    0% = no change, 100% = black
                  </p>
                </div>
                <ColorInput
                  label="Text"
                  value={tokens.card.text || "#111827"}
                  onChange={(v) => updateToken("card", "text", v)}
                  error={errors["theme.card.text"]?.[0]}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5" data-slot="input-wrapper">
                  <label className="text-sm font-semibold text-foreground">Border Radius</label>
                  <div className="relative" data-slot="input-affix-wrapper">
                    <Input
                      type="number"
                      min="0"
                      max="999"
                      value={formatRadius(tokens.card.radius)}
                      onChange={(e) => {
                        const raw = e.target.value;
                        updateToken("card", "radius", raw === "" ? "" : `${raw}px`);
                      }}
                      error={errors["theme.card.radius"]?.[0]}
                      placeholder="8"
                      className="pr-10"
                    />
                    <span
                      data-slot="input-suffix"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none"
                    >
                      px
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground" data-slot="input-helper">
                    Value in pixels
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Select
                    label="Shadow"
                    options={SHADOW_PRESETS}
                    value={findShadowPresetKey(tokens.card.shadow) ?? "none"}
                    onValueChange={(v) => {
                      const preset = SHADOW_PRESETS.find((p) => p.value === v);
                      if (preset) updateToken("card", "shadow", preset.css);
                    }}
                  />
                </div>
              </div>
              {(() => {
                const cardBorder = parseBorder(tokens.card.border);
                return (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-1.5" data-slot="input-wrapper">
                      <label className="text-sm font-semibold text-foreground">Border Width</label>
                      <div className="relative" data-slot="input-affix-wrapper">
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          value={cardBorder.width}
                          onChange={(e) => updateBorder("card", "width", e.target.value)}
                          error={errors["theme.card.border"]?.[0]}
                          placeholder="0"
                          className="pr-10"
                        />
                        <span
                          data-slot="input-suffix"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none"
                        >
                          px
                        </span>
                      </div>
                    </div>
                    <Select
                      label="Border Style"
                      options={BORDER_STYLE_OPTIONS}
                      value={cardBorder.style}
                      onValueChange={(v) => updateBorder("card", "style", v)}
                    />
                    <ColorInput
                      label="Border Color"
                      value={cardBorder.color}
                      onChange={(v) => updateBorder("card", "color", v)}
                    />
                  </div>
                );
              })()}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Typography
            </h3>
            <Select
              label="Font Family"
              options={FONT_OPTIONS}
              value={fontFamily}
              onValueChange={setFontFamily}
            />
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Live Preview
            </h3>
          </div>
          <div className="border border-gray-200 rounded-lg bg-gray-100 flex items-center justify-center min-h-100 py-10">
            <MockTenantPreview tokens={tokens} fontFamily={fontFamily} themeName={name} />
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card className="sticky bottom-0 ">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={isPending || !isDirty}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 " />
                  {isEdit ? "Save Changes" : "Create Theme"}
                </>
              )}
            </Button>
            {isDirty && (
              <Button variant="destructive" onClick={handleReset} disabled={isPending}>
                <RotateCcw className="w-4 h-4 " />
                Reset
              </Button>
            )}
            <Link href="/super/themes">
              <Button type="button" variant="secondary" disabled={isPending}>
                Cancel
              </Button>
            </Link>
          </div>
          {isEdit && (
            <Button variant="destructive" onClick={handleDelete} disabled={isPending || deleting}>
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 " />
                  Delete Theme
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
