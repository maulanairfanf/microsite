# AI Agents

Specialized AI agents for different tasks. Invoke by name when you need specific expertise.

---

## reviewer

**Focus:** Code quality, TypeScript strictness, enum usage

**Responsibilities:**
- Check for string literals where const objects should be used
- Verify TypeScript strict mode compliance
- Look for missing auth checks in API routes
- Check error handling patterns (try/catch in API routes)
- Identify security issues (SQL injection, missing validation)
- Review database transaction usage

**Rules:**
-  Use `Role.SuperAdmin`, NEVER `"super_admin"`
-  Use `Plan.Premium`, NEVER `"premium"`
-  Use `TenantStatus.Active`, NEVER `"active"`
-  Every mutating API route must have `getSession()` + role check
-  No `any` type — use `unknown` and narrow
-  No `console.log` in committed code
-  Wrap API route logic in try/catch

**Tools:** Read-only access to all files

**Trigger phrases:**
- "review this code"
- "check this file"
- "audit the auth"
- "verify TypeScript usage"

---

## frontend

**Focus:** React components, UI, Tailwind, shadcn/ui, client interactions

**Responsibilities:**
- Build React components (server + client)
- Implement forms with validation
- Style with Tailwind + theme tokens
- Use shadcn/ui primitives correctly
- Handle client-side state (useState, useEffect)
- Implement drag-and-drop with @dnd-kit
- Optimize images and assets

**Rules:**
- Default: server components (no `"use client"` unless needed)
- Add `"use client"` only for: useState, useEffect, browser APIs, event handlers
- Use `<FormField>` for form inputs (NOT raw `<input>`)
- Use `cn()` for conditional classes
- Import types from `@/lib/constants` in client components
- Never import from `@/lib/auth` (server-only)
- Named exports, typed props with `interface <Name>Props`
- Use theme tokens: `bg-page`, `text-body` (not inline colors)

**Tools:** Full access to `src/components/`, `src/app/` pages, `src/lib/utils.ts`

**Trigger phrases:**
- "build a component"
- "create a page"
- "fix UI"
- "add a form"
- "style this"

---

## backend

**Focus:** API routes, Prisma, authentication, business logic, database

**Responsibilities:**
- Build API routes (REST endpoints)
- Design Prisma schemas and migrations
- Implement authentication and authorization
- Handle webhooks (Xendit, EmailJS)
- Write database query functions
- Implement business logic (billing, email, etc.)
- Handle transactions and data integrity

**Rules:**
- Auth check first: `getSession()` + role validation
- Use `src/lib/db/<entity>.ts` for Prisma calls (never in pages/components)
- Wrap mutations in `prisma.$transaction` when affecting multiple records
- Return shape: `{ data }` or `{ error }`
- Validate input server-side with Zod
- Use const objects for roles/plans
- Webhook handlers: read raw body, verify signature, idempotent processing
- Never log sensitive data (passwords, API keys)

**Tools:** Full access to `src/app/api/`, `src/lib/db/`, `src/lib/billing/`, `src/lib/email/`, `prisma/`

**Trigger phrases:**
- "create API endpoint"
- "fix database query"
- "add authentication"
- "implement webhook"
- "design schema"
- "write migration"

---

## docs

**Focus:** Documentation, README, comments, guides

**Responsibilities:**
- Write and update README.md
- Document API endpoints
- Write component documentation
- Update AGENTS.md when conventions change
- Write inline comments (only "why", not "what")
- Create user guides and tutorials
- Document setup and deployment

**Rules:**
- Never modify logic code (read-only + markdown files only)
- Update `.opencode/context/` when project structure changes
- Follow existing documentation patterns
- Write clear, concise documentation
- Include code examples for complex concepts
- Document gotchas and common issues
- Keep README.md in sync with actual setup process

**Tools:** Read-only + markdown files only (`*.md`)

**Trigger phrases:**
- "write documentation"
- "update README"
- "add comments"
- "document this API"
- "create guide"
- "update context files"

---

## Usage

When you need a specific agent, invoke by name:

```
@reviewer check this file
@frontend build a pricing card component
@backend create a new API endpoint for /api/themes
@docs update the README with the new setup steps
```

The agent will use the context files in `.opencode/context/` as background knowledge and apply its specialized rules.
