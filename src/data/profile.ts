export interface Education {
  school: string
  degree: string
  period: string
}

export interface Profile {
  name: string
  role: string
  location: string
  summary: string
  education: Education
  languages: string[]
}

export const profile: Profile = {
  name: 'Benjamin Lassaut',
  role: 'Lead QA Engineer / SDET',
  location: 'Opio, France',
  summary:
    "I turn \"we're not sure it works\" into shippable confidence. First quality hire at several " +
    'startups; most recently I owned the QA architecture for high-stakes fintech and blockchain ' +
    'systems across 20+ networks. I write my own tests and tooling: TypeScript, Playwright, Cypress, ' +
    'GitHub Actions, and BDD.',
  education: {
    school: "Institut Superieur d'Electronique de Paris",
    degree: "Master's Degree in Engineering - Electronics & Computer Science",
    period: '2009 - 2012',
  },
  languages: ['French (Native)', 'English (Professional)'],
}
