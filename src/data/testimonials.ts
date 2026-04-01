export interface Testimonial {
  author: string
  role: string
  company: string
  date: string
  excerpt: string
  fullText: string
  linkedinUrl: string
}

export const testimonials: Testimonial[] = [
  {
    author: 'Michel Bartz',
    role: 'VP of Engineering',
    company: 'Kiln',
    date: 'March 2026',
    excerpt:
      'From day one, he took ownership of quality across the organization, building our QA function entirely from scratch. [...] If you\'re looking for someone who can build and scale quality from the ground up, Benjamin is the right choice.',
    fullText:
      'I had the pleasure of recruiting and working with Benjamin as our very first QA hire, and his impact was immediate and lasting.\n\nFrom day one, he took ownership of quality across the organization, building our QA function entirely from scratch. They designed and implemented a robust QA framework, establishing processes that brought structure, consistency, and confidence to our development lifecycle. Developing comprehensive automated E2E test suites across multiple products, covering both UI and API. On top of that, they built a sophisticated automated testing suite for staking systems across blockchains like Ethereum and Solana, leveraging Fireblocks.\n\nHis reporting on test coverage, bugs, and release cycles enabled better decision-making and significantly improved our delivery reliability.\n\nIf you\'re looking for someone who can build and scale quality from the ground up, Benjamin is the right choice.',
    linkedinUrl: 'https://www.linkedin.com/in/benjaminlassaut/details/recommendations/',
  },
]
