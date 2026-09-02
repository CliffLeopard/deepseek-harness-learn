import os from 'node:os'
import path from 'node:path'

import createMDX from '@next/mdx'

/**
 * Hostnames Next 16 will serve `/_next` (HMR, fonts, RSC) to in `next dev`.
 *
 * Opening the Network URL (a LAN IP) is treated as a different origin from
 * `localhost`. Without these entries the page HTML loads but client JS does
 * not hydrate, so buttons like the theme switch do nothing.
 */
function allowedDevHosts() {
  const hosts = new Set([
    '127.0.0.1',
    'localhost',
    '10.*.*.*',
    '192.168.*.*',
    '172.*.*.*',
  ])
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs ?? []) {
      if (addr.internal) continue
      if (addr.family === 'IPv4' || addr.family === 4) hosts.add(addr.address)
    }
  }
  return [...hosts]
}

/**
 * MDX pipeline.
 *
 * Plugins are declared in string form because Turbopack requires a
 * serialisable loader configuration. Heading ids come from `rehype-slug`, and
 * `scripts/build-content-index.mjs` reproduces the same slugs with
 * `github-slugger` so the generated table of contents stays in sync.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm', {}]],
    rehypePlugins: [
      ['rehype-slug', {}],
      [
        'rehype-pretty-code',
        {
          theme: { dark: 'vitesse-dark', light: 'vitesse-light' },
          keepBackground: false,
          defaultLang: 'text',
        },
      ],
    ],
  },
})

const learnRoot = import.meta.dirname

/** Subpath for GitHub Pages (`/{repo}`); empty for local `out/` preview. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Pre-render every chapter to `out/`. Preview then uses a static file server
  // instead of `next dev`, which was hanging on Windows while still holding
  // the port.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
  allowedDevOrigins: allowedDevHosts(),
  outputFileTracingRoot: learnRoot,
  // Keep Turbopack from treating the parent monorepo as the workspace root.
  turbopack: {
    root: learnRoot,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**', path.resolve(learnRoot, '..', 'packages')],
      }
    }
    return config
  },
}

export default withMDX(nextConfig)
