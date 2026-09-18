import { describe, it, expect, vi } from 'vitest'

vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  },
)

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

  it('uses the singular for a single scenario', () => {
    render(<FeatureCard raw={'Feature: Solo\n  Scenario: Only one'} index={0} />)
    expect(screen.getByText('1 scenario')).toBeInTheDocument()
    expect(screen.queryByText(/scenarios/)).not.toBeInTheDocument()
  })

  it('shows the hook next to the count only when provided', () => {
    const { rerender } = render(<FeatureCard raw={sampleFeature} index={0} hook="Before: connect" />)
    expect(screen.getByText('· Before: connect')).toBeInTheDocument()

    rerender(<FeatureCard raw={sampleFeature} index={0} />)
    expect(screen.queryByText(/Before: connect/)).not.toBeInTheDocument()
    expect(screen.queryByText(/·/)).not.toBeInTheDocument()
  })

  it('winks at the visitor only on the "Who tests the tester" feature', () => {
    const { rerender } = render(<FeatureCard raw={'Feature: Who tests the tester?\n  Scenario: x'} index={0} />)
    expect(screen.getByText("psst - that's you right now")).toBeInTheDocument()

    rerender(<FeatureCard raw={sampleFeature} index={0} />)
    expect(screen.queryByText(/psst/)).not.toBeInTheDocument()
  })

  it('starts collapsed and expands on click to show gherkin content', async () => {
    const { container } = render(<FeatureCard raw={sampleFeature} index={0} />)
    const button = screen.getByRole('button')
    const bar = container.querySelector('.absolute.left-0') as HTMLElement
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText(/MetaMask is installed/)).not.toBeInTheDocument()
    expect(bar).not.toHaveClass('bg-teal-400')
    expect(bar).toHaveClass('bg-hairline/10')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/MetaMask is installed/)).toBeInTheDocument()
    expect(bar).toHaveClass('bg-teal-400')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(screen.queryByText(/MetaMask is installed/)).not.toBeInTheDocument())
  })

  it('renders every line of the feature through GherkinLine when open', () => {
    render(<FeatureCard raw={sampleFeature} index={0} defaultOpen />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    const pre = document.querySelector('pre') as HTMLElement
    const renderedLines = Array.from(pre.children).map((line) => line.textContent)
    expect(renderedLines).toEqual(sampleFeature.split('\n'))
  })
})
