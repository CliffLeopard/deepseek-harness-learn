'use client'

import { motion, useScroll, useSpring } from 'motion/react'

/** Hairline under the header showing how far into the page the reader is. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="h-px origin-left bg-linear-to-r from-accent via-violet to-accent"
    />
  )
}
