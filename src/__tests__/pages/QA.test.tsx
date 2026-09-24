import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    constructor() {}
  } as unknown as typeof IntersectionObserver
})
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

  // Landing scrolled on the contact section is covered end to end in App.test.tsx
  it('navigates to the contact section of the home page on click', () => {
    renderQA()
    const link = screen.getByRole('link', { name: 'Get in touch' })
    fireEvent.click(link)
    expect(mockNavigate).toHaveBeenCalledExactlyOnceWith({ pathname: '/', hash: '#contact' })
  })
})

describe('QA page - Web3 demo section', () => {
  it('renders the section divider', () => {
    renderQA()
    expect(screen.getByText(/From UI to/)).toBeInTheDocument()
    expect(
      screen.getByText(/Same approach, applied to a smart contract/),
    ).toBeInTheDocument()
  })

  it('renders the Section 2 heading', () => {
    renderQA()
    expect(screen.getByText(/LockBox/)).toBeInTheDocument()
  })


  it('renders web3 stats', () => {
    renderQA()
    const statsEl = document.querySelector('[data-testid="web3-stats"]')
    expect(statsEl).toBeInTheDocument()
  })

  it('renders 4 web3 practice cards', () => {
    renderQA()
    expect(screen.getByText('Real wallet interactions')).toBeInTheDocument()
    expect(screen.getByText('Transaction lifecycle')).toBeInTheDocument()
    expect(screen.getByText('On-chain state validation')).toBeInTheDocument()
    expect(screen.getByText('No API shortcuts')).toBeInTheDocument()
  })

  it('renders 4 web3 feature cards', () => {
    renderQA()
    expect(document.querySelector('[data-testid="web3-feature-visitor-connects-wallet"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="web3-feature-visitor-deposits-successfully"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="web3-feature-visitor-rejects-transaction"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="web3-feature-visitor-withdraws-successfully"]')).toBeInTheDocument()
  })

  it('renders demo and repo CTAs', () => {
    renderQA()
    const repoLinks = screen.getAllByRole('link', { name: /Explore the test suite/ })
    const dappLink = repoLinks.find((l) => l.getAttribute('href')?.includes('lockbox'))
    expect(dappLink).toBeTruthy()
  })

})

describe('QA page - CI status badges', () => {
  const badgeIds = ['qa-status-badge', 'dapp-status-badge']

  function stubBadgeResponse(body: string, ok = true, status = 200) {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok, status, text: () => Promise.resolve(body) }),
    )
  }

  async function expectBadges(text: string) {
    for (const id of badgeIds) {
      await waitFor(() => expect(screen.getByTestId(id).textContent).toBe(text))
    }
  }

  function expectNeutral(id: string) {
    const badge = screen.getByTestId(id)
    expect(badge).toHaveClass('text-muted/40')
    expect(badge).not.toHaveClass('text-emerald-400')
    const dot = badge.querySelector('span')
    expect(dot).toHaveClass('bg-muted/40')
    expect(dot).not.toHaveClass('bg-emerald-400')
    expect(dot).not.toHaveClass('animate-pulse')
  }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows passing when the badge SVG says passing', async () => {
    stubBadgeResponse('<svg><text>passing</text></svg>')
    renderQA()
    await expectBadges('passing')
    for (const id of badgeIds) expect(screen.getByTestId(id)).toHaveClass('text-emerald-400')
  })

  it('shows failing when the badge SVG says failing', async () => {
    stubBadgeResponse('<svg><text>failing</text></svg>')
    renderQA()
    await expectBadges('failing')
    for (const id of badgeIds) expect(screen.getByTestId(id)).toHaveClass('text-red-400')
  })

  it('shows a neutral unknown badge when the fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    renderQA()
    await expectBadges('unknown')
    badgeIds.forEach(expectNeutral)
  })

  it('shows a neutral unknown badge when the SVG says neither passing nor failing', async () => {
    stubBadgeResponse('<svg><text>no status</text></svg>')
    renderQA()
    await expectBadges('unknown')
    badgeIds.forEach(expectNeutral)
  })

  it('shows a neutral unknown badge when the badge request is not ok', async () => {
    stubBadgeResponse('<svg><text>passing</text></svg>', false, 503)
    renderQA()
    await expectBadges('unknown')
    badgeIds.forEach(expectNeutral)
  })
})
