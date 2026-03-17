export interface SkillCategory {
  name: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'QA & Testing',
    skills: ['Test Automation', 'Smart Contract Testing', 'CI/CD', 'E2E Testing', 'API Testing', 'Performance Testing'],
  },
  {
    name: 'Web3',
    skills: ['Solidity', 'EVM', 'Foundry', 'Hardhat', 'Ethereum', 'Arbitrum', 'Base', 'Optimism', 'Polygon'],
  },
  {
    name: 'Tech',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AI/LLM Integration', 'Python', 'Docker'],
  },
]
