import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { slugify, extractFeatureName, countScenarios } from '../../lib/gherkin'
import { GherkinLine } from './GherkinLine'

export function FeatureCard({
  raw,
  index,
  defaultOpen = false,
  testIdPrefix = 'qa',
  hook,
}: {
  raw: string
  index: number
  defaultOpen?: boolean
  testIdPrefix?: string
  hook?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const name = extractFeatureName(raw)
  const testid = `${testIdPrefix}-feature-${slugify(name)}`
  const scenarioCount = countScenarios(raw)

  return (
    <motion.div
      data-testid={testid}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative"
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-px transition-colors duration-300 ${open ? 'bg-teal-400' : 'bg-white/10 group-hover:bg-teal-400/40'}`}
      />

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 pl-5 pr-4 py-4 text-left hover:bg-white/[0.02] transition-colors rounded-r-lg"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-0.5">
            <span className="font-heading font-semibold text-light group-hover:text-teal-400 transition-colors truncate">
              {name}
            </span>
          </div>
          <span className="text-xs font-mono text-muted/60">
            {scenarioCount} scenario{scenarioCount !== 1 ? 's' : ''}
            {hook && <span className="text-muted/40 ml-1"> · {hook}</span>}
          </span>
          {name.includes('Who tests the tester') && (
            <span className="text-xs font-body italic text-teal-400/50 ml-3">
              psst - that's you right now
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted/40 text-xs shrink-0"
        >
          &#9662;
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pl-5 pr-4 pb-5">
              <div className="rounded-lg bg-dark-900/80 border border-white/[0.04] p-4 overflow-x-auto">
                <pre className="font-mono text-[13px] leading-[1.7]">
                  {raw.split('\n').map((line, i) => (
                    <GherkinLine key={i} line={line} />
                  ))}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
