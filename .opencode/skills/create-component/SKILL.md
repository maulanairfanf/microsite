---
name: create-component
description: Use when building a React component for Halamanku — a public section renderer, an admin card, a form field, or any reusable UI. Follows the component anatomy in conventions.md.
---

# Create Component

Build a React component consistent with Halamanku's component conventions (`.opencode/context/conventions.md` → "Components").

## Anatomy

- File: `PascalCase.tsx`, one component per file, **named export** (no default exports).
- Typed props: `export interface <Name>Props { ... }`.
- Optional `className?: string` for composition.
- Early-return `null` when the component is not applicable.
- No comments unless explaining "why" (not "what").

```tsx
interface PlanBadgeProps {
  plan: Plan;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  if (plan !== Plan.Premium) return null;
  return <span className={cn("text-[10px] font-semibold", className)}>Pro</span>;
}
```

## Rules

- **Server-first.** Add `"use client"` only when needed, with a why-comment.
- **Reuse before create.** If you are typing similar JSX the SECOND time, extract; do not pre-extract for hypothetical reuse.
- **Styling:** `cn()` from `@/lib/utils`; theme tokens (`bg-page`, `text-body`) instead of inline colors; reuse existing `globals.css` animations (`animate-*`) instead of new keyframes.
- **Do NOT import `@/lib/auth` in client components.** Client types come from `@/lib/constants`.
- **shadcn primitives** live in `src/components/ui/` (design system, do not modify). Wrap them in your component for custom styling rather than editing variants.

## Location

- Public section renderer: `src/components/<Name>.tsx` (registered in `ComponentRenderer.tsx`).
- Admin pieces: `src/components/admin/`.
- Auth forms: `src/components/auth/` (share `FormField`, `BrandLogo`).

## Steps

1. Run `analyze-feature` to find an existing similar component and shared types.
2. Add `src/data` seed entries only if required for sample tenants (not typical).

## Verification

- `npm run typecheck`
- `npm run lint`