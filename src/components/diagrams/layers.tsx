import type { ReactNode } from 'react'

import type { Tone } from '@/lib/tone'

export interface LayerChip {
  title: string
  sub?: string
}

export interface LayerRow {
  title: string
  /** Monospace qualifier, typically a directory. */
  meta?: string
  tone?: Tone
  chips: LayerChip[]
  note?: ReactNode
}

/**
 * Stacked architecture bands, top layer first. Each band names one tier and
 * lists the concrete units inside it.
 */
export function Layers({ rows }: { rows: LayerRow[] }) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <section
          key={row.title}
          data-tone={row.tone ?? 'accent'}
          className="relative overflow-hidden rounded-card border border-tone-line bg-tone-soft"
        >
          <span className="absolute inset-y-0 left-0 w-[3px] bg-tone" aria-hidden />
          <div className="grid gap-3 p-3.5 pl-5 lg:grid-cols-[11rem_1fr] lg:items-center">
            <div className="min-w-0">
              <p className="text-[0.875rem] leading-tight font-semibold text-fg-strong">
                {row.title}
              </p>
              {row.meta ? (
                <p className="mt-0.5 font-mono text-[0.68rem] text-tone">{row.meta}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {row.chips.map((chip) => (
                <span
                  key={chip.title}
                  className="inline-flex items-baseline gap-1.5 rounded-md border border-line-strong bg-surface px-2 py-1 text-[0.75rem] text-fg"
                >
                  {chip.title}
                  {chip.sub ? (
                    <span className="font-mono text-[0.65rem] text-subtle">{chip.sub}</span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
          {row.note ? (
            <p className="border-t border-tone-line/60 px-5 py-2 text-[0.75rem] leading-relaxed text-muted">
              {row.note}
            </p>
          ) : null}
        </section>
      ))}
    </div>
  )
}
