/**
 * Derives the table of contents and the search index from the MDX sources.
 *
 * Two artefacts are written:
 *
 * - `src/generated/toc.json` — heading ids per chapter, consumed by the
 *   in-page table of contents and its scroll spy.
 * - `public/search-index.json` — one record per heading section, fetched lazily
 *   the first time the command palette opens.
 *
 * Heading ids are produced with `github-slugger`, the same slugger `rehype-slug`
 * uses during the MDX build, so ids in the DOM and ids in the table of contents
 * cannot drift.
 */

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import GithubSlugger from 'github-slugger'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'src', 'content')

// The registry is TypeScript; Node strips its erasable types on import. A
// file:// URL is required because Windows drive letters look like URL schemes.
const { chapters } = await import(pathToFileURL(path.join(root, 'src', 'lib', 'chapters.ts')).href)

/** Longest prose excerpt kept per section, in characters. */
const SNIPPET_LIMIT = 600

/**
 * Strips inline markdown so heading text matches what `rehype-slug` sees after
 * MDX has turned `` `code` `` and `**bold**` into elements.
 */
function plainText(markdown) {
  return markdown
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Counts how much a line opens or closes JSX, so prose extraction can skip
 * component blocks without parsing MDX.
 */
function jsxDelta(line) {
  const opens = line.match(/<[A-Za-z]/g)?.length ?? 0
  const selfClosing = line.match(/\/>/g)?.length ?? 0
  const closing = line.match(/<\/[A-Za-z]/g)?.length ?? 0
  return opens - selfClosing - closing
}

/**
 * Splits one MDX file into `## `/`### ` sections, returning the heading list
 * and the prose belonging to each heading.
 */
function parseSections(source) {
  const slugger = new GithubSlugger()
  const headings = []
  /** Prose accumulated for the heading currently open. */
  let current = null
  const sections = []
  let inFence = false
  let jsxDepth = 0

  const flush = () => {
    if (current) sections.push(current)
  }

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    if (jsxDepth > 0) {
      jsxDepth += jsxDelta(line)
      if (jsxDepth < 0) jsxDepth = 0
      continue
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(trimmed)
    if (heading) {
      flush()
      const depth = heading[1].length
      const text = plainText(heading[2])
      const id = slugger.slug(text)
      headings.push({ id, text, depth })
      current = { id, text, depth, prose: [] }
      continue
    }

    if (trimmed.startsWith('<')) {
      jsxDepth += jsxDelta(line)
      if (jsxDepth < 0) jsxDepth = 0
      continue
    }

    if (trimmed === '' || trimmed.startsWith('import ') || trimmed.startsWith('export ')) continue

    current?.prose.push(plainText(trimmed))
  }

  flush()
  return { headings, sections }
}

const toc = {}
const searchIndex = []

const present = new Set(
  (await readdir(contentDir)).filter((name) => name.endsWith('.mdx')).map((name) => name.slice(0, -4)),
)

for (const chapter of chapters) {
  if (!present.has(chapter.slug)) {
    throw new Error(
      `Chapter "${chapter.slug}" is registered in src/lib/chapters.ts but src/content/${chapter.slug}.mdx does not exist.`,
    )
  }
  present.delete(chapter.slug)

  const source = await readFile(path.join(contentDir, `${chapter.slug}.mdx`), 'utf8')
  const { headings, sections } = parseSections(source)

  toc[chapter.slug] = headings

  // The chapter itself is searchable through its title, lede and keywords.
  searchIndex.push({
    slug: chapter.slug,
    id: '',
    chapter: chapter.title,
    num: chapter.num,
    group: chapter.group,
    heading: chapter.title,
    depth: 1,
    text: `${chapter.lede} ${chapter.keywords.join(' ')}`.slice(0, SNIPPET_LIMIT),
  })

  for (const section of sections) {
    searchIndex.push({
      slug: chapter.slug,
      id: section.id,
      chapter: chapter.title,
      num: chapter.num,
      group: chapter.group,
      heading: section.text,
      depth: section.depth,
      text: section.prose.join(' ').slice(0, SNIPPET_LIMIT),
    })
  }
}

if (present.size > 0) {
  throw new Error(
    `MDX files without a registry entry: ${[...present].join(', ')}. Add them to src/lib/chapters.ts.`,
  )
}

await mkdir(path.join(root, 'src', 'generated'), { recursive: true })
await mkdir(path.join(root, 'public'), { recursive: true })

await writeFile(
  path.join(root, 'src', 'generated', 'toc.json'),
  `${JSON.stringify(toc, null, 2)}\n`,
)
await writeFile(
  path.join(root, 'public', 'search-index.json'),
  `${JSON.stringify(searchIndex)}\n`,
)

const headingCount = Object.values(toc).reduce((sum, list) => sum + list.length, 0)
console.log(
  `content index: ${chapters.length} chapters, ${headingCount} headings, ${searchIndex.length} search records`,
)
