import type { ReactNode } from 'react'

import type { Tone } from '@/lib/tone'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/* Badge                                                                      */
/* -------------------------------------------------------------------------- */

interface BadgeProps {
  tone?: Tone
  mono?: boolean
  children: ReactNode
}

/** Inline pill used for service keys, event names and role labels. */
export function Badge({ tone = 'neutral', mono = true, children }: BadgeProps) {
  return (
    <span
      data-tone={tone}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-tone-line bg-tone-soft px-2 py-px align-[1px] text-[0.7rem] whitespace-nowrap text-tone',
        mono && 'font-mono tracking-[0.01em]',
      )}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

export interface CardItem {
  title: string
  /** Monospace sub-label, typically a package or service key. */
  meta?: string
  body: ReactNode
  tone?: Tone
}

/** Responsive grid of small definition cards. */
export function Cards({ items, cols = 2 }: { items: CardItem[]; cols?: 2 | 3 }) {
  return (
    <div
      className={cn(
        'my-6 grid gap-3',
        cols === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
      )}
    >
      {items.map((item) => (
        <div
          key={item.title}
          data-tone={item.tone ?? 'accent'}
          className="group relative overflow-hidden rounded-card border border-line bg-surface p-4 transition-colors hover:border-tone-line"
        >
          <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-tone-line to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <p className="text-[0.9375rem] leading-snug font-semibold text-fg-strong">{item.title}</p>
          {item.meta ? (
            <p className="mt-1 font-mono text-[0.7rem] text-tone">{item.meta}</p>
          ) : null}
          <div className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{item.body}</div>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Definition list                                                            */
/* -------------------------------------------------------------------------- */

export interface DefItem {
  term: ReactNode
  /** Optional type or signature shown next to the term. */
  sig?: string
  desc: ReactNode
}

/** Term/definition rows. Used for interface members and vocabulary. */
export function DefList({ items }: { items: DefItem[] }) {
  return (
    <dl className="my-6 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
      {items.map((item, index) => (
        <div key={index} className="grid gap-1 px-4 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4">
          <dt className="min-w-0">
            <span className="font-mono text-[0.8125rem] font-semibold break-words text-accent">
              {item.term}
            </span>
            {item.sig ? (
              <span className="mt-0.5 block font-mono text-[0.7rem] break-words text-subtle">
                {item.sig}
              </span>
            ) : null}
          </dt>
          <dd className="min-w-0 text-[0.8125rem] leading-relaxed text-muted">{item.desc}</dd>
        </div>
      ))}
    </dl>
  )
}

/* -------------------------------------------------------------------------- */
/* Stat strip                                                                 */
/* -------------------------------------------------------------------------- */

export interface StatItem {
  value: string
  label: string
  tone?: Tone
}

/** Compact numeric summary strip. */
export function Stats({ items }: { items: StatItem[] }) {
  return (
    <div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          data-tone={item.tone ?? 'accent'}
          className="rounded-card border border-line bg-surface px-3.5 py-3"
        >
          <p className="font-mono text-xl leading-none font-semibold text-tone">{item.value}</p>
          <p className="mt-1.5 text-[0.75rem] leading-snug text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Data table                                                                 */
/* -------------------------------------------------------------------------- */

interface DataTableProps {
  head: string[]
  rows: ReactNode[][]
  /** Renders the first column in monospace, for key/name columns. */
  monoFirst?: boolean
  caption?: string
}

/**
 * Table wrapper that scrolls horizontally instead of squeezing columns, which
 * matters for the wide seam and event catalogues.
 */
export function DataTable({ head, rows, monoFirst = true, caption }: DataTableProps) {
  return (
    <div className="my-6 overflow-hidden rounded-card border border-line bg-surface">
      {caption ? (
        <p className="border-b border-line bg-surface-2/60 px-4 py-2 text-[0.8125rem] text-muted">
          {caption}
        </p>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[0.8125rem]">
          <thead>
            <tr>
              {head.map((cell) => (
                <th
                  key={cell}
                  scope="col"
                  className="border-b border-line-strong bg-surface-2 px-3.5 py-2.5 text-left font-mono text-[0.68rem] font-semibold tracking-[0.06em] whitespace-nowrap text-muted uppercase"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition-colors hover:bg-surface-2/70">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      'border-b border-line px-3.5 py-2.5 align-top leading-relaxed text-muted last:border-b-0',
                      rowIndex === rows.length - 1 && 'border-b-0',
                      cellIndex === 0 && 'text-fg',
                      cellIndex === 0 && monoFirst && 'font-mono text-[0.78rem] whitespace-nowrap',
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Steps                                                                      */
/* -------------------------------------------------------------------------- */

export interface StepItem {
  title: string
  body: ReactNode
}

/** Numbered procedure with a connecting rail. */
export function Steps({ items }: { items: StepItem[] }) {
  return (
    <ol className="my-6 space-y-0">
      {items.map((item, index) => (
        <li key={item.title} className="relative flex gap-4 pb-5 last:pb-0">
          {index < items.length - 1 ? (
            <span
              className="absolute top-8 bottom-0 left-[0.9375rem] w-px bg-line-strong"
              aria-hidden
            />
          ) : null}
          <span className="relative z-1 flex size-8 flex-none items-center justify-center rounded-full border border-accent-line bg-accent-soft font-mono text-[0.75rem] font-semibold text-accent">
            {index + 1}
          </span>
          <div className="min-w-0 pt-1">
            <p className="text-[0.9375rem] font-semibold text-fg-strong">{item.title}</p>
            <div className="mt-1 text-[0.8438rem] leading-relaxed text-muted">{item.body}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* -------------------------------------------------------------------------- */
/* Split columns                                                              */
/* -------------------------------------------------------------------------- */

/** Two-column comparison, collapsing to one column on small screens. */
export function Split({ children }: { children: ReactNode }) {
  return <div className="my-6 grid gap-4 lg:grid-cols-2">{children}</div>
}

/** Titled panel, normally used inside `Split`. */
export function Panel({
  title,
  tone = 'accent',
  children,
}: {
  title: string
  tone?: Tone
  children: ReactNode
}) {
  return (
    <section
      data-tone={tone}
      className="rounded-card border border-line bg-surface p-4 [&>*:last-child]:mb-0"
    >
      <p className="mb-2 flex items-center gap-2 text-[0.8125rem] font-semibold text-tone">
        <span className="size-1.5 rounded-full bg-tone" aria-hidden />
        {title}
      </p>
      <div className="text-[0.8438rem] leading-relaxed text-muted [&>p]:mb-2">{children}</div>
    </section>
  )
}
