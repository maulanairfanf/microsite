---
name: create-form
description: Use when building a form for Halamanku — sign-up, login, admin edit forms, theme editor. Uses the shared FormField + Zod validator pattern, never raw inputs.
---

# Create Form

Build a validated form using Halamanku's shared form pattern (`.opencode/context/conventions.md` → "Forms").

## The pattern (shared validation)

1. **Define the Zod schema** in `src/lib/<thing>Validator.ts` (e.g. `themeValidator.ts`).
2. **Client** uses the schema for live feedback (field-level errors via the `error` prop).
3. **Server re-runs** the same schema in the API route before touching the DB.
4. Field-level errors go on the `<FormField>` `error` prop — not a top-level toast.

## Must-dos

- **Use `<FormField>` for inputs** (labels, hints, errors). NEVER raw `<input>`.
- Use `<Button>`, `<Link>`, `<Select>` from `@/components/ui/` — not raw `<button>`, `<a>`, `<select>`.
- Shared dropdown option types: `SelectOption` / `ComponentOption` from `@/lib/db/types.ts` — never inline `{ value, label }` literals.
- Client components import const objects/types from `@/lib/constants` only.

## Client form example

```tsx
"use client"; // uses useState + onSubmit

const [errors, setErrors] = useState<Record<string, string[]>>({});
<FormField id="email" label="Email" type="email" value={email} onChange={setEmail} error={errors.email?.[0]} />
```

## Section config forms

Section config uses the `configSchema` registry pattern (`section-form/` under `src/components/admin/`), not hand-written fields. Adding a new field type = adding one entry to `fieldRegistry` in `FieldRenderer.tsx` — never extend existing field components.

## Steps

1. `analyze-feature` — check `src/components/auth/FormField.tsx` and an existing admin form for the pattern.
2. Create/extend the Zod validator in `src/lib/`.
3. Build the client form component.
4. Wire the mutation (see `wire-mutation` skill) to submit, running the validator server-side.

## Verification

- `npm run typecheck`
- `npm run lint`
- Add/adjust unit tests if the validator is new (see `write-tests` skill).