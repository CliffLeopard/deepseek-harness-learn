import {
  ArrowRight,
  Boxes,
  GitBranch,
  Layers3,
  Radar,
  Route,
  Workflow,
} from 'lucide-react'
import Link from 'next/link'

import { ChromeProvider } from '@/components/site/chrome'
import { CommandPalette } from '@/components/site/command-palette'
import { NavDrawer } from '@/components/site/sidebar'
import { TopBar } from '@/components/site/top-bar'
import { chapterGroups, chapters } from '@/lib/chapters'

const REPO = 'https://github.com/deepseek-ai/deepseek-harness'

const HIGHLIGHTS = [
  {
    icon: Boxes,
    title: '一切皆插件',
    body: '模型适配器、工具注册表、会话日志，甚至 agent 主循环本身，都是插件贡献的。理解这一点，才能理解为什么改行为不需要改源码。',
    tone: 'accent',
  },
  {
    icon: Route,
    title: 'Turn / Step / Round',
    body: '循环的三层语义是全站最容易混用的词。本站给出精确定义、时序图，以及每个扩展点能改变什么。',
    tone: 'violet',
  },
  {
    icon: Layers3,
    title: '能力接缝',
    body: '服务定义、实现、消费者三个角色合在一起才叫 seam。换掉一个实现——比如把本地进程换成 E2B 沙箱——整个产品行为就会变。',
    tone: 'lime',
  },
  {
    icon: GitBranch,
    title: '会话日志是唯一真相',
    body: '模型消息历史不另存一份，而是从只追加的事件日志算出来。fork、resume、转录、遥测都从这条日志来。',
    tone: 'amber',
  },
  {
    icon: Workflow,
    title: '执行管线里的检查点',
    body: '策略、审批、沙箱、超时、改写结果和 UI 渲染都排在循环外面的固定位置。加一类新策略，不必改 agent-loop。',
    tone: 'rose',
  },
  {
    icon: Radar,
    title: '图先于文字',
    body: '架构图、数据流图、生命周期图、时序图与对照表贯穿全站，每张图都配有「怎么读」的说明。',
    tone: 'accent',
  },
] as const

const PATHS = [
  {
    label: '第一次接触',
    chapters: ['overview', 'cordis', 'lifecycle'],
    body: '先看全景分层，再补 Cordis 的四个基本概念，然后直接读循环语义。',
  },
  {
    label: '要写一个插件',
    chapters: ['plugins', 'tools', 'lifecycle'],
    body: '先看插件怎么挂进树、怎么进入一次 turn，再对工具管线和循环语义。',
  },
  {
    label: '要加一个工具',
    chapters: ['tools', 'context', 'session-log'],
    body: '工具定义与管线阶段、提示装配顺序，以及结果如何落进会话日志。',
  },
  {
    label: '要换一个后端',
    chapters: ['seams', 'execution', 'composition'],
    body: '先搞清 seam 的三个角色，再看执行世界怎么实现，最后用 patch 一层层换掉它。',
  },
  {
    label: '要做进程外集成',
    chapters: ['integration', 'web', 'engineering'],
    body: 'SDK / ACP / Webhook 的边界约束，Web 的 Typert 类型图，以及必须过的门禁。',
  },
] as const

