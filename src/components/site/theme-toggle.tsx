'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/**
 * Theme switch. It renders a placeholder until mounted because the resolved
 * theme is unknown during server rendering.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const dark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={mounted ? (dark ? '切换到浅色主题' : '切换到深色主题') : '切换主题'}
      className="flex size-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent-line hover:bg-accent-soft hover:text-accent"
    >
      {mounted ? (
        dark ? (
          <Sun className="size-4" aria-hidden />
        ) : (
          <Moon className="size-4" aria-hidden />
        )
      ) : (
        <span className="size-4" aria-hidden />
      )}
    </button>
  )
}
