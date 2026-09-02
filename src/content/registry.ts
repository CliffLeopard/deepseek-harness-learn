import type { ComponentType } from 'react'

/**
 * Static map from chapter slug to its MDX module.
 *
 * The map is explicit rather than dynamic so the bundler can see every chapter
 * at build time; `scripts/build-content-index.mjs` fails the build when this
 * set and `src/lib/chapters.ts` disagree.
 */
export const contentLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  overview: () => import('./overview.mdx'),
  cordis: () => import('./cordis.mdx'),
  composition: () => import('./composition.mdx'),
  plugins: () => import('./plugins.mdx'),
  'core-spine': () => import('./core-spine.mdx'),
  lifecycle: () => import('./lifecycle.mdx'),
  'session-log': () => import('./session-log.mdx'),
  tools: () => import('./tools.mdx'),
  llm: () => import('./llm.mdx'),
  seams: () => import('./seams.mdx'),
  execution: () => import('./execution.mdx'),
  orchestration: () => import('./orchestration.mdx'),
  context: () => import('./context.mdx'),
  web: () => import('./web.mdx'),
  integration: () => import('./integration.mdx'),
  engineering: () => import('./engineering.mdx'),
  glossary: () => import('./glossary.mdx'),
}
