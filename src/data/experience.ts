export interface ExperienceEntry {
  company: string
  role: string
  period: string
  highlights: string[]
  current?: boolean
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Kiln',
    role: 'Lead QA Engineer',
    period: 'May 2025 - Jun 2026',
    highlights: [
      'Owned quality across all Kiln products - staking APIs, DeFi vaults, dashboard, and smart contracts.',
      'Scaled an enterprise-grade Cypress + Cucumber framework covering 20+ blockchain networks, with automated pipelines several product teams rely on to ship safely.',
      'Built hourly production monitoring (shift-right) wired into incident response, catching regressions before they reach users.',
      'QA evangelism: product mapping, shared QA reviews, and upskilling teams on test automation.',
    ],
  },
  {
    company: 'Kiln',
    role: 'Senior QA Engineer',
    period: 'Oct 2023 - May 2025',
    highlights: [
      'Designed the full QA architecture from scratch - BDD feature files, Cypress commands, and API tasks.',
      'Automated end-to-end critical flows: transaction crafting, signing (Fireblocks), broadcasting, and on-chain verification.',
      'Replaced manual validation with automated cross-chain test coverage - faster, safer releases.',
    ],
  },
  {
    company: 'Coinhouse',
    role: 'QA Lead',
    period: 'Jul 2023 - Oct 2023',
    highlights: [
      'Owned quality for the crypto exchange platform during a critical growth phase.',
      'Hardened the test strategy on critical journeys (buy/sell, KYC, withdrawals) - E2E automation and CI quality gates to secure releases.',
    ],
  },
  {
    company: 'Deepomatic',
    role: 'QA Manager',
    period: 'Jun 2022 - Jul 2023',
    highlights: [
      'Scaled the QA practice from individual contributor to a managed team with defined KPIs.',
      'Introduced smoke, sanity, and performance test automation into CI pipelines.',
    ],
  },
  {
    company: 'Deepomatic',
    role: 'QA Engineer',
    period: 'Aug 2021 - Jun 2022',
    highlights: [
      'First dedicated QA hire - established QA standards and processes company-wide.',
      'Set up quality KPIs, monitoring, and automated CI test pipelines from scratch.',
    ],
  },
  {
    company: 'Médiamétrie',
    role: 'Ops Engineer',
    period: 'Jul 2020 - Jul 2021',
    highlights: [
      'Led the datacenter-to-AWS migration of the Médiamat TV-audience chain (Terraform, Ansible, XL Release, Consul) in an agile context.',
      'Orchestrated application scheduling with Automic Workload Automation; built the QA and UAT environments on AWS.',
    ],
  },
  {
    company: 'Médiamétrie',
    role: 'QA Analyst',
    period: 'Oct 2018 - Jul 2020',
    highlights: [
      'Introduced BDD practices through PO / QA / Dev workshops; automated web-service tests (Newman, Docker) and UI tests (Cucumber, Cypress) on Jenkins.',
      'Deployed Test Management for Jira across the IT department; drove SonarQube quality KPIs (coverage, new-code coverage, blockers) in sprint demos.',
    ],
  },
  {
    company: 'Calypso Technology',
    role: 'QA Analyst',
    period: 'Aug 2017 - Aug 2018',
    highlights: [
      'Single point of contact for QA on decision support and order management (Cross Asset front-to-back platform).',
      'Defined and ran client bug tests under a 2-day SLA, non-regression suites, and functional tests (portfolio management, benchmarking, funds).',
      'Supported Back-Office, Security Finance, and Compliance teams; contributed BDD feature definitions for automation.',
    ],
  },
  {
    company: 'BNP Paribas CIB',
    role: 'Front Office Support Engineer',
    period: 'Feb 2016 - Aug 2017',
    highlights: [
      'Front-line support for traders and sales on quotation / deal booking, structured-product pricing, and legal documentation platforms, in an international environment.',
      'Built a Python-based application monitoring system; ran morning, start-of-week, and post-release checks.',
    ],
  },
  {
    company: 'Société Générale CIB',
    role: 'QA Analyst',
    period: 'May 2014 - Oct 2015',
    highlights: [
      'Specified UAT and integration tests (scrum) on Alpha SP, the electronic trading platform for structured products.',
      'Coordinated test status and defects with teams in Bangalore, Montréal, and London; owned GO / NO-GO communication.',
      'Rolled out Zephyr, a new Jira-integrated test management tool; provided functional support to internal users.',
    ],
  },
  {
    company: 'Bouygues Telecom',
    role: 'QA Analyst',
    period: 'Sep 2013 - May 2014',
    highlights: [
      'Owned acceptance, non-regression, and post-release test cycles on AGORA, the sales referential platform; owned GO / NO-GO communication.',
      'Owned the AGORA test assets on HP Quality Center; tracked defects and fixes.',
    ],
  },
  {
    company: 'Orange',
    role: 'QA Analyst',
    period: 'Oct 2012 - Dec 2012',
    highlights: [
      'Automated web-service tests for the new Orange mobile customer portal with SoapUI (authentication, usage tracking).',
      'Wrote functional test specifications, ran qualification cycles, and handled root-cause analysis on failures.',
    ],
  },
]
