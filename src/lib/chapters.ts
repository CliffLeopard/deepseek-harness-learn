/**
 * Chapter catalogue.
 *
 * This is the single source of reading order, sidebar grouping, pager
 * neighbours, and the content-index script. Every slug here must have a
 * matching `src/content/<slug>.mdx` and a loader in `src/content/registry.ts`.
 */

export interface Chapter {
  slug: string
  num: string
  /** Short label in the sidebar and pager. */
  nav: string
  title: string
  lede: string
  group: string
  keywords: string[]
}

export interface ChapterGroup {
  label: string
  chapters: Chapter[]
}

export const chapters: Chapter[] = [
  {
    slug: 'overview',
    num: '01',
    nav: '项目全景',
    title: 'DeepSeek Harness 全景',
    lede: 'DeepSeek Harness（命令行名 dsh）是 DeepSeek AI 开源的 agent harness。它的全部产品能力都由插件贡献，运行在 Cordis 框架之上——包括模型适配器、工具注册表、会话日志，乃至 agent 主循环本身。',
    group: '起步',
    keywords: ['dsh', 'harness', 'cordis', 'plugin', 'everything is a plugin', '总览'],
  },
  {
    slug: 'cordis',
    num: '02',
    nav: 'Cordis 插件框架',
    title: 'Cordis：插件、服务与可撤销效果',
    lede: 'Cordis 是 Harness 底下的插件框架，源码钉在 vendor/。它提供四件事：当服务仓库用的 Context、用 inject 声明的依赖、带派发模式的类型化事件，以及注册了就能撤销的 effect。',
    group: '框架层',
    keywords: ['cordis', 'context', 'service', 'inject', 'emit', 'waterfall', 'parallel', 'serial', 'bail', '@mode', 'effect', 'fiber', 'plugin', '事件', '派发模式'],
  },
  {
    slug: 'composition',
    num: '03',
    nav: '组合与启动',
    title: 'Profile、Bundle 与 Patch 分层',
    lede: '一个运行中的 dsh 是启动时由若干有序层组合出的插件树。理解这套分层，就掌握了在不改一行源码的前提下改变产品行为的全部手段。',
    group: '框架层',
    keywords: ['profile', 'bundle', 'patch', 'cordis.patch.yml', 'dsh home', 'dump-config', 'patchReload', '启动'],
  },
  {
    slug: 'plugins',
    num: '04',
    nav: '插件开发',
    title: '写插件：怎么挂进树，怎么进入一次 turn',
    lede: '插件是贡献，不是内核补丁。这一章把 apply、inject、三种包，接到「一行配置如何变成模型看得见的能力」：工具、钩子、提示段落、UI 分别挂在循环的哪一段。',
    group: '框架层',
    keywords: ['plugin', 'bundle', 'library', 'apply', 'inject', 'defineTool', 'cordis.patch.yml', '--patch', '扩展点', '插件开发'],
  },
  {
    slug: 'core-spine',
    num: '05',
    nav: '核心 spine',
    title: '核心 spine：服务、Agent 与三类事件域',
    lede: 'packages/core/ 是产品 API 主干。它定义会话日志、提示装配、工具注册表、Agent 句柄与默认循环驱动，并划出三类事件域——选对事件域，是绝大多数改动的第一个决定。',
    group: '运行核心',
    keywords: ['ctx.sessions', 'ctx.tools', 'ctx.agents', 'ctx.agentLoop', 'Agent', 'AgentHandle', 'scope', 'initiator', '事件域'],
  },
  {
    slug: 'lifecycle',
    num: '06',
    nav: 'Agent 生命周期',
    title: 'Turn、Step 与 Round：循环的精确语义',
    lede: 'step 是一次模型请求加上它引发的工具调用；turn 是零个或多个 step；round 是包住 turn 的外层策略迭代。三个词不能混用。',
    group: '运行核心',
    keywords: ['turn', 'step', 'round', 'agent/pre-step', 'agent/request', 'turn-stopping', 'inbox', 'PreStepDecision', '生命周期', '时序图'],
  },
  {
    slug: 'session-log',
    num: '07',
    nav: '会话日志与投影',
    title: '会话日志：唯一真相，消息历史从这里算出来',
    lede: '会话是一条只追加的 SessionEvent 日志。模型消息历史不另存一份，由 deriveMessages() 从日志算出来。fork、resume、转录、遥测和持久化都从这条日志来。',
    group: '运行核心',
    keywords: ['SessionEvent', 'deriveMessages', 'surface', 'SurfaceOp', 'request/header', 'fork', 'resume', 'JSONL', 'projection', 'turnBoundary'],
  },
  {
    slug: 'tools',
    num: '08',
    nav: '工具执行管线',
    title: '工具注册表与执行管线',
    lede: '工具是模型能做的一切事。策略、审批、沙箱、超时、改写结果和 UI 渲染都排在循环外面的固定位置，加一类新策略不必改 agent-loop。',
    group: '运行核心',
    keywords: ['ctx.tools', 'ToolDefinition', 'tools/pre-execute', 'tools/execute', 'tools/post-execute', 'guard', 'approval', 'executionMode', 'PTC'],
  },
  {
    slug: 'llm',
    num: '09',
    nav: 'LLM 流式与上下文',
    title: 'LLM 适配器、流式词汇与上下文预算',
    lede: 'ctx.llm 定义消息与流式的词汇，并提供适配器 seam。循环只认识 StreamChunk；provider 的差异全部封在适配器里。上下文压力则由 token 计量与压缩两个服务协同处理。',
    group: '运行核心',
    keywords: ['ctx.llm', 'StreamChunk', 'FinishReason', 'GenerateOptions', 'llm/stream', 'tokenMeter', 'compaction'],
  },
  {
    slug: 'seams',
    num: '10',
    nav: '能力接缝全景',
    title: 'Capability Seam：三个角色才算一个能力',
    lede: 'seam 是可替换能力的单位。服务定义、实现、消费者三者缺一不可。换掉一个实现，产品行为就会变。',
    group: '能力层',
    keywords: ['seam', 'Service Definition', 'Service Provider', 'Consumer', 'capability', 'E2B'],
  },
  {
    slug: 'execution',
    num: '11',
    nav: '执行世界',
    title: '执行世界：Shell、子进程、沙箱与文件系统',
    lede: '文件系统与子进程的 provider 共享同一个执行世界。把它们一起指向远程沙箱，Bash、PTY 与 LSP 会随之整体搬迁，无需为任何 consumer 做 fork。',
    group: '能力层',
    keywords: ['ctx.shell', 'ctx.subprocess', 'ctx.fs', 'ctx.sandbox', 'confine', 'Landlock', 'Seatbelt', 'request/spec'],
  },
  {
    slug: 'orchestration',
    num: '12',
    nav: '编排与委派',
    title: 'Subagent、Workflow、Ralph、Job 与 Goal',
    lede: '编排层解决的不是「再跑一次循环」，而是「谁拥有这次运行、状态存在哪里、如何续跑或停止」。四种机制各自对应不同的生命周期。',
    group: '能力层',
    keywords: ['subagent', 'workflow', 'ralph', 'jobs', 'goal', 'Activation', 'continuable'],
  },
  {
    slug: 'context',
    num: '13',
    nav: '提示与上下文装配',
    title: '系统提示、变量、技能与上下文来源',
    lede: '每个 step 都会重新装配提示段落与工具 schema。所以某个 scope 上的 shadowing、restriction，以及 skills 这类动态 catalog，都能在 turn 中途生效。',
    group: '能力层',
    keywords: ['ctx.systemPrompt', 'PromptSection', 'assemble', 'skills', 'ContextForm', 'KV cache'],
  },
  {
    slug: 'web',
    num: '14',
    nav: 'Web 客户端',
    title: '浏览器里的另一棵 Cordis 树',
    lede: 'Web GUI 不是一套独立的 React 应用，而是 Host 上的 Cordis 树通过 Typert RPC 驱动的 Client 树。Session 事件流、Slots 与 Conversation 节点共同把日志变成可回放的界面。',
    group: '产品外壳',
    keywords: ['Typert', 'ctx.remote', 'slots', 'conversation', 'client-modules', 'ui-renderer'],
  },
  {
    slug: 'integration',
    num: '15',
    nav: '进程外集成',
    title: 'SDK、ACP、Webhook 与 Hook 桥',
    lede: '所有受支持的 Node 应用都从 dsh 加一个 profile 名启动。TypeScript / Python SDK、ACP、Webhook 与 Claude Code / Codex hook 桥都是同一棵树的不同出口，而不是另一套内核。',
    group: '产品外壳',
    keywords: ['sdk', 'json-rpc', 'acp', 'webhook', 'hooks', 'python'],
  },
  {
    slug: 'engineering',
    num: '16',
    nav: '工程与门禁',
    title: '测试层级、构建分面与仓库纪律',
    lede: '源码和构建产物不能混用；CI 覆盖率门禁是逐文件 100%。模型看得见或用户看得见的改动，必须更新不依赖 API key 的录制会话快照。',
    group: '工程与词汇',
    keywords: ['test:coverage', 'snapshot', 'tsconfig.host', 'tsdown', 'hygiene', 'Agent Note'],
  },
  {
    slug: 'glossary',
    num: '17',
    nav: '名词解释',
    title: '领域词汇：一个概念一个词',
    lede: 'turn、step、round、seam、scope、shadowing 等术语在代码、文档、事件名与 PR 讨论里必须指同一件事。遇到含义不明的词，先在这里对齐。',
    group: '工程与词汇',
    keywords: ['glossary', 'turn', 'step', 'round', 'seam', 'scope', 'shadowing', 'Ralph'],
  },
]

export const chapterGroups: ChapterGroup[] = groupChapters(chapters)

export const chapterBySlug = new Map(chapters.map((chapter) => [chapter.slug, chapter]))

/** Previous and next chapter in reading order. */
export function neighbours(slug: string): { prev?: Chapter; next?: Chapter } {
  const index = chapters.findIndex((chapter) => chapter.slug === slug)
  if (index < 0) return {}
  return {
    prev: chapters[index - 1],
    next: chapters[index + 1],
  }
}

function groupChapters(list: Chapter[]): ChapterGroup[] {
  const groups: ChapterGroup[] = []
  for (const chapter of list) {
    const last = groups.at(-1)
    if (last && last.label === chapter.group) {
      last.chapters.push(chapter)
    } else {
      groups.push({ label: chapter.group, chapters: [chapter] })
    }
  }
  return groups
}
