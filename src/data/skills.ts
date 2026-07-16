export type SkillEntry = string | { name: string; bug: true }

export interface SkillCategory {
  name: string
  skills: SkillEntry[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'Test & Automation',
    skills: ['Test Strategy', 'Test Automation', 'E2E Testing', 'API Testing', 'Performance Testing', 'BDD / Cucumber'],
  },
  {
    name: 'Tools',
    skills: ['TypeScript', 'Playwright', 'Cypress', 'Postman', 'GitHub Actions', 'Jenkins', 'Allure', 'Linear'],
  },
  {
    name: 'CI/CD & Infra',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Vercel', { name: 'Playwright', bug: true }],
  },
  {
    name: 'Languages & Observability',
    skills: ['Python', 'SQL', 'Datadog', 'PostgreSQL', 'Redis'],
  },
]
