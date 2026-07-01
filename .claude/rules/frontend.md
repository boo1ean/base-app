---
description: React + Vite + TanStack Query + Tailwind + shadcn/ui component patterns
paths:
  - "apps/web/**/*.{ts,tsx}"
  - "packages/ui/**/*.{ts,tsx}"
---

# Frontend

**Stack:** React, Vite, TanStack Query, oRPC typed client, Tailwind CSS, shadcn/ui

## Component Structure

```tsx
import { useState } from 'react'
import { Button } from '@repo/ui/components/button'

interface UserCardProps {
  user: User
  onEdit: (id: string) => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const [expanded, setExpanded] = useState(false)
  return ( /* ... */ )
}
```

Order within a file: imports → types → component → local helpers.

## Props

- Destructure in the function signature.
- Name the type `<Component>Props`.
- Accept `className` on wrapper components, merge with `cn()`.
- Never use `React.FC`.
- Avoid prop drilling past 2 levels — use context or composition.

## Hooks

- One concern per hook.
- Shared hooks in `hooks/`, feature hooks in `features/<name>/hooks/`.
- Never call hooks conditionally.
- No `useEffect` for derived state — compute during render.

## shadcn/ui

- **All shadcn primitives live in `packages/ui` and are imported as `@repo/ui/components/<name>`** (e.g. `import { Button } from '@repo/ui/components/button'`); the `cn` helper is `@repo/ui/lib/utils`. Never copy primitives into `apps/web/src/components/ui/` — that path is lint-banned (`no-restricted-imports`).
- **Always reuse existing shadcn components** — never create custom elements when a shadcn primitive already covers the use case (buttons, inputs, dialogs, selects, cards, badges, tooltips, etc.).
- Use the `Button` component with its built-in `variant` (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) and `size` (`default`, `sm`, `lg`, `icon`) props. Never write raw `<button>` elements with hand-styled classes — raw `<button>`/`<input>` in `apps/web` is a lint error (`no-restricted-syntax`).
- Same principle applies to all primitives: use `Input` instead of `<input>`, `Dialog` instead of a custom modal, `Select` instead of a custom dropdown, etc.
- Add new primitives **only** with the root command: `pnpm ui:add <name>` (wraps `shadcn add --cwd packages/ui`, configured by `packages/ui/components.json`). It always writes the primitive into `packages/ui`. Or follow the `add-ui-component` skill.
- **Never invoke the shadcn CLI directly** (`npx`/`pnpm dlx shadcn …`, `shadcn add` from an app, etc.). There is intentionally no `components.json` in any app, so a direct/app-run CLI invocation will fail by design. The CLI version is pinned in the root `ui:add` script — do not use `shadcn@latest`. To bump it, change the version in the root `package.json` script (and note why).
- Theme tokens (CSS variables + `@theme`) live once in `packages/ui/src/styles/globals.css` and are imported by `apps/web/src/app.css` via `@import '@repo/ui/globals.css'`.
- Customize appearance via Tailwind `className` — not by forking component internals.
- Wrap shadcn primitives in domain components only when adding business logic or composition (e.g. `ConfirmDialog` wrapping `AlertDialog`).

## Styling (Tailwind)

- Utility classes are the primary styling method.
- Use `cn()` helper (clsx + tailwind-merge) for conditional classes.
- Design tokens in `tailwind.config.ts`, not raw values in components.
- Semantic color names: `primary`, `destructive`, `muted`.
- Mobile-first: base styles → `sm:` → `md:` → `lg:`.
- Dark mode via `class` strategy: `bg-white dark:bg-gray-900`.
- Respect `prefers-reduced-motion` — use `motion-safe:`.

## Patterns to Avoid

- No inline styles except dynamic runtime values.
- No string concatenation for classes — use `cn()`.
- No business logic inside components — extract to hooks or services.
- No `React.memo` / `useMemo` / `useCallback` without a measured perf problem.

## Routing

Semantic `pages/` directory — file name maps to route path:

```
src/
  pages/             ← one default-export component per route
    index.tsx        ← /
    about.tsx        ← /about
    settings.tsx     ← /settings
    not-found.tsx    ← catch-all 404
  layouts/           ← shared shells (nav, sidebar, footer)
    root-layout.tsx  ← wraps all pages via <Outlet />
  router.tsx         ← single route config, lazy imports all pages
```

- Each page file has a single `default export` (the page component).
- All pages are `lazy()` imported in `router.tsx` and wrapped in `<Suspense>`.
- Layouts use React Router's `<Outlet />` for nested rendering.
- To add a page: create `pages/<name>.tsx`, add a `<Route>` in `router.tsx`.

## Data Fetching

- TanStack Query for server state via the typed oRPC client.
- The oRPC client and TanStack Query utils are set up in `lib/api-client.ts`:
  - `client` — typed `RouterClient<AppRouter>` for direct calls.
  - `orpc` — TanStack Query utils (`orpc.<procedure>.queryOptions()`, `.mutationOptions()`).
- **Never use manual `fetch` or hand-written types for API calls.** Always use the typed `orpc` utils.
- Use `orpc.*.queryOptions()` with `useQuery` / `useSuspenseQuery`.
- Use `orpc.*.mutationOptions()` with `useMutation`.

## Web Storage

- **Never touch `localStorage` / `sessionStorage` directly.** No raw `getItem` / `setItem` / `JSON.parse`.
- Use `createWebStorage` from [`seitu/web`](https://seitu.letstri.dev/docs/web/web-storage) — every key is validated by a Zod schema and has a default value.
- Define one typed storage handle per concern, with schemas + `defaultValues`.
- In React, subscribe with `useSubscription` from `seitu/react` instead of reading on render.

```ts
import { createWebStorage } from 'seitu/web'
import * as z from 'zod'

const appStorage = createWebStorage({
  type: 'localStorage',
  schemas: { theme: z.enum(['light', 'dark']) },
  defaultValues: { theme: 'light' },
})

appStorage.get() // typed, validated
appStorage.set({ theme: 'dark' })
```
