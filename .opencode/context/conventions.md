# Coding Conventions

## Enums: Use Const Objects

**Rule:** Co-locate const objects and derived types in the same file as the business logic. Never scatter string literals like `"super_admin"` or `"premium"` across call sites.

**Location:** `src/lib/constants.ts`

**Pattern:**
```ts
export const Role = {
  SuperAdmin: "super_admin",
  TenantMainAdmin: "tenant_main_admin",
  TenantAdmin: "tenant_admin",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Plan = {
  Free: "free",
  Premium: "premium",
} as const;
export type Plan = (typeof Plan)[keyof typeof Plan];
```

**Usage:**
- ✅ `session.role === Role.SuperAdmin`
- ❌ `session.role === "super_admin"`
- ✅ `tenant.plan === Plan.Premium`
- ❌ `tenant.plan === "premium"`

**Why:** Const values match wire format byte-for-byte. TypeScript's structural typing makes them assignable to both const-derived types and original string literal types.

---

## Imports: Server vs Client Separation

**Critical Rule:** Client components cannot import from files that use `next/headers` (cookies, etc.).

**Pattern:**
- `src/lib/constants.ts` — Shared types and const objects (NO server-only imports)
- `src/lib/auth.ts` — Server-only functions (getSession, setSession, clearSession)

**Client components:**
```ts
import type { Role } from "@/lib/constants";
import { Plan } from "@/lib/constants";
```

**Server components/API routes:**
```ts
import { getSession } from "@/lib/auth";
import { Role, Plan } from "@/lib/constants";
```

**Never:** Import `@/lib/auth` in client components — it imports `cookies()` from `next/headers`.

---

## Section Components: configSchema Pattern

**Rule:** Section component types are defined in the `components` table, each with a `configSchema` (JSON-stringified array of field definitions). The admin form (`TenantSectionForm.tsx`) parses the schema to render form fields.

**File structure:**
```
src/lib/components/
├── componentNames.ts           # ComponentName const (lowercase values)
├── displayNames.ts             # COMPONENT_DISPLAY_NAMES map (human labels)
└── schemas/
    ├── hero.ts                 # HERO_SCHEMA
    ├── banner.ts               # BANNER_SCHEMA
    ├── linktree.ts             # LINKTREE_SCHEMA
    ├── products-showcase.ts    # PRODUCTS_SHOWCASE_SCHEMA
    ├── products-catalog.ts     # PRODUCTS_CATALOG_SCHEMA
    ├── social-media.ts         # SOCIAL_MEDIA_SCHEMA
    ├── footer.ts               # FOOTER_SCHEMA (empty)
    └── index.ts                # re-exports + COMPONENT_SCHEMAS map
```

**Component names** (use the const, never string literals):
```ts
import { ComponentName } from "@/lib/components/componentNames";

if (section.component?.name === ComponentName.Hero) { ... }
```

**Adding a new section type:**
1. Add to `ComponentName` const in `componentNames.ts`
2. Create `schemas/<name>.ts` with the configSchema
3. Add to `COMPONENT_SCHEMAS` map in `schemas/index.ts`
4. Add to `COMPONENT_DISPLAY_NAMES` map in `displayNames.ts`
5. Run migration script: `npx tsx scripts/migrate-component-schemas.ts --force`
6. Add render component in `src/components/<Name>.tsx`
7. Add case in `src/components/ComponentRenderer.tsx`

**Schema field types:** `"text" | "number" | "textarea" | "array" | "object"` (see `TenantSectionForm.tsx`)

**Two-name pattern:** `name` is the wire identifier (e.g., `products_showcase`), `displayName` is the human label (e.g., "Products Showcase"). UI shows `displayName ?? name`. All DB comparisons use `componentId` (stable, not affected by name changes). This separates wire format from display concerns.

---

## Database Access

**Rule:** Never call `prisma` directly in pages, components, or API routes. Always go through `src/lib/db/<entity>.ts`.

