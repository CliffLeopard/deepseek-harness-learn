import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Pager } from '@/components/site/pager'
import { TocRail, type Heading } from '@/components/site/toc-rail'
import { contentLoaders } from '@/content/registry'
import tocData from '@/generated/toc.json'
import { chapterBySlug, chapters, neighbours } from '@/lib/chapters'

const toc = tocData as Record<string, Heading[]>

export const dynamicParams = false
export const dynamic = 'force-static'

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapter.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const chapter = chapterBySlug.get(slug)
  if (!chapter) return {}
  return {
    title: chapter.title,
    description: chapter.lede,
    keywords: chapter.keywords,
  }
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const chapter = chapterBySlug.get(slug)
  const load = contentLoaders[slug]
  if (!chapter || !load) notFound()

  const { default: Content } = await load()
  const { prev, next } = neighbours(slug)
  const headings = toc[slug] ?? []

  return (
    <div className="flex min-w-0">
      <main id="content" className="min-w-0 flex-1 px-4 pt-8 pb-20 sm:px-8 xl:px-12">
        <div className="mx-auto max-w-3xl">
          <header className="animate-rise mb-8 border-b border-line pb-7">
            <p className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.08em] text-subtle uppercase">
              <span className="rounded border border-accent-line bg-accent-soft px-1.5 py-px text-accent">
                {chapter.num}
              </span>
              {chapter.group}
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-fg-strong sm:text-4xl">
              {chapter.title}
            </h1>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{chapter.lede}</p>
          </header>

          <article className="prose-dsh">
            <Content />
          </article>

          <Pager prev={prev} next={next} />

          <p className="mt-10 rounded-card border border-line bg-surface px-4 py-3 text-[0.75rem] leading-relaxed text-subtle">
            本站内容由仓库 <code className="font-mono text-muted">docs/</code> 与{' '}
            <code className="font-mono text-muted">packages/</code>{' '}
            的现行文档提炼而成，用于学习与查阅；以源码和生成目录为准。
          </p>
        </div>
      </main>

      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 flex-none overflow-y-auto py-8 pr-4 xl:block">
        <TocRail headings={headings} />
      </aside>
    </div>
  )
}
