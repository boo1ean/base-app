import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  ignores: [
    'dist',
    'node_modules',
    '.turbo',
    'drizzle',
  ],
})
  .append({
    name: 'repo/shadcn-only-primitives',
    files: ['apps/web/**/*.{ts,tsx}'],
    ignores: ['packages/ui/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXOpeningElement[name.name=\'button\']',
          message: 'Use the shadcn <Button> from @repo/ui/components/button instead of a raw <button>.',
        },
        {
          selector: 'JSXOpeningElement[name.name=\'input\']',
          message: 'Use the shadcn <Input> from @repo/ui/input instead of a raw <input>.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/components/ui/*', '**/components/ui/*'],
              message: 'Shared UI primitives must come from @repo/ui/* (shadcn). Do not hand-roll local copies.',
            },
          ],
        },
      ],
    },
  })
