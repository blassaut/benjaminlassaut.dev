import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1 rounded-md bg-dark-800 border border-hairline/10 text-[10px] font-mono text-light/70 whitespace-nowrap pointer-events-none z-10"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
