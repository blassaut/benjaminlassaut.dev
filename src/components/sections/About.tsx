import { motion } from 'framer-motion'
import AnimatedSection from '../AnimatedSection'

const stats = [
  { value: '10+', label: 'Years in QA' },
  { value: '20+', label: 'Blockchain Networks' },
  { value: '5', label: 'Industries' },
]

export default function About() {
  return (
    <AnimatedSection id="about" className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-3xl font-heading font-bold">About</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
        </div>

        <div className="space-y-6 text-muted font-body text-base leading-relaxed">
          <p>
            I'm a QA engineer who believes quality is about more than finding bugs - it's about
            building confidence in every release. Over the past decade I've worked across{' '}
            <span className="text-light">fintech</span>,{' '}
            <span className="text-light">capital markets</span>,{' '}
            <span className="text-light">AI</span>, and{' '}
            <span className="text-light">blockchain</span>, always focused on the same thing:
            making sure the software people depend on actually works.
          </p>
          <p>
            At <span className="text-teal-400">Kiln</span>, I lead QA across staking
            infrastructure, DeFi vaults, and smart contracts deployed on 20+ chains. I built the
            test architecture from scratch - BDD feature files, cross-chain transaction flows,
            Fireblocks signing pipelines - and turned it into a framework the whole team relies on.
          </p>
          <p>
            Before web3, I cut my teeth on electronic trading desks at{' '}
            <span className="text-light">BNP Paribas</span> and{' '}
            <span className="text-light">Société Générale</span>, migrated datacenters to AWS,
            and scaled QA practices at startups where I was the first quality hire. I like
            building things from zero.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center py-5 rounded-xl border border-white/5 bg-dark-800/30"
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
