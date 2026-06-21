# AGENTS.md

> Rules and patterns for AI agents and human contributors working on **Halamanku** — a multi-tenant microsite builder.
> If a future you (human or LLM) reads this and disagrees with a rule, fix the rule first, then the code.

## 1. Overview

**Halamanku** is a Linktree-style microsite platform. Tenants sign up, get a default Hero section, customize a visual theme (page/container/card tokens with live preview), and publish at `/{tenant-slug}`.

**Tech stack:**

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev), [TypeScript 5](https://www.typescriptlang.org) with `strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`
- [Prisma 6](https://www.prisma.io) + [PostgreSQL 16](https://www.postgresql.org)
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix)
- [@dnd-kit](https://dndkit.com) for drag-and-drop sections
- [Zod 4](https://zod.dev) for validation (client + server share schemas)
- [Vitest 1.6](https://vitest.dev) for unit tests, [Playwright](https://playwright.dev) for E2E
- [ESLint 9](https://eslint.org) (flat config) + [Prettier 3](https://prettier.io)

**Role hierarchy:**

```
super_admin  >  tenant_main_admin  >  tenant_admin
```

A `super_admin` manages all tenants and themes globally. A `tenant_main_admin` is the owner of a single tenant and can transfer ownership. A `tenant_admin` is a regular user inside a tenant with limited permissions.

**Where 95% of edits happen:** `src/`. Reference `prisma/` for schema, `e2e/` for E2E tests, `tests/` for unit tests.

---

## 2. Project layout

```
halamanku/
├── prisma/
│   ├── schema.prisma         # Tenant, User, Section, Component, Theme (+ plan: String)
│   ├── seed.ts               # Seeds super admin + sample tenants
│   └── migrations/            # One folder per migration
├── public/
│   └── logo.svg              # Halamanku brand mark (near-white, 1254x1254)
├── src/
│   ├── app/                  # App Router
│   │   ├── page.tsx          # Landing page (server component)
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Tailwind + custom CSS + animations
│   │   ├── not-found.tsx     # Custom 404
│   │   ├── login/            # /login
│   │   ├── sign-up/          # /sign-up
│   │   ├── admin/            # Tenant admin UI (server components under here)
│   │   ├── super/            # Super admin UI
│   │   ├── [...tenant]/      # /{slug} public microsite
│   │   ├── checkout/         # /checkout, /checkout/success
│   │   └── api/              # REST endpoints
│   │       ├── auth/         # /api/auth/{login,logout,sign-up}
│   │       ├── tenants/      # /api/tenants
│   │       ├── themes/       # /api/themes
│   │       ├── sections/     # /api/sections
│   │       ├── users/        # /api/users
│   │       ├── billing/       # /api/billing/{checkout,webhook,subscription,cancel}
│   │       └── health/       # /api/health
│   ├── components/
│   │   ├── ui/               # shadcn primitives — DO NOT modify
│   │   ├── admin/            # Sidebar, AdminShell, AdminTopBar, forms
│   │   ├── auth/             # FormField, BrandLogo (shared by /login + /sign-up)
│   │   ├── landing/          # Marketing site sections (Hero, Features, ...)
│   │   └── <Name>.tsx        # Public page components (Hero, Linktree, ProductCard, ...)
│   │                         # rendered by ComponentRenderer on /{slug}
│   ├── lib/
│   │   ├── auth.ts           # getSession, setSession, clearSession
│   │   ├── client-api.ts     # clientApi.{get,post,put,delete}
│   │   ├── prisma.ts         # Prisma client singleton
│   │   ├── slug.ts           # SLUG_REGEX, isValidSlug, isReservedSlug
│   │   ├── themeTokens.ts    # parseBorder, composeBorder, computeHoverBackground
│   │   ├── themeValidator.ts # Zod schemas for theme tokens
│   │   ├── themeDefaults.ts  # defaultTokens
│   │   ├── heroDefaults.ts   # HERO_COMPONENT_NAME + HERO_CONFIG_SCHEMA
│   │   ├── useIsClient.ts    # SSR-safe hydration hook
│   │   ├── utils.ts          # cn() helper (clsx + tailwind-merge)
│   │   ├── billing/          # Xendit wrapper + checkout-token + activation helpers
│   │   ├── email/            # EmailJS REST API wrapper + verification token utils
│   │   ├── constants.ts      # Role, Plan const objects + Session type
│   │   └── db/               # Prisma query functions (one file per entity)
│   ├── types/
│   │   └── components.ts     # Component, Theme, ThemeTokens, etc.
│   └── data/                 # Seed/static JSON for sample tenants
├── tests/                    # Vitest unit tests (one .test.ts per source file)
├── e2e/                      # Playwright E2E tests
├── eslint.config.mjs
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
├── docker-compose.yml        # Postgres on port 5433
└── .github/workflows/ci.yml  # lint, typecheck, test, build, e2e
```

---

## 3. The data path: 3 ways to fetch

This is the most important section. Pick the right path the first time.

### Path A — Server Component (preferred for read-only page data)

Use when a page or layout needs data on initial render and doesn't need real-time updates.

```ts
// src/app/admin/page.tsx
import { getSession } from "@/lib/auth";
import { getTenantByTenantId } from "@/lib/db/tenants";
import { listThemes } from "@/lib/db/themes";

export default async function AdminDashboard() {
  const session = await getSession();
  const tenant = session?.tenantId ? await getTenantByTenantId(session.tenantId) : null;
  const themes = await listThemes();
  // ... render
}
```

- No `"use client"`.
- All `await`s are top-level in the function body. Don't `Promise.all` everything — sequential reads are fine and easier to reason about.
- `getSession()` returns `Session | null`. Always null-check before dereferencing.
- For redirects on missing auth, call `redirect("/login")` from `next/navigation` at the top of the function (after the session check).

### Path B — API Route (for mutations and client-driven refresh)

Use when the data changes, or when a client component needs to call it.

```ts
// src/app/api/themes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTheme, updateTheme, deleteTheme } from "@/lib/db/themes";
import { getSession } from "@/lib/auth";
import { Role } from "@/lib/constants";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session || session.role !== Role.SuperAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: super admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    // ... validate, mutate

    return NextResponse.json({ data: theme });
  } catch (error) {
    console.error("PUT /api/themes/[id] error:", error);
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}
```

**Hard rules:**

1. **Auth check first.** Every mutating handler (`POST`, `PUT`, `PATCH`, `DELETE`) checks `getSession()` and the required role as its first statement after `try`.
2. **Wrap in `try/catch`.** Always. The catch logs the error and returns 500 with a generic message.
3. **Return shape** is one of:
   - `{ data: ... }` for read
   - `{ success: true, data: ... }` for create/update
   - `{ success: true, message: "..." }` for success-only responses (e.g., delete)
   - `{ error: "human readable message" }` for any failure
   - For validation errors: `{ error: "Validation failed", errors: { field: ["msg1", "msg2"] } }`
4. **Status codes:**
   | Code | When |
   |---|---|
   | 200 | OK (read or update) |
   | 201 | Created (POST) |
   | 400 | Bad Request (validation) |
   | 401 | Unauthorized (no session) |
   | 403 | Forbidden (wrong role) |
   | 404 | Not Found |
   | 409 | Conflict (e.g., unique constraint) |
   | 500 | Internal Server Error |
5. **Validate input server-side.** Never trust the client. If there's a Zod schema, run it.
6. **Use `prisma.$transaction`** when mutating multiple records atomically. Example: `deleteTenant` in `src/lib/db/tenants.ts` deletes users + tenant in a transaction.

### Path C — Client Component fetch (for forms, interactive UI)

Use inside `"use client"` components when the user triggers a mutation (form submit, button click, drag-drop reorder).

```ts
// Anywhere in a "use client" component
import { clientApi } from "@/lib/client-api";

await clientApi.put(`/api/themes/${id}`, {
  name: "New name",
  config: JSON.stringify(tokens),
});
// On success, refresh server data:
router.refresh();
```

**Never** use raw `fetch()` in a client component. `clientApi` already:

- Sets `Content-Type: application/json`
- Throws an `Error` with the server's `error` message on non-OK responses
- Returns typed `T` on success

If you need the response without throwing (e.g., a 409 you want to display inline), wrap in try/catch.

---

## 4. DB queries: how to add or modify

**Rule: every Prisma call goes through `src/lib/db/<entity>.ts`.** Never import `prisma` from a page, component, or API route.

### File structure

One file per entity, named exactly after the Prisma model (lowercased).

```
src/lib/db/
├── tenants.ts       # CRUD for Tenant model
├── users.ts         # CRUD for User model (+ password hashing)
├── themes.ts        # CRUD for Theme model (+ parseThemeConfig helper)
├── sections.ts      # CRUD for Section model
├── components.ts    # CRUD for Component model
├── billing.ts       # CRUD for Subscription + Payment
└── index.ts         # Re-exports (used sparingly — prefer direct imports)
```

### Naming convention

| Function | Returns | Example |
|---|---|---|
| `get<X>` | one record or `null` | `getUserById`, `getThemeBySlug`, `getTenantByTenantId` |
| `list<X>(options?)` | many records | `listTenants({ includeInactive })`, `listThemes()` |
| `create<X>(data)` | created record | `createUser({ email, password, name, ... })` |
| `update<X>(id, data)` | updated record (partial data) | `updateTenant(id, { name, themeId })` |
| `delete<X>(id)` | `Promise<void>` | `deleteTheme(id)` |
| `count<X>...` | number, special-purpose | `countTenantsUsingTheme(themeId)` |
| `find<Specific>(args)` | one record for a specific case | `findHeroSectionForTenant(tenantId)` |

### Return types

Re-export the Prisma type if you return it unchanged:

```ts
// src/lib/db/users.ts
import type { User } from "@prisma/client";
export type { User };

export async function getUserById(id: string): Promise<User | null> { ... }
```

Or define a hand-rolled interface for transformation/serialization cases (see `Tenant` in `src/lib/db/tenants.ts`).

### Transactions

When a single user action affects multiple records, wrap in `prisma.$transaction`:

```ts
// src/lib/db/tenants.ts
export async function deleteTenant(id: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.user.deleteMany({ where: { tenantId: id } });
    await tx.tenant.delete({ where: { id } });
  });
}
```

### Schema changes

1. Edit `prisma/schema.prisma`
2. `npx prisma migrate dev --name <short_description>` — creates a new migration under `prisma/migrations/<timestamp>_<name>/`
3. If you added a new model: add a new file in `src/lib/db/` with the query functions
4. If you added a field to an existing model: update the entity's file to expose helpers (and add a transformer if it's a JSON field)
5. If it's user-facing: add validation to the relevant Zod schema in `src/lib/<thing>Validator.ts`

---

## 5. Components: server vs client, where to put them

### Default: server components

**No `"use client"` unless you genuinely need:**

- `useState`, `useEffect`, `useRef`, or other hooks
- Browser APIs (`window`, `document`, `localStorage`, `navigator`)
- Event handlers that must run in the browser
- Third-party libraries that require the client (e.g., drag-and-drop, dialogs)

When you do add `"use client"`, comment the reason:

```ts
"use client"; // Drag-and-drop requires browser event handlers

import { useState } from "react";
// ...
```

### Where to put new components

| Type of component | Location | Examples |
|---|---|---|
| Public page component (rendered by `ComponentRenderer` on `/{slug}`) | `src/components/<Name>.tsx` | `Hero.tsx`, `Linktree.tsx`, `ProductCard.tsx` |
| Admin UI (forms, tables, theme editor) | `src/components/admin/<Name>.tsx` | `Sidebar.tsx`, `ThemeEditor.tsx` |
| Shared between `/login` and `/sign-up` | `src/components/auth/<Name>.tsx` | `FormField.tsx`, `BrandLogo.tsx` |
| Marketing site section | `src/components/landing/<Name>.tsx` | `Hero.tsx`, `Features.tsx`, `Showcase.tsx` |
| shadcn primitive — don't modify | `src/components/ui/<name>.tsx` | `button.tsx`, `card.tsx`, `avatar.tsx` |

### Naming

- **Files**: `PascalCase.tsx`
- **One component per file**, exported by name (no `default` exports)
- Filename matches the exported name
- Helpers stay inline if used only once; move to a separate file only when reused

### Reusability rules

- **Reuse before creating.** If you're typing similar JSX for the second time, **extract it**.
- **Don't pre-extract.** Wait for the second occurrence. Hypothetical future reuse is not a reason to extract.
- **Before writing a new component, search the codebase.** The likely sources:
  - `src/components/admin/` (sidebar, top bar, forms, theme editor)
  - `src/components/auth/` (FormField, BrandLogo)
  - `src/components/ui/` (shadcn primitives)
  - `src/components/<Name>.tsx` (existing public page components)

### Reusable components to know about

| Component | Where | What it does |
|---|---|---|
| `<FormField>` | `src/components/auth/FormField.tsx` | Labeled input with optional hint and error. **Use for all form inputs.** |
| `<BrandLogo>` | `src/components/auth/BrandLogo.tsx` | The Halamanku wordmark SVG, no link. |
| `<Button>`, `<Card>`, `<Input>`, `<Select>`, `<Textarea>`, `<Avatar>`, `<DropdownMenu>`, `<Skeleton>` | `src/components/ui/` | shadcn primitives. Wrap them in your own component if you need a variant. |
| `<PageHeader>` | `src/components/admin/PageHeader.tsx` | Title + description + action slot. Top of every admin page. |
| `<Sidebar>`, `<AdminShell>`, `<AdminTopBar>` | `src/components/admin/` | Layout for `/admin` and `/super`. Don't add new ad-hoc layouts. |
| `<ColorInput>` | `src/components/admin/ColorInput.tsx` | Hex color picker for the theme editor. |
| `<NavBar>`, `<NavBarWithScrollSpy>` | `src/components/landing/NavBar.tsx` | Floating top bar on the landing page. |

### Component anatomy

A "well-formed" component looks like this:

```ts
// src/components/billing/PlanBadge.tsx
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/constants";

interface PlanBadgeProps {
  plan: Plan;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  if (plan !== Plan.Premium) return null;

  return (
    <span
      className={cn(
        "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-700",
        className,
      )}
    >
      Pro
    </span>
  );
}
```

- Named export (not `default`)
- Typed props with an `interface <Name>Props`, optional `className?: string` for composition
- Uses `cn()` (from `@/lib/utils`) for conditional class merging
- Returns `null` early when not applicable
- No comments unless explaining "why" (not "what")

---

## 6. Forms

### Use `<FormField>` for inputs

```ts
import { FormField } from "@/components/auth/FormField";

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

Don't use shadcn `<Input>` directly for validated forms — it doesn't render labels, hints, or errors. Use it for unstyled inputs (e.g., search bars) and forms without validation.

### Validation is shared between client and server

1. Define a Zod schema in `src/lib/<thing>Validator.ts`:

   ```ts
   // src/lib/themeValidator.ts
   export const themeSchema = z.object({
     name: z.string().min(1, "Theme name is required").max(100, "Name too long"),
     // ...
   });

   export function validateTheme(data: unknown): {
     success: boolean;
     data?: ThemeFormData;
     errors?: ThemeFieldErrors;
   } {
     const result = themeSchema.safeParse(data);
     if (result.success) return { success: true, data: result.data };

     const formatted = result.error.format();
     // ... flatten into { "theme.card.background": ["..."] }
   }
   ```

2. Client uses it for live feedback (and to disable the submit button on errors).
3. Server re-runs it in the API route before touching the DB.
4. Field-level errors go under the field via the `error` prop — not as a top-level toast.

### Form page pattern

```ts
// 1. Page is "use client" if it has any interaction
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { fooSchema } from "@/lib/fooValidator";
import { clientApi } from "@/lib/client-api";

export default function FooPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = fooSchema.safeParse({ name });
    if (!validation.success) {
      setErrors(validation.error.format() as any);
      return;
    }
    setLoading(true);
    try {
      await clientApi.post("/api/foo", validation.data);
      router.push("/admin");
    } catch (err: any) {
      setErrors({ _form: [err.message] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField id="name" label="Name" value={name} onChange={setName} error={errors.name?.[0]} />
      <Button type="submit" disabled={loading}>{loading ? "..." : "Create"}</Button>
    </form>
  );
}
```

---

## 7. Styling

### Use theme tokens, not inline colors

The tenant page renders a custom theme per tenant via CSS variables. Don't hardcode colors that should come from the theme.

| Want to do | Use | Don't use |
|---|---|---|
| Set a tenant-themable background | `var(--pageBackground)` (Tailwind: `bg-page`) | `bg-[#7c3aed]` |
| Set a tenant-themable text color | `var(--bodyText)` (Tailwind: `text-body`) | `text-[#111827]` |
| Set a primary purple button | `<Button>` (already styled) | `bg-purple-600 text-white` |
| Apply conditional classes | `cn(...)` from `@/lib/utils` | string concat or template literals |
| Center a flex item | `flex items-center justify-center` | custom CSS |

### shadcn primitives

In `src/components/ui/` — owned by the design system. **Don't add new variants to them.** If you need different styles, wrap them in your own component (e.g., `<PageHeader>` wraps `<div>`s, not a modified `<Card>`).

### Animations

`animate-float`, `animate-pulse-glow`, `animate-bounce-in`, `animate-wiggle`, `animate-fade-in` etc. are defined in `src/app/globals.css`. Use the existing ones; don't add new keyframes for one-off cases.

---

## 8. What NOT to do

A quick cheatsheet. If you find yourself doing any of these, stop and reconsider.

- ❌ **Don't put `prisma` calls in page or component files.** Always go through `src/lib/db/<entity>.ts`.
- ❌ **Don't use raw `fetch()` in client components.** Use `clientApi.{get,post,put,delete}`.
- ❌ **Don't use the `any` type.** Use `unknown` and narrow, or define a real type. (The codebase currently has 86 `no-explicit-any` warnings — fix them when you touch the file.)
- ❌ **Don't use `console.log` in committed code.** `console.error` and `console.warn` are allowed in `try/catch` blocks and top-level error boundaries.
- ❌ **Don't create barrel files** (`index.ts` re-exports). They hurt tree-shaking. Import directly from the source file.
- ❌ **Don't pre-extract components** for hypothetical future reuse. Wait for the second occurrence.
- ❌ **Don't skip auth checks** in API routes. Every mutating endpoint checks `getSession()` and the required role as its first statement.
- ❌ **Don't use raw `<input>` in forms.** Use `<FormField>` so labels, hints, and errors render consistently.
- ❌ **Don't fetch in `useEffect` for page-load data.** Use a server component, or `use()` with a promise.
- ❌ **Don't add new keyframes to `globals.css`** for one-off cases. Use existing animations.
- ❌ **Don't import from `src/lib/db/index.ts`** when you can import directly from the entity file. (The barrel exists; just don't add to it.)
- ❌ **Don't use the `Form` event handler** (`onSubmit={(e) => e.preventDefault()}`) without also calling the API and handling loading/error state.
- ❌ **Don't use string literal types for enumerated values.** Use const objects (e.g., `Role.SuperAdmin`) instead of `"super_admin"` scattered across call sites. The const values match the wire format byte-for-byte; TypeScript's structural typing makes them assignable to both the const-derived type and the original string literal type.
- ❌ **Don't use `dangerouslySetInnerHTML`** without a comment explaining the XSS audit.

---

## 9. Testing

- **Unit tests** in `tests/<source-file-name>.test.ts` for pure functions in `src/lib/`. Run with `npm test`.
- **E2E tests** in `e2e/<feature>.spec.ts` for critical user flows (sign-up, login, checkout). Run with `npm run e2e`.
- **Test names read like sentences**: `it("rejects slug with uppercase letters")`.
- **Use real data, not mocks of modules.** Don't reach for `vi.mock()` unless you have to — a real call to a Zod schema or a pure function is faster and more realistic.
- **One test file per source file** when reasonable. If a module has 30 functions, one `.test.ts` is fine. If it has 100, split it.
- **Test the public API**, not the internals. If a helper isn't exported, it's a private implementation detail — don't test it through the public API.

### Vitest pattern

```ts
// tests/slug.test.ts
import { describe, it, expect } from "vitest";
import { isValidSlug } from "@/lib/slug";

describe("isValidSlug", () => {
  it("accepts a simple lowercase slug", () => {
    expect(isValidSlug("hello")).toBe(true);
  });
  // ...
});
```

### Playwright pattern

```ts
// e2e/sign-up.spec.ts
import { test, expect } from "@playwright/test";

test("signs up, lands on /admin", async ({ page }) => {
  await page.goto("/sign-up");
  await page.getByLabel("Email").fill(`e2e-${Date.now()}@example.com`);
  // ...
  await page.getByRole("button", { name: /create/i }).click();
  await page.waitForURL("**/admin");
  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
});
```

---

## 10. Quick reference: how to add a new X

### Add a new API endpoint

1. Add a query function in `src/lib/db/<entity>.ts` if needed
2. Create `src/app/api/<resource>/route.ts` (or `src/app/api/<resource>/[id]/route.ts` for a single resource)
3. Auth check at the top of every mutating handler
4. Wrap body in `try/catch`, return JSON with `error` or `data` / `success`
5. If the request body has a Zod schema, run it server-side

### Add a new admin page

1. Create `src/app/<area>/<page>/page.tsx` (server component)
2. Read `session` + data at the top
3. Use `<PageHeader>` for the title row
4. Use existing `<Card>` for content blocks
5. For forms, use `<FormField>` and the matching Zod validator

### Add a new theme token

1. Add the field to the Zod schema in `src/lib/themeValidator.ts`
2. Add the field to defaults in `src/lib/themeDefaults.ts`
3. Add a form field in `src/components/admin/ThemeEditor.tsx` (use `<ColorInput>`, `<Input>`, or `<Select>`)
4. Add the CSS variable mapping in `src/components/ThemeProvider.tsx` (the `tokenMap` object)
5. Use the variable in your component via the Tailwind utility (e.g., `bg-page` for `var(--pageBackground)`)
6. Add the test case in `tests/theme-tokens.test.ts` and `tests/theme-validator.test.ts`

### Add a new section type (e.g., "Testimonials")

1. Add a `Component` row in the DB (via seed or migration) with the `configSchema` JSON describing the form fields
2. Create `src/components/Testimonials.tsx` matching the type interface in `src/types/components.ts`
3. Add a case in `src/components/ComponentRenderer.tsx`:
   ```ts
   case "testimonials":
     return <Testimonials data={component} />;
   ```
4. Add mock data in `src/lib/themePreviewMockData.ts` so the theme editor's mock preview shows the new type
5. Add to the `PREVIEW_SECTIONS` list (or wherever the editor pulls from)

### Add a new role-gated feature

1. Add the role check in the API route: `if (session.role !== Role.SuperAdmin) return 403`
2. Add the route in the appropriate layout's Sidebar nav items (`src/components/admin/Sidebar.tsx` — `superAdminNavItems` or `tenantAdminNavItems`)
3. Add any admin UI for the feature in the relevant page

### Add a new env var

1. Add to `.env` (and document in `README.md`)
2. Reference via `process.env.<NAME>` in `src/lib/<thing>.ts`
3. If the var is required at startup, validate in `src/lib/env.ts` (create it if it doesn't exist yet) and fail loudly if missing

### Add transactional email (EmailJS)

No npm install needed — uses built-in `fetch` to call the EmailJS REST API.

1. Sign up at [emailjs.com](https://emailjs.com) and connect your Gmail/Outlook as the email service
2. Create an email template with these variables:
   - `{{user_name}}` — recipient's display name
   - `{{to_email}}` — recipient's email address (also set the template's **"To Email"** field to `{{to_email}}`, not a hardcoded address)
   - `{{verification_url}}` — the verification link
   - `{{expires_in}}` — token expiry in minutes (e.g., `"1440"` for 24h)
   - `{{year}}` — current year for the footer
   - `{{reply_to}}` — reply-to address
3. Enable **"API access from non-browser environments"** at [emailjs.com/admin/account/security](https://dashboard.emailjs.com/admin/account/security) — required for server-side calls
4. Add `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID` to `.env`
5. Create `src/lib/email/providers/emailjs.ts` — REST API wrapper with `isEmailConfigured()` guard and `sendVerificationEmail()` (uses `fetch`, no SDK)
6. Create `src/lib/email/index.ts` — re-exports only the public API
7. Create `src/lib/email/utils/generate-token.ts` — `generateEmailVerificationToken()` + `getEmailVerificationTokenExpiry()`
8. Add `emailVerificationToken`, `emailVerificationTokenExpiresAt`, `emailVerified` fields to `User` in `prisma/schema.prisma`
9. Run `npx prisma migrate dev --name add_email_verification_fields`
10. Add `getUserByVerificationToken` + `verifyUserEmail` to `src/lib/db/users.ts`
11. Wire into sign-up: generate token → save to user → fire-and-forget `sendVerificationEmail()` (never fail the signup if email fails)
12. Create `GET /api/auth/verify?token=xxx` → validate token → `verifyUserEmail` → redirect to `/verify-email?status=success`
13. Create `POST /api/auth/resend-verification` → auth required → generate new token → resend email
14. Show unverified banner in `AdminShell` with resend button; pass `emailVerified` from the server layout via `getUserById`

> **Note on placeholder paths in this doc:** Throughout section 10 you'll see paths like `src/lib/<thing>.ts` or `src/app/api/<resource>/route.ts` — the angle-bracket parts are placeholders, not literal directory names. Substitute the actual resource (e.g., `src/lib/billing.ts` or `src/app/api/billing/checkout/route.ts`). The `Testimonials` and `env.ts` references are similarly aspirational — those files don't exist yet, the section shows what creating them would look like.

---

## 11. Enums: prefer const objects over string unions

**Rule:** co-locate the const object and its derived type in the same file as the business logic that owns the value. Never scatter string literals like `"super_admin"` or `"premium"` across call sites.

**Pattern:**

```ts
// src/lib/constants.ts — Role and Plan live here, imported by auth + call sites
export const Role = {
  SuperAdmin: "super_admin",
  TenantMainAdmin: "tenant_main_admin",
  TenantAdmin: "tenant_admin",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

// src/lib/billing/plans.ts — PlanInfo map keyed by Plan
import { Plan } from "@/lib/constants";

export const PLANS: Record<Plan, PlanInfo> = {
  [Plan.Free]: { id: Plan.Free, name: "Free", ... },
  [Plan.Premium]: { id: Plan.Premium, name: "Premium", ... },
};
```

**Why:** const values match the wire format (DB, JSON, cookies) byte-for-byte. TypeScript's structural typing means `Role.SuperAdmin` is assignable to the older `"super_admin"` literal type and vice-versa — no migration needed on the wire. The type is derived with `(typeof Role)[keyof typeof Role]`, so adding a new variant requires updating only the const object and TypeScript will catch all usages.

**What to never do:**
- ❌ Declare `type Role = "super_admin" | "tenant_main_admin" | "tenant_admin"` as a standalone string union type — values drift out of sync with the wire format with no single source of truth.
- ❌ Use string literals like `"super_admin"` in API route auth checks — hard to search, easy to mistype, no IDE autocomplete.
- ❌ Put enum values in the Prisma schema default — keep defaults as raw strings; the application layer owns the typed const.

---

## See also

- `README.md` — project overview, setup, demo credentials
- `CHANGELOG.md` — what's new in each version
- `LICENSE` — MIT
- `src/lib/themeTokens.ts` — canonical example of a pure utility module with tests
- `src/lib/constants.ts` — canonical example of co-located const objects + derived types
- `src/lib/email/providers/emailjs.ts` — canonical example of a server-side email provider (REST API, no SDK)
- `src/app/api/themes/[id]/route.ts` — canonical example of an API route
- `src/components/auth/FormField.tsx` — canonical example of a reusable client component
- `src/lib/db/tenants.ts` — canonical example of a DB module (read, write, transaction)

When in doubt, **copy the pattern from an existing file**.
