import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionHeading from '../../../components/ui/SectionHeading'

const lineAfter = 'flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent'
const lineBefore = 'flex-1 h-px bg-gradient-to-l from-teal-400/30 to-transparent'

// The title + teal hairline that opens every section of the home page and every block of /qa
describe('SectionHeading', () => {
  it('renders the QA page size by default: title, then a hairline fading out to the right', () => {
    render(<SectionHeading>Feature files</SectionHeading>)
    const title = screen.getByRole('heading', { level: 2, name: 'Feature files' })
    expect(title).toHaveAttribute('class', 'text-2xl font-heading font-bold')
    const row = title.parentElement!
    expect(row).toHaveAttribute('class', 'flex items-center gap-4 mb-8')
    expect(Array.from(row.children).map((el) => el.getAttribute('class'))).toEqual([
      'text-2xl font-heading font-bold',
      lineAfter,
    ])
  })

  it('renders the bigger home page size, with more room below', () => {
    render(<SectionHeading size="lg">About</SectionHeading>)
    const title = screen.getByRole('heading', { level: 2, name: 'About' })
    expect(title).toHaveAttribute('class', 'text-3xl font-heading font-bold')
    expect(title.parentElement).toHaveAttribute('class', 'flex items-center gap-4 mb-14')
  })

  // The contact section
  it('centres the title between two hairlines', () => {
    render(<SectionHeading size="lg" centered>Get in Touch</SectionHeading>)
    const row = screen.getByRole('heading', { level: 2, name: 'Get in Touch' }).parentElement!
    expect(row).toHaveAttribute('class', 'flex items-center justify-center gap-4 mb-14')
    expect(Array.from(row.children).map((el) => el.getAttribute('class'))).toEqual([
      lineBefore,
      'text-3xl font-heading font-bold',
      lineAfter,
    ])
  })

  // The experience section puts the resume download between the title and the hairline
  it('shows an action right after the title', () => {
    render(
      <SectionHeading size="lg" action={<button>Resume (PDF)</button>}>
        Experience
      </SectionHeading>,
    )
    const row = screen.getByRole('heading', { level: 2, name: 'Experience' }).parentElement!
    expect(Array.from(row.children).map((el) => el.textContent)).toEqual(['Experience', 'Resume (PDF)', ''])
    expect(row.lastElementChild).toHaveAttribute('class', lineAfter)
  })
})
