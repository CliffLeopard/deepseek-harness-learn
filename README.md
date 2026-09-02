# DeepSeek Harness 技术图谱

独立的 Next.js 站点，给工程师看。按「框架 → 运行核心 → 能力 → 产品外壳 → 工程」的顺序，讲清 `dsh` 的架构、数据流与生命周期。

在线阅读：[https://cliffleopard.github.io/deepseek-harness-learn/](https://cliffleopard.github.io/deepseek-harness-learn/)

本仓库从 DeepSeek Harness 的 `learn/` 目录独立出来。它不发布 `@deepseek-ai/dsh-*` 包。在原仓中 `pnpm-workspace.yaml` 把它钉成自己的 workspace 根，避免安装时改写仓库锁文件。

## 栈

| 层 | 选择 |
|---|---|
| 框架 | Next.js 16 App Router + React 19 + TypeScript |
| 样式 | Tailwind CSS 4（`@theme inline` 语义色） |
| 内容 | MDX + `remark-gfm` + `rehype-pretty-code` / Shiki |
| 主题 | `next-themes`（class 策略，跟随系统并可手动切换） |
| 搜索 | `cmdk` 命令面板，索引由 `scripts/build-content-index.mjs` 生成 |
| 动效 | `motion`（按需）；图标 `lucide-react`；字体 Geist |

## 本地运行

阅读、给同事看，用静态预览，不要用 `pnpm dev`。`next dev`（尤其是 Turbopack）在 Windows 上会把 4123 占住但不再响应 HTTP，浏览器一直转圈。

```sh
cd learn
pnpm run install:isolated   # 等价于 pnpm install --ignore-workspace
pnpm run preview            # 构建 out/ 并用静态服务器监听 4123（本机与局域网）
```

已经有 `out/` 时只需 `pnpm start`，秒开，不经过打包器。改了 MDX 或组件后再跑 `pnpm run preview` 或先 `pnpm run build`。

改站点壳、样式、组件时才用开发服务器：

```sh
pnpm dev           # webpack，较慢但比 Turbopack 稳
pnpm run dev:turbo # 仅在明确要热更新速度时使用
```

`predev` / `prebuild` 会先跑内容索引，写出：

- `src/generated/toc.json` — 各章标题锚点，供页内目录使用
- `public/search-index.json` — 命令面板的懒加载索引

生产产物在 `out/`，拷走即可发布（任意静态托管）。`trailingSlash` 已打开，`/docs/overview/` 对应 `out/docs/overview/index.html`。

推送到 `main` 后，GitHub Actions 会构建并发布到 GitHub Pages。项目站点带 `basePath` `/deepseek-harness-learn`，本地预览不要设置 `NEXT_PUBLIC_BASE_PATH`。

## 内容结构

- 章节元数据：`src/lib/chapters.ts`（阅读顺序的唯一来源）
- 章节正文：`src/content/<slug>.mdx`
- 加载表：`src/content/registry.ts`（显式，方便打包器静态看到每一章）
- 图与内容组件：`src/components/diagrams/*`、`src/components/content/*`
- 站点壳：`src/components/site/*`

新增一章时，三处必须一起改：`chapters.ts`、`registry.ts`、对应的 `.mdx`。内容索引脚本会在三者不一致时失败。

## 以源码为准

本站是讲解，不是规范。类型、事件与配置的完整清单仍以仓库 `docs/` 与生成目录为准。
