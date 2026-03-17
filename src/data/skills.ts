export interface SkillCategory {
  name: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'QA & Testing',
    skills: ['Test Strategy', 'Test Automation', 'CI/CD', 'E2E Testing', 'API Testing', 'Performance Testing', 'BDD / Cucumber'],
  },
  {
    name: 'Web3',
    skills: ['Smart Contract Testing', 'EVM Networks', 'Solana', 'Polkadot', 'Cosmos', 'Viem', 'Fireblocks', 'MetaMask', 'Foundry / Anvil'],
  },
  {
    name: 'Tools',
    skills: ['TypeScript', 'Cypress', 'Playwright', 'Postman', 'GitHub Actions', 'Linear', 'Allure'],
  },
  {
    name: 'Infrastructure',
    skills: ['AWS', 'Docker', 'Terraform', 'Python', 'PostgreSQL', 'Redis'],
  },
]
