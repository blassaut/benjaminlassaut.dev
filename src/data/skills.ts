export type SkillEntry = string | { name: string; bug: true }

export interface SkillCategory {
  name: string
  skills: SkillEntry[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'QA & Testing',
    skills: ['Test Strategy', 'Test Automation', 'CI/CD', 'E2E Testing', 'API Testing', 'Performance Testing', 'BDD / Cucumber'],
  },
  {
    name: 'Web3',
    skills: ['Smart Contract Testing', 'EVM Networks', 'Solana', 'Polkadot', 'Cosmos', 'Viem', 'Fireblocks', 'MetaMask', 'Hardhat', 'Foundry / Anvil'],
  },
  {
    name: 'Tools',
    skills: ['TypeScript', 'Playwright', 'Dappwright', 'Cypress', 'Postman', 'GitHub Actions', 'Linear', 'Allure'],
  },
  {
    name: 'Infrastructure',
    skills: ['AWS', 'Vercel', 'Docker', 'Terraform', 'Python', 'PostgreSQL', 'Redis', { name: 'Playwright', bug: true }],
  },
]
