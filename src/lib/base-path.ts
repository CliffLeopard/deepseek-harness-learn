/**
 * Public URL prefix when the atlas is hosted under a subpath.
 *
 * GitHub Pages project sites live at `/{repo}/`. Local preview and `pnpm start`
 * leave this empty so the static server can bind at `/`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * Prefix a site-root path (`/docs/...`, `/search-index.json`) with {@link BASE_PATH}.
 * Hash links, external URLs, and already-prefixed paths are left unchanged.
 * @param href - href or fetch URL.
 * @returns the URL to use in the current deployment.
 */
export function withBasePath(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (!BASE_PATH) return href
  if (href === BASE_PATH || href.startsWith(`${BASE_PATH}/`)) return href
  return `${BASE_PATH}${href}`
}
