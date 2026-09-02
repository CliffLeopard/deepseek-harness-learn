import type { ReactNode } from 'react'

import { ChromeProvider } from '@/components/site/chrome'
import { CommandPalette } from '@/components/site/command-palette'
import { NavDrawer, Sidebar } from '@/components/site/sidebar'
import { TopBar } from '@/components/site/top-bar'

/** Documentation shell: header, chapter navigation and the search palette. */
export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <ChromeProvider>
      <TopBar />
      <NavDrawer />
      <CommandPalette />
      <div className="mx-auto flex w-full max-w-[102rem] px-0 lg:px-4">
        <Sidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </ChromeProvider>
  )
}
