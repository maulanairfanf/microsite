---
name: wire-query
description: Use when building or fixing a read-only (GET) endpoint or query in Halamanku — API route returning data, or a DB read function. Follows the read conventions and response shape.
---

# Wire Query

Build a read-only API route or DB query consistent with Halamanku's conventions (`.opencode/context/conventions.md` → "API Routes" and "Database Access"; `.opencode/context/security.md`).

## API route (GET)

```ts
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (session?.role !== Role.SuperAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    const tenants = await listTenants(...);   // from src/lib/db/
    return NextResponse.json({ data: tenants });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
```

Hard rules from `conventions.md`:
- **Auth check first**, after `try`. Return 401 (no session) / 403 (wrong role).
- **Wrap in try/catch**, return generic 500 message (never leak internals — `security.md`).
- **Read shape:** `{ data: ... }`. (Mutations use `{ success: true, ... }` — see `wire-mutation`.)
- **Server-side validation** of query params with Zod when they feed the query.
- **No `prisma` in the route** — call `src/lib/db/<entity>.ts`.

## DB query function (`src/lib/db/<entity>.ts`)

- Naming: `get<X>` (one record or null), `list<X>(options?)` (many), `count<X>...`.
- **Scope by `tenantId`** — never return data across tenants. The session tenantId is authoritative (`security.md`).
- Do NOT import from `src/lib/db/index.ts` — import from the entity file directly.

## Steps

1. `analyze-feature` — find an existing route for the same verb + resource.
2. Add/reuse the DB function in `src/lib/db/<entity>.ts`.
3. Create or update the route in `src/app/api/**/route.ts`.

## Verification

- `npm run typecheck`
- `npm run lint`
- Add a unit test for any new pure query/helper (see `write-tests`).