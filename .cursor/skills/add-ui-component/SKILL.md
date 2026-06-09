---
name: add-ui-component
description: Scaffold a shared UI component in packages/ui built on shadcn/ui primitives. Use when the user asks to add a shared component, create a design-system primitive, or build a reusable UI element in the ui package.
---

# Add UI Component

Create a reusable component in `packages/ui`. Replace `<name>` with the component name (kebab-case file, PascalCase export).

## Rules

- Built on shadcn/ui primitives — don't reinvent inputs, dialogs, buttons.
- Accept `className`, merge with `cn()`.
- Forward refs when wrapping native elements.
- Styling only — no app-specific business logic.
- Export from the package barrel; consumers import as `@repo/ui/<name>`.

## Steps

1. Create `packages/ui/src/components/<name>.tsx`:

```tsx
import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { cn } from '@repo/ui/lib/utils'

interface BadgeProps extends ComponentProps<'span'> {
  variant?: 'default' | 'destructive'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-primary text-primary-foreground',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground',
        className,
      )}
      {...props}
    />
  ),
)
Badge.displayName = 'Badge'
```

2. Export from `packages/ui/src/index.ts` (the barrel).

3. Add a test: `packages/ui/src/components/<name>.test.tsx`.
