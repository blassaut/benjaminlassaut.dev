import { motion } from 'framer-motion'
import { countScenarios, countTestRuns, extractFeatureName } from '../lib/gherkin'
import { useHashNavigation } from '../hooks/useHashNavigation'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import { primaryButton } from '../components/ui/primaryButton'
import { FeatureCard } from '../components/qa/FeatureCard'
import { PracticeCard } from '../components/qa/PracticeCard'
import { StatGrid } from '../components/qa/StatGrid'
import { CIStatusBadge } from '../components/qa/CIStatusBadge'
import GitHubIcon from '../components/ui/GitHubIcon'
import { siteFeatures as features } from '../data/qa-features'
import { browserProjects, projectsPerForm } from '../../e2e/browsers'
import { web3Features, web3FeatureHooks, web3Practices, web3Stats } from '../data/web3-features'
import { REPO_URL as REPO, LOCKBOX_REPO_URL, LOCKBOX_DEMO_URL } from '../data/links'

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
      `Cross-browser e2e tests run on ${new Intl.ListFormat('en').format(browserProjects.map((p) => p.label))} on every push.`,
    detail: `${features.reduce((sum, f) => sum + countScenarios(f), 0)} scenarios across ${browserProjects.length} browser projects`,
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
    value: features.reduce((sum, f) => sum + countTestRuns(f, projectsPerForm), 0).toString(),
    label: 'Tests',
  },
  { value: browserProjects.length.toString(), label: 'Browsers' },
]

export default function QaLab() {
  const navigateToHash = useHashNavigation()

  return (
    <div data-testid="qa" className="pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero header */}
        <Reveal immediate className="mb-8 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-5 leading-[1.1]">
            Who tests the
            <br />
            <span className="text-teal-400">tester</span>?
          </h1>
          <p className="text-muted font-body text-lg leading-relaxed">
            Everything on this page is automatically verified - the same way I'd set things up
            on your product.
          </p>
        </Reveal>

        {/* Section 1: How this is tested */}
        <Reveal immediate y={16} delay={0.08} className="mb-10">
          <SectionHeading>How this is tested</SectionHeading>
          <p className="text-muted font-body leading-relaxed -mt-4 mb-10">
            BDD scenarios, Playwright, CI on every push.{' '}
            <CIStatusBadge repoUrl={REPO} testId="qa-status-badge" />
          </p>
        </Reveal>

        {/* Section 1 stat bar */}
        <Reveal immediate y={16} delay={0.1} className="mb-10">
          <StatGrid stats={stats} testIdPrefix="qa" animate baseDelay={0.15} />
        </Reveal>

        {/* QA Practices */}
        <Reveal immediate delay={0.1} className="mb-20">
          <SectionHeading>How it works</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {practices.map((p, i) => (
              <PracticeCard key={p.label} practice={p} index={i} />
            ))}
          </div>
        </Reveal>

        {/* Feature Files */}
        <Reveal className="mb-20">
          <SectionHeading>Feature files</SectionHeading>
          <p className="text-sm text-muted font-body mb-6 -mt-4">
            Each file describes a user journey in Gherkin syntax. Tap one to expand.
          </p>

          <div className="space-y-1 rounded-xl border border-hairline/5 bg-surface-raised/10 py-2 overflow-hidden">
            {features.map((raw, i) => (
              <FeatureCard key={i} raw={raw} index={i} />
            ))}
          </div>
        </Reveal>

        {/* Repo link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center pb-4 mb-0"
        >
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono text-content/40 hover:text-teal-400 hover:underline transition-colors"
          >
            <GitHubIcon />
            Explore the test suite
          </a>
        </motion.div>

        {/* Section divider */}
        <Reveal className="mt-20 mb-12 pt-16 max-w-2xl">
          <hr className="border-hairline/5 mb-16" />
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-5 leading-[1.1]">
            From UI to<br />
            <span className="text-teal-400">on-chain</span> systems
          </h2>
          <p className="text-muted font-body text-lg leading-relaxed">
            Same approach, applied to a smart contract.
          </p>
        </Reveal>

        {/* Section 2: Web3 demo */}
        <Reveal className="mb-8">
          <SectionHeading>LockBox - on-chain deposit &amp; withdraw</SectionHeading>
          <p className="text-muted font-body leading-relaxed -mt-4 mb-6">
            A demo dApp built to showcase production-grade testing.{' '}
            <CIStatusBadge repoUrl={LOCKBOX_REPO_URL} testId="dapp-status-badge" />
          </p>
        </Reveal>

        {/* Live demo iframe (desktop) / link (mobile) */}
        <Reveal y={16} className="mb-12">
          {/* Desktop: embedded iframe */}
          <div className="hidden sm:block rounded-xl border border-hairline/10 overflow-hidden">
            <iframe
              src={LOCKBOX_DEMO_URL}
              title="LockBox demo"
              className="w-full h-[750px] bg-surface"
              style={{ overflow: 'hidden' }}
              sandbox="allow-scripts allow-same-origin allow-popups"
              allow="clipboard-write"
            />
          </div>
          <p className="hidden sm:block text-[10px] font-mono text-muted/30 text-center mt-3">
            Live demo on Hoodi testnet. Connect MetaMask to interact.
          </p>
          {/* Mobile: link to demo */}
          <div className="sm:hidden rounded-xl border border-hairline/10 bg-surface-raised/20 py-8 px-6 text-center">
            <p className="text-content/60 font-heading font-semibold text-sm mb-2">Live on Hoodi testnet</p>
            <p className="text-muted/40 font-mono text-xs mb-5">
              Connect MetaMask to deposit &amp; withdraw ETH
            </p>
            <a
              href={LOCKBOX_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block ${primaryButton('sm')}`}
            >
              Open the demo
            </a>
          </div>
        </Reveal>

        {/* Web3 "How this is tested" */}
        <Reveal y={16} className="mb-10">
          <SectionHeading>How this is tested</SectionHeading>
          <p className="text-muted font-body leading-relaxed -mt-4 mb-10">
            Dappwright + Playwright on a local Hardhat node. No mocked wallet interactions.
          </p>
        </Reveal>

        {/* Web3 stat bar */}
        <Reveal y={16} className="mb-10">
          <StatGrid stats={web3Stats} testIdPrefix="web3" />
          <p className="text-[10px] font-mono text-muted/30 text-center mt-3">
            Deterministic test environment. No flaky RPC or network dependency.
          </p>
        </Reveal>

        {/* Web3 Practices */}
        <Reveal className="mb-20">
          <SectionHeading>How it works</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {web3Practices.map((p, i) => (
              <PracticeCard key={p.label} practice={p} index={i} />
            ))}
          </div>
        </Reveal>

        {/* Web3 Feature Files */}
        <Reveal className="mb-20">
          <SectionHeading>Feature files</SectionHeading>
          <p className="text-sm text-muted font-body mb-6 -mt-4">
            Each file describes a user journey in Gherkin syntax. Tap one to expand.
          </p>

          <div className="space-y-1 rounded-xl border border-hairline/5 bg-surface-raised/10 py-2 overflow-hidden">
            {web3Features.map((raw, i) => (
              <FeatureCard
                key={i}
                raw={raw}
                index={i}
                testIdPrefix="web3"
                hook={web3FeatureHooks[extractFeatureName(raw)]}
              />
            ))}
          </div>
        </Reveal>

        {/* Web3 CTAs */}
        <Reveal y={12} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href={LOCKBOX_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono text-content/60 hover:text-teal-400 hover:underline transition-colors"
          >
            <GitHubIcon />
            Explore the test suite
          </a>
        </Reveal>

        {/* Page-level CTA */}
        <Reveal y={16} className="text-center pt-16 pb-10">
          <p className="text-lg text-muted font-body mb-6">
            Want this on your product?
          </p>
          <a
            href="#contact"
            onClick={(e) => navigateToHash(e, '#contact')}
            className={`inline-block ${primaryButton()}`}
          >
            Get in touch
          </a>
        </Reveal>
      </div>
    </div>
  )
}
