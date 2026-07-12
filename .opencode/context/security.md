# Security Guidelines

## Authentication & Authorization

- **Every mutating API route** must call `getSession()` and verify the user's role before processing
- Role checks use const objects (`Role.SuperAdmin`, never `"super_admin"`)
- Client-side role checks are for UX only — real enforcement happens server-side

## Tenant Isolation

- All queries scope by `tenantId` — never return data across tenant boundaries
- The `session.tenantId` is the authoritative tenant identifier
- Admin users can only access their own tenant's data (unless SuperAdmin)

## Input Validation

- Validate all user input server-side with Zod schemas
- Client-side validation is convenience only — server re-runs every check
- Never trust the client — validate shape, types, and bounds

## XSS Prevention

- Use `dangerouslySetInnerHTML` only with XSS audit comments citing the escape mechanism
- User-provided content (titles, descriptions) is rendered as plain text, not HTML
- SVG and image URLs from `configJson` are rendered as `<img>` / `<Image>` tags — no script execution possible from image URLs

## Image URLs

- User-provided image URLs are rendered with `<Image unoptimized>` to avoid Next.js domain whitelist errors
- Uploaded images go through Vercel Blob (controlled domain)
- External URLs pasted by admins are their own content on their own site — acceptable risk

## Secrets & Environment

- Never commit secrets (API keys, tokens, passwords) to version control
- `.env.example` documents all required env vars without real values
- Production secrets are managed via Vercel Environment Variables, not files

## API Routes

- Every handler wrapped in try/catch — never leak stack traces or internal details
- Error responses return generic messages (`"Failed to save section"`), not DB errors
- Use the standard response shapes: `{ data }`, `{ error }`, `{ success }`

## Database

- Prisma parameterizes all queries — no SQL injection risk
- `prisma.$transaction` for multi-record mutations to prevent partial writes
- Never call `prisma` directly in pages or components — go through `src/lib/db/`
