import Link from 'next/link'

/** Wordmark plus the generated hexagonal glyph used as the site logo. */
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-2.5">
      <span className="relative flex size-8 flex-none items-center justify-center">
        <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
          <path
            d="M16 2.2 28.5 9v14L16 29.8 3.5 23V9z"
            className="fill-accent-soft stroke-accent-line"
            strokeWidth="1.2"
          />
          <path
            d="M16 6.6v5.6M16 19.8v5.6M9.8 12.4l4.8 2.8M22.2 12.4l-4.8 2.8M9.8 19.6l4.8-2.8M22.2 19.6l-4.8-2.8"
            className="stroke-accent"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle cx="16" cy="16" r="3.1" className="fill-accent" />
        </svg>
      </span>
      {compact ? null : (
        <span className="min-w-0 leading-tight">
          <strong className="block truncate text-[0.9375rem] font-semibold tracking-tight text-fg-strong">
            DeepSeek Harness
          </strong>
          <small className="block font-mono text-[0.65rem] tracking-[0.06em] text-subtle uppercase">
            技术图谱 / Learn
          </small>
        </span>
      )}
    </Link>
  )
}
