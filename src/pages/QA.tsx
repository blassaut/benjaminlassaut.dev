import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1 rounded-md bg-dark-800 border border-white/10 text-[10px] font-mono text-light/70 whitespace-nowrap pointer-events-none z-10"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

import { countScenarios, countTestRuns } from '../lib/gherkin'
import { SectionHeading } from '../components/qa/SectionHeading'
import { FeatureCard } from '../components/qa/FeatureCard'
import { PracticeCard } from '../components/qa/PracticeCard'
import { StatGrid } from '../components/qa/StatGrid'
import { web3Features, web3Practices, web3Stats } from '../data/web3-features'

import recruiterFeature from '../../e2e/features/recruiter-visits-portfolio.feature?raw'
import navigatesFeature from '../../e2e/features/visitor-navigates-site.feature?raw'
import blogFeature from '../../e2e/features/reader-browses-blog.feature?raw'
import contactsFeature from '../../e2e/features/visitor-contacts-benjamin.feature?raw'
import qaFeature from '../../e2e/features/visitor-explores-qa.feature?raw'
import bugEasterEggFeature from '../../e2e/features/visitor-finds-bug-easter-egg.feature?raw'

const features = [
  qaFeature,
  recruiterFeature,
  navigatesFeature,
  blogFeature,
  contactsFeature,
  bugEasterEggFeature,
]

const REPO = 'https://github.com/blassaut/benjaminlassaut.dev'

const practices = [
  {
    label: 'data-testid',
    description:
      'Every interactive element is testable by design - semantic identifiers decouple tests from UI structure.',
    detail: 'nav-link-about, contact-input-email, experience-card-kiln...',
    icon: '{}',
    source: { label: 'Intro.tsx', href: `${REPO}/blob/main/src/components/sections/Intro.tsx` },
  },
  {
    label: 'BDD / Gherkin',
    description:
      'Feature files written in plain English describe user journeys. Step definitions translate them to Playwright actions.',
    detail: 'Given I am on the homepage / Then I should see the hero section',
    icon: 'Gw',
    source: { label: 'e2e/features/', href: `${REPO}/tree/main/e2e/features` },
  },
  {
    label: 'Playwright',
    description:
      'Cross-browser e2e tests run on Chrome, Mobile Safari, and Mobile Chrome on every push.',
    detail: `${features.reduce((sum, f) => sum + countScenarios(f), 0)} scenarios across 3 browser projects`,
    icon: 'Pw',
    source: { label: 'playwright.config.ts', href: `${REPO}/blob/main/playwright.config.ts` },
  },
  {
    label: 'CI / GitHub Actions',
    description:
      'Build, type-check, and full e2e suite run automatically. Failures block the merge.',
    detail: 'bddgen && playwright test on every PR',
    icon: 'CI',
    source: { label: 'ci.yml', href: `${REPO}/blob/main/.github/workflows/ci.yml` },
  },
]

const stats = [
  { value: features.length.toString(), label: 'User journeys' },
  {
    value: features.reduce((sum, f) => sum + countScenarios(f), 0).toString(),
    label: 'Scenarios',
  },
  {
    value: features.reduce((sum, f) => sum + countTestRuns(f), 0).toString(),
    label: 'Tests',
  },
  { value: '3', label: 'Browsers' },
]

function useCIStatus(badgeUrl: string) {
  const [status, setStatus] = useState<'passing' | 'failing' | 'loading'>('loading')

  useEffect(() => {
    fetch(badgeUrl)
      .then((res) => res.text())
      .then((svg) => {
        if (svg.includes('passing')) setStatus('passing')
        else if (svg.includes('failing')) setStatus('failing')
        else setStatus('passing')
      })
      .catch(() => setStatus('passing'))
  }, [badgeUrl])

  return status
}

