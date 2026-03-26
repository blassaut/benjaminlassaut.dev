import { describe, it, expect, vi } from 'vitest'

vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  },
)

import { render, screen, fireEvent } from '@testing-library/react'
import { FeatureCard } from '../../../components/qa/FeatureCard'

const sampleFeature = `Feature: Visitor connects wallet
  Scenario: Wallet available
    Given MetaMask is installed
  Scenario: No wallet
    Given MetaMask is not installed`

describe('FeatureCard', () => {
  it('renders feature name from first line', () => {
    render(<FeatureCard raw={sampleFeature} index={0} />)
    expect(screen.getByText('Visitor connects wallet')).toBeInTheDocument()
  })

  it('shows scenario count', () => {
    render(<FeatureCard raw={sampleFeature} index={0} />)
    expect(screen.getByText('2 scenarios')).toBeInTheDocument()
  })

  it('has correct data-testid', () => {
    const { container } = render(<FeatureCard raw={sampleFeature} index={0} testIdPrefix="web3" />)
    expect(container.querySelector('[data-testid="web3-feature-visitor-connects-wallet"]')).toBeInTheDocument()
  })

  it('defaults to qa- prefix when no testIdPrefix given', () => {
    const { container } = render(<FeatureCard raw={sampleFeature} index={0} />)
    expect(container.querySelector('[data-testid="qa-feature-visitor-connects-wallet"]')).toBeInTheDocument()
  })

  it('expands on click to show gherkin content', () => {
    render(<FeatureCard raw={sampleFeature} index={0} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText(/MetaMask is installed/)).toBeInTheDocument()
  })
})
