---
description: Git workflow — branch naming, commits, PRs
---

# Git Workflow

## Branch Naming

```
<type>/<short-description>
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`

## Commit Messages

Conventional Commits:

```
<type>(<scope>): <description>
```

- Scope = workspace or domain: `web`, `api`, `shared`, `ui`, `auth`, `cart`
- Subject: imperative mood, lowercase, no period, < 72 chars
- Body (optional): explain *why*, not *what*

## PRs

- One concern per PR.
- Description: summary + test plan + screenshots (if UI change).
- Under 400 lines of diff when possible.

## Before Committing

1. `pnpm lint && pnpm typecheck`
2. `pnpm test` (relevant packages)
3. No `console.log` or debug artifacts
4. No secrets in staged files
