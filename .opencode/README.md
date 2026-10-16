# Halamanku Agent Dev Kit

Native opencode structure. No custom framework — this is opencode's own
agents / skills / commands / plugin loading, configured for Halamanku.

## Layers

| Layer | Purpose | Location |
|---|---|---|
| 1 — Memory | Long-lived project knowledge & rules | `.opencode/context/*.md` (loaded via `opencode.json` → `instructions`) |
| 2 — Skills | Reusable, on-demand workflows | `.opencode/skills/<name>/SKILL.md` |
| 3 — Hooks | Automated post-edit validation | `.opencode/plugin/hooks.ts` |
| 4 — Agents | Specialists invoked per task | `.opencode/agents/<name>.md` |
| 5 — Commands | Orchestration workflows | `.opencode/commands/<name>.md` |

## How it interacts

```
/feature (L5)
   → @planner (L4) — plan only, never writes
   → analyze-feature (L2) — understand existing code
   → @frontend-builder (L4) — build via create-*/wire-* skills (L2)
   → write-tests (L2) → @code-reviewer (L4)
Every file edit → hooks (L3) run lint + typecheck
All layers read Memory (L1) via instructions
```

## Skills

| Skill | Use for |
|---|---|
| `analyze-feature` | Read-only codebase understanding BEFORE writing code |
| `create-page` | New App Router page / route group |
| `create-component` | New React component |
| `create-form` | Validated form (FormField + shared Zod) |
| `create-section` | New section component type (registry + migration + renderer) |
| `wire-query` | Read-only GET endpoint / DB read |
| `wire-mutation` | POST/PUT/DELETE endpoint / webhook / transaction |
| `write-tests` | Vitest unit + Playwright E2E |
| `code-review` | Read-only review checklist |

## Agents

- `@planner` — produces an implementation plan; `edit`/`bash` denied.
- `@frontend-builder` — builds UI; can edit.
- `@code-reviewer` — read-only review per conventions + security.
- `@bug-hunter` — read-only root-cause investigation.

## Commands

- `/feature <desc>` — plan → analyze → build → test → review.
- `/bug <symptom>` — root-cause → fix → regression test → review.
- `/review` — code review only (no test execution, no edits).
- `/validate` — lint → typecheck → test (CI gate order).

## Adding a piece

- New skill: add `.opencode/skills/<name>/SKILL.md` (frontmatter: `name`, `description` with trigger keywords). Loaded via `skills.paths` in `opencode.json`.
- New agent: add `.opencode/agents/<name>.md` (frontmatter: `description`, `mode: subagent`, `permission`).
- New command: add `.opencode/commands/<name>.md` (frontmatter: `description`, `agent`; body uses `$ARGUMENTS`).
- New hook: extend `.opencode/plugin/hooks.ts` (auto-discovered; no config entry needed).

Config is loaded at opencode startup — restart opencode after changing any of the above.
