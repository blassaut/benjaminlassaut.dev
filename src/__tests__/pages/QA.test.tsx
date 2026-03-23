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
