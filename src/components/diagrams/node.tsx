import type { ReactNode } from 'react'

import type { Tone } from '@/lib/tone'
import { cn } from '@/lib/utils'

/**
 * Node silhouettes. The shape carries meaning, so a reader can tell a service
 * from a durable store, a decision gate or a process boundary at a glance.
 */
export type NodeKind =
  | 'service' // a Cordis service on ctx
  | 'plugin' // a plugin that only contributes effects
  | 'store' // durable state
  | 'event' // an event on the bus
  | 'gate' // a decision point
  | 'io' // process or network boundary
  | 'model' // the LLM
  | 'plain'

export interface DiagramNodeProps {
  title: ReactNode
  /** Monospace second line: service key, package or type. */
  sub?: ReactNode
  /** Third line in plain text, for a short clarification. */
  note?: ReactNode
  kind?: NodeKind
  tone?: Tone
  className?: string
}

const KIND_CLASS: Record<NodeKind, string> = {
  service: 'rounded-lg border-tone-line bg-tone-soft',
  plugin: 'rounded-lg border-dashed border-tone-line bg-surface-2',
  store: 'rounded-[1.4rem] border-tone-line bg-tone-soft',
  event: 'rounded-full border-tone-line bg-tone-soft px-4',
  gate: 'rounded-lg border-tone-line bg-tone-soft [clip-path:polygon(0.75rem_0,calc(100%-0.75rem)_0,100%_50%,calc(100%-0.75rem)_100%,0.75rem_100%,0_50%)] px-5',
  io: 'rounded-lg border-dashed border-line-strong bg-inset',
  model: 'rounded-lg border-tone-line bg-tone-soft ring-1 ring-tone-line ring-offset-2 ring-offset-surface',
  plain: 'rounded-lg border-line-strong bg-surface-2',
}

/** One box in a diagram. Every diagram family composes these. */
export function DiagramNode({
  title,
  sub,
  note,
  kind = 'plain',
  tone = 'accent',
  className,
}: DiagramNodeProps) {
  return (
    <div
      data-tone={tone}
      data-kind={kind}
      className={cn(
        // `shrink-0` keeps a row of nodes at its natural width so the figure
        // scrolls instead of collapsing every label to one character per line.
        'flex shrink-0 flex-col items-center justify-center border px-3 py-2 text-center',
        KIND_CLASS[kind],
        className,
      )}
    >
      <span className="text-[0.8125rem] leading-tight font-semibold whitespace-nowrap text-fg-strong">
        {title}
      </span>
      {sub ? (
        <span className="mt-0.5 font-mono text-[0.68rem] leading-tight whitespace-nowrap text-tone">
          {sub}
        </span>
      ) : null}
      {note ? (
        <span className="mt-1 max-w-44 text-[0.7rem] leading-snug text-subtle">{note}</span>
      ) : null}
    </div>
  )
}

/** Directional connector with an optional label riding on the line. */
export function Arrow({
  label,
  dir = 'row',
  tone = 'neutral',
  dashed = false,
}: {
  label?: ReactNode
  dir?: 'row' | 'col'
  tone?: Tone
  dashed?: boolean
}) {
  if (dir === 'col') {
    return (
      <div
        data-tone={tone}
        className="flex flex-none flex-col items-center justify-center gap-1 py-1"
        aria-hidden={!label}
      >
        <span
          className={cn(
            'h-5 w-0 border-l border-tone-line',
            dashed ? 'border-dashed' : 'border-solid',
          )}
        />
        {label ? (
          <span className="rounded-full border border-line bg-surface px-2 py-px font-mono text-[0.66rem] whitespace-nowrap text-tone">
            {label}
          </span>
        ) : null}
        <span
          className={cn(
            'h-5 w-0 border-l border-tone-line',
            dashed ? 'border-dashed' : 'border-solid',
          )}
        />
        <span className="-mt-1 size-0 border-x-4 border-t-5 border-x-transparent border-t-[var(--tone-line)]" />
      </div>
    )
  }

  return (
    <div
      data-tone={tone}
      className="flex flex-none flex-col items-center justify-center gap-1 px-1"
      aria-hidden={!label}
    >
      {label ? (
        <span className="font-mono text-[0.66rem] whitespace-nowrap text-tone">{label}</span>
      ) : null}
      <span className="flex items-center">
        <span
          className={cn(
            'w-7 border-t border-tone-line',
            dashed ? 'border-dashed' : 'border-solid',
          )}
        />
        <span className="size-0 border-y-4 border-l-5 border-y-transparent border-l-[var(--tone-line)]" />
      </span>
    </div>
  )
}

/** Key explaining node shapes or tones used in the surrounding diagram. */
export function Legend({
  items,
}: {
  items: { label: string; tone?: Tone; kind?: NodeKind }[]
}) {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3">
      {items.map((item) => (
        <li
          key={item.label}
          data-tone={item.tone ?? 'neutral'}
          className="flex items-center gap-1.5 text-[0.72rem] text-muted"
        >
          <span
            className={cn(
              'size-2.5 border border-tone-line bg-tone-soft',
              item.kind === 'event' || item.kind === 'store'
                ? 'rounded-full'
                : item.kind === 'io' || item.kind === 'plugin'
                  ? 'rounded-[2px] border-dashed'
                  : 'rounded-[3px]',
            )}
            aria-hidden
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
