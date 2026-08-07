---
description: Implement a new feature end-to-end: plan, analyze, build, test, review.
agent: build
---

Implement the following feature for Halamanku:

$ARGUMENTS

Orchestrate this in order, delegating to the native subagents and loading the skills you need:

1. @planner — produce the implementation plan (plan for `$ARGUMENTS`). Use the `analyze-feature` skill first to understand the existing code before planning. Do NOT let the planner write code.
2. @frontend-builder — implement the plan using the appropriate `create-*` / `wire-*` skills (choose `create-page`, `create-component`, `create-form`, `create-section`, `wire-query`, `wire-mutation`). Use `clientApi` for client→server calls.
3. Load the `write-tests` skill — add unit and/or E2E tests for new pure logic and important flows.
4. @code-reviewer — read-only review against `conventions.md` and `security.md`. Fix all `[blocker]` findings (by passing the fix back to @frontend-builder), then resolve or document `[nit]`s.

End with a short summary: what was built, files changed, tests added, review outcome.