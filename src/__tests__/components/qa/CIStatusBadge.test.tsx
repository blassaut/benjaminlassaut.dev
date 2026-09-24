import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CIStatusBadge } from '../../../components/qa/CIStatusBadge'

// Status outcomes (passing / failing / unknown) are covered on the page in QA.test.tsx
const REPO = 'https://github.com/acme/widget'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('CIStatusBadge', () => {
  it('reads the ci.yml badge of the given repo', () => {
    const fetch = vi.fn(() => new Promise<Response>(() => {}))
    vi.stubGlobal('fetch', fetch)

    render(<CIStatusBadge repoUrl={REPO} testId="badge" />)

    expect(fetch).toHaveBeenCalledExactlyOnceWith(`${REPO}/actions/workflows/ci.yml/badge.svg`)
  })

  it('links to the repo workflow runs in a new tab', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})))

    render(<CIStatusBadge repoUrl={REPO} testId="badge" />)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('href', `${REPO}/actions`)
    expect(badge).toHaveAttribute('target', '_blank')
    expect(badge).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows a neutral "..." while the status is loading', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})))

    render(<CIStatusBadge repoUrl={REPO} testId="badge" />)

    const badge = screen.getByTestId('badge')
    expect(badge.textContent).toBe('...')
    expect(badge).toHaveClass('text-muted/40')
    expect(badge.querySelector('span')).toHaveClass('bg-muted/40')
  })

  it('explains what the badge is on hover', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})))

    render(<CIStatusBadge repoUrl={REPO} testId="badge" />)
    fireEvent.mouseEnter(screen.getByTestId('badge'))

    expect(screen.getByRole('tooltip').textContent).toBe('CI: GitHub Actions')
  })
})
