---
name: create-section
description: Use when adding a new section component type to Halamanku (Hero, Linktree, Banner, etc.), including schema registration, migration, renderer, and ComponentRenderer wiring.
---

# Create Section

Add a new section type to Halamanku's component registry. This is the core unit of work the platform is built around. Follow the exact 8-step flow in `.opencode/context/conventions.md` → "Section Components".

## The full flow

1. **Register the wire name** — add to `ComponentName` const in `src/lib/components/componentNames.ts` (lowercase value, e.g. `cta_banner`).
2. **Create the schema** — `src/lib/components/schemas/<name>.ts` exporting `X_SCHEMA` (array of field definitions). Field types: `"text" | "number" | "textarea" | "array" | "object"`.
3. **Register in the map** — add to `COMPONENT_SCHEMAS` in `schemas/index.ts`.
4. **Add the display name** — add to `COMPONENT_DISPLAY_NAMES` in `src/lib/components/displayNames.ts` (human label, e.g. "CTA Banner").
5. **Run the migration** to write the schema to the DB:
   `npx tsx scripts/migrate-component-schemas.ts --force`
6. **Build the renderer** — `src/components/<Name>.tsx`, using the `create-component` skill for anatomy.
7. **Wire the renderer** — add a case in `src/components/ComponentRenderer.tsx`.
8. **Seed sample data** (`src/data/`) only if the feature needs a demo tenant.

## Two-name pattern

- `name` = wire identifier (`cta_banner`), lowercase.
- `displayName` = UI label ("CTA Banner"). UI shows `displayName ?? name`.
- DB comparisons use `componentId` (stable), never a rename-sensitive name.

## Guards

- **Hero protection:** at most one Hero per tenant, enforced at the API layer (403/409). Don't weaken this.
- UI/admin forms parse `configSchema` automatically via `TenantSectionForm` — you generally do NOT hand-write admin form fields for a new section.

## Verification

- `npm run typecheck` and `npm run lint`.
- Check the migration ran (via `scripts/migrate-component-schemas.ts`) and Prisma schema is unchanged unless you really added a DB field.
- Add a render test if meaningful (see `write-tests`).