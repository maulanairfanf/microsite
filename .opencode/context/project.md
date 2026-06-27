# Halamanku Project Overview

## What is Halamanku?

A multi-tenant link-in-bio microsite builder (like Linktree, but Indonesian-market focused).
Tenants sign up, get a public page at `/{tenant-slug}`, customize sections (Hero, Linktree,
Banner, Product Showcase, Product Catalog, Social Media, Footer), and share one URL
with all their links.

**Core flow:**
- Sign up → create tenant → auto-provision Hero section
- Admin panel: manage sections, customize theme, invite users, upgrade to premium
- Public page: renders tenant's sections with their custom theme
- Premium tier: unlimited links, all themes, priority support (Rp 30,000/month via Xendit)

**Users:**
- `super_admin` — platform owner, manages all tenants/themes
- `tenant_main_admin` — tenant owner, manages their tenant
- `tenant_admin` — team member with limited permissions
- Public visitors — view tenant pages, no account needed

## Section Component Types

Tenants can add these section types to their public microsite. Each is a row in the `components` table with a `configSchema` (JSON array of field definitions).

| Type | Purpose |
|---|---|
| `hero` | Title, subtitle, background, logo, CTA button |
| `banner` | Carousel of promotional banners with image + CTA |
| `linktree` | List of links with icons (social, contact, etc.) |
| `products_showcase` | Featured products grid with pricing |
| `products_catalog` | Products grouped by category |
| `social_media` | Social platform links + join CTA |
| `footer` | Static footer (no config) |

- **Component names:** `src/lib/components/componentNames.ts` (const object, all lowercase)
- **Schemas:** `src/lib/components/schemas/<type>.ts` (one file per component)
- **All schemas map:** `COMPONENT_SCHEMAS` in `src/lib/components/schemas/index.ts`
- **Display names:** `src/lib/components/displayNames.ts` (human-readable labels like "Products Showcase")
- **Form rendering:** `src/components/admin/TenantSectionForm.tsx` parses configSchema and generates form fields

**Two-name pattern:** Each component has both `name` (wire format, e.g., `products_showcase`) and `displayName` (UI label, e.g., "Products Showcase"). UI shows `displayName ?? name`. DB comparisons use `componentId`, not `name`.

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript 5 (strict mode, `noUncheckedIndexedAccess`, `noImplicitOverride`)
- Prisma 6 + PostgreSQL 16
- Tailwind CSS 4 + shadcn/ui (Radix primitives)
- @dnd-kit for drag-and-drop sections
- Zod 4 for validation (client + server share schemas)
- Vitest 1.6 for unit tests, Playwright for E2E
- ESLint 9 (flat config) + Prettier 3

## Role Hierarchy
```
super_admin > tenant_main_admin > tenant_admin
```

- `super_admin` — manages all tenants and themes globally
- `tenant_main_admin` — tenant owner, can transfer ownership
- `tenant_admin` — regular user inside a tenant with limited permissions

## Plan System
- `free` — 1 microsite, 3 links, 3 themes, basic sections
- `premium` — unlimited links, all themes, premium sections, priority support
- Billing via Xendit (Indonesian payment gateway), Rp 30,000/month

## Key Directories
```
src/
├── app/                  # App Router
│   ├── admin/            # Tenant admin UI (server components)
│   ├── super/            # Super admin UI
│   ├── [...tenant]/      # /{slug} public microsite
│   ├── checkout/         # /checkout, /checkout/success
│   ├── verify-email/     # Email verification status page
│   └── api/              # REST endpoints
├── components/
│   ├── ui/               # shadcn primitives — DO NOT modify
│   ├── admin/            # Sidebar, AdminShell, AdminTopBar, forms
│   ├── auth/             # FormField, BrandLogo (shared by /login + /sign-up)
│   ├── landing/          # Marketing site sections
│   └── <Name>.tsx        # Public page components (Hero, Linktree, etc.)
├── lib/
│   ├── auth.ts           # getSession, setSession, clearSession (server-only)
│   ├── constants.ts      # Role, Plan const objects + Session type (shared)
│   ├── client-api.ts     # clientApi.{get,post,put,delete}
│   ├── prisma.ts         # Prisma client singleton
│   ├── slug.ts           # SLUG_REGEX, isValidSlug, isReservedSlug
│   ├── themeTokens.ts    # parseBorder, composeBorder, computeHoverBackground
│   ├── themeValidator.ts # Zod schemas for theme tokens
│   ├── themeDefaults.ts  # defaultTokens
│   ├── heroDefaults.ts   # HERO_COMPONENT_NAME + HERO_CONFIG_SCHEMA
│   ├── useIsClient.ts    # SSR-safe hydration hook
│   ├── utils.ts          # cn() helper (clsx + tailwind-merge)
│   ├── billing/          # Xendit wrapper + checkout-token + activation helpers
│   ├── email/            # EmailJS REST API wrapper + verification token utils
│   └── db/               # Prisma query functions (one file per entity)
├── types/
│   └── components.ts     # Component, Theme, ThemeTokens, etc.
── data/                 # Seed/static JSON for sample tenants
```

## Database
- Docker Compose on port 5433
- Migrations in `prisma/migrations/`
- Seed script: `prisma/seed.ts`

## Sample Tenants
- `kerabat-jenggala` — Specialty Coffee & Pastries
- `pempek-ibu-wati` — Pempek Rumahan
