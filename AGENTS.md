# Halamanku Development Guide

> Rules and patterns for AI agents and human contributors working on **Halamanku** — a multi-tenant microsite builder.
> If a future you (human or LLM) reads this and disagrees with a rule, fix the rule first, then the code.

## AI Context

This project uses `.opencode/context/` for background knowledge that AI agents should always have:

- `context/project.md` — Tech stack, architecture, role hierarchy
- `context/conventions.md` — Coding standards, import rules, patterns
- `context/development.md` — Environment setup, seed data, build issues
- `context/email.md` — EmailJS setup, template variables
- `context/billing.md` — Xendit integration details

## AI Agents

Specialized agents are defined in `.opencode/agents.md`:

- `reviewer` — Code reviews (TypeScript strictness, enum usage)
- `frontend` — UI components (React, Tailwind, shadcn/ui)
- `backend` — API/DB work (Prisma, authentication)
- `docs` — Documentation (README, comments)

When working on this project, reference the context files for specifics. This file contains the high-level overview; context files contain the details.

---

## Quick Start

1. Read `context/project.md` for architecture overview
2. Read `context/conventions.md` for coding standards
3. Invoke the appropriate agent for your task

## See also

- `README.md` — project overview, setup, demo credentials
- `CHANGELOG.md` — what's new in each version
- `LICENSE` — MIT
- `.opencode/context/` — detailed context files
- `.opencode/agents.md` — specialized AI agents
