'use client'

import { Command } from 'cmdk'
import { CornerDownLeft, FileText, Hash, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { withBasePath } from '@/lib/base-path'

import { useChrome } from './chrome'

interface SearchRecord {
  slug: string
  /** Heading id, empty for the chapter record itself. */
  id: string
  chapter: string
  num: string
  group: string
  heading: string
  depth: number
  text: string
}

/** Ranks a record against the query; `0` means "no match". */
function score(record: SearchRecord, needle: string): number {
  const heading = record.heading.toLowerCase()
  const chapter = record.chapter.toLowerCase()
  const text = record.text.toLowerCase()

  if (heading === needle) return 1000
  let total = 0
  if (heading.startsWith(needle)) total += 600
  else if (heading.includes(needle)) total += 400
  if (chapter.includes(needle)) total += 120
  if (text.includes(needle)) total += 80
  if (total > 0) total += (3 - record.depth) * 10
  return total
}

/** Prose around the first hit, so the reader can judge relevance. */
function excerpt(record: SearchRecord, needle: string): string {
  const at = record.text.toLowerCase().indexOf(needle)
  if (at < 0) return record.text.slice(0, 120)
  const start = Math.max(0, at - 40)
  return `${start > 0 ? '…' : ''}${record.text.slice(start, at + 90)}`
}

/**
 * Command palette. The index is fetched the first time the palette opens, so
 * the initial page load never pays for it.
 *
 * The shell is a local overlay rather than `Command.Dialog`: that keeps open
 * state on our chrome store and avoids a same-click dismiss through Radix.
 */
export function CommandPalette() {
  const { searchOpen, setSearchOpen } = useChrome()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState<SearchRecord[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!searchOpen || records || failed) return
    let cancelled = false
    fetch(withBasePath('/search-index.json'))
      .then((response) => {
        if (!response.ok) throw new Error(`search index: HTTP ${response.status}`)
        return response.json() as Promise<SearchRecord[]>
      })
      .then((data) => {
        if (!cancelled) setRecords(data)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [searchOpen, records, failed])

  useEffect(() => {
    if (!searchOpen) {
      setQuery('')
      return
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [searchOpen])

  const results = useMemo(() => {
    if (!records) return []
    const needle = query.trim().toLowerCase()
    if (needle === '') {
      return records.filter((record) => record.id === '').slice(0, 16)
    }
    return records
      .map((record) => ({ record, rank: score(record, needle) }))
      .filter((entry) => entry.rank > 0)
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 30)
      .map((entry) => entry.record)
  }, [records, query])

  const needle = query.trim().toLowerCase()

  function go(record: SearchRecord) {
    setSearchOpen(false)
    setQuery('')
    router.push(record.id ? `/docs/${record.slug}#${record.id}` : `/docs/${record.slug}`)
  }

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-60" role="presentation">
      <button
        type="button"
        aria-label="关闭搜索"
        className="absolute inset-0 bg-black/55 backdrop-blur-xs"
        onClick={() => setSearchOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="站内搜索"
        className="absolute inset-x-3 top-[12vh] mx-auto max-w-2xl overflow-hidden rounded-panel border border-line-strong bg-surface shadow-float"
      >
        <Command shouldFilter={false} loop label="站内搜索" className="flex flex-col">
          <div className="flex items-center gap-2.5 border-b border-line px-4">
            <Hash className="size-4 flex-none text-subtle" aria-hidden />
            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder="输入关键字：turn / ctx.tools / seam / waterfall …"
              className="h-12 flex-1 bg-transparent text-[0.9375rem] text-fg outline-none placeholder:text-subtle"
            />
            <kbd className="flex-none rounded border border-line bg-surface-2 px-1.5 py-px font-mono text-[0.65rem] text-subtle">
              Esc
            </kbd>
          </div>

          <Command.List className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain p-2">
            {!records && !failed ? (
              <div className="flex items-center gap-2 px-3 py-6 text-[0.8125rem] text-muted">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                正在加载索引…
              </div>
            ) : null}

            {failed ? (
              <div className="px-3 py-6 text-[0.8125rem] text-muted">
                索引加载失败。运行{' '}
                <code className="font-mono text-accent">pnpm run content-index</code> 重新生成后刷新页面。
              </div>
            ) : null}

            {records && results.length === 0 ? (
              <Command.Empty className="px-3 py-6 text-[0.8125rem] text-muted">
                没有匹配的章节或小节。
              </Command.Empty>
            ) : null}

            {results.map((record) => (
              <Command.Item
                key={`${record.slug}#${record.id}`}
                value={`${record.slug}#${record.id}`}
                onSelect={() => go(record)}
                className="group flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 data-[selected=true]:bg-accent-soft"
              >
                {record.id ? (
                  <Hash
                    className="mt-0.5 size-3.5 flex-none text-subtle group-data-[selected=true]:text-accent"
                    aria-hidden
                  />
                ) : (
                  <FileText
                    className="mt-0.5 size-3.5 flex-none text-subtle group-data-[selected=true]:text-accent"
                    aria-hidden
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate text-[0.875rem] font-medium text-fg group-data-[selected=true]:text-accent">
                      {record.heading}
                    </span>
                    <span className="flex-none font-mono text-[0.65rem] text-subtle">
                      {record.num} · {record.group}
                    </span>
                  </span>
                  {needle && record.text ? (
                    <span className="mt-0.5 block truncate text-[0.75rem] text-muted">
                      {excerpt(record, needle)}
                    </span>
                  ) : (
                    <span className="mt-0.5 block truncate text-[0.75rem] text-subtle">
                      {record.chapter}
                    </span>
                  )}
                </span>
                <CornerDownLeft
                  className="mt-1 size-3 flex-none text-subtle opacity-0 group-data-[selected=true]:opacity-100"
                  aria-hidden
                />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