**File structure:**
```
src/lib/db/
├── tenants.ts       # CRUD for Tenant model
├── users.ts         # CRUD for User model (+ password hashing)
├── themes.ts        # CRUD for Theme model
├── sections.ts      # CRUD for Section model
├── components.ts    # CRUD for Component model
├── billing.ts       # CRUD for Subscription + Payment
└── index.ts         # Re-exports (used sparingly)
```

**Naming convention:**
- `get<X>` — one record or null (`getUserById`, `getTenantByTenantId`)
- `list<X>(options?)` — many records (`listTenants`, `listThemes`)
- `create<X>(data)` — created record
- `update<X>(id, data)` — updated record
- `delete<X>(id)` — Promise<void>
- `count<X>...` — number, special-purpose

**Transactions:**
```ts
await prisma.$transaction(async (tx) => {
  await tx.user.deleteMany({ where: { tenantId: id } });
  await tx.tenant.delete({ where: { id } });
});
```

---

## API Routes

**Hard rules:**

1. **Auth check first** — Every mutating handler checks `getSession()` and required role as first statement after `try`.

2. **Wrap in try/catch** — Always. Catch logs error and returns 500 with generic message.

3. **Return shape:**
   - `{ data: ... }` for read
   - `{ success: true, data: ... }` for create/update
   - `{ success: true, message: "..." }` for success-only
   - `{ error: "human readable message" }` for failures
   - Validation errors: `{ error: "Validation failed", errors: { field: ["msg1"] } }`

4. **Status codes:**
   - 200 — OK (read or update)
   - 201 — Created (POST)
   - 400 — Bad Request (validation)
   - 401 — Unauthorized (no session)
   - 403 — Forbidden (wrong role)
   - 404 — Not Found
   - 409 — Conflict (unique constraint)
   - 500 — Internal Server Error

5. **Validate input server-side** — Never trust client. Run Zod schemas.

6. **Use `prisma.$transaction`** — When mutating multiple records atomically.

---

## Components

**Server vs Client:**
- Default: server components (no `"use client"`)
- Add `"use client"` only when needed: `useState`, `useEffect`, browser APIs, event handlers, third-party libs requiring client
- Comment the reason when adding `"use client"`

**Naming:**
- Files: `PascalCase.tsx`
- One component per file, exported by name (no default exports)
- Filename matches exported name

**Anatomy:**
```ts
interface PlanBadgeProps {
  plan: Plan;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  if (plan !== Plan.Premium) return null;

  return (
    <span className={cn("text-[10px] font-semibold", className)}>
      Pro
    </span>
  );
}
```

- Named export (not default)
- Typed props with `interface <Name>Props`
- Optional `className?: string` for composition
- Uses `cn()` from `@/lib/utils` for conditional classes
- Returns `null` early when not applicable
- No comments unless explaining "why" (not "what")

**Reusability rules:**
- Reuse before creating — if typing similar JSX second time, extract it
- Don't pre-extract — wait for second occurrence
- Search existing components before writing new ones

---

## Forms

**Use `<FormField>` for inputs:**
```ts
<FormField
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  placeholder="name@email.com"
  required
  autoComplete="email"
  error={errors.email?.[0]}
/>
```

Don't use shadcn `<Input>` directly for validated forms — it doesn't render labels, hints, or errors.

**Validation is shared:**
1. Define Zod schema in `src/lib/<thing>Validator.ts`
2. Client uses it for live feedback
3. Server re-runs it in API route before touching DB
4. Field-level errors via `error` prop — not top-level toast

---

## Styling

**Use theme tokens, not inline colors:**
- `var(--pageBackground)` (Tailwind: `bg-page`) — tenant-themable background
- `var(--bodyText)` (Tailwind: `text-body`) — tenant-themable text color
- `<Button>` — primary purple button (already styled)
- `cn(...)` — conditional class merging
- `flex items-center justify-center` — center flex items

**shadcn primitives:**
- In `src/components/ui/` — owned by design system
- Don't add new variants to them
- Wrap in your own component if you need different styles

