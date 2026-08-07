---
name: code-review
description: Use when reviewing Halamanku code or changes before merge. Checks conventions (const-object enums, no any/console.log), auth, tenant isolation, XSS, and error handling. Purely read-only.
---

# Code Review

Read-only review of Halamanku code against `.opencode/context/conventions.md` and `.opencode/context/security.md`. Hears reports; never edit. If fixes are needed, hand them to the builder agent.

## Convention checks (conventions.md)

- **Const objects, not string literals.** `Role.SuperAdmin` / `Plan.Premium` / `TenantStatus.Active` — NOT `"super_admin"` etc.
- **No `any`** — use `unknown` and narrow.
- **No `console.log`** in committed code; `console.error`/`warn` allowed inside try/catch.
- **API routes:** every mutating route has `getSession()` + role check first; wrapped in try/catch; correct response shape (`{ data }`, `{ success, ... }`, `{ error }`); server-side Zod validation; correct status codes.
- **DB access:** no `prisma` in pages/components/routes — goes through `src/lib/db/<entity>.ts`. Multi-record mutations use `prisma.$transaction`.
- **Types:** Section shapes and option types imported from `src/lib/db/types.ts`, never defined inline.
- **Components:** named exports, `interface <Name>Props`, `cn()`, theme tokens; `"use client"` only when needed with a why-comment; `<FormField>` not raw `<input>`; no raw `<button>`/`<a>`.
- **No new keyframes** in `globals.css` for one-off cases; no `dangerouslySetInnerHTML` without an XSS audit comment.

## Security checks (security.md)

- **Auth & authorization:** every mutating route checks session + role. Client role checks are UX only.
- **Tenant isolation:** all queries scoped by `tenantId`; no cross-tenant reads.
- **Input validation:** server re-runs every Zod schema; never trust client.
- **XSS:** user content rendered as plain text; `dangerouslySetInnerHTML` only with audit comment.
- **Webhooks:** raw body + signature verification + idempotent activation (billing.md / email.md).
- **Secrets:** no credentials committed; env vars documented in `.env.example` without values.

## Output

A prioritized findings list, each tagged:
- `[blocker]` — security or data-integrity issue; must fix before merge.
- `[nit]` — style/convention drift; fix if cheap.

No edits. Hand blockers to the builder with file:line references.