'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

import { chapterGroups } from '@/lib/chapters'
import { cn } from '@/lib/utils'

import { Brand } from './brand'
import { useChrome } from './chrome'

/** Chapter navigation, grouped by tier and numbered in reading order. */
function NavTree() {
  const pathname = usePathname()

  return (
    <nav className="space-y-5 pb-10">
      {chapterGroups.map((group) => (
        <section key={group.label}>
          <p className="mb-1.5 px-3 font-mono text-[0.66rem] tracking-[0.09em] text-subtle uppercase">
            {group.label}
          </p>
          <ul className="space-y-px">
            {group.chapters.map((chapter) => {
              const href = `/docs/${chapter.slug}`
              const active = pathname === href
              return (
                <li key={chapter.slug}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-baseline gap-2.5 rounded-lg px-3 py-1.5 text-[0.8438rem] transition-colors',
                      active
                        ? 'bg-accent-soft font-medium text-accent'
                        : 'text-muted hover:bg-surface-2 hover:text-fg',
                    )}
                  >
                    <span
                      className={cn(
                        'font-mono text-[0.68rem] tabular-nums',
                        active ? 'text-accent' : 'text-subtle group-hover:text-muted',
                      )}
                    >
                      {chapter.num}
                    </span>
                    <span className="min-w-0 flex-1">{chapter.nav}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </nav>
  )
}

/** Persistent sidebar on large screens. */
export function Sidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 flex-none overflow-y-auto border-r border-line px-3 pt-6 lg:block">
      <NavTree />
    </aside>
  )
}

/** The same navigation as an overlay drawer for narrow screens. */
export function NavDrawer() {
  const { navOpen, setNavOpen } = useChrome()

  return (
    <div
      className={cn('fixed inset-0 z-50 lg:hidden', navOpen ? 'block' : 'pointer-events-none')}
      aria-hidden={!navOpen}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="关闭导航"
        onClick={() => setNavOpen(false)}
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200',
          navOpen ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        className={cn(
          'absolute inset-y-0 left-0 flex w-[19rem] max-w-[85vw] flex-col border-r border-line bg-bg transition-transform duration-200 ease-out',
          navOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 flex-none items-center justify-between border-b border-line px-3">
          <Brand />
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label="关闭导航"
            className="flex size-9 items-center justify-center rounded-lg border border-line text-muted hover:text-fg"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-4">
          <NavTree />
        </div>
      </div>
    </div>
  )
}
