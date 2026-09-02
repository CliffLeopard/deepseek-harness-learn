import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-start justify-center px-6">
      <p className="font-mono text-[0.7rem] tracking-[0.08em] text-accent uppercase">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg-strong">没有这一页</h1>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        地址对不上任何章节。从全景重新进入，或用 <kbd className="rounded border border-line bg-surface-2 px-1.5 py-px font-mono text-[0.75rem]">Ctrl K</kbd>{' '}
        搜索服务键与事件名。
      </p>
      <Link
        href="/docs/overview"
        className="mt-6 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
      >
        回到第 01 章
      </Link>
    </main>
  )
}
