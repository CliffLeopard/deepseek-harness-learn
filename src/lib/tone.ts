/**
 * Shared colour-role names.
 *
 * Components set `data-tone={tone}` and then use the `tone` / `tone-soft` /
 * `tone-line` Tailwind colours, which resolve through the CSS variables in
 * `globals.css`. Keeping the union here is what lets MDX props stay typed.
 */
export type Tone = 'accent' | 'violet' | 'lime' | 'amber' | 'rose' | 'neutral'
