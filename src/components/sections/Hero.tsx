import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-heading font-bold"
        >
          Benjamin{' '}
          <span className="text-teal-400">Lassaut</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-xl text-muted font-body"
        >
          QA Lead · Web3 · Making Smart Contracts Safer
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex gap-4 justify-center"
        >
          <a
            href="#experience"
            className="px-6 py-3 bg-teal-400 text-dark-900 font-body font-semibold rounded-lg hover:bg-teal-500 transition-colors"
          >
            See my work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-teal-400 text-teal-400 font-body font-semibold rounded-lg hover:bg-teal-400/10 transition-colors"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  )
}
