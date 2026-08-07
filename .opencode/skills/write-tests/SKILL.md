---
name: write-tests
description: Use when writing or extending unit tests (Vitest) or end-to-end tests (Playwright) for Halamanku. Follows existing test patterns and CI gate ordering.
---

# Write Tests

Add tests to Halamanku. Unit tests live in `tests/`, E2E in `e2e/`. Mirror the existing patterns and the CI gate order.

## Unit tests (Vitest) — `tests/*.test.ts`

The suite targets the trickiest pure logic. Follow these existing examples:
- `tests/theme-validator.test.ts` — Zod schema behavior
- `tests/theme-tokens.test.ts` — `parseBorder`/`composeBorder`, `computeHoverBackground`, radius helpers
- `tests/configState.test.ts` — `configState` helpers (node env, no DOM)
- `tests/slug.test.ts` — `isValidSlug` / `isReservedSlug`

When adding or changing pure helpers in `src/lib/`, add a sibling unit test here.

Run: `npm test` (or `npm run test:watch`, `npm run test:coverage`).

## E2E (Playwright) — `e2e/*.spec.ts`

The suite covers the critical user journey (e.g. `e2e/sign-up.spec.ts`: sign up → redirected to `/admin` → Hero section). Add specs only for important user flows, not every component.

Run: `npx playwright install --with-deps chromium` once, then `npm run e2e`.

## Guide

- Follow the CI gate order when verifying: `lint` → `typecheck` → `test` → (`build`/`e2e` for release).
- A unit test is worth it for the trickiest pure logic (parsing, math, validation), not for trivial components.
- Don't test implementation details of server components unless they surface real behavior.

## Verification

- `npm run typecheck`
- `npm run lint`
- `npm test` (green)