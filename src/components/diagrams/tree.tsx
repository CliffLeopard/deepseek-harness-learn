import type { ReactNode } from 'react'

import type { Tone } from '@/lib/tone'

export interface TreeNode {
  label: string
  /** Short explanation shown to the right of the label. */
  note?: ReactNode
  tone?: Tone
  children?: TreeNode[]
}

/**
 * Nested structure with guide rails. Used for the repository map and the
 * composed plugin tree.
 */
export function Tree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <div className="font-mono text-[0.8125rem] leading-relaxed">
      <Branch nodes={nodes} depth={0} />
    </div>
  )
}

function Branch({ nodes, depth }: { nodes: TreeNode[]; depth: number }) {
  return (
    <ul className={depth > 0 ? 'ml-3 border-l border-line-strong pl-3' : ''}>
      {nodes.map((node) => (
        <li key={node.label} data-tone={node.tone ?? 'accent'} className="py-0.5">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-semibold text-tone">{node.label}</span>
            {node.note ? (
              <span className="font-sans text-[0.75rem] text-muted">{node.note}</span>
            ) : null}
          </span>
          {node.children?.length ? <Branch nodes={node.children} depth={depth + 1} /> : null}
        </li>
      ))}
    </ul>
  )
}
