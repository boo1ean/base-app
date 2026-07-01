# base-app

A type-safe, full-stack TypeScript monorepo. Turborepo + pnpm workspaces, with end-to-end type safety from the database schema through the API to the React frontend. Designed to launch with a single `docker compose up`.

## Stack

| Layer | Tech |
|----------|----------------------------------------------------|
| Frontend | React, Vite, TanStack Query, Tailwind CSS, shadcn/ui |
| Backend | tsx, oRPC (typed RPC), Drizzle ORM, Zod |
| Shared | TypeScript, Zod schemas (single source of truth) |
| Tooling | pnpm, Turborepo, Vitest, Playwright, ESLint (@antfu) |
| Infra | Docker Compose (Postgres + apps) |

## Layout

```
apps/
  web/   ← React frontend (Vite)
  api/   ← Backend server (tsx + oRPC)
packages/
  db/      ← Drizzle schema + createDb factory + migrations
  logger/  ← Pino-based logger, createAppLogger factory
  shared/  ← Shared Zod schemas, types, utils
  ui/      ← Shared UI components (shadcn base)
docker-compose.yml ← one-shot launch: all apps + infra
```

## Getting Started

```bash
pnpm install
docker compose up                  # infra only (Postgres) — run apps locally with hot-reload
docker compose --profile apps up   # full stack including built app containers
```

Compose ships working env defaults — no `.env` file required.

## Core Approaches

- **End-to-end type safety.** Zod schemas in `packages/shared` are the single source of truth; types are derived via `z.infer<>`. The API exposes a typed `AppRouter`; the frontend calls it through a typed oRPC client (never manual `fetch`).
- **Pure, reusable packages.** `process.env` is banned in `packages/`. Packages expose factory functions (`createDb`, `createAppLogger`) that receive config via options. Only apps read env.
- **Single env boundary.** Each app reads `process.env` in exactly one Zod-validated `env.ts`; the app crashes at startup on invalid config. Infra reachability is checked before serving traffic.
- **Docker as the launch contract.** Adding an app or infra dependency means adding a matching service to `docker-compose.yml`. The repo must always be launchable.
- **Strict TypeScript.** `strict: true`, no `any` (use `unknown` + guards), prefer inference, derive types from schemas.
- **Consistent style.** `@antfu/eslint-config` handles lint + format (no Prettier): no semicolons, single quotes, 2-space indent, sorted imports. Run `pnpm lint:fix`.

## Before Committing

```bash
pnpm lint && pnpm typecheck
pnpm test            # relevant packages
```

No `console.log`, debug artifacts, or secrets in staged files. Use the logger, not `console`. Conventional Commits (`<type>(<scope>): <description>`), one concern per PR.

## AI Rules & Skills

Coding standards and workflows for Claude Code live alongside the code and load automatically by file path: `CLAUDE.md` (imports `AGENTS.md`) is the entry point, rules live in `.claude/rules/*.md`, skills in `.claude/skills/`. See `AGENTS.md` for the authoritative tables.

| Rule | Applies to |
|------|-----------------------------------------|
| `conventions` | Always — naming, imports, TS, errors, files |
| `git` | Always — branches, commits, PRs |
| `platform` | Always — detect current OS, use only its shell conventions |
| `frontend` | `apps/web/**`, `packages/ui/**` |
| `backend` | `apps/api/**` |
| `shared` | `packages/{shared,db,logger}/**` |
| `testing` | `*.test.*`, `*.spec.*`, `tests/**` |
| `eslint` | `eslint.config.*` |
| `docker` | `docker-compose*.yml`, `**/Dockerfile`, `**/package.json` |
| `rule-maintenance` | `.claude/rules/**`, `.claude/skills/**`, `AGENTS.md`, `CLAUDE.md` |

On-demand skills in `.claude/skills/`: `scaffold-app` (bootstrap the monorepo), `add-feature` (new domain slice), `add-ui-component` (shared UI primitive).

> Keep this README in sync: when the stack, layout, core approaches, or the rule/skill set change, update this file and `AGENTS.md` in the same change.
