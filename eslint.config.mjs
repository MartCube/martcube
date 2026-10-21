import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import stylistic from '@stylistic/eslint-plugin'

// Formatting is handled by ESLint (no Prettier), same idea as @nuxt/eslint with `stylistic: true`.
// Run `pnpm lint:fix` or enable "fix on save" in the editor.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
  }),
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.netlify/**',
  ]),
])
