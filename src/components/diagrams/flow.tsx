import { Fragment } from 'react'

import type { Tone } from '@/lib/tone'
import { cn } from '@/lib/utils'

import { Arrow, DiagramNode, type DiagramNodeProps } from './node'

export interface FlowNode extends DiagramNodeProps {
  /** Label on the connector entering this node from the previous one. */
  edge?: string
  edgeTone?: Tone
  /** Draw the incoming connector dashed, for optional or async hops. */
  dashed?: boolean
}

interface FlowProps {
  dir?: 'row' | 'col'
  nodes: FlowNode[]
  /** Allow the row to wrap instead of scrolling. */
  wrap?: boolean
}

/** Linear chain of nodes joined by labelled connectors. */
export function Flow({ dir = 'row', nodes, wrap = false }: FlowProps) {
  return (
    <div
      className={cn(
        'flex items-stretch',
        // `w-max` lets the enclosing figure scroll rather than compress nodes.
        dir === 'row' ? 'w-max flex-row items-center' : 'flex-col items-center',
        wrap && 'w-full flex-wrap justify-center gap-y-2',
      )}
    >
      {nodes.map((node, index) => {
        const { edge, edgeTone, dashed, ...rest } = node
        return (
          <Fragment key={index}>
            {index > 0 ? (
              <Arrow label={edge} dir={dir} tone={edgeTone ?? 'neutral'} dashed={dashed} />
            ) : null}
            <DiagramNode {...rest} className={dir === 'col' ? 'w-full max-w-md' : undefined} />
          </Fragment>
        )
      })}
    </div>
  )
}

export interface BranchTarget {
  label: string
  title: string
  sub?: string
  tone?: Tone
}

/** A single node that fans out into mutually exclusive outcomes. */
export function Fanout({
  source,
  targets,
}: {
  source: DiagramNodeProps
  targets: BranchTarget[]
}) {
  return (
    <div className="flex flex-col items-center">
      <DiagramNode {...source} />
      <span className="h-4 w-px bg-line-strong" aria-hidden />
      <div className="h-px w-[min(100%,44rem)] bg-line-strong" aria-hidden />
      <div className="grid w-full gap-3 pt-0 sm:grid-cols-2 lg:grid-cols-3">
        {targets.map((target) => (
          <div key={target.label} data-tone={target.tone ?? 'accent'} className="flex flex-col items-center">
            <span className="h-4 w-px bg-tone-line" aria-hidden />
            <span className="mb-1.5 rounded-full border border-tone-line bg-surface px-2 py-px font-mono text-[0.66rem] text-tone">
              {target.label}
            </span>
            <DiagramNode
              title={target.title}
              sub={target.sub}
              kind="service"
              tone={target.tone ?? 'accent'}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
