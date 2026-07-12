# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-13

### Added
- Multi-tenant microsite platform with two role tiers: `super_admin` (manages all tenants and themes) and `tenant_main_admin` (manages their own microsite).
- Self-service sign-up at `/sign-up` that creates a tenant, a default Hero section, and a user atomically in a single transaction.
- Authentication at `/login` with bcrypt password hashing, HttpOnly session cookies, and role-based redirect (`super_admin` → `/super`, others → `/admin`).
- Public microsite rendering at `/{tenant-slug}` with optional `?preview={themeId}` parameter for theme previewing.
- Visual theme editor at `/super/themes/[id]` with in-memory live preview: edit page/container/card tokens (colors, radius, border, shadow, hover opacity) and see a phone-mockup preview update instantly. No roundtrip to the database.
- Tenant theme picker at `/admin/theme` with iframe-based live preview that debounces theme switches.
- Drag-and-drop section reordering via `@dnd-kit` with sort indicators and a default-locked Hero section.
- Section component schema system: 10 component types (Hero, Linktree, Products Showcase, Products Catalog, Banner, Social Media, Footer, Features, FAQ, Pricing) defined in the `Component` table with a `configSchema` JSON metadata field.
- Tenant management for super admins: create, edit, archive, restore, and hard-delete tenants. Hard delete is gated to `archived` status only and cascades to sections (DB-level) plus all tenant users (explicit).
- Theme management for super admins: create, edit, and delete themes. Delete is blocked (409) if any tenant is currently using the theme.
- User management per tenant: invite, role assignment (`tenant_main_admin` / `tenant_admin`), transfer ownership, deactivate.
- Super admin impersonation: log in as a tenant admin for support, with a clear "stop impersonating" banner and route.
- Themed component system: page/container/card CSS variables applied via `<ThemeProvider>`; per-card hover opacity computed as `color-mix(card.bg X%, #000 Y%)` where `X = 100 - opacity`.
- Border tokens stored as full CSS shorthand string in DB (`"0"`, `"1px solid #000"`), split into 3 fields in the editor UI (Width, Style, Color) with `parseBorder` / `composeBorder` helpers.
- Glassmorphic landing page with gradient hero, floating orbs, and animated decorative shapes.
- Glassmorphic `/login` and `/sign-up` pages with live slug validation, password match validation, and decorative phone mockup.
- Floating top-right navigation bar on the landing page (Sign In + Get Started Free).
- English landing page (translated from Indonesian).

### Technical details
- Next.js 16.1 with App Router and Turbopack.
- React 19, TypeScript 5 with `strict: true`.
- Prisma 6 ORM with PostgreSQL (15+).
- Tailwind CSS 4 with `@theme` inline tokens.
- shadcn/ui (Radix UI) for the admin interface.
- ESLint 9 flat config + Prettier 3.
- Zod 4 for form and API validation.

### Security
- Bcrypt password hashing.
- HttpOnly session cookies with `SameSite=lax`.
- Super admin routes server-guarded.
- Tenant data isolation enforced at the database query level (`where: { tenantId: session.tenantId }`).
- Slug validation prevents reserved words and path-traversal-shaped inputs.
- Hard-delete safety: themes cannot be deleted if tenants use them; tenants can only be hard-deleted if archived.

[0.1.0]: https://github.com/your-username/microsite/releases/tag/v0.1.0
