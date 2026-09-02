import { AlertTriangle, Ban, Info, Lightbulb, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Tone } from '@/lib/tone'

type CalloutVariant = 'note' | 'key' | 'warn' | 'trap' | 'rule'

const VARIANTS: Record<
  CalloutVariant,
  { tone: Tone; label: string; icon: typeof Info }
> = {
  note: { tone: 'accent', label: '说明', icon: Info },
  key: { tone: 'violet', label: '关键结论', icon: Lightbulb },
  warn: { tone: 'amber', label: '注意', icon: AlertTriangle },
  trap: { tone: 'rose', label: '常见误解', icon: Ban },
  rule: { tone: 'lime', label: '规则', icon: ShieldCheck },
}

interface CalloutProps {
  variant?: CalloutVariant
  /** Overrides the variant's default label. */
  title?: string
  children: ReactNode
}

/** Highlighted aside. The variant fixes both the colour and the default label. */
export function Callout({ variant = 'note', title, children }: CalloutProps) {
  const { tone, label, icon: Icon } = VARIANTS[variant]

  return (
    <aside
      data-tone={tone}
      className="my-5 flex gap-3 rounded-card border border-tone-line bg-tone-soft px-4 py-3.5"
    >
      <Icon className="mt-0.5 size-4 flex-none text-tone" aria-hidden />
      <div className="min-w-0 text-[0.875rem] leading-relaxed">
        <p className="mb-1 font-semibold text-tone">{title ?? label}</p>
        <div className="[&>*:last-child]:mb-0 [&>p]:mb-2 text-fg">{children}</div>
      </div>
    </aside>
  )
}
