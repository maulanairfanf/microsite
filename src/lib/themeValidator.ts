import { z } from "zod";

const colorRegex = /^(#[0-9a-fA-F]{3,8}|rgb\(.+\)|rgba\(.+\)|hsl\(.+\)|hsla\(.+\)|[a-z]+)$/;

const colorField = z
  .string()
  .min(1, "Color is required")
  .regex(colorRegex, "Invalid color format (use hex, rgb, rgba, hsl, or named color)");

const cssValueField = z
  .string()
  .refine((val) => val.length <= 200, "CSS value too long (max 200 characters)");

export const themePageSchema = z.object({
  background: colorField,
  text: colorField,
  headerText: colorField,
});

export const themeContainerSchema = z.object({
  background: colorField,
  radius: cssValueField,
  border: cssValueField,
  shadow: cssValueField,
});

export const themeCardSchema = z.object({
  background: colorField,
  hoverBackground: colorField.optional(),
  hoverOpacity: z
    .number()
    .min(0, "Hover opacity must be between 0 and 100")
    .max(100, "Hover opacity must be between 0 and 100")
    .optional(),
  text: colorField,
  radius: cssValueField,
  border: cssValueField,
  shadow: cssValueField,
});

export const themeSchema = z.object({
  name: z.string().min(1, "Theme name is required").max(100, "Name too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  fontFamily: z.string().min(1, "Font family is required"),
  theme: z.object({
    page: themePageSchema,
    container: themeContainerSchema,
    card: themeCardSchema,
  }),
});

export type ThemeFormData = z.infer<typeof themeSchema>;

export type ThemeFieldErrors = Record<string, string[] | undefined>;

export function validateTheme(data: unknown): {
  success: boolean;
  data?: ThemeFormData;
  errors?: ThemeFieldErrors;
} {
  const result = themeSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const formatted = result.error.format() as Record<string, any>;
  const flat: ThemeFieldErrors = {};

  function flatten(node: any, path: string[] = []) {
    if (!node || typeof node !== "object") return;

    if (Array.isArray(node._errors) && node._errors.length > 0) {
      const key = path.join(".");
      if (key) flat[key] = node._errors;
    }

    for (const [k, v] of Object.entries(node)) {
      if (k === "_errors") continue;
      flatten(v, [...path, k]);
    }
  }

  flatten(formatted);
  return { success: false, errors: flat };
}
