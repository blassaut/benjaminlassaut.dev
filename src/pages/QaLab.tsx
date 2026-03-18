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
]

const GHERKIN_META = ['As a', 'I want', 'So that']
const GHERKIN_TAGS = ['@desktop', '@mobile']

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function extractFeatureName(raw: string): string {
  const firstLine = raw.split('\n')[0]
  return firstLine.replace(/^Feature:\s*/, '').trim()
}

function countScenarios(raw: string): number {
  return (raw.match(/^\s*Scenario(?: Outline)?:/gm) || []).length
}

function GherkinLine({ line }: { line: string }) {
  const trimmed = line.trimStart()
  const indent = line.length - trimmed.length

  for (const tag of GHERKIN_TAGS) {
    if (trimmed.startsWith(tag)) {
      return (
        <span className="block">
          {indent > 0 && <span>{' '.repeat(indent)}</span>}
          <span className="text-amber-400/80 font-semibold">{tag}</span>
          <span className="text-light/60">{trimmed.slice(tag.length)}</span>
        </span>
      )
    }
  }

  for (const kw of GHERKIN_KEYWORDS) {
    if (trimmed.startsWith(kw)) {
      const rest = trimmed.slice(kw.length)
      return (
        <span className="block">
          {indent > 0 && <span>{' '.repeat(indent)}</span>}
          <span className="text-teal-400 font-semibold">{kw}</span>
          <span className="text-light/90">{rest}</span>
        </span>
      )
    }
  }

  for (const meta of GHERKIN_META) {
    if (trimmed.startsWith(meta)) {
      return (
        <span className="block">
          {indent > 0 && <span>{' '.repeat(indent)}</span>}
          <span className="text-teal-400/50 italic">{trimmed}</span>
        </span>
      )
    }
  }

  // Table rows (pipes)
  if (trimmed.startsWith('|')) {
    return (
      <span className="block">
        {indent > 0 && <span>{' '.repeat(indent)}</span>}
        <span className="text-light/40">{trimmed}</span>
      </span>
    )
  }

  // Empty or comment lines
  if (!trimmed || trimmed.startsWith('#')) {
    return (
      <span className="block text-white/10">{line || ' '}</span>
    )
  }

  return (
    <span className="block">
      <span className="text-muted/60">{line}</span>
    </span>
  )
}

function FeatureCard({ raw, index }: { raw: string; index: number }) {
  const [open, setOpen] = useState(false)
  const name = extractFeatureName(raw)
  const testid = `qa-feature-${slugify(name)}`
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
      {/* Left accent line */}
      <div className={`absolute left-0 top-0 bottom-0 w-px transition-colors duration-300 ${open ? 'bg-teal-400' : 'bg-white/10 group-hover:bg-teal-400/40'}`} />

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
          </span>
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

const features = [
  recruiterFeature,
  navigatesFeature,
  blogFeature,
  contactsFeature,
  qaFeature,
]

const practices = [
  {
    label: 'data-testid',
    description: 'Every interactive element has a semantic test identifier, decoupling tests from CSS and DOM structure.',
    detail: 'nav-link-about, contact-input-email, experience-card-kiln...',
    icon: '{}',
  },
  {
    label: 'BDD / Gherkin',
    description: 'Feature files written in plain English describe user journeys. Step definitions translate them to Playwright actions.',
    detail: 'Given I am on the homepage / Then I should see the hero section',
    icon: 'Gw',
  },
  {
    label: 'Playwright',
    description: 'Cross-browser e2e tests run on Desktop Chrome, Mobile Safari, and Mobile Android on every push.',
    detail: '64 scenarios across 3 browser projects',
    icon: 'Pw',
  },
  {
    label: 'CI / GitHub Actions',
    description: 'Build, type-check, and full e2e suite run automatically. Failures block the merge.',
    detail: 'bddgen && playwright test on every PR',
    icon: 'CI',
  },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-2xl font-heading font-bold">{children}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
    </div>
  )
}

export default function QaLab() {
  return (
    <div data-testid="qa" className="pt-24 pb-20 px-6">
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

      <div className="max-w-4xl mx-auto">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 max-w-2xl"
        >
          <div className="mb-5">
            <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-teal-400 border border-teal-400/20 rounded-full bg-teal-400/5">
              QA Engineering
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-5 leading-[1.1]">
            Who tests the<br />
            <span className="text-teal-400">tester</span>?
          </h1>
          <p className="text-muted font-body text-lg leading-relaxed">
            This portfolio is its own test subject. Every page, every interaction, every section
            is described in BDD scenarios that run automatically on every push.
          </p>
        </motion.div>

        {/* QA Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <SectionHeading>How it's built</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {practices.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative p-5 rounded-xl border border-white/5 bg-dark-800/20 hover:border-teal-400/15 transition-colors group overflow-hidden"
              >
                {/* Background icon */}
                <span className="absolute -right-2 -bottom-3 text-[64px] font-mono font-black text-white/[0.02] select-none leading-none group-hover:text-teal-400/[0.04] transition-colors">
                  {p.icon}
                </span>

                <div className="relative">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase text-teal-400 border border-teal-400/20 rounded bg-teal-400/5 mb-3">
                    {p.label}
                  </span>
                  <p className="text-sm text-light/80 font-body leading-relaxed mb-2">
                    {p.description}
                  </p>
                  <p className="text-xs font-mono text-muted/50 leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CI Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mb-20"
        >
          <SectionHeading>Pipeline status</SectionHeading>
          <a
            data-testid="qa-status-badge"
            href="https://github.com/blassaut/benjaminlassaut.dev/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-5 py-3.5 rounded-xl border border-white/5 bg-dark-800/20 hover:border-teal-400/20 transition-all group"
          >
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wide">passing</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-light font-body group-hover:text-teal-400 transition-colors">
                GitHub Actions CI
              </span>
              <span className="text-xs text-muted/50 font-mono">
                build + e2e on every push
              </span>
            </div>
            <svg className="w-4 h-4 text-muted/30 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>

        {/* Feature Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <SectionHeading>Feature files</SectionHeading>
          <p className="text-sm text-muted font-body mb-6 -mt-4">
            Each file describes a user journey in Gherkin syntax. Click to expand.
          </p>

          <div className="space-y-1 rounded-xl border border-white/5 bg-dark-800/10 py-2 overflow-hidden">
            {features.map((raw, i) => (
              <FeatureCard key={i} raw={raw} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Playwright Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionHeading>Test report</SectionHeading>
          <a
            href="/playwright-report/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 p-5 rounded-xl border border-white/5 bg-dark-800/20 hover:border-teal-400/20 transition-all group"
          >
            <div className="shrink-0 w-12 h-12 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-heading font-semibold text-light group-hover:text-teal-400 transition-colors">
                Playwright HTML Report
              </span>
              <span className="block text-xs text-muted/60 font-body mt-0.5">
                Interactive report with test runs, traces, and screenshots. Opens in a new tab.
              </span>
            </div>
            <svg className="w-4 h-4 text-muted/30 shrink-0 group-hover:text-teal-400/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>

        {/* Meta callout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-mono text-muted/40">
            Yes, this page is also tested.{' '}
            <span className="text-teal-400/40">visitor-explores-qa.feature</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
