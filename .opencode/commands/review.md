---
description: Peer code + security review only. No test execution and no edits.
agent: build
---

Review this Halamanku change:

$ARGUMENTS

Run the `code-review` skill and delegate a read-only @code-reviewer to review the change against `.opencode/context/conventions.md` and `.opencode/context/security.md`.

This command is review-only: do NOT edit files and do NOT run lint/typecheck/test. Use the `validate` command for the test gate.

Present findings tagged `[blocker]` (security / data-integrity, must fix) or `[nit]` (style / convention drift), each with `file:line`. Do not resolve findings yourself — report them for the builder to address.