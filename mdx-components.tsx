import type { MDXComponents } from 'mdx/types'

import type { ComponentProps } from 'react'

import { Callout } from '@/components/content/callout'
import { CodeBlock } from '@/components/content/code-block'
import { Figure } from '@/components/content/figure'
import { Heading } from '@/components/content/heading'
import {
  Badge,
  Cards,
  DataTable,
  DefList,
  Panel,
  Split,
  Stats,
  Steps,
} from '@/components/content/primitives'
import { Fanout, Flow } from '@/components/diagrams/flow'
import { Layers } from '@/components/diagrams/layers'
import { Matrix } from '@/components/diagrams/matrix'
import { Arrow, DiagramNode, Legend } from '@/components/diagrams/node'
import { Pipeline } from '@/components/diagrams/pipeline'
import { Seam } from '@/components/diagrams/seam'
import { Sequence } from '@/components/diagrams/sequence'
import { Timeline } from '@/components/diagrams/timeline'
import { Tree } from '@/components/diagrams/tree'
import { withBasePath } from '@/lib/base-path'

/**
 * Components available to every MDX file without an import.
 *
 * Chapters are written as prose plus these components; keeping the mapping
 * global is what lets a chapter file stay free of boilerplate.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ id, children }) => (
      <Heading level={2} id={id}>
        {children}
      </Heading>
    ),
    h3: ({ id, children }) => (
      <Heading level={3} id={id}>
        {children}
      </Heading>
    ),
    h4: ({ id, children }) => (
      <Heading level={4} id={id}>
        {children}
      </Heading>
    ),
    pre: (props) => <CodeBlock {...props} />,
    a: ({ href, children, ...props }: ComponentProps<'a'>) => (
      <a href={href ? withBasePath(href) : href} {...props}>
        {children}
      </a>
    ),

    // Content primitives
    Badge,
    Callout,
    Cards,
    DataTable,
    DefList,
    Figure,
    Panel,
    Split,
    Stats,
    Steps,

    // Diagram primitives
    Arrow,
    DiagramNode,
    Fanout,
    Flow,
    Layers,
    Legend,
    Matrix,
    Pipeline,
    Seam,
    Sequence,
    Timeline,
    Tree,

    ...components,
  }
}
