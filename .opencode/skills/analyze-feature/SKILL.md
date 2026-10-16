---
name: analyze-feature
description: Use before writing any code for a feature or bug fix. Understand the existing implementation, architecture, reusable components, and services without modifying anything.
---

# Analyze Feature

Read-only reconnaissance before generating code. Run this BEFORE any `create-*`, `wire-*`, or `write-tests` skill. Never edit, create, or delete files — this skill is read + search only.

## Why

Understanding how the codebase already solves a problem avoids duplicating patterns and produces changes that fit the existing architecture instead of fighting it.

## Procedure

1. **Map the domain.**
   - Read `.opencode/context/project.md` (architecture, roles, sections) and `.opencode/context/conventions.md` (const-objects, DB-access layering, API shape).
   - Identify which area the feature touches: sections, theme, billing, email, auth, admin, super-admin, public page.

2. **Find existing similar code.**
   - Sections: read `src/lib/components/componentNames.ts`, `schemas/`, `displayNames.ts`, a sample render component in `src/components/`, and `ComponentRenderer.tsx`.
   - Pages: find siblings in `src/app/**` for the same route group (`admin`, `super`, `[...tenant]`, `checkout`).
   - API: find an `src/app/api/**/route.ts` that fits the same verb (read vs mutation) and note its auth + validation + response pattern.
   - DB: check `src/lib/db/<entity>.ts` for a function that already returns the needed shape.

3. **Inventory reusable primitives.**
   - Reusable UI: `src/components/ui/*` (design system — do not modify), existing admin/auth forms and tables.
   - Shared types: `src/lib/db/types.ts` (`SectionWithComponent`, `SectionFormSection`, `SectionCardItem`, `SelectOption`, `ComponentOption`).
   - Pure helpers: `src/lib/*` (`themeTokens.ts`, `slug.ts`, `configState.ts`), hooks in `src/hooks/`.

4. **Note constraints & risks.**
   - Client/server boundary: client must not import `@/lib/auth`.
   - Cross-tenant isolation: all queries scoped by `tenantId`, session is authoritative.
   - Do-not-edit: `src/components/ui/**` and `src/lib/constants.ts` unless the task is to extend enums.

## Output

Report:
- Relevant files and where unchanged
- Existing patterns/helpers to reuse (with exact paths)
- Where new code must go
- Constraints/risks identified
- Whether a Prisma migration is needed (only if you touch `prisma/schema.prisma`)

Stop here. Hand off to the builder with this context.