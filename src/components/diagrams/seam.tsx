import type { ReactNode } from 'react'

interface SeamProps {
  /** The service key the definition publishes, e.g. `ctx.shell`. */
  serviceKey: string
  definition: { title: string; sub?: string; body?: ReactNode }
  providers: { title: string; sub?: string }[]
  consumers: { title: string; sub?: string }[]
}

/**
 * The three roles of a capability seam: one Service Definition on top, its
 * interchangeable Service Providers on the left, and its Consumers on the
 * right. Drawing all three is the point — a lone role is not a seam.
 */
export function Seam({ serviceKey, definition, providers, consumers }: SeamProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <div
          data-tone="accent"
          className="w-full max-w-md rounded-card border border-tone-line bg-tone-soft px-4 py-3 text-center"
        >
          <p className="font-mono text-[0.7rem] tracking-[0.05em] text-tone uppercase">
            Service Definition
          </p>
          <p className="mt-1 text-[0.9375rem] font-semibold text-fg-strong">{definition.title}</p>
          <p className="mt-0.5 font-mono text-[0.75rem] text-tone">{serviceKey}</p>
          {definition.sub ? (
            <p className="mt-0.5 font-mono text-[0.68rem] text-subtle">{definition.sub}</p>
          ) : null}
          {definition.body ? (
            <div className="mt-2 text-[0.78rem] leading-relaxed text-muted">{definition.body}</div>
          ) : null}
        </div>
      </div>

      <div className="flex justify-center" aria-hidden>
        <div className="relative h-6 w-full max-w-2xl">
          <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-line-strong" />
          <span className="absolute top-3 right-[12.5%] left-[12.5%] h-px bg-line-strong" />
          <span className="absolute top-3 left-[12.5%] h-3 w-px bg-line-strong" />
          <span className="absolute top-3 right-[12.5%] h-3 w-px bg-line-strong" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Role
          role="Service Provider"
          hint="可互换实现"
          tone="lime"
          items={providers}
        />
        <Role role="Consumer" hint="调用方" tone="violet" items={consumers} />
      </div>
    </div>
  )
}

function Role({
  role,
  hint,
  tone,
  items,
}: {
  role: string
  hint: string
  tone: 'lime' | 'violet'
  items: { title: string; sub?: string }[]
}) {
  return (
    <section
      data-tone={tone}
      className="rounded-card border border-tone-line bg-tone-soft p-3.5"
    >
      <p className="flex items-baseline gap-2">
        <span className="font-mono text-[0.7rem] tracking-[0.05em] text-tone uppercase">
          {role}
        </span>
        <span className="text-[0.7rem] text-subtle">{hint}</span>
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li
            key={item.title}
            className="rounded-md border border-line-strong bg-surface px-2.5 py-1.5"
          >
            <p className="text-[0.8125rem] leading-tight text-fg">{item.title}</p>
            {item.sub ? (
              <p className="mt-0.5 font-mono text-[0.66rem] break-all text-subtle">{item.sub}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
