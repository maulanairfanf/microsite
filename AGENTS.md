# Halamanku Development Guide

> Rules and patterns for AI agents and human contributors working on **Halamanku** — a multi-tenant microsite builder.
> If a future you (human or LLM) reads this and disagrees with a rule, fix the rule first, then the code.

## AI Development Kit

The Agent Dev Kit lives under `.opencode/` and follows opencode's native structure. See `.opencode/README.md` for the full map of layers. At a glance:

**Memory (Layer 1) — `.opencode/context/`**
- `project.md` — Tech stack, architecture, role hierarchy
- `conventions.md` — Coding standards, import rules, patterns
- `development.md` — Environment setup, seed data, build issues
- `email.md` — EmailJS setup, template variables
- `billing.md` — Xendit integration details
- `security.md` — Auth, tenant isolation, XSS, secrets

**Skills (Layer 2):** `.opencode/skills/<name>/SKILL.md` — reusable project workflows (create-page, wire-mutation, code-review, ...). Loaded on demand.

**Hooks (Layer 3):** `.opencode/plugin/hooks.ts` — automated post-edit validation (lint + typecheck on `.ts`/`.tsx` writes).

**Agents (Layer 4):** `.opencode/agents/<name>.md` — specialists (`planner`, `frontend-builder`, `code-reviewer`, `bug-hunter`).

**Commands (Layer 5):** `.opencode/commands/<name>.md` — orchestration (`feature`, `bug`, `review`, `validate`).

When working on this project, reference the context files for specifics. This file contains the high-level overview; context files contain the details.

---

## Quick Start

1. Read `context/project.md` for architecture overview
2. Read `context/conventions.md` for coding standards
3. Invoke the appropriate agent for your task

## See also

- `.opencode/README.md` — map of the Agent Dev Kit layers
- `README.md` — project overview, setup, demo credentials
- `CHANGELOG.md` — what's new in each version
- `LICENSE` — MIT
- `.opencode/context/` — detailed context files
- `.opencode/agents/` — specialized AI agents
