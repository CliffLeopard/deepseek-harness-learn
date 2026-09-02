import type { Tone } from '@/lib/tone'
import { cn } from '@/lib/utils'

export interface SeqActor {
  /** Identifier referenced by every step, and the visible label. */
  name: string
  /** Monospace qualifier: package, service key or process. */
  sub?: string
  tone?: Tone
}

export type SeqStep =
  /** Message from one lane to another. */
  | {
      type: 'msg'
      from: string
      to: string
      label: string
      /** `call` is solid, `return` dashed, `async` dotted. */
      style?: 'call' | 'return' | 'async'
      tone?: Tone
    }
  /** Work a lane does on itself. */
  | { type: 'self'; at: string; label: string; tone?: Tone }
  /** Commentary spanning the whole diagram. */
  | { type: 'note'; label: string; tone?: Tone }
  /** Section divider naming the phase that follows. */
  | { type: 'phase'; label: string }

const LINE_STYLE = {
  call: 'border-solid',
  return: 'border-dashed',
  async: 'border-dotted',
} as const

/**
 * Sequence diagram.
 *
 * Lanes are laid out as equal fractions of the width, and every message is
 * absolutely positioned between two lane centres, so an arrow always starts and
 * ends exactly on a lifeline regardless of how many actors there are.
 */
export function Sequence({ actors, steps }: { actors: SeqActor[]; steps: SeqStep[] }) {
  const lanes = actors.length
  const indexOf = new Map(actors.map((actor, index) => [actor.name, index]))
  const centre = (index: number) => ((index + 0.5) / lanes) * 100

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: `${Math.max(28, lanes * 9)}rem` }}>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${lanes}, minmax(0, 1fr))` }}
        >
          {actors.map((actor) => (
            <div
              key={actor.name}
              data-tone={actor.tone ?? 'accent'}
              className="rounded-lg border border-tone-line bg-tone-soft px-2 py-1.5 text-center"
            >
              <p className="text-[0.78rem] leading-tight font-semibold text-fg-strong">
                {actor.name}
              </p>
              {actor.sub ? (
                <p className="mt-0.5 font-mono text-[0.64rem] leading-tight break-all text-tone">
                  {actor.sub}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="relative mt-1 pt-2 pb-2">
          {actors.map((actor, index) => (
            <span
              key={actor.name}
              aria-hidden
              className="absolute inset-y-0 w-px -translate-x-1/2 bg-line-strong"
              style={{ left: `${centre(index)}%` }}
            />
          ))}

          {steps.map((step, key) => {
            if (step.type === 'phase') {
              return (
                <div key={key} className="relative flex items-center gap-2 py-2.5">
                  <span className="h-px flex-1 bg-line-strong" aria-hidden />
                  <span className="rounded-full border border-line-strong bg-surface-2 px-2.5 py-0.5 font-mono text-[0.66rem] tracking-[0.04em] text-muted uppercase">
                    {step.label}
                  </span>
                  <span className="h-px flex-1 bg-line-strong" aria-hidden />
                </div>
              )
            }

            if (step.type === 'note') {
              return (
                <div key={key} className="relative flex justify-center py-1.5">
                  <p
                    data-tone={step.tone ?? 'neutral'}
                    className="max-w-[92%] rounded-md border border-dashed border-tone-line bg-surface px-2.5 py-1 text-center text-[0.72rem] leading-snug text-muted"
                  >
                    {step.label}
                  </p>
                </div>
              )
            }

            if (step.type === 'self') {
              const index = indexOf.get(step.at) ?? 0
              return (
                <div key={key} className="relative h-11">
                  <div
                    data-tone={step.tone ?? 'accent'}
                    className="absolute top-1/2 -translate-y-1/2 pl-3"
                    style={{ left: `${centre(index)}%`, maxWidth: `${100 - centre(index) - 2}%` }}
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-md rounded-l-none border border-l-2 border-tone-line border-l-tone bg-surface px-2 py-1 font-mono text-[0.68rem] text-fg">
                      <span className="text-tone" aria-hidden>
                        &#8635;
                      </span>
                      {step.label}
                    </span>
                  </div>
                </div>
              )
            }

            const from = indexOf.get(step.from) ?? 0
            const to = indexOf.get(step.to) ?? 0
            const left = Math.min(centre(from), centre(to))
            const width = Math.abs(centre(to) - centre(from))
            const rightwards = to > from

            return (
              <div key={key} className="relative h-11">
                <div
                  data-tone={step.tone ?? 'accent'}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  <span className="mb-1 block truncate px-1 text-center font-mono text-[0.68rem] text-tone">
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      'relative block border-t border-tone-line',
                      LINE_STYLE[step.style ?? 'call'],
                    )}
                    aria-hidden
                  >
                    <span
                      className={cn(
                        'absolute -top-[4px] size-0 border-y-4 border-y-transparent',
                        rightwards
                          ? 'right-0 border-l-6 border-l-[var(--tone-line)]'
                          : 'left-0 border-r-6 border-r-[var(--tone-line)]',
                      )}
                    />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
