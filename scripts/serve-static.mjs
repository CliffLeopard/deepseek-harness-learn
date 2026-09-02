/**
 * Serve `out/` as a static site on 0.0.0.0 (LAN-safe).
 *
 * `next dev` on Windows/Turbopack has been hanging while still holding the
 * port — TCP accepts, HTTP never returns. This site is a pre-rendered atlas,
 * so preview goes through `next build` + this server instead of the bundler.
 */

import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'out')
const port = Number(process.env.PORT ?? 4123)
const host = process.env.HOST ?? '0.0.0.0'

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

function lanAddresses() {
  const ips = []
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs ?? []) {
      if (addr.internal) continue
      if (addr.family === 'IPv4' || addr.family === 4) ips.push(addr.address)
    }
  }
  return ips
}

function withinOut(resolved) {
  const rel = path.relative(outDir, resolved)
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)
}

/**
 * Map a URL pathname onto a file under `out/`.
 *
 * Next's static export with `trailingSlash` writes `docs/overview/index.html`.
 * Callers often omit the slash (`/docs/overview`), so we try that too.
 */
async function resolveFile(urlPath) {
  let pathname
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0] ?? '/')
  } catch {
    return null
  }

  const candidates = []
  const joined = path.normalize(path.join(outDir, pathname))
  if (pathname.endsWith('/')) {
    candidates.push(path.join(joined, 'index.html'))
  } else {
    candidates.push(joined)
    candidates.push(`${joined}.html`)
    candidates.push(path.join(joined, 'index.html'))
  }

  for (const candidate of candidates) {
    if (!withinOut(candidate) && candidate !== path.join(outDir, 'index.html')) continue
    if (!existsSync(candidate)) continue
    const info = await stat(candidate)
    if (info.isFile()) return candidate
  }
  return null
}

function cacheControl(filePath) {
  const rel = path.relative(outDir, filePath).replaceAll('\\', '/')
  if (rel.startsWith('_next/static/')) return 'public, max-age=31536000, immutable'
  if (rel.endsWith('.html')) return 'no-cache'
  return 'public, max-age=60'
}

if (!existsSync(path.join(outDir, 'index.html'))) {
  console.error('No static build at learn/out/. Run `pnpm run build` first, or `pnpm run preview`.')
  process.exit(1)
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' })
    res.end()
    return
  }

  const urlPath = req.url ?? '/'
  const pathname = urlPath.split('?')[0] ?? '/'
  if (pathname === '/docs' || pathname === '/docs/') {
    res.writeHead(302, { Location: '/docs/overview/' })
    res.end()
    return
  }

  try {
    const filePath = (await resolveFile(urlPath)) ?? path.join(outDir, '404.html')
    const body = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const status = filePath.endsWith(`${path.sep}404.html`) && urlPath !== '/404.html' ? 404 : 200
    res.writeHead(status, {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': cacheControl(filePath),
    })
    if (req.method === 'HEAD') {
      res.end()
      return
    }
    res.end(body)
  } catch (error) {
    console.error(error)
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Internal Server Error')
  }
})

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other process, then retry.`)
    process.exit(1)
  }
  throw error
})

server.listen(port, host, () => {
  console.log(`Static preview of learn/out`)
  console.log(`  Local:    http://127.0.0.1:${port}`)
  for (const ip of lanAddresses()) {
    console.log(`  Network:  http://${ip}:${port}`)
  }
  console.log('This server does not hot-reload. Rebuild with `pnpm run build` after content edits.')
})

function shutdown() {
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
