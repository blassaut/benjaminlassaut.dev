import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'

import recruiterFeature from '../../e2e/features/recruiter-visits-portfolio.feature?raw'
import navigatesFeature from '../../e2e/features/visitor-navigates-site.feature?raw'
import blogFeature from '../../e2e/features/reader-browses-blog.feature?raw'
import contactsFeature from '../../e2e/features/visitor-contacts-benjamin.feature?raw'
import qaFeature from '../../e2e/features/visitor-explores-qa.feature?raw'

const GHERKIN_KEYWORDS = [
  'Feature:',
  'Scenario Outline:',
  'Scenario:',
  'Background:',
  'Examples:',
  'Given',
  'When',
  'Then',
  'And',
  'But',
  'As a',
  'I want',
  'So that',
  '@desktop',
  '@mobile',
]

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function extractFeatureName(raw: string): string {
  const firstLine = raw.split('\n')[0]
  return firstLine.replace(/^Feature:\s*/, '').trim()
}

function GherkinLine({ line }: { line: string }) {
  const trimmed = line.trimStart()
  const indent = line.length - trimmed.length

  for (const kw of GHERKIN_KEYWORDS) {
    if (trimmed.startsWith(kw)) {
      const rest = trimmed.slice(kw.length)
      return (
        <span className="block">
          {indent > 0 && <span>{' '.repeat(indent)}</span>}
          <span style={{ color: '#14b8a6' }} className="font-semibold">{kw}</span>
          <span className="text-[#f0f0f0]">{rest}</span>
        </span>
      )
    }
  }

  return (
    <span className="block">
      <span className="text-[#6b7280]">{line}</span>
    </span>
  )
}

function FeatureCard({ raw, index }: { raw: string; index: number }) {
  const [open, setOpen] = useState(false)
  const name = extractFeatureName(raw)
  const testid = `qa-feature-${slugify(name)}`

  return (
    <motion.div
      data-testid={testid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-white/5 bg-dark-800/30 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-teal-400 font-mono text-xs uppercase tracking-widest opacity-60">
            feature
          </span>
          <span className="font-heading font-semibold text-light group-hover:text-teal-400 transition-colors">
            {name}
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted text-sm ml-4 shrink-0"
        >
          ▾
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
            <div className="px-6 pb-6 pt-2 border-t border-white/5">
              <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                {raw.split('\n').map((line, i) => (
                  <GherkinLine key={i} line={line} />
                ))}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const features = [
  recruiterFeature,
  navigatesFeature,
  blogFeature,
  contactsFeature,
  qaFeature,
]

export default function QaLab() {
  return (
    <div data-testid="qa" className="pt-24 pb-16 px-6">
      <Helmet>
        <title>Who tests the tester? - Benjamin Lassaut</title>
        <meta
          name="description"
          content="This portfolio tests itself. BDD scenarios written in Gherkin describe expected behavior and run on every push via Playwright and GitHub Actions CI."
        />
        <link rel="canonical" href="https://benjaminlassaut.dev/qa" />
        <meta property="og:title" content="Who tests the tester? - Benjamin Lassaut" />
        <meta
          property="og:description"
          content="This portfolio tests itself. BDD scenarios written in Gherkin describe expected behavior and run on every push via Playwright and GitHub Actions CI."
        />
        <meta property="og:url" content="https://benjaminlassaut.dev/qa" />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-heading font-bold mb-4">
            Who tests the tester?
          </h1>
          <p className="text-muted font-body text-lg leading-relaxed">
            This site tests itself. The BDD scenarios below describe expected behavior of this very
            portfolio - and they run on every push.
          </p>
        </motion.div>

        {/* CI Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <a
            data-testid="qa-status-badge"
            href="https://github.com/blassaut/benjaminlassaut.dev/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-white/5 bg-dark-800/30 hover:border-teal-400/30 transition-colors"
          >
            <img
              src="https://github.com/blassaut/benjaminlassaut.dev/actions/workflows/ci.yml/badge.svg"
              alt="CI status"
              className="h-5"
            />
            <span className="text-sm text-muted font-body">View CI runs on GitHub Actions</span>
          </a>
        </motion.div>

        {/* Feature Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-heading font-bold">Feature Files</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
          </div>
        </motion.div>

        <div className="space-y-3 mb-12">
          {features.map((raw, i) => (
            <FeatureCard key={i} raw={raw} index={i} />
          ))}
        </div>

        {/* Playwright Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-heading font-bold">Test Results</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
          </div>
          <p className="text-sm text-muted font-body mb-4">
            Interactive Playwright HTML report - browse test runs, traces, and screenshots.
          </p>
          <div className="rounded-xl border border-white/5 overflow-hidden bg-dark-800/30">
            <iframe
              src="/playwright-report/index.html"
              title="Playwright Test Report"
              className="w-full"
              style={{ height: '700px', border: 'none' }}
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Meta callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-teal-400/20 bg-teal-400/5 rounded-xl px-6 py-5"
        >
          <p className="text-sm font-body text-muted">
            <span className="text-teal-400 font-mono font-semibold">meta:</span>{' '}
            Yes, this page is also tested. See{' '}
            <span className="font-mono text-teal-400/80">visitor-explores-qa.feature</span>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