export default function LandingPage() {
  const chapterBySlug = new Map(chapters.map((chapter) => [chapter.slug, chapter]))

  return (
    <ChromeProvider>
      <TopBar />
      <NavDrawer />
      <CommandPalette />

      <main id="content">
        {/* Hero ------------------------------------------------------------ */}
        <section className="relative mx-auto max-w-6xl px-5 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="animate-rise max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-3 py-1 font-mono text-[0.7rem] tracking-[0.06em] text-accent uppercase">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
              Developer Preview · 全插件 Agent Harness
            </span>

            <h1 className="mt-6 text-4xl leading-[1.1] font-semibold tracking-tight text-fg-strong sm:text-6xl">
              把 <span className="text-accent">DeepSeek Harness</span>
              <br />
              从架构读到细节
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              这是给工程师看的技术图谱。顺序是「框架 → 运行核心 → 能力 → 产品外壳 →
              工程」，把 <code className="font-mono text-accent">dsh</code>{' '}
              每一层讲清楚：插件怎样组成一个正在跑的 agent，一次 turn 里发生了什么，
              哪些 seam 可以换掉。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/docs/overview"
                className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[0.9375rem] font-medium text-accent-fg transition-transform hover:-translate-y-px"
              >
                开始阅读
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/docs/lifecycle"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-2.5 text-[0.9375rem] text-fg transition-colors hover:border-accent-line hover:text-accent"
              >
                直接看循环语义
              </Link>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-2 py-2.5 text-[0.9375rem] text-muted transition-colors hover:text-fg"
              >
                查看仓库
              </a>
            </div>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: '17', label: '章节，从全景到术语表', tone: 'accent' },
              { value: '20+', label: '包分组构成的插件树', tone: 'violet' },
              { value: '29', label: '可替换的 seam', tone: 'lime' },
              { value: '3', label: '事件域：会话 / agent / 能力', tone: 'amber' },
            ].map((stat) => (
              <div
                key={stat.label}
                data-tone={stat.tone}
                className="rounded-card border border-line bg-surface px-4 py-3.5"
              >
                <dt className="font-mono text-2xl leading-none font-semibold text-tone">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-[0.78rem] leading-snug text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Highlights ------------------------------------------------------ */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-fg-strong">
            这份图谱要让你掌握什么
          </h2>
          <p className="mt-2 max-w-2xl text-[0.9375rem] text-muted">
            不是 API 清单，而是「为什么这样设计、改动应该落在哪里」。
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <article
                key={item.title}
                data-tone={item.tone}
                className="group relative overflow-hidden rounded-panel border border-line bg-surface p-5 transition-colors hover:border-tone-line"
              >
                <span
                  className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-tone to-transparent opacity-0 transition-opacity group-hover:opacity-70"
                  aria-hidden
                />
                <item.icon className="size-5 text-tone" aria-hidden />
                <h3 className="mt-3 text-[0.9375rem] font-semibold text-fg-strong">{item.title}</h3>
                <p className="mt-1.5 text-[0.8438rem] leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Reading paths --------------------------------------------------- */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-fg-strong">按目的选路线</h2>
          <p className="mt-2 max-w-2xl text-[0.9375rem] text-muted">
            全站是线性的，但不必线性读。下面几条路线各自只有三章。
          </p>

          <div className="mt-7 grid gap-3 lg:grid-cols-2">
            {PATHS.map((path) => (
              <article
                key={path.label}
                className="rounded-panel border border-line bg-surface p-5 transition-colors hover:border-accent-line"
              >
                <p className="font-mono text-[0.7rem] tracking-[0.06em] text-accent uppercase">
                  {path.label}
                </p>
                <p className="mt-2 text-[0.8438rem] leading-relaxed text-muted">{path.body}</p>
                <ol className="mt-3.5 flex flex-wrap gap-2">
                  {path.chapters.map((slug) => {
                    const chapter = chapterBySlug.get(slug)
                    if (!chapter) return null
                    return (
                      <li key={slug}>
                        <Link
                          href={`/docs/${slug}`}
                          className="inline-flex items-baseline gap-1.5 rounded-md border border-line bg-surface-2 px-2.5 py-1 text-[0.78rem] text-fg transition-colors hover:border-accent-line hover:text-accent"
                        >
                          <span className="font-mono text-[0.66rem] text-subtle">
                            {chapter.num}
                          </span>
                          {chapter.nav}
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </article>
            ))}
          </div>
        </section>

        {/* Full table of contents ------------------------------------------ */}
        <section className="mx-auto max-w-6xl px-5 py-12 pb-24">
          <h2 className="text-2xl font-semibold tracking-tight text-fg-strong">全部章节</h2>

          <div className="mt-7 space-y-8">
            {chapterGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-3 flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.09em] text-subtle uppercase">
                  {group.label}
                  <span className="h-px flex-1 bg-line" aria-hidden />
                </p>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {group.chapters.map((chapter) => (
                    <li key={chapter.slug}>
                      <Link
                        href={`/docs/${chapter.slug}`}
                        className="group flex h-full flex-col rounded-card border border-line bg-surface px-4 py-3 transition-colors hover:border-accent-line"
                      >
                        <span className="flex items-baseline gap-2">
                          <span className="font-mono text-[0.7rem] text-subtle">{chapter.num}</span>
                          <span className="text-[0.875rem] font-medium text-fg group-hover:text-accent">
                            {chapter.nav}
                          </span>
                        </span>
                        <span className="mt-1 line-clamp-2 text-[0.75rem] leading-snug text-subtle">
                          {chapter.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-[0.78rem] text-subtle">
          <p>
            内容提炼自仓库 <code className="font-mono text-muted">docs/</code> 与{' '}
            <code className="font-mono text-muted">packages/</code> 的现行文档，以源码为准。
          </p>
          <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-fg">
            deepseek-ai/deepseek-harness
          </a>
        </div>
      </footer>
    </ChromeProvider>
  )
}
