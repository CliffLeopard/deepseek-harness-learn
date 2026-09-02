import { Link2 } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Section heading with a hover anchor. Ids come from `rehype-slug`, so they
 * match the generated table of contents and every in-page link.
 */
export function Heading({
  level,
  id,
  children,
}: {
  level: 2 | 3 | 4
  id?: string
  children: ReactNode
}) {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4'

  return (
    <Tag id={id} className="group scroll-mt-24">
      {children}
      {id ? (
        <a
          href={`#${id}`}
          aria-label="本节链接"
          className="ml-1.5 inline-flex translate-y-px align-middle text-subtle no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Link2 className="size-3.5" aria-hidden />
        </a>
      ) : null}
    </Tag>
  )
}
