import { describe, it, expect, vi } from 'vitest'

vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  },
)

import { render, screen } from '@testing-library/react'
import { StatGrid } from '../../../components/qa/StatGrid'

describe('StatGrid', () => {
  const stats = [
    { value: '5', label: 'Journeys' },
    { value: '13', label: 'Scenarios' },
  ]

  it('renders all stat items', () => {
    render(<StatGrid stats={stats} testIdPrefix="test" />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Journeys')).toBeInTheDocument()
    expect(screen.getByText('13')).toBeInTheDocument()
    expect(screen.getByText('Scenarios')).toBeInTheDocument()
  })

  it('applies data-testid with prefix', () => {
    const { container } = render(<StatGrid stats={stats} testIdPrefix="web3" />)
    expect(container.querySelector('[data-testid="web3-stats"]')).toBeInTheDocument()
  })
})
