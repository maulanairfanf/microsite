# Email Integration (EmailJS)

## Approach

**Server-side only** — API routes call EmailJS REST API via built-in `fetch`. No npm package needed (browser-only `@emailjs/browser` doesn't work in Node.js).

**Free tier:** 200 emails/month, no domain verification, no recipient restrictions.

---

## Template Variables

Your EmailJS template must define these variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `{{user_name}}` | Recipient's display name | `"John Doe"` |
| `{{to_email}}` | Recipient's email address | `"user@example.com"` |
| `{{verification_url}}` | Verification link | `"https://app.com/verify?token=..."` |
| `{{expires_in}}` | Token expiry in minutes | `"1440"` (24 hours) |
| `{{year}}` | Current year for footer | `"2026"` |
| `{{reply_to}}` | Reply-to address | `"noreply@halamanku.com"` |

---

## Dashboard Setup

1. **Sign up** at [emailjs.com](https://emailjs.com)
2. **Add Email Service** → Connect your Gmail/Outlook
3. **Create Email Template** with variables above
4. **Set "To Email" field** to `{{to_email}}` (NOT a hardcoded email)
5. **Enable "API access from non-browser environments"** at `/admin/account/security` (required for server-side calls)
6. **Copy credentials:**
   - Public Key (starts with `user_...`)
   - Service ID (e.g., `service_gmail`)
   - Template ID (e.g., `template_abc123`)

---

## Environment Variables

```env
EMAILJS_PUBLIC_KEY="user_xxxxx"
EMAILJS_SERVICE_ID="service_xxxxx"
EMAILJS_TEMPLATE_ID="template_xxxxx"
```

---

## File Locations

```
src/lib/email/
├── index.ts                          # Public API (re-exports)
├── providers/
│   └── emailjs.ts                    # REST API wrapper
└── utils/
    └── generate-token.ts             # Token generation + expiry
```

**API routes:**
- `GET /api/auth/verify?token=xxx` — Verify email token
- `POST /api/auth/resend-verification` — Resend verification email (auth required)

**Pages:**
- `/verify-email` — Verification status page (success/error/resend)

---

## Code Pattern

**Provider (`emailjs.ts`):**
```ts
const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      user_name: input.name,
      to_email: input.to,
      verification_url: input.verificationUrl,
      expires_in: "1440",
      year: new Date().getFullYear().toString(),
      reply_to: "noreply@halamanku.com",
    },
  }),
});
```

**Important:** EmailJS returns plain text `"OK"` on success (not JSON). Use `response.text()`, not `response.json()`.

---

## Signup Flow

1. User signs up → generate verification token (crypto.randomBytes 32 hex)
2. Save token to user (`emailVerificationToken`, `emailVerificationTokenExpiresAt`)
3. Fire-and-forget `sendVerificationEmail()` (never fail signup if email fails)
4. User clicks link in email → `GET /api/auth/verify?token=xxx`
5. Validate token → `verifyUserEmail()` → redirect to `/verify-email?status=success`

---

## Common Issues

### "The Public Key is required"
- Env vars not loaded → restart dev server (Next.js doesn't hot-reload `.env`)
- Check `.env` has `EMAILJS_PUBLIC_KEY="..."` (with quotes)

### "API access from non-browser environments is currently disabled"
- Enable in EmailJS dashboard: `/admin/account/security`

### "535 Authentication failed" (Elastic Email/SMTP)
- You're using wrong service — EmailJS doesn't use SMTP auth

### Emails go to wrong address
- Template's "To Email" field is hardcoded → change to `{{to_email}}`

### SyntaxError: Unexpected token 'O', "OK" is not valid JSON
- EmailJS returns plain text `"OK"` on success
- Use `response.text()`, not `response.json()`
