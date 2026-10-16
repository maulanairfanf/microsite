---
name: create-page
description: Use when building a new Next.js App Router page or route group for Halamanku. Sets up the page, layout, and route group following server-first conventions.
---

# Create Page

Add a new page under `src/app/`. Requires the project architecture from `.opencode/context/project.md`.

## Where it goes

| Route | Location | Notes |
|---|---|---|
| Admin UI | `src/app/admin/**` | Server components, session-guarded |
| Super admin UI | `src/app/super/**` | Server components, `Role.SuperAdmin` guard |
| Public microsite | `src/app/[...tenant]/**` | Renders sections + theme |
| Checkout / auth / verify | `src/app/{checkout,login,sign-up,verify-email}/**` | Existing groups |
| API routes | `src/app/api/**/route.ts` | Use the `wire-query` / `wire-mutation` skills instead |

## Conventions

- **Default: server components.** Add `"use client"` ONLY when required (`useState`, `useEffect`, browser APIs, event handlers, third-party client libs). Add a comment explaining why.
- **Named exports only.** No default exports.
- **Use shared UI:** `<FormField>` for inputs, `<Button>`, `<Link>` from `@/components/ui/`, theme tokens (`bg-page`, `text-body`) — never inline colors.
- **Server pages may read session** via `getSession()` from `@/lib/auth`; guard admin routes by role. Client components import types from `@/lib/constants`.
- **No `prisma` calls in pages** — use `src/lib/db/<entity>.ts` functions.
- **Reuse before create:** check for an existing page in the same route group and an existing layout.

## Steps

1. Run the `analyze-feature` skill for the target route group.
2. Create the page file (and `layout.tsx` if the group needs one).
3. Add it to route-group navigation/sidebar only if the existing app does so.

## Verification

- `npm run typecheck`
- `npm run lint`
- If it's an admin page behind auth, verify the role guard is in place (per `security.md`).