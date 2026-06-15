# AGENTS.md

Monorepo web application. Turborepo + pnpm workspaces.

## Stack

| Layer    | Tech                                      |
|----------|-------------------------------------------|
| Frontend | React, Vite, Tailwind CSS, shadcn/ui      |
| Backend  | tsx, oRPC, Drizzle ORM, Zod                |
| Shared   | TypeScript, Zod schemas                   |
| Tooling  | pnpm, Turborepo, Vitest, ESLint (@antfu)  |
| Infra    | Docker Compose (Postgres + apps)          |

## Monorepo Layout

```
apps/
  web/            ← React frontend (Vite)
  api/            ← Backend server (tsx + oRPC)
packages/
  db/             ← Drizzle schema, createDb factory, migrations
  logger/         ← Pino-based logger, createAppLogger factory
  shared/         ← Shared Zod schemas, types, utils
  ui/             ← Shared UI components (shadcn base)
docker-compose.yml ← one-shot launch: all apps + infra
```

Launch everything with `docker compose up` (compose has built-in env defaults — no `.env` required). Scaffolding templates (env example, etc.) live under `.cursor/skills/scaffold-app/templates/`.

## Rules

Passive coding standards in `.cursor/rules/*.mdc`, auto-injected by glob:

| Rule               | Activates on                          |
|--------------------|---------------------------------------|
| `conventions`      | Always                                |
| `git`              | Always                                |
| `frontend`         | `apps/web/**`, `packages/ui/**`       |
| `backend`          | `apps/api/**`                         |
| `shared`           | `packages/shared/**`, `packages/db/**`, `packages/logger/**` |
| `testing`          | `*.test.*`, `*.spec.*`, `tests/**`    |
| `eslint`           | `eslint.config.*`                     |
| `docker`           | `docker-compose*.yml`, `**/Dockerfile`, `**/package.json` |
| `rule-maintenance` | `.cursor/rules/**`, `.cursor/skills/**`, `AGENTS.md`, `README.md` |

## Skills

On-demand workflows in `.cursor/skills/`, loaded when the task matches:

| Skill              | Use when                                       |
|--------------------|------------------------------------------------|
| `scaffold-app`     | Bootstrapping the monorepo from scratch        |
| `add-feature`      | Adding a new domain feature slice              |
| `add-ui-component` | Adding a shared component to `packages/ui`      |

> When rules or skills change, update this file — see the `rule-maintenance` rule.
