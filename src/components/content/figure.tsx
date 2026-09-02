import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type FigureKind = '架构图' | '数据流' | '生命周期' | '时序图' | '状态图' | '结构图' | '对照表'

interface FigureProps {
  /** Diagram family, shown as the figure's eyebrow. */
  kind: FigureKind
  title: string
  /** Reading guidance placed under the diagram. */
  caption?: ReactNode
  /** Set when the diagram is wider than the column and must scroll. */
  scroll?: boolean
  children: ReactNode
}

/**
 * Frame shared by every diagram on the site: eyebrow, title, the diagram
 * itself, and a caption that tells the reader how to read it.
 */
export function Figure({ kind, title, caption, scroll = false, children }: FigureProps) {
  return (
    <figure className="my-7 overflow-hidden rounded-panel border border-line bg-surface shadow-panel">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line bg-surface-2/60 px-4 py-2.5">
        <span className="rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.08em] text-accent uppercase">
          {kind}
        </span>
        <span className="text-sm font-semibold text-fg-strong">{title}</span>
      </figcaption>

      {scroll ? (
        <div className="relative">
          <div className="overflow-x-auto px-4 py-6 sm:px-6">{children}</div>
          {/* Fade at the trailing edge so a clipped diagram reads as scrollable. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-surface to-transparent"
          />
        </div>
      ) : (
        <div className="px-4 py-6 sm:px-6">{children}</div>
      )}

      {caption ? (
        <div className="border-t border-line bg-inset/60 px-4 py-3 text-[0.8125rem] leading-relaxed text-muted sm:px-6">
          {caption}
        </div>
      ) : null}
    </figure>
  )
}
