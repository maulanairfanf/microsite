---
description: Fix a bug: root-cause it, implement the fix, add a regression test, and review.
agent: build
---

Fix the following bug in Halamanku:

$ARGUMENTS

Orchestrate this in order:

1. @bug-hunter — read-only root-cause the issue. Have it report the root cause, evidence, and suggested fix with `file:line`. If it hits the known gotchas (client/server import separation, Prisma migration drift, EmailJS plain-text `"OK"`, webhook raw-body) refer to `.opencode/context/development.md`, `email.md`, `billing.md`. Do NOT let the bug-hunter edit.
2. @frontend-builder — implement the fix from the root-cause report, using the relevant `wire-*` / `create-*` / `create-component` skill.
3. Load the `write-tests` skill — add a regression test that would have caught the bug.
4. @code-reviewer — read-only review; fix all `[blocker]` findings.

End with: root cause, the fix, the regression test added, and the review outcome.