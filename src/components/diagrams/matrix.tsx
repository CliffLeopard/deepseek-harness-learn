import type { ReactNode } from 'react'

import type { Tone } from '@/lib/tone'

export interface MatrixCell {
  label: ReactNode
  tone?: Tone
}

interface MatrixProps {
  /** Header for the row-label column. */
  corner: string
  cols: string[]
  rows: { label: string; cells: (MatrixCell | null)[] }[]
}

/**
 * Two-axis comparison grid. Empty cells are meaningful: they say the
 * combination does not exist.
 */
export function Matrix({ corner, cols, rows }: MatrixProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-[0.78rem]">
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-line-strong px-3 py-2 text-left font-mono text-[0.66rem] tracking-[0.05em] text-subtle uppercase"
            >
              {corner}
            </th>
            {cols.map((col) => (
              <th
                key={col}
                scope="col"
                className="border-b border-line-strong px-3 py-2 text-left font-mono text-[0.68rem] font-semibold whitespace-nowrap text-muted"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row.label}:${rowIndex}`}>
              <th
                scope="row"
                className="border-b border-line px-3 py-2 text-left align-top text-[0.8125rem] font-medium text-fg"
              >
                {row.label}
              </th>
              {row.cells.map((cell, index) => (
                <td key={index} className="border-b border-line px-3 py-2 align-top">
                  {cell ? (
                    <span
                      data-tone={cell.tone ?? 'accent'}
                      className="inline-block rounded-md border border-tone-line bg-tone-soft px-2 py-0.5 text-[0.75rem] leading-snug text-fg"
                    >
                      {cell.label}
                    </span>
                  ) : (
                    <span className="text-subtle" aria-label="不适用">
                      &mdash;
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
