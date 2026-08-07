---
description: Run the full validation gate (lint, typecheck, test) mirroring CI order. No code changes.
agent: build
---

Validate the current state of the codebase, mirroring the CI gate order in `.github/workflows/ci.yml`:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`

If the user asks for a full gate, also run `npm run build` (and `npm run e2e` when a DB is available) in that order, after the first three pass.

For each failing step: report the failures and fix them. Do not stop at the first failure — run each step to completion where safe, then fix, then re-run the full gate until green.

End with the final status of each step: lint / typecheck / test (and build / e2e if requested). Do not make feature code changes beyond what is needed to pass the gate.