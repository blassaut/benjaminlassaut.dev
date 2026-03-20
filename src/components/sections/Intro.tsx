import { motion } from 'framer-motion'

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Radial gradient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(ellipse, #14b8a6 0%, transparent 70%)',
        }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#14b8a6 1px, transparent 1px), linear-gradient(90deg, #14b8a6 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Breathing glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, #14b8a6 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function FloatingTag({ text, x, y, delay }: { text: string; x: string; y: string; delay: number }) {
  return (
    <motion.span
      className="absolute hidden md:block px-3 py-1 text-xs font-mono text-teal-400/40 border border-teal-400/10 rounded bg-dark-900/50 backdrop-blur-sm select-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 1, delay },
        y: { duration: 4, repeat: Infinity, delay: delay + 1, ease: 'easeInOut' },
      }}
    >
      {text}
    </motion.span>
  )
}

export default function Intro() {
  return (
    <section data-testid="intro-section" className="relative min-h-screen flex items-center justify-center px-6">
      <GridBackground />

      <div className="relative z-10 max-w-4xl text-center">
        {/* Headshot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img
            src="/headshot-optimized.webp"
            alt="Benjamin Lassaut - QA Lead specializing in web3 testing"
            width={128}
            height={128}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full mx-auto object-cover ring-2 ring-teal-400/30 ring-offset-2 ring-offset-[#0a0a0f]"
          />
        </motion.div>

        {/* Role label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono tracking-widest uppercase text-teal-400 border border-teal-400/20 rounded-full bg-teal-400/5">
            QA Lead &middot; Web3
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-8xl font-heading font-bold tracking-tight leading-none"
        >
          Benjamin
          <br />
          <span className="text-teal-400">Lassaut</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-lg md:text-xl text-muted font-body max-w-lg mx-auto"
        >
          I design systems that catch bugs before users ever see them.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex gap-4 justify-center"
        >
          <a
            data-testid="hero-cta-work"
            href="#experience"
            className="group relative px-7 py-3 bg-teal-400 text-dark-900 font-body font-semibold rounded-lg overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]"
          >
            <span className="relative z-10">See my work</span>
          </a>
          <a
            data-testid="hero-cta-contact"
            href="#contact"
            className="px-7 py-3 border border-teal-400/30 text-teal-400 font-body font-semibold rounded-lg hover:border-teal-400 hover:bg-teal-400/5 transition-all"
          >
            Get in touch
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-[-80px]"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 border-2 border-white/10 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-teal-400/50 rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating ambient tags */}
      <FloatingTag text="Cypress" x="8%" y="25%" delay={1} />
      <FloatingTag text="20+ Chains" x="85%" y="30%" delay={1.4} />
      <FloatingTag text="Smart Contracts" x="5%" y="70%" delay={1.8} />
      <FloatingTag text="Foundry" x="88%" y="65%" delay={2.2} />
    </section>
  )
}
