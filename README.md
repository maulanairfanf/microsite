# Halamanku

> A multi-tenant microsite builder. One platform, every brand. Sign up, pick a theme, customize tokens, publish at `yourbrand.halamanku.com`.

[![CI](https://img.shields.io/badge/CI-passing-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-style multi-tenant SaaS that lets anyone spin up a personalized microsite at `/{slug}` and customize its theme with a live in-memory preview. Built as a portfolio piece to demonstrate real-world full-stack patterns: auth, RBAC, drag-and-drop, visual theming, transactional data integrity, defensive deletes, and end-to-end testing.

---

## Live demo

Add your Vercel URL here once deployed: **`https://halamanku.vercel.app`**

Sample seeded tenants: [`/kerabat-jenggala`](#) · [`/pempek-ibu-wati`](#)

---

## Screenshots

> Drop in real captures of the live app for maximum impact.

| Landing | Sign-up | Theme editor | Public page |
|---|---|---|---|
| _add_ `docs/landing.png` | _add_ `docs/signup.png` | _add_ `docs/theme-editor.png` | _add_ `docs/public-page.png` |

---

## What is Halamanku?

Halamanku (Indonesian for "my page") is a Linktree-style microsite platform. Tenants sign up, get a default Hero section, and customize their page through a visual theme editor — colors, borders, shadows, hover effects — all previewed live in a phone mockup before they hit save. The result is a public microsite at `/{tenant-slug}` that they can share anywhere.

The platform supports two roles:

- **`super_admin`** — manages all tenants and themes across the platform
- **`tenant_main_admin`** — manages their own tenant (sections, theme, users)

---

## Features

### For end users
- **Self-service sign-up** at `/sign-up` — creates a tenant, a default Hero section, and a user in a single atomic transaction
- **Visual theme editor** with in-memory live preview: edit page/container/card tokens and see the phone mockup update instantly
- **Tenant theme picker** with iframe-based live preview of the actual public page
- **Drag-and-drop section reordering** with a default-locked Hero section (cannot be deleted or moved)
- **User management** per tenant: invite, role assignment, transfer ownership, deactivate
- **10 component types** out of the box: Hero, Linktree, Products Showcase, Products Catalog, Banner, Social Media, Footer, Features, FAQ, Pricing

### For super admins
- **Tenant management**: create, edit, archive, restore, and hard-delete tenants
- **Theme management**: create, edit, and delete themes (with safety checks)
- **Impersonation**: log in as a tenant admin for support, with a clear "stop impersonating" banner

### Engineering
- **Role-based access control** with a clear hierarchy: `super_admin` > `tenant_main_admin` > `tenant_admin`
- **Defensive deletes**: themes can only be deleted if unused; tenants can only be hard-deleted when archived
- **HttpOnly session cookies** with `SameSite=lax`
- **Bcrypt password hashing** (10 rounds)
- **Cascade safety**: deleting a tenant removes its users explicitly; sections cascade at the DB level
- **Theming pipeline**: page/container/card CSS variables applied via a single `<ThemeProvider>`; per-card hover opacity computed as `color-mix(card.bg X%, #000 Y%)` where `X = 100 - opacity`
- **Glassmorphic landing/auth UI** with gradient backgrounds, floating orbs, and animated decorative shapes

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | [TypeScript 5](https://www.typescriptlang.org) (strict, `noUncheckedIndexedAccess`, `noImplicitOverride`) |
| UI | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) on top of [Radix UI](https://www.radix-ui.com) |
| Drag & drop | [@dnd-kit](https://dndkit.com) |
| ORM | [Prisma 6](https://www.prisma.io) |
| Database | [PostgreSQL 16](https://www.postgresql.org) |
| Auth | Custom session cookies, bcryptjs |
| Validation | [Zod 4](https://zod.dev) |
| Icons | [lucide-react](https://lucide.dev) + [react-icons](https://react-icons.github.io/react-icons) |
| Unit tests | [Vitest 1.6](https://vitest.dev) + `@vitest/coverage-v8` |
| E2E tests | [Playwright](https://playwright.dev) |
| Lint / format | [ESLint 9](https://eslint.org) (flat config) + [Prettier 3](https://prettier.io) |
| CI | [GitHub Actions](https://github.com/features/actions) |

---

## Architecture

```
┌────────────────────────────┐
│  Landing page (/)          │  ← public marketing site
│  /sign-up  /login          │
└─────────────┬──────────────┘
              │ sign-up (atomic tx)
              ▼
┌────────────────────────────┐
│  Tenant                    │  ← row in `tenants` table
│  User (tenant_main_admin)  │  ← row in `users` table
│  Hero Section (order 0)    │  ← row in `sections` table, auto-created
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│  /admin                    │  ← tenant admin UI (drag-drop, theme picker)
│  /super                    │  ← super admin UI (tenants, themes)
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│  /{tenant-slug}            │  ← public microsite, theme tokens applied
│  /{tenant-slug}?preview=ID │  ← theme preview mode
└────────────────────────────┘
```

**Key design decisions:**

- **Component ID as FK** — `Section` references `Component` by ID, not name. Renaming a component preserves the link.
- **Theme tokens in DB, applied via CSS variables** — `<ThemeProvider>` sets `--pageBackground`, `--containerBackground`, etc. on `:root`. Components read them via Tailwind utility classes (`.bg-page`, `.container-bg`, `.card-bg`).
- **In-memory preview** — super admin theme editor uses a `<MockTenantPreview>` that wraps the mock sections in `<ThemeProvider>` with local state. No DB roundtrip per keystroke. Save commits to DB.
- **Hero protection** — one Hero per tenant, enforced at the API layer (PUT/POST sections returns 403/409 if you'd create a second Hero; DELETE returns 403 for the existing one).

---

## Local setup

```bash
# 1. Clone and install
git clone <repo-url>
cd microsite
npm install

# 2. Start the database
docker-compose up -d

# 3. Run migrations and seed
npx prisma migrate dev
npx prisma db seed

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

### Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/microsite"
```

The default `docker-compose.yml` exposes PostgreSQL on port `5433` to match this URL. If you change the port in `docker-compose.yml`, update `DATABASE_URL` accordingly.

---

## Demo credentials

After `npx prisma db seed`, these accounts are available:

| Role | Email | Password |
|---|---|---|
| `super_admin` | `admin@halamanku.id` | `admin123` |
| `tenant_main_admin` | `tenant@foo.com` | `tenant123` |

Sign up your own tenant at `/sign-up` to test the full flow.

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests (one-shot) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with v8 coverage |
| `npm run e2e` | Playwright E2E tests (requires `npx playwright install` first) |
| `npm run e2e:ui` | Playwright with the UI runner |

---

## Project structure

```
.
├── prisma/
│   ├── schema.prisma        # Tenant, User, Section, Component, Theme
│   ├── seed.ts              # Seeds super admin + sample tenants
│   └── migrations/
├── public/
│   └── logo.svg             # Brand mark
├── src/
│   ├── app/
│   │   ├── (routes)/         # App Router pages
│   │   │   ├── page.tsx              # Landing
│   │   │   ├── login/                # /login
│   │   │   ├── sign-up/              # /sign-up
│   │   │   ├── admin/                # Tenant admin UI
│   │   │   ├── super/                # Super admin UI
│   │   │   └── [...tenant]/          # /{slug} public microsite
│   │   ├── api/             # REST endpoints
│   │   │   ├── auth/        # /api/auth/{login,logout,sign-up}
│   │   │   ├── tenants/     # /api/tenants
│   │   │   ├── themes/      # /api/themes
│   │   │   ├── sections/    # /api/sections
│   │   │   ├── users/       # /api/users
│   │   │   └── health/      # /api/health
│   │   ├── globals.css      # Tailwind + custom CSS
│   │   ├── layout.tsx       # Root layout
│   │   └── not-found.tsx    # Custom 404
│   ├── components/
│   │   ├── admin/           # Admin UI (forms, tables, theme editor)
│   │   ├── auth/            # Shared auth components (FormField, BrandLogo)
│   │   ├── landing/         # Marketing page sections
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── ComponentRenderer.tsx
│   │   ├── Hero.tsx         # Public Hero section
│   │   ├── Linktree.tsx
│   │   ├── ProductsCatalog.tsx
│   │   ├── ProductsShowcase.tsx
│   │   ├── Banner.tsx
│   │   ├── Footer.tsx
│   │   ├── SocialMedia.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts          # Session helpers
│   │   ├── prisma.ts        # Prisma client
│   │   ├── slug.ts          # Tenant slug validation
│   │   ├── themeTokens.ts   # Pure theme helpers (parseBorder, etc.)
│   │   ├── themeValidator.ts # Zod schemas
│   │   ├── themeDefaults.ts # Default theme tokens
│   │   ├── heroDefaults.ts  # Default Hero config
│   │   ├── themePreviewMockData.ts # Mock data for the live theme preview
│   │   └── db/              # Database query functions
│   └── types/
│       └── components.ts    # Section / Theme type definitions
├── tests/                   # Vitest unit tests
│   ├── theme-validator.test.ts
│   ├── theme-tokens.test.ts
│   └── slug.test.ts
├── e2e/                     # Playwright E2E tests
│   └── sign-up.spec.ts
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions: lint, typecheck, test, build, e2e
├── CHANGELOG.md
├── LICENSE
├── README.md
├── docker-compose.yml
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── playwright.config.ts
├── prettier.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

---

## Testing

### Unit tests (Vitest)

```bash
npm test                    # one-shot
npm run test:watch          # watch mode
npm run test:coverage       # with v8 coverage
```

The current unit test suite covers the trickiest pure logic in the project:

- `themeValidator` — Zod schemas for theme tokens
- `parseBorder` / `composeBorder` — border shorthand parsing/composing
- `parseRadius` / `formatRadius` — radius string helpers
- `findShadowPresetKey` — preset lookup
- `computeHoverBackground` — hover opacity color math
- `isValidSlug` / `isReservedSlug` — tenant slug validation

### E2E tests (Playwright)

```bash
npx playwright install --with-deps chromium
npm run e2e                 # run all
npm run e2e:ui              # with the Playwright UI
```

The E2E suite covers the most important user flow: signing up, being redirected to `/admin`, and seeing the default Hero section.

### CI

Every push and PR to `main` or `development` runs lint, typecheck, unit tests, build, and the Playwright E2E suite against a fresh PostgreSQL service container. The CI badge in this README reflects the latest run.

---

## What I'd do next

This is intentionally a focused MVP. A non-exhaustive list of next steps:

- **Image upload** — currently sections only accept image URLs. A real file-upload pipeline (S3 / Vercel Blob) plus on-the-fly resizing would be a big UX win.
- **Real-time form validation** — Zod schemas are already in place; wiring them to live client-side error messages would feel snappier than the current on-submit pattern.
- **Bulk section operations** — multi-select with bulk delete / move / duplicate.
- **Footer editor** — a dedicated page for editing the persistent footer (currently the Footer component is rendered but has no admin UI to edit it).
- **i18n post-launch** — install `next-intl`, extract strings to `messages/en.json` and `messages/id.json`, add a `[locale]` segment, and a language switcher. The landing page is currently English; a planned Indonesian translation was the original target.
- **Section templates** — quick-add buttons for "Coffee shop Hero", "Product launch Banner", etc. so new tenants don't start from a blank canvas.
- **Audit log** — track who changed what, when. Especially useful for super admins.
- **Webhooks** — let tenants subscribe to events (new user signed up, theme changed, etc.) for downstream automation.

---

## License

[MIT](LICENSE) © 2026 Halamanku Contributors
