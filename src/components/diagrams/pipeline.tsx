import type { ReactNode } from 'react'

import type { Tone } from '@/lib/tone'

export interface PipelineBranch {
  /** Condition that takes this exit. */
  label: string
  /** Where control goes. */
  to: string
  tone?: Tone
}

export interface PipelineStage {
  title: string
  /** Event name or function that implements the stage. */
  sub?: string
  body?: ReactNode
  tone?: Tone
  /** Early exits leaving the main line at this stage. */
  branches?: PipelineBranch[]
}

/**
 * Ordered processing stages on a single vertical rail, with early exits drawn
 * as offshoots. Used for the tool pipeline and the boot sequence.
 */
export function Pipeline({ stages }: { stages: PipelineStage[] }) {
  return (
    <ol className="relative space-y-0">
      {stages.map((stage, index) => (
        <li
          key={stage.title}
          data-tone={stage.tone ?? 'accent'}
          className="relative flex gap-3.5 pb-4 last:pb-0"
        >
          {index < stages.length - 1 ? (
            <span
              className="absolute top-7 bottom-0 left-[0.8125rem] w-px bg-line-strong"
              aria-hidden
            />
          ) : null}

          <span className="relative z-1 mt-0.5 flex size-7 flex-none items-center justify-center rounded-md border border-tone-line bg-tone-soft font-mono text-[0.7rem] font-semibold text-tone">
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="min-w-0 flex-1">
            <div className="rounded-card border border-line bg-surface px-3.5 py-2.5">
              <p className="text-[0.875rem] leading-tight font-semibold text-fg-strong">
                {stage.title}
              </p>
              {stage.sub ? (
                <p className="mt-0.5 font-mono text-[0.7rem] break-all text-tone">{stage.sub}</p>
              ) : null}
              {stage.body ? (
                <div className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                  {stage.body}
                </div>
              ) : null}
            </div>

            {stage.branches?.length ? (
              <div className="mt-2 flex flex-wrap gap-2 pl-3">
                {stage.branches.map((branch) => (
                  <span
                    key={branch.label}
                    data-tone={branch.tone ?? 'rose'}
                    className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-tone-line bg-tone-soft px-2 py-1 text-[0.72rem] text-muted"
                  >
                    <span className="font-mono text-[0.68rem] text-tone">{branch.label}</span>
                    <span aria-hidden className="text-subtle">
                      &rarr;
                    </span>
                    {branch.to}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
