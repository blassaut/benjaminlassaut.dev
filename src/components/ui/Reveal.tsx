import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  /** How far below its place, in px, the block starts */
  y?: number
  /** Seconds before the block starts to appear */
  delay?: number
  /** Appear as soon as the page renders (top of the page) instead of when scrolled into view */
  immediate?: boolean
}

/** Fades a block in while it rises into place. */
export default function Reveal({ children, className, y = 20, delay = 0, immediate }: Props) {
  const shown = { opacity: 1, y: 0 }
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      {...(immediate ? { animate: shown } : { whileInView: shown, viewport: { once: true } })}
      // Stryker disable next-line ObjectLiteral: animation timing, not observable in jsdom
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
