import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { Chapter } from '@/lib/chapters'

/** Previous/next chapter links in reading order. */
export function Pager({ prev, next }: { prev?: Chapter; next?: Chapter }) {
  if (!prev && !next) return null

  return (
    <nav className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-card border border-line bg-surface px-4 py-3 transition-colors hover:border-accent-line"
        >
          <span className="flex items-center gap-1.5 font-mono text-[0.68rem] text-subtle">
            <ArrowLeft className="size-3" aria-hidden />
            上一章 · {prev.num}
          </span>
          <span className="text-[0.875rem] font-medium text-fg group-hover:text-accent">
            {prev.nav}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-col items-end gap-1 rounded-card border border-line bg-surface px-4 py-3 text-right transition-colors hover:border-accent-line sm:col-start-2"
        >
          <span className="flex items-center gap-1.5 font-mono text-[0.68rem] text-subtle">
            下一章 · {next.num}
            <ArrowRight className="size-3" aria-hidden />
          </span>
          <span className="text-[0.875rem] font-medium text-fg group-hover:text-accent">
            {next.nav}
          </span>
        </Link>
      ) : null}
    </nav>
  )
}
