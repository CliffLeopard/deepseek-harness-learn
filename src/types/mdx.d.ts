/**
 * MDX modules resolve through the Next.js loader, which TypeScript cannot see.
 *
 * `src/content/registry.ts` imports chapters as `./<slug>.mdx`; without this
 * declaration those imports fail type checking with TS2307.
 */
declare module '*.mdx' {
  import type { ComponentType } from 'react'

  const MDXContent: ComponentType<{ components?: Record<string, unknown> }>
  export default MDXContent
}
