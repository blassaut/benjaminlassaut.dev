import { motion } from 'framer-motion'

interface Stat {
  value: string
  label: string
}

export function StatGrid({
  stats,
  testIdPrefix,
  animate: animateOnLoad = false,
  baseDelay = 0,
}: {
  stats: Stat[]
  testIdPrefix: string
  animate?: boolean
  baseDelay?: number
}) {
  return (
    <div data-testid={`${testIdPrefix}-stats`} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          {...(animateOnLoad
            ? { animate: { opacity: 1, y: 0 } }
            : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true } })}
          transition={{ duration: 0.3, delay: baseDelay + i * 0.06 }}
          className="text-center py-4 rounded-xl border border-white/5 bg-dark-800/20"
        >
          <div className="text-2xl font-heading font-bold text-teal-400">{stat.value}</div>
          <div className="text-[10px] text-muted/50 font-mono mt-1 uppercase tracking-wider">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
