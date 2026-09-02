'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface ChromeState {
  /** Mobile navigation drawer. */
  navOpen: boolean
  setNavOpen: (open: boolean) => void
  /** Command palette. */
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

const ChromeContext = createContext<ChromeState | null>(null)

/** Shared open/closed state for the drawer and the command palette. */
export function useChrome(): ChromeState {
  const value = useContext(ChromeContext)
  if (!value) throw new Error('useChrome must be used inside <ChromeProvider>')
  return value
}

export function ChromeProvider({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  // Navigating with the drawer open would leave it covering the new page.
  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((open) => !open)
        return
      }
      if (event.key === '/' && !isTypingTarget(event.target)) {
        event.preventDefault()
        setSearchOpen(true)
        return
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setNavOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Overlays sit on the page, so the document behind them must not scroll.
  useEffect(() => {
    document.body.style.overflow = navOpen || searchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen, searchOpen])

  const value = useMemo(
    () => ({ navOpen, setNavOpen, searchOpen, setSearchOpen }),
    [navOpen, searchOpen],
  )

  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}
