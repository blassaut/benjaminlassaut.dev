import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '../AnimatedSection'
import { testimonials } from '../../data/testimonials'

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function Testimonials() {
  return (
    <AnimatedSection id="testimonials" className="py-28 px-6" data-testid="testimonials-section">
      <div className="max-w-3xl mx-auto">
        {/* Section header - matches Skills/Experience pattern */}
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-3xl font-heading font-bold">Testimonials</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
        </div>

        <div className="space-y-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number]
  index: number
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      data-testid={`testimonial-card-${slugify(testimonial.author)}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border border-white/5 bg-dark-800/30 p-6 hover:border-teal-400/20 transition-colors"
    >
      {/* Decorative quote icon */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-teal-400/20 mb-4"
        aria-hidden="true"
      >
        <path d="M11.3 2.5c-1.6.8-2.9 1.7-3.8 2.8C6.5 6.4 6 7.7 6 9.2c0 .6.1 1 .3 1.3.2.3.5.4.9.4.8 0 1.5.3 2 .8s.8 1.2.8 2c0 .9-.3 1.6-.8 2.1s-1.2.8-2 .8c-1.1 0-2-.4-2.7-1.3C3.8 14.4 3.5 13.2 3.5 11.7c0-2.2.7-4.1 2-5.8 1.4-1.7 3.2-3 5.5-3.9l.3.5zm9 0c-1.6.8-2.9 1.7-3.8 2.8-1 1.1-1.5 2.4-1.5 3.9 0 .6.1 1 .3 1.3.2.3.5.4.9.4.8 0 1.5.3 2 .8s.8 1.2.8 2c0 .9-.3 1.6-.8 2.1s-1.2.8-2 .8c-1.1 0-2-.4-2.7-1.3-.7-.9-1-2.1-1-3.6 0-2.2.7-4.1 2-5.8 1.4-1.7 3.2-3 5.5-3.9l.3.5z" />
      </svg>

      {/* Quote text */}
      <motion.blockquote layout className="text-light/90 font-body leading-relaxed">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={expanded ? 'full' : 'excerpt'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {expanded
              ? testimonial.fullText.split('\n\n').map((paragraph, i) => (
                  <p key={i} className={i > 0 ? 'mt-3' : ''}>
                    {paragraph}
                  </p>
                ))
              : <p>{testimonial.excerpt}</p>
            }
          </motion.div>
        </AnimatePresence>
      </motion.blockquote>

      {/* Read more / Read less toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="mt-3 text-sm text-teal-400 hover:text-teal-300 transition-colors font-mono cursor-pointer"
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>

      {/* Attribution row */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-light font-semibold text-sm">{testimonial.author}</p>
          <p className="text-muted text-xs">
            {testimonial.role} @ {testimonial.company} · {testimonial.date}
          </p>
        </div>
        <a
          href={testimonial.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View original recommendation on LinkedIn"
          className="text-muted hover:text-teal-400 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </div>
    </motion.div>
  )
}
