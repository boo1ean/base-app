---
name: scaffold-app
description: Bootstrap the full Turborepo + pnpm monorepo from scratch — web app, API, shared and UI packages, ESLint, and tooling. Use when starting a new project, initializing the repo, or the user asks to bootstrap, scaffold, or set up the base app.
---

# Scaffold App

Bootstrap the monorepo. Run steps in order from the repo root.

## Checklist

```
- [ ] 1. Root workspace
- [ ] 2. Frontend (apps/web)
- [ ] 3. Backend (apps/api)
- [ ] 4. DB package (packages/db)
- [ ] 5. Shared package (packages/shared)
- [ ] 6. UI package (packages/ui)
- [ ] 7. Path aliases
- [ ] 8. ESLint
- [ ] 9. Docker (one-shot launch)
- [ ] 10. Git
```

## 1. Root

```bash
pnpm init
pnpm add -Dw turbo typescript eslint @antfu/eslint-config
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

`turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "lint": { "dependsOn": ["^lint"] },
    "test": { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^build"] }
  }
}
```

## 2. Frontend — apps/web

```bash
pnpm create vite apps/web -- --template react-ts
cd apps/web
pnpm add react-router @tanstack/react-query zod
pnpm add tailwindcss @tailwindcss/vite
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Install shadcn/ui, set up `components.json`, add base primitives.

Directory layout:

```
src/
  pages/          ← one file per route (index.tsx, about.tsx, not-found.tsx)
  layouts/        ← shared shells (root-layout.tsx uses <Outlet />)
  router.tsx      ← single route config, lazy imports all pages
  components/     ← app-specific components
  features/       ← domain features (colocated)
  hooks/          ← shared hooks
  lib/            ← framework wrappers, api-client, utils
  services/       ← oRPC client + query hooks
  stores/         ← client state (zustand / context)
```

## 3. Backend — apps/api

```bash
mkdir -p apps/api/src/{router,middleware,services,utils}
cd apps/api && pnpm init
pnpm add @orpc/server @repo/db @repo/shared zod
pnpm add -D tsx @types/node vitest
```

The API uses `RPCHandler` (not `OpenAPIHandler`) with a `/rpc` prefix. Procedures use `os` from `@orpc/server` without explicit routes — no `.route({ method, path })`. Export `AppRouter` type via `"exports": { "./router": "./src/router/index.ts" }` in `package.json` so the frontend can import it for the typed client.

Create `apps/api/src/services/db.ts` — instantiates the shared db package:

```typescript
import { createDb } from '@repo/db'
export const db = createDb({ connectionString: process.env.DATABASE_URL! })
```

## 4. DB Package — packages/db

```bash
mkdir -p packages/db/src/schema
cd packages/db && pnpm init
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit @types/node
```

Schema lives here. Apps import `createDb` and pass a connection string. See the `shared` rule.

## 5. Shared — packages/shared

```bash
mkdir -p packages/shared/src/schemas
cd packages/shared && pnpm init
pnpm add zod
```

## 6. UI — packages/ui

```bash
mkdir -p packages/ui/src/{components,lib}
cd packages/ui && pnpm init
pnpm add react tailwindcss clsx tailwind-merge
```

## 7. Path Aliases

In each app's `tsconfig.json`:

```json
{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } } }
```

## 8. ESLint

Create `eslint.config.ts` at the repo root (see the `eslint` rule for the config). Add root scripts:

```json
{ "scripts": { "lint": "eslint .", "lint:fix": "eslint . --fix" } }
```

## 9. Docker

The repo ships a `docker-compose.yml` for one-shot launch. Compose has built-in env defaults (`${VAR:-default}`), so no `.env` is required. Add a `Dockerfile` for each app so compose can build them:

- `apps/api/Dockerfile` — run the tsx server.
- `apps/web/Dockerfile` — build the Vite app, serve the static output (when web is added).

Launch the whole stack:

```bash
docker compose up
```

To override defaults locally, copy the env template to the repo root:

```bash
cp .cursor/skills/scaffold-app/templates/env.example .env
```

Keep `docker-compose.yml` in sync with every app and infra dependency — see the `docker` rule.

## 10. Git

```bash
git init
```

`.gitignore`: `node_modules`, `dist`, `.env*`, `.DS_Store`, `*.local`, `.turbo`
