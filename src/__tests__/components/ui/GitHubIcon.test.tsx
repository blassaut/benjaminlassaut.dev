import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import GitHubIcon from '../../../components/ui/GitHubIcon'

// The icon sits next to the "Explore the test suite" links on /qa
describe('GitHubIcon', () => {
  it('draws the GitHub mark at the default inline size', () => {
    const { container } = render(<GitHubIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('class', 'w-4 h-4')
    expect(svg?.querySelector('path')?.getAttribute('d')).toMatch(/^M12 0C5\.37 0 0 5\.37/)
  })

  it('accepts a custom size', () => {
    const { container } = render(<GitHubIcon className="w-6 h-6" />)
    expect(container.querySelector('svg')).toHaveAttribute('class', 'w-6 h-6')
  })
})
