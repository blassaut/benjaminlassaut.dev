import { useState, useEffect } from 'react'
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

function countTestRuns(raw: string): number {
  const lines = raw.split('\n')
  let runs = 0
  let currentTag: string | null = null
  let inOutline = false
  let outlineMultiplier = 3
  let seenExamplesHeader = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('@desktop')) currentTag = 'desktop'
    else if (trimmed.startsWith('@mobile')) currentTag = 'mobile'
    else if (/^Scenario Outline:/.test(trimmed)) {
      inOutline = true
      seenExamplesHeader = false
      outlineMultiplier = currentTag === 'desktop' ? 1 : currentTag === 'mobile' ? 2 : 3
      currentTag = null
    } else if (/^Scenario:/.test(trimmed)) {
      inOutline = false
      seenExamplesHeader = false
      runs += currentTag === 'desktop' ? 1 : currentTag === 'mobile' ? 2 : 3
      currentTag = null
    } else if (inOutline && trimmed.startsWith('Examples:')) {
      seenExamplesHeader = false // next pipe row is the header
    } else if (inOutline && trimmed.startsWith('|')) {
      if (!seenExamplesHeader) {
        seenExamplesHeader = true // this is the header row, skip it
      } else {
        runs += outlineMultiplier // data row = one scenario instance
      }
    }
  }
  return runs
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

function FeatureCard({ raw, index, defaultOpen = false }: { raw: string; index: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
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
          {name.includes('Who tests the tester') && (
            <span className="text-xs font-body italic text-teal-400/50 ml-3">
              psst - that's you right now
            </span>
          )}
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
  qaFeature,
  recruiterFeature,
  navigatesFeature,
  blogFeature,
  contactsFeature,
]

const REPO = 'https://github.com/blassaut/benjaminlassaut.dev'

const practices = [
  {
    label: 'data-testid',
    description: 'Every interactive element has a semantic test identifier, decoupling tests from CSS and DOM structure.',
    detail: 'nav-link-about, contact-input-email, experience-card-kiln...',
    icon: '{}',
    source: { label: 'Hero.tsx', href: `${REPO}/blob/main/src/components/sections/Hero.tsx` },
  },
  {
    label: 'BDD / Gherkin',
    description: 'Feature files written in plain English describe user journeys. Step definitions translate them to Playwright actions.',
    detail: 'Given I am on the homepage / Then I should see the hero section',
    icon: 'Gw',
    source: { label: 'e2e/features/', href: `${REPO}/tree/main/e2e/features` },
  },
  {
    label: 'Playwright',
    description: 'Cross-browser e2e tests run on Desktop Chrome, Mobile Safari, and Mobile Android on every push.',
    detail: `${features.reduce((sum, f) => sum + countScenarios(f), 0)} scenarios across 3 browser projects`,
    icon: 'Pw',
    source: { label: 'playwright.config.ts', href: `${REPO}/blob/main/playwright.config.ts` },
  },
  {
    label: 'CI / GitHub Actions',
    description: 'Build, type-check, and full e2e suite run automatically. Failures block the merge.',
    detail: 'bddgen && playwright test on every PR',
    icon: 'CI',
    source: { label: 'ci.yml', href: `${REPO}/blob/main/.github/workflows/ci.yml` },
  },
]

function useCIStatus() {
  const [status, setStatus] = useState<'passing' | 'failing' | 'loading'>('loading')

  useEffect(() => {
    fetch('https://github.com/blassaut/benjaminlassaut.dev/actions/workflows/ci.yml/badge.svg')
      .then((res) => res.text())
      .then((svg) => {
        if (svg.includes('passing')) setStatus('passing')
        else if (svg.includes('failing')) setStatus('failing')
        else setStatus('passing') // default if unknown
      })
      .catch(() => setStatus('passing'))
  }, [])

  return status
}


function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-2xl font-heading font-bold">{children}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
    </div>
  )
}

export default function QaLab() {
  const ciStatus = useCIStatus()

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
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://benjaminlassaut.dev/qa" />
        <meta property="og:image" content="https://benjaminlassaut.dev/og-image.png" />
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

        {/* Hero stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: features.reduce((sum, f) => sum + countScenarios(f), 0).toString(), label: 'Scenarios' },
              { value: features.reduce((sum, f) => sum + countTestRuns(f), 0).toString(), label: 'Test runs' },
              { value: '3', label: 'Browsers' },
              { value: '5', label: 'User journeys' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                className="text-center py-4 rounded-xl border border-white/5 bg-dark-800/20"
              >
                <div className="text-2xl font-heading font-bold text-teal-400">{stat.value}</div>
                <div className="text-[10px] text-muted/50 font-mono mt-1 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {['Desktop Chrome', 'Mobile Safari', 'Mobile Android'].map((browser) => (
              <span
                key={browser}
                className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-teal-400/60 border border-teal-400/10 rounded-full bg-teal-400/5"
              >
                {browser}
              </span>
            ))}
            <a
              data-testid="qa-status-badge"
              href="https://github.com/blassaut/benjaminlassaut.dev/actions"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest hover:opacity-80 transition-opacity ${
                ciStatus === 'passing'
                  ? 'text-emerald-400/60 border-emerald-400/10 bg-emerald-400/5'
                  : ciStatus === 'failing'
                    ? 'text-red-400/60 border-red-400/10 bg-red-400/5'
                    : 'text-muted/40 border-white/10 bg-white/5'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                ciStatus === 'passing' ? 'bg-emerald-400 animate-pulse' : ciStatus === 'failing' ? 'bg-red-400' : 'bg-muted/40'
              }`} />
              {ciStatus === 'loading' ? '...' : ciStatus}
            </a>
          </div>
        </motion.div>

        {/* Why this matters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="rounded-xl border border-white/5 bg-dark-800/20 p-6">
            <h3 className="text-sm font-heading font-semibold text-light mb-3">Why this matters</h3>
            <div className="space-y-3 text-sm text-muted font-body leading-relaxed">
              <p>
                BDD scenarios written in plain English make test intent readable by anyone, not just developers.
                You can open a feature file below and understand exactly what's being verified without reading
                any code.
              </p>
              <p>
                Using <span className="text-light/80 font-mono text-xs">data-testid</span> attributes
                instead of CSS selectors means tests don't break when the design changes.
                The suite validates <span className="text-light/80">behavior</span>, not implementation -
                so refactoring the UI never means rewriting tests.
              </p>
            </div>
          </div>
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
                  <p className="text-xs font-mono text-muted/50 leading-relaxed mb-3">
                    {p.detail}
                  </p>
                  <a
                    href={p.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted/40 hover:text-teal-400 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    {p.source.label}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
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
            Each file describes a user journey in Gherkin syntax.
          </p>

          <div className="space-y-1 rounded-xl border border-white/5 bg-dark-800/10 py-2 overflow-hidden">
            {features.map((raw, i) => (
              <FeatureCard key={i} raw={raw} index={i} defaultOpen={i === 0} />
            ))}
          </div>
        </motion.div>

        {/* Repo CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="https://github.com/blassaut/benjaminlassaut.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted/40 hover:text-teal-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Want to see the code? View the full repo.
          </a>
        </motion.div>
      </div>
    </div>
  )
}
