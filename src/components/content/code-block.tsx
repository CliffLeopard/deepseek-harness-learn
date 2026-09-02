'use client'

import { Check, Copy } from 'lucide-react'
import { useRef, useState, type ComponentPropsWithoutRef } from 'react'

interface CodeBlockProps extends ComponentPropsWithoutRef<'pre'> {
  /** Written by rehype-pretty-code from the fence's language tag. */
  'data-language'?: string
}

/**
 * Replacement for `<pre>` inside MDX. It keeps the Shiki markup untouched and
 * adds the language label and a copy button, reading the text straight from the
 * rendered DOM so no source duplication is needed.
 */
export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const language = props['data-language']

  async function copy() {
    const text = preRef.current?.textContent
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="group relative">
      <div className="flex items-center justify-between border-b border-line bg-surface-2/70 px-3 py-1.5">
        <span className="font-mono text-[0.66rem] tracking-[0.06em] text-subtle uppercase">
          {language ?? 'text'}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="复制代码"
          className="flex items-center gap-1.5 rounded-md border border-line px-2 py-0.5 font-mono text-[0.66rem] text-subtle transition-colors hover:border-accent-line hover:text-accent"
        >
          {copied ? (
            <Check className="size-3 text-lime" aria-hidden />
          ) : (
            <Copy className="size-3" aria-hidden />
          )}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  )
}
