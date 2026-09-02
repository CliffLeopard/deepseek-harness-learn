import type { ReactNode } from 'react'

import type { Tone } from '@/lib/tone'

export interface TimelineItem {
  /** When this happens: an event name or a phase label. */
  at: string
  title: string
  body?: ReactNode
  tone?: Tone
}

/**
 * Ordered points in time with the trigger on the left. Used where the ordering
 * matters more than the control flow, such as event emission order.
 */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-0 border-l border-line-strong pl-0">
      {items.map((item) => (
        <li key={item.at + item.title} data-tone={item.tone ?? 'accent'} className="relative pb-4 pl-5 last:pb-0">
          <span
            className="absolute top-[0.4rem] -left-[0.3125rem] size-2.5 rounded-full border-2 border-tone bg-bg"
            aria-hidden
          />
          <p className="font-mono text-[0.7rem] break-all text-tone">{item.at}</p>
          <p className="mt-0.5 text-[0.875rem] font-semibold text-fg-strong">{item.title}</p>
          {item.body ? (
            <div className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{item.body}</div>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
