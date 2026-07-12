# Development Setup

## Environment Files

**Priority order (highest to lowest):**
1. `.env.local` — Local secrets (gitignored)
2. `.env` — Committed defaults (fallback)

Next.js loads `.env.local` first, then `.env`. For local development, put secrets in `.env.local`.

**Current env vars:**
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/microsite"

# Public app URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Xendit billing
XENDIT_SECRET_KEY="xnd_development_..."
XENDIT_CALLBACK_TOKEN="..."
BILLING_TOKEN_SECRET="..."

# EmailJS
EMAILJS_PUBLIC_KEY="..."
EMAILJS_SERVICE_ID="..."
EMAILJS_TEMPLATE_ID="..."
```

See `.env.example` for template with documentation.

---

## Database

**Docker Compose:**
```bash
docker compose up -d   # Start PostgreSQL on port 5433
```

**After schema changes:**
```bash
npx prisma migrate dev --name <short_description>
```

**Seed data:**
```bash
npx tsx prisma/seed.ts
```

Check `prisma/seed.ts` for current credentials (super admin, sample tenants).

**Prisma Studio:**
```bash
npx prisma studio   # Open http://localhost:5555
```

---

## Build Issues & Gotchas

### Client/Server Import Separation

**Problem:** Client components can't import from files with `next/headers` (cookies, headers, etc.).

**Symptom:** Build error: "You're importing a component that needs next/headers"

**Solution:**
- Shared types/consts → `src/lib/constants.ts` (NO server-only imports)
- Server functions → `src/lib/auth.ts` (has `cookies()`)
- Client components import from `@/lib/constants`
- Server code imports from both

### Migration Drift

**Problem:** "Drift detected: Your database schema is not in sync with your migration history"

**Cause:** Used `prisma db push` instead of `prisma migrate dev`, or manually modified DB.

**Solution (development only):**
```bash
npx prisma migrate reset   # Wipes DB, replays all migrations
npx tsx prisma/seed.ts     # Re-seed data
```

---

## Testing

**Unit tests (Vitest):**
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

**E2E tests (Playwright):**
```bash
npm run e2e           # Run all E2E tests
npm run e2e:ui        # Interactive UI mode
```

**Type check:**
```bash
npm run typecheck     # tsc --noEmit
```

**Lint:**
```bash
npm run lint          # ESLint (0 errors target)
npm run lint:fix      # Auto-fix
npm run format        # Prettier
```

**Build:**
```bash
npm run build         # Next.js production build
npm run dev           # Development server (Turbopack)
```

---

## Common Commands

```bash
# Start development
docker compose up -d          # Start database
npm run dev                   # Start Next.js dev server

# Database operations
npx prisma migrate dev        # Apply migrations
npx prisma studio             # Open Prisma Studio
npx tsx prisma/seed.ts        # Seed dev data

# Testing
npm test                      # Run unit tests
npm run e2e                   # Run E2E tests
npm run typecheck             # TypeScript check
npm run lint                  # ESLint check

# Production
npm run build                 # Build for production
npm start                     # Start production server
```

---

## Demo Credentials

After running seed:

**Super Admin:**
- Email: `admin@halamanku.id`
- Password: `admin123`
- Access: `/super`

**Sample Tenants:**
- `coffee-shop` — admin@coffee-shop.com / demo1234

Access admin panel at `/admin` after login.
