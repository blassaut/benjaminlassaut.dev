import { motion } from 'framer-motion'
import AnimatedSection from '../AnimatedSection'

const stats = [
  { value: '10+', label: 'Years in QA' },
  { value: '20+', label: 'Networks Tested' },
  { value: '5', label: 'Industries' },
]

export default function About() {
  return (
    <AnimatedSection id="about" className="py-28 px-6" data-testid="about-section">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-3xl font-heading font-bold">About</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
        </div>

        <div className="space-y-6 text-muted font-body text-base leading-relaxed">
          <p>
            I design QA systems that run continuously, from{' '}
            <span className="text-light">CI</span> to{' '}
            <span className="text-light">production</span> - automated, wired directly
            into incident response. Not regression checklists. I write my own tests and
            tooling: <span className="text-light">TypeScript</span>,{' '}
            <span className="text-light">Playwright</span>,{' '}
            <span className="text-light">Cypress</span>,{' '}
            <span className="text-light">GitHub Actions</span>, and BDD.
          </p>
          <p>
            At <span className="text-teal-400">Kiln</span>, I built the QA architecture from
            zero and scaled it across teams. BDD frameworks, end-to-end coverage of high-stakes
            fintech and blockchain flows spanning 20+ networks, and production monitoring running
            every hour. When something breaks, we know before clients do.
          </p>
          <p>
            Before that: electronic trading desks at{' '}
            <span className="text-light">BNP Paribas</span> and{' '}
            <span className="text-light">Societe Generale</span>, a datacenter-to-AWS
            migration at Mediametrie, and QA practices built from scratch at startups where
            I was the first quality hire.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              data-testid={`about-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center py-5 rounded-xl border border-hairline/5 bg-dark-800/30 shadow-card"
            >
              <div className="text-2xl font-heading font-bold text-teal-400">{stat.value}</div>
              <div className="text-xs text-muted font-mono mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
