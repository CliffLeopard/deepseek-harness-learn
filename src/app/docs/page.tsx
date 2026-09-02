import Link from 'next/link'

import { withBasePath } from '@/lib/base-path'

/**
 * `/docs` has no content of its own.
 *
 * Static export cannot emit a server `redirect()`, so this page is a real
 * HTML fallback (meta refresh + link) that still works from `out/`.
 */
export default function DocsIndex() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-start justify-center px-6">
      <meta httpEquiv="refresh" content={`0;url=${withBasePath('/docs/overview/')}`} />
      <p className="text-[0.9375rem] leading-relaxed text-muted">
        正在进入{' '}
        <Link href="/docs/overview" className="text-accent underline-offset-2 hover:underline">
          第 01 章
        </Link>
        。
      </p>
    </main>
  )
}
