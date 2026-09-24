import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest'

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    constructor() {}
  } as unknown as typeof IntersectionObserver
})

import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

const scrollTo = vi.fn()
// jsdom does not implement scrollIntoView, so assign directly instead of vi.spyOn
const scrollIntoView = vi.fn()
const originalScrollTo = window.scrollTo
const originalScrollIntoView = Element.prototype.scrollIntoView

beforeEach(() => {
  window.scrollTo = scrollTo
  Element.prototype.scrollIntoView = scrollIntoView
  // Run requestAnimationFrame callbacks synchronously
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  window.scrollTo = originalScrollTo
  Element.prototype.scrollIntoView = originalScrollIntoView
  scrollTo.mockClear()
  scrollIntoView.mockClear()
  window.history.pushState({}, '', '/')
})

describe('App routing', () => {
  it('renders the Legal page on /legal', () => {
    window.history.pushState({}, '', '/legal')
    render(<App />)
    expect(screen.getByTestId('legal-page')).toBeInTheDocument()
  })
})

describe('ScrollToTop', () => {
  it('scrolls to the top when there is no hash', () => {
    window.history.pushState({}, '', '/legal')
    render(<App />)
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('scrolls smoothly to the contact section when a hash is present', () => {
    window.history.pushState({}, '', '/#contact')
    render(<App />)
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('contact'))
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('does not crash or scroll when the hash matches no element', () => {
    window.history.pushState({}, '', '/#does-not-exist')
    expect(() => render(<App />)).not.toThrow()
    expect(scrollIntoView).not.toHaveBeenCalled()
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('scrolls to the top again on every route change', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(scrollTo).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByTestId('footer-link-legal'))
    expect(screen.getByTestId('legal-page')).toBeInTheDocument()
    expect(scrollTo).toHaveBeenCalledTimes(2)
  })

  it('lands on the home section when a nav link is clicked from another page', () => {
    window.history.pushState({}, '', '/legal')
    render(<App />)

    fireEvent.click(screen.getByTestId('nav-link-about'))

    expect(window.location.pathname + window.location.hash).toBe('/#about')
    expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: 'smooth' })
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('about'))
  })

  it('lands on the contact section from the QA page "Get in touch" button', () => {
    // The CI badges fetch GitHub; keep the test offline
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))))
    window.history.pushState({}, '', '/qa')
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'Get in touch' }))

    expect(window.location.pathname + window.location.hash).toBe('/#contact')
    expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: 'smooth' })
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('contact'))
  })

  it('does not crash when the hash is not a valid CSS selector', () => {
    window.history.pushState({}, '', '/#123')
    expect(() => render(<App />)).not.toThrow()
    expect(scrollIntoView).not.toHaveBeenCalled()
  })
})
