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
import { PracticeCard } from '../../../components/qa/PracticeCard'

describe('PracticeCard', () => {
  const practice = {
    label: 'Automated wallet interactions',
    description: 'Connect MetaMask in e2e tests.',
    detail: 'Dappwright drives MetaMask',
    icon: 'Wx',
    caption: 'Dappwright + Playwright' as const,
    source: { label: 'e2e/steps/', href: 'https://github.com/blassaut/web3-staking-demo/tree/main/e2e/steps' },
  }

  it('renders label, description, and detail', () => {
    render(<PracticeCard practice={practice} index={0} />)
    expect(screen.getByText('Automated wallet interactions')).toBeInTheDocument()
    expect(screen.getByText('Connect MetaMask in e2e tests.')).toBeInTheDocument()
    expect(screen.getByText('Dappwright drives MetaMask')).toBeInTheDocument()
  })

  it('renders source link pointing to correct href', () => {
    render(<PracticeCard practice={practice} index={0} />)
    const link = screen.getByRole('link', { name: /e2e\/steps\// })
    expect(link).toHaveAttribute('href', practice.source.href)
  })

  it('renders caption when provided', () => {
    render(<PracticeCard practice={practice} index={0} />)
    expect(screen.getByText('Dappwright + Playwright')).toBeInTheDocument()
  })

  it('does not render caption when not provided', () => {
    const noCaptionPractice = { ...practice, caption: undefined }
    render(<PracticeCard practice={noCaptionPractice} index={0} />)
    expect(screen.queryByText('Dappwright + Playwright')).not.toBeInTheDocument()
  })
})
