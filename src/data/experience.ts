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
    period: 'May 2025 - Present',
    current: true,
    highlights: [
      'Own quality across all Kiln products - staking APIs, DeFi vaults, dashboard, and smart contracts.',
      'Built an enterprise-grade Cypress + Cucumber framework covering 20+ blockchain networks.',
      'Replaced manual QA bottlenecks with automated pipelines teams rely on to ship safely across multiple product teams.',
      'Reduced production incidents by catching issues through hourly automated monitoring before users ever saw them.',
    ],
  },
  {
    company: 'Kiln',
    role: 'Senior QA Engineer',
    period: 'Oct 2023 - May 2025',
    highlights: [
      'Designed the full QA architecture from scratch - BDD feature files, Cypress commands, and API tasks.',
      'Automated transaction crafting, signing (Fireblocks), broadcasting, and verification flows across multiple chains.',
      'Unblocked faster releases by replacing manual validation with automated cross-chain test coverage.',
    ],
  },
  {
    company: 'Coinhouse',
    role: 'QA Lead',
    period: 'Jul 2023 - Oct 2023',
    highlights: [
      'Owned quality for the crypto exchange platform during a critical growth phase.',
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
      'Established QA standards and processes company-wide - first dedicated QA hire.',
      'Set up quality KPIs, monitoring, and automated CI test pipelines from scratch.',
    ],
  },
  {
    company: 'Médiamétrie',
    role: 'Ops Engineer',
    period: 'Jul 2020 - Jul 2021',
    highlights: [
      'Led datacenter-to-AWS migration using Ansible, Terraform, and XL Release.',
    ],
  },
  {
    company: 'Médiamétrie',
    role: 'QA Analyst',
    period: 'Oct 2018 - Jul 2020',
    highlights: [
      'Introduced BDD practices and built automation PoCs with Selenium, Cypress, and Jenkins.',
      'Deployed Test Management for Jira Cloud and managed AWS testing infrastructure.',
    ],
  },
  {
    company: 'Calypso Technology',
    role: 'QA Analyst',
    period: 'Aug 2017 - Aug 2018',
    highlights: [
      'Led QA on the Cross Asset front-to-back platform - order management, decision support, and P&L.',
    ],
  },
  {
    company: 'BNP Paribas CIB',
    role: 'Front Office Support Engineer',
    period: 'Feb 2016 - Aug 2017',
    highlights: [
      'Front-line technical support for traders on eCommerce applications (quotation, pricing, RFQ).',
    ],
  },
  {
    company: 'Société Générale CIB',
    role: 'QA Analyst',
    period: 'May 2014 - Oct 2015',
    highlights: [
      'Tested multi-asset electronic trading platforms across London, Montreal, Paris, and Bangalore.',
    ],
  },
  {
    company: 'Bouygues Telecom',
    role: 'QA Analyst',
    period: 'Sep 2013 - May 2014',
    highlights: [
      'Ran full test cycles - acceptance, non-regression, deployment, post-release - and owned GO/NO GO calls.',
    ],
  },
]