export default function QaLab() {
  const ciStatus = useCIStatus('https://github.com/blassaut/benjaminlassaut.dev/actions/workflows/ci.yml/badge.svg')
  const dappCIStatus = useCIStatus('https://github.com/blassaut/dapp-demo/actions/workflows/ci.yml/badge.svg')
  const navigate = useNavigate()

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
          className="mb-8 max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-5 leading-[1.1]">
            Who tests the
            <br />
            <span className="text-teal-400">tester</span>?
          </h1>
          <p className="text-muted font-body text-lg leading-relaxed">
            Instead of telling you I'm good at testing, this page proves it. Everything here is
            automatically verified - the same way I'd set things up on your product.
          </p>
        </motion.div>

        {/* Section 1: How this is tested */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-10"
        >
          <SectionHeading>How this is tested</SectionHeading>
          <p className="text-muted font-body leading-relaxed -mt-4 mb-10">
            Tested the same way I'd test your product - every interaction, every state, every edge case.{' '}
            <Tooltip label="CI: GitHub Actions">
              <a
                data-testid="qa-status-badge"
                href="https://github.com/blassaut/benjaminlassaut.dev/actions"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-widest hover:opacity-80 transition-opacity align-baseline ${
                  ciStatus === 'passing'
                    ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10'
                    : ciStatus === 'failing'
                      ? 'text-red-400 border-red-400/20 bg-red-400/10'
                      : 'text-muted/40 border-white/10 bg-white/5'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    ciStatus === 'passing'
                      ? 'bg-emerald-400 animate-pulse'
                      : ciStatus === 'failing'
                        ? 'bg-red-400'
                        : 'bg-muted/40'
                  }`}
                />
                {ciStatus === 'loading' ? '...' : ciStatus}
              </a>
            </Tooltip>
          </p>
        </motion.div>

        {/* Section 1 stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <StatGrid stats={stats} testIdPrefix="qa" animate baseDelay={0.15} />
        </motion.div>

        {/* QA Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <SectionHeading>How it works</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {practices.map((p, i) => (
              <PracticeCard key={p.label} practice={p} index={i} />
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
            Each file describes a user journey in Gherkin syntax. Tap one to expand.
          </p>

          <div className="space-y-1 rounded-xl border border-white/5 bg-dark-800/10 py-2 overflow-hidden">
            {features.map((raw, i) => (
              <FeatureCard key={i} raw={raw} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Repo link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center pb-4 mb-0"
        >
          <a
            href="https://github.com/blassaut/benjaminlassaut.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono text-light/40 hover:text-teal-400 hover:underline transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Explore the test suite
          </a>
        </motion.div>

        {/* Section divider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 mb-12 pt-16 max-w-2xl"
        >
          <hr className="border-white/5 mb-16" />
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-5 leading-[1.1]">
            From UI to<br />
            <span className="text-teal-400">on-chain</span> systems
          </h2>
          <p className="text-muted font-body text-lg leading-relaxed">
            In web3, bugs don't just break UX - they lose money.
            Real deposits, real withdrawals, real wallet interactions.
          </p>
        </motion.div>

        {/* Section 2: Web3 demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <SectionHeading>LockBox - on-chain deposit &amp; withdraw</SectionHeading>
          <p className="text-muted font-body leading-relaxed -mt-4 mb-6">
            A real dApp, tested the same way as production systems.{' '}
            <Tooltip label="CI: GitHub Actions">
              <a
                data-testid="dapp-status-badge"
                href="https://github.com/blassaut/dapp-demo/actions"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-widest hover:opacity-80 transition-opacity align-baseline ${
                  dappCIStatus === 'passing'
                    ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10'
                    : dappCIStatus === 'failing'
                      ? 'text-red-400 border-red-400/20 bg-red-400/10'
                      : 'text-muted/40 border-white/10 bg-white/5'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    dappCIStatus === 'passing'
                      ? 'bg-emerald-400 animate-pulse'
                      : dappCIStatus === 'failing'
                        ? 'bg-red-400'
                        : 'bg-muted/40'
                  }`}
                />
                {dappCIStatus === 'loading' ? '...' : dappCIStatus}
              </a>
            </Tooltip>
          </p>
        </motion.div>

        {/* Live demo iframe */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <iframe
              src="https://lockbox.benjaminlassaut.dev"
              title="LockBox demo"
              className="w-full h-[750px] bg-dark-900"
              style={{ overflow: 'hidden' }}
              sandbox="allow-scripts allow-same-origin allow-popups"
              allow="clipboard-write"
            />
          </div>
          <p className="text-[10px] font-mono text-muted/30 text-center mt-3">
            Live demo on Hoodi testnet. Connect MetaMask to interact.
          </p>
        </motion.div>

        {/* Web3 "How this is tested" */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <SectionHeading>How this is tested</SectionHeading>
          <p className="text-muted font-body leading-relaxed -mt-4 mb-10">
            Real transactions on a local Hardhat node - every deposit, withdrawal, and rejection verified end-to-end.
          </p>
        </motion.div>

        {/* Web3 stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <StatGrid stats={web3Stats} testIdPrefix="web3" />
          <p className="text-[10px] font-mono text-muted/30 text-center mt-3">
            Deterministic test environment. No flaky RPC or network dependency.
          </p>
        </motion.div>

        {/* Web3 Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <SectionHeading>How it works</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {web3Practices.map((p, i) => (
              <PracticeCard key={p.label} practice={p} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Web3 Feature Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <SectionHeading>Feature files</SectionHeading>
          <p className="text-sm text-muted font-body mb-6 -mt-4">
            Each file describes a user journey in Gherkin syntax. Tap one to expand.
          </p>

          <div className="space-y-1 rounded-xl border border-white/5 bg-dark-800/10 py-2 overflow-hidden">
            {web3Features.map((raw, i) => (
              <FeatureCard
                key={i}
                raw={raw}
                index={i}
                testIdPrefix="web3"
                hook={
                  {
                    2: 'recovery without reload',
                    3: 'full round-trip flow',
                  }[i]
                }
              />
            ))}
          </div>
        </motion.div>

        {/* Web3 CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <a
            href="https://github.com/blassaut/dapp-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono text-light/60 hover:text-teal-400 hover:underline transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Explore the test suite
          </a>
        </motion.div>

        {/* Page-level CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pt-16 pb-10"
        >
          <p className="text-lg text-muted font-body mb-6">
            If your system needs this level of confidence, let's talk.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
              setTimeout(() => {
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
            className="inline-block px-7 py-3 bg-teal-400 text-dark-900 font-body font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </div>
  )
}
