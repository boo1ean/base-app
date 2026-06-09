---
name: add-feature
description: Scaffold a new domain feature slice across the monorepo — frontend feature folder, shared Zod schemas, backend oRPC router, and route wiring. Use when the user asks to add a feature, create a new domain module, or build out a new area of the app (e.g. "add notifications", "add a billing feature").
---

# Add Feature

Scaffold a vertical feature slice. Replace `<name>` with the feature name (kebab-case).

## Checklist

```
- [ ] 1. Shared schema
- [ ] 2. Frontend feature folder
- [ ] 3. Backend router (if API needed)
- [ ] 4. Route wiring
- [ ] 5. Test
- [ ] 6. Infra check
```

## 1. Shared Schema

Create `packages/shared/src/schemas/<name>.ts` — the single source of truth. Derive types via `z.infer<>`. Export from the package barrel.

```typescript
import { z } from 'zod'

export const notificationSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  read: z.boolean(),
})

export type Notification = z.infer<typeof notificationSchema>
```

## 2. Frontend Feature Folder

```bash
mkdir -p apps/web/src/features/<name>/{components,hooks,utils}
```

Create:

- `features/<name>/types.ts` — feature-local types
- `features/<name>/index.ts` — barrel (the only public entry point)
- `features/<name>/components/<name>-list.tsx` — main component
- `features/<name>/hooks/use-<name>.ts` — data hook wrapping TanStack Query

```typescript
// hooks/use-notifications.ts
export const notificationKeys = {
  all: ['notifications'] as const,
}

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: () => api.notifications.list(),
  })
}
```

## 3. Backend Router

If the feature needs an API, add `apps/api/src/router/<name>.ts` and merge it into the root router. Validate I/O with schemas from `@repo/shared`. Keep procedures thin — delegate to a service in `apps/api/src/services/<name>-service.ts`.

```typescript
export const notificationRouter = router({
  list: publicProcedure
    .output(z.array(notificationSchema))
    .query(({ ctx }) => notificationService.list(ctx.db)),
})
```

## 4. Route Wiring

1. Create `apps/web/src/pages/<name>.tsx` (default export, the page component).
2. Add a lazy import + `<Route>` in `apps/web/src/router.tsx`.

## 5. Test

Add `features/<name>/components/<name>-list.test.tsx`. Follow the `testing` rule (Vitest + RTL, AAA pattern, factory mocks).

## 6. Infra Check

If the feature introduces a new infra dependency (cache, queue, object storage, etc.), add a matching service to `docker-compose.yml` and env vars to `.env.example` — see the `docker` rule.
