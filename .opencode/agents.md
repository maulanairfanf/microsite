# AI Agents — Index

Specialized AI agents live as native opencode subagents in `.opencode/agents/<name>.md`.
Invoke them by name with `@name` (e.g. `@planner plan the checkout flow`).

| Agent | File | Mode | Role |
|---|---|---|---|
| planner | `.opencode/agents/planner.md` | subagent | Produces an implementation plan only; never writes code |
| frontend-builder | `.opencode/agents/frontend-builder.md` | subagent | Builds React components, forms, sections, theme-driven UI |
| code-reviewer | `.opencode/agents/code-reviewer.md` | subagent | Read-only code + security review per conventions/security context |
| bug-hunter | `.opencode/agents/bug-hunter.md` | subagent | Read-only root-cause investigation |

Orchestration commands in `.opencode/commands/` compose these agents with `.opencode/skills/`.

> The original prose agents (`reviewer`, `frontend`, `backend`, `docs`) were migrated here:
> `reviewer` → `code-reviewer`, `frontend` → `frontend-builder`, `backend` → the frontend-builder/planner rules, `docs` → the `code-review` skill. Fewer, composed specialists beat many single-purpose ones.