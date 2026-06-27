# Billing Integration (Xendit)

## Approach

**Indonesian payment gateway** — `xendit-node` SDK, sandbox mode for development.

**Payment methods:** GO_PAY, OVO, DANA, SHOPEEPAY, LINKAJA, QRIS, VIRTUAL_ACCOUNT

**Pricing:** Rp 30,000/month for Premium plan

---

## Invoice Status Mapping

Xendit invoice statuses are normalized in `src/lib/billing/providers/xendit.ts`:

| Xendit Status | Normalized To |
|---------------|---------------|
| `PAID` / `SETTLED` | `XenditInvoiceStatus.Paid` |
| `PENDING` / `UNPAID` | `XenditInvoiceStatus.Pending` |
| `EXPIRED` | `XenditInvoiceStatus.Expired` |
| Unknown | `XenditInvoiceStatus.Unknown` |

**Subscription status flow:**
- Invoice `Paid` → Create `Subscription` with `status: "active"`, update `Tenant.plan` to `"premium"`
- Invoice `Expired` → Record failed payment, don't update plan
- Webhook replay → Idempotent (check if subscription exists)

---

## Activation Flow

```
User clicks "Upgrade" 
  → POST /api/billing/checkout
  → Create Xendit invoice (externalId: "halamanku-{tenantId}-{timestamp}")
  → Return checkout URL + signed token
  → User completes payment on Xendit
  → Xendit webhook → POST /api/billing/webhook
  → Verify signature, extract tenant ID
  → Fetch invoice status, activate subscription
  → OR: User returns to /checkout/success
  → ActivationPoller polls /api/billing/refresh (rescue endpoint)
  → Same activation logic (idempotent)
```

**Idempotency:** If subscription already exists for this Xendit invoice (in any state), update it rather than creating a duplicate.

---

## Webhook Handling

**Verification:**
```ts
// src/app/api/billing/webhook/route.ts
const rawBody = await request.text(); // NOT request.json()
const event = verifyXenditWebhook(rawBody, callbackToken);
```

**Key points:**
- Read raw body (not `request.json()`) to avoid "body already consumed" issues
- Verify `x-callback-token` header
- Log event type for debugging
- Idempotent activation (can be called multiple times safely)

---

## Environment Variables

```env
XENDIT_SECRET_KEY="xnd_development_..."
XENDIT_CALLBACK_TOKEN="..."
BILLING_TOKEN_SECRET="..."  # HMAC-SHA256 for checkout URLs
```

**Get sandbox keys:**
- Secret: [dashboard.xendit.co](https://dashboard.xendit.co) → Settings → Developers → API Keys
- Callback: Settings → Developers → Callbacks

---

## File Locations

```
src/lib/billing/
├── index.ts                    # Public API
├── plans.ts                    # Plan definitions (PLANS map)
├── activation.ts               # Idempotent activation logic
├── checkout-token.ts           # HMAC signing for success URLs
├── refresh-status.ts           # Polling status const
└── providers/
    └── xendit.ts               # Xendit SDK wrapper
```

**API routes:**
- `POST /api/billing/checkout` — Create invoice
- `POST /api/billing/webhook` — Xendit callback
- `POST /api/billing/refresh` — Polling rescue endpoint
- `POST /api/billing/cancel` — Cancel subscription
- `GET /api/billing/subscription` — Get subscription status

**Components:**
- `src/components/billing/CheckoutButton.tsx`
- `src/components/billing/SubscriptionCard.tsx`
- `src/components/billing/PlanBadge.tsx`
- `src/components/billing/ActivationPoller.tsx`

---

## Code Patterns

**Xendit SDK initialization:**
```ts
// src/lib/billing/providers/xendit.ts
let _xendit: Xendit | null = null;

function getXendit(): Xendit {
  if (_xendit) return _xendit;
  if (!XENDIT_SECRET_KEY) {
    throw new Error("XENDIT_SECRET_KEY is not set...");
  }
  _xendit = new Xendit({ secretKey: XENDIT_SECRET_KEY });
  return _xendit;
}
```

**Activation (idempotent):**
```ts
export async function activatePremiumSubscription(input: ActivationInput) {
  const existing = await getSubscriptionByXenditInvoiceId(input.xenditInvoiceId);
  
  if (existing && existing.status === SubscriptionStatus.Active) {
    return { kind: ActivationKind.AlreadyActive, subscriptionId: existing.id };
  }
  
  if (existing) {
    await updateSubscriptionStatus(input.xenditInvoiceId, { status: SubscriptionStatus.Active });
    await recordPayment({ ... });
    await setTenantPlan(input.tenantId, Plan.Premium);
    return { kind: ActivationKind.Activated, subscriptionId: existing.id };
  }
  
  // Create new subscription
  const sub = await recordSubscription({ ... });
  await recordPayment({ ... });
  await setTenantPlan(input.tenantId, Plan.Premium);
  return { kind: ActivationKind.Activated, subscriptionId: sub.id };
}
```

---

## Testing in Sandbox

**Sandbox vs Production:**
- Sandbox uses test API keys (`xnd_development_...`)
- Sandbox allows `simulate_payment` endpoint to fake payment completion
- Production requires real payment methods

**Test card numbers:** Xendit sandbox accepts any test data for QRIS/Virtual Account

**Simulate payment (sandbox only):**
```ts
// src/lib/billing/providers/xendit.ts
export async function simulateXenditInvoicePayment(externalId: string) {
  const auth = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64");
  const res = await fetch(`https://api.xendit.co/v2/invoices/${id}/simulate_payment`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
  });
}
```

**Disabled in production:**
```ts
if (simulate && process.env.NODE_ENV === "production") {
  return NextResponse.json({ error: "Simulate is disabled in production" }, { status: 403 });
}
```

---

## Common Issues

### "XENDIT_SECRET_KEY is not set"
- App works without billing — checkout flow just won't work
- Add key to `.env` and restart dev server

### Webhook signature verification fails
- Check `XENDIT_CALLBACK_TOKEN` matches Xendit dashboard
- Ensure raw body is read (not `request.json()`)

### Subscription not created after payment
- Check webhook was received (look for `[webhook]` logs)
- Verify activation is idempotent (can be called multiple times)
- Check Xendit invoice status via `findXenditInvoiceByExternalId()`
