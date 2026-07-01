---
name: add-ui-component
description: Scaffold a shared UI component in packages/ui built on shadcn/ui primitives. Use when the user asks to add a shared component, create a design-system primitive, or build a reusable UI element in the ui package.
---

# Add UI Component

Create a reusable component in `packages/ui`. Replace `<name>` with the component name (kebab-case file, PascalCase export).

## Rules

- Built on shadcn/ui primitives — don't reinvent inputs, dialogs, buttons.
- Accept `className`, merge with `cn()`.
- Styling only — no app-specific business logic.
- Internal imports use Node subpath imports (`#lib/utils`, `#components/*`), not the package name.
- Consumers import each primitive by subpath: `@repo/ui/components/<name>` (and `@repo/ui/lib/utils`). There is no barrel.

## Prefer the CLI

Run the root command — it writes the primitive into `packages/ui` (via `--cwd packages/ui`):

```bash
pnpm ui:add <name>
```

- This is the **only** sanctioned way to invoke shadcn. The CLI version is pinned in the root `package.json` `ui:add` script; never call `pnpm dlx shadcn@latest` / `npx shadcn` directly.
- Do not run the shadcn CLI from an app — there is no app-level `components.json`, so it will fail by design. Only `packages/ui` is configured.
- To upgrade the CLI, bump the pinned version in the root `ui:add` script.

## Manual steps

1. Create `packages/ui/src/components/<name>.tsx`:

```tsx
import type { ComponentProps } from 'react'
import { cn } from '#lib/utils'

interface BadgeProps extends ComponentProps<'span'> {
  variant?: 'default' | 'destructive'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-primary text-primary-foreground',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground',
        className,
      )}
      {...props}
    />
  )
}
```

2. It's auto-exported via the `"./components/*"` subpath export — consume as `@repo/ui/components/badge`.

3. Add a test: `packages/ui/src/components/<name>.test.tsx`.