**Animations:**
- Use existing ones from `src/app/globals.css`: `animate-float`, `animate-pulse-glow`, `animate-bounce-in`, `animate-wiggle`, `animate-fade-in`
- Don't add new keyframes for one-off cases

---

## What NOT to Do

- ❌ Don't put `prisma` calls in page or component files
- ❌ Don't use raw `fetch()` in client components — use `clientApi`
- ❌ Don't use `any` type — use `unknown` and narrow
- ❌ Don't use `console.log` in committed code — `console.error` and `console.warn` allowed in try/catch
- ❌ Don't create barrel files (`index.ts` re-exports) — they hurt tree-shaking
- ❌ Don't pre-extract components for hypothetical reuse
- ❌ Don't skip auth checks in API routes
- ❌ Don't use raw `<input>` in forms — use `<FormField>`
- ❌ Don't fetch in `useEffect` for page-load data — use server component or `use()`
- ❌ Don't add new keyframes to `globals.css` for one-off cases
- ❌ Don't import from `src/lib/db/index.ts` — import directly from entity file
-  Don't use string literal types for enumerated values — use const objects
- ❌ Don't use `dangerouslySetInnerHTML` without XSS audit comment

---

## SOLID Principles

**Rule:** Decompose large components (200+ lines) into single-responsibility units before they accrete nested logic. Don't pre-extract for hypothetical reuse — wait for the second occurrence, then refactor.

### Where each principle lives in this codebase

| Principle | Application |
|---|---|
| **S**ingle Responsibility | One component per file. Pure logic in `src/lib/`. React state in `src/hooks/`. UI in `src/components/`. |
| **O**pen/Closed | Extend by adding entries to a frozen registry, not by editing `if/else` branches. Example: `fieldRegistry` in `section-form/fields/FieldRenderer.tsx`. |
| **L**iskov Substitution | Field components share a `FieldContext` shape — any component matching that contract can be swapped into the registry. |
| **I**nterface Segregation | Field components destructure only the props they need; orchestrators pass a thin `FieldContext`, not a god-object. |
| **D**ependency Inversion | Field components depend on the `FieldContext` abstraction, not on `useConfigState` directly. The orchestrator wires the dependency. |

### Reference implementation: `TenantSectionForm` decomposition

```
src/
├── lib/configState.ts                 # Pure helpers: getNestedValue, setNestedValue, getEmptyItem, updateArrayItemAt, addArrayItemAt, removeArrayItemAt
├── hooks/useConfigState.ts            # React state adapter over the pure helpers
└── components/admin/
    ├── TenantSectionForm.tsx          # Orchestrator (~80 lines): parsing, state, render
    └── section-form/
        ├── types.ts                   # ConfigField, FieldContext
        └── fields/
            ├── TextField.tsx          # text | number | textarea
            ├── ObjectField.tsx        # nested object — recurses via FieldRenderer
            ├── ArrayField.tsx         # list of items — recurses via FieldRenderer
            └── FieldRenderer.tsx      # frozen fieldRegistry + dispatch
```

**Why:** The original 403-line monolith mixed JSON parsing, deep path mutation, branchy JSX, and submission logic. After refactor, adding a new field type (e.g., `color`, `image`) is a one-line addition to `fieldRegistry` — no edits to existing field components (OCP).

**Tests:** Pure helpers in `tests/configState.test.ts` (node env, no DOM). Hook adapter in `tests/useConfigState.test.ts` (mocks `useState`).

---

## When to Refactor

| Signal | Action |
|---|---|
| File > 300 lines | Look for the largest nested responsibility and extract it |
| Three+ `if (field.type === ...)` branches on the same value | Replace with a registry map |
| Same mutation logic (deep-path set) duplicated 3+ times | Extract to a pure helper in `src/lib/` |
| Component renders JSX + holds business state + parses data | Split: pure renderer + state hook + data parser |
| Two+ callers need the same shape of derived value | Extract a `use<X>` hook |

**Don't refactor preemptively.** Wait for the second occurrence or for the file to cross ~300 lines.
