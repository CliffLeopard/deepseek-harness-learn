'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export interface Heading {
  id: string
  text: string
  depth: number
}

/**
 * In-page table of contents with a scroll spy.
 *
 * The active entry is the last heading whose top edge has passed the sticky
 * header, which matches what a reader perceives as "the section I am in" more
 * closely than intersection ratios do.
 */
export function TocRail({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')

  useEffect(() => {
    if (headings.length === 0) return

    let frame = 0

    function measure() {
      frame = 0
      const offset = 96
      let current = headings[0]?.id ?? ''
      for (const heading of headings) {
        const element = document.getElementById(heading.id)
        if (!element) continue
        if (element.getBoundingClientRect().top - offset <= 0) current = heading.id
        else break
      }
      // At the very bottom the last heading may never cross the offset.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = headings.at(-1)?.id ?? current
      }
      setActiveId(current)
    }

    function onScroll() {
      if (frame === 0) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="本页目录" className="text-[0.8125rem]">
      <p className="mb-2 font-mono text-[0.66rem] tracking-[0.09em] text-subtle uppercase">
        本页目录
      </p>
      <ul className="border-l border-line">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  '-ml-px block border-l py-1 leading-snug transition-colors',
                  heading.depth === 3 ? 'pl-6' : 'pl-3',
                  active
                    ? 'border-accent font-medium text-accent'
                    : 'border-transparent text-muted hover:border-line-strong hover:text-fg',
                )}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
