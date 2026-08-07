---
name: wire-mutation
description: Use when building or fixing a write (POST/PUT/DELETE) endpoint or state-changing flow in Halamanku — including webhooks, transactions, and idempotent activation. Follows the mutation conventions.
---

# Wire Mutation

Build a mutating API route or workflow (POST/PUT/DELETE) per Halamanku's conventions (`.opencode/context/conventions.md` → "API Routes", "Database Access"; `.opencode/context/security.md`).

## API route (POST example)

```ts
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== Role.SuperAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    const body = XValidator.parse(await request.json());   // Zod, server-side
    const created = await createThing(session.tenantId, body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", errors: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
```

Hard rules from `conventions.md`:
- **Auth check first** (401 no session / 403 wrong role), right after `try`.
- **Wrap in try/catch**; generic 500s (never leak DB errors — `security.md`).
- **Mutation shape:** `{ success: true, data }` (create/update) or `{ success: true, message }`.
- **Status codes:** 201 created, 200 update, 400 validation, 401/403 auth, 404 not found, 409 conflict.
- **Zod validation server-side**, always — never trust the client.
- **No `prisma` in the route** — use `src/lib/db/<entity>.ts`.

## Multi-record mutations → transactions

```ts
await prisma.$transaction(async (tx) => {
  await tx.user.deleteMany({ where: { tenantId: id } });
  await tx.tenant.delete({ where: { id } });
});
```

## Webhooks (Xendit / EmailJS)

When wiring a webhook, follow `.opencode/context/billing.md` and `email.md`:
- **Read the raw body** (`await request.text()`), NOT `request.json()` — avoid "body already consumed".
- **Verify the signature/callback token**.
- **Make processing idempotent** (e.g. activation: if a subscription already exists, update it, never duplicate).

## Steps

1. `analyze-feature` — find an existing mutation route + the matching `src/lib/db/<entity>.ts` function.
2. Create/update DB mutation in `src/lib/db/<entity>.ts`.
3. Wrap multi-record writes in `prisma.$transaction`.
4. Create/update the route; add server-side Zod validation.

## Verification

- `npm run typecheck`
- `npm run lint`
- `npm test` (add/adjust unit tests; see `write-tests`).