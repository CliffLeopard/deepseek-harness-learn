'use client'

import { Menu, Search } from 'lucide-react'

import { Brand } from './brand'
import { useChrome } from './chrome'
import { GithubMark } from './github-mark'
import { ReadingProgress } from './reading-progress'
import { ThemeToggle } from './theme-toggle'

const REPO = 'https://github.com/deepseek-ai/deepseek-harness'

/** Sticky header: drawer trigger, wordmark, search affordance and controls. */
export function TopBar() {
  const { setNavOpen, setSearchOpen } = useChrome()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg-veil backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          aria-label="打开导航"
          className="flex size-9 flex-none items-center justify-center rounded-lg border border-line text-muted hover:text-fg lg:hidden"
        >
          <Menu className="size-4" aria-hidden />
        </button>

        <div className="w-auto flex-none lg:w-[15.25rem]">
          <Brand />
        </div>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-left text-[0.8125rem] text-subtle transition-colors hover:border-accent-line hover:text-muted sm:flex"
        >
          <Search className="size-3.5 flex-none" aria-hidden />
          <span className="flex-1 truncate">搜索章节、服务键、事件名…</span>
          <kbd className="rounded border border-line bg-surface-2 px-1.5 py-px font-mono text-[0.65rem] text-subtle">
            Ctrl K
          </kbd>
        </button>

        <div className="ml-auto flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="搜索"
            className="flex size-9 items-center justify-center rounded-lg border border-line text-muted hover:text-fg sm:hidden"
          >
            <Search className="size-4" aria-hidden />
          </button>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label="在 GitHub 上查看仓库"
            className="flex size-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent-line hover:bg-accent-soft hover:text-accent"
          >
            <GithubMark className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
      <ReadingProgress />
    </header>
  )
}
