import { motion } from 'framer-motion'

export interface Practice {
  label: string
  description: string
  detail: string
  icon: string
  caption?: string
  source: { label: string; href: string }
}

export function PracticeCard({ practice: p, index }: { practice: Practice; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative p-5 rounded-xl border border-white/5 bg-dark-800/20 hover:border-teal-400/15 transition-colors group overflow-hidden"
    >
      <span className="absolute -right-2 -bottom-3 text-[64px] font-mono font-black text-white/[0.02] select-none leading-none group-hover:text-teal-400/[0.04] transition-colors">
        {p.icon}
      </span>

      <div className="relative">
        <span className="inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase text-teal-400 border border-teal-400/20 rounded bg-teal-400/5 mb-3">
          {p.label}
        </span>
        <p className="text-sm text-light/80 font-body leading-relaxed mb-2">{p.description}</p>
        <p className="text-xs font-mono text-muted/50 leading-relaxed mb-3">{p.detail}</p>
        <div className="flex items-center justify-between">
          <a
            href={p.source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted/40 hover:text-teal-400 transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            {p.source.label}
          </a>
          {p.caption && (
            <span className="text-[10px] font-mono text-muted/30">{p.caption}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
