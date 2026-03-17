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
    role: 'QA Lead',
    period: '2024 — Present',
    current: true,
    highlights: [
      'Built AI-powered test generation for smart contracts — no Solidity knowledge required',
      'Designed scenario-based testing platform covering 10+ EVM networks',
      'Established QA processes for blockchain staking infrastructure',
    ],
  },
  // TODO: Benjamin to fill in previous roles
]
