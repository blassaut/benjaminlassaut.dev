import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from '../AnimatedSection'
import SectionHeading from '../ui/SectionHeading'
import { primaryButton } from '../ui/primaryButton'
import { LINKEDIN_URL, GITHUB_URL, CONTACT_FORM_URL } from '../../data/links'

const links = [
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: 'in' },
  { label: 'GitHub', href: GITHUB_URL, icon: 'gh' },
]

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch(CONTACT_FORM_URL, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatedSection id="contact" className="py-28 px-6" data-testid="contact-section">
      <div className="max-w-xl mx-auto">
        <SectionHeading size="lg" centered>Get in Touch</SectionHeading>

        <p className="text-muted font-body mb-10 text-center">
          Open to interesting opportunities and conversations about QA and test automation.
        </p>

        <motion.form
          data-testid="contact-form"
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-xl border border-hairline/5 bg-surface-raised/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              data-testid="contact-input-name"
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full px-4 py-3 bg-surface/50 border border-hairline/5 rounded-lg text-content font-body text-sm placeholder:text-muted/50 focus:outline-none focus:border-teal-400/50 transition-colors"
            />
            <input
              data-testid="contact-input-email"
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 bg-surface/50 border border-hairline/5 rounded-lg text-content font-body text-sm placeholder:text-muted/50 focus:outline-none focus:border-teal-400/50 transition-colors"
            />
          </div>
          <textarea
            data-testid="contact-input-message"
            name="message"
            placeholder="Message"
            rows={4}
            required
            className="w-full px-4 py-3 bg-surface/50 border border-hairline/5 rounded-lg text-content font-body text-sm placeholder:text-muted/50 focus:outline-none focus:border-teal-400/50 transition-colors resize-none"
          />
          <button
            data-testid="contact-submit"
            type="submit"
            disabled={status === 'sending'}
            className={`w-full ${primaryButton()} disabled:opacity-50`}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'sent' && (
            <p data-testid="contact-status" className="text-teal-400 font-body text-sm text-center">Message sent! I'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p data-testid="contact-status" className="text-red-400 font-body text-sm text-center">Something went wrong. Try again or reach out on LinkedIn.</p>
          )}
        </motion.form>

        <div className="flex justify-center gap-4 mt-8">
          {links.map((link) => (
            <a
              key={link.label}
              data-testid={`contact-link-${link.label.toLowerCase()}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-muted border border-hairline/5 rounded-lg hover:text-teal-400 hover:border-teal-400/20 transition-colors"
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
