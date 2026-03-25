import { describe, it, expect, vi, beforeAll } from 'vitest'

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    constructor() {}
  } as unknown as typeof IntersectionObserver
})
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import QaLab from '../../pages/QA'
import { HelmetProvider } from 'react-helmet-async'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderQA() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/qa']}>
        <QaLab />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('QA page - Get in touch CTA', () => {
  it('renders the conversion CTA', () => {
    renderQA()
    const link = screen.getByRole('link', { name: 'Get in touch' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#contact')
  })

  it('navigates to home on click', () => {
    renderQA()
    const link = screen.getByRole('link', { name: 'Get in touch' })
    fireEvent.click(link)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('scrolls to #contact after navigation', async () => {
    vi.useFakeTimers()
    const scrollIntoView = vi.fn()
    const el = document.createElement('div')
    el.id = 'contact'
    el.scrollIntoView = scrollIntoView
    document.body.appendChild(el)

    renderQA()
    const link = screen.getByRole('link', { name: 'Get in touch' })
    fireEvent.click(link)

    vi.advanceTimersByTime(100)
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })

    document.body.removeChild(el)
    vi.useRealTimers()
  })
})

describe('QA page - Web3 staking demo section', () => {
  it('renders the transition line between sections', () => {
    renderQA()
    expect(
      screen.getByText(
        /The same approach applies where failures are more expensive/,
      ),
    ).toBeInTheDocument()
  })

  it('renders the Section 2 heading', () => {
    renderQA()
    expect(screen.getByText('A web3 staking demo')).toBeInTheDocument()
  })

  it('renders the intro copy', () => {
    renderQA()
    expect(
      screen.getByText(/bugs don't just break UX/),
    ).toBeInTheDocument()
  })

  it('renders web3 stats', () => {
    renderQA()
    const statsEl = document.querySelector('[data-testid="web3-stats"]')
    expect(statsEl).toBeInTheDocument()
  })

  it('renders 4 web3 practice cards', () => {
    renderQA()
    expect(screen.getByText('Automated wallet interactions')).toBeInTheDocument()
    expect(screen.getByText('Transaction lifecycle testing')).toBeInTheDocument()
    expect(screen.getByText('Wrong-network resilience')).toBeInTheDocument()
    expect(screen.getByText('Browser-level web3 testing')).toBeInTheDocument()
  })

  it('renders 5 web3 feature cards', () => {
    renderQA()
    expect(document.querySelector('[data-testid="web3-feature-visitor-connects-wallet"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="web3-feature-visitor-stakes-successfully"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="web3-feature-visitor-rejects-transaction"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="web3-feature-visitor-is-on-wrong-network"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="web3-feature-visitor-unstakes-successfully"]')).toBeInTheDocument()
  })

  it('renders the visual preview placeholder', () => {
    renderQA()
    expect(screen.getByText('End-to-end wallet flow')).toBeInTheDocument()
  })

  it('renders demo and repo CTAs', () => {
    renderQA()
    const demoLink = screen.getByRole('link', { name: /Test the wallet flow live/ })
    expect(demoLink).toHaveAttribute('href', expect.stringContaining('web3-staking-demo'))
    const repoLink = screen.getByRole('link', { name: /Explore the test suite/ })
    expect(repoLink).toHaveAttribute('href', expect.stringContaining('web3-staking-demo'))
  })

  it('renders the transparency line', () => {
    renderQA()
    expect(
      screen.getByText(/The live demo uses real wallet interaction/),
    ).toBeInTheDocument()
  })
})
