import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar'

function LocationProbe() {
  return <span data-testid="location">{useLocation().pathname}</span>
}

function renderNavbar(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
      <LocationProbe />
    </MemoryRouter>,
  )
}

const expectedLinks = [
  { testid: 'nav-link-about', label: 'About', href: '#about' },
  { testid: 'nav-link-experience', label: 'Experience', href: '#experience' },
  { testid: 'nav-link-skills', label: 'Skills', href: '#skills' },
  { testid: 'nav-link-who-tests-the-tester', label: 'Who tests the tester?', href: '/qa' },
  { testid: 'nav-link-contact', label: 'Contact', href: '#contact' },
]

const scrollIntoView = vi.fn()
let about: HTMLElement

beforeEach(() => {
  document.documentElement.className = ''
  localStorage.clear()
  about = document.createElement('section')
  about.id = 'about'
  about.scrollIntoView = scrollIntoView
  document.body.appendChild(about)
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })
})

afterEach(() => {
  about.remove()
  scrollIntoView.mockClear()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('Navbar', () => {
  describe('desktop navigation', () => {
    it('renders the logo link to the home page', () => {
      renderNavbar()
      expect(screen.getByTestId('nav-logo')).toHaveAttribute('href', '/')
    })

    it.each(expectedLinks)('renders the "$label" link as $testid pointing to $href', ({ testid, label, href }) => {
      renderNavbar()
      const links = screen.getAllByTestId(testid)
      expect(links).toHaveLength(1) // mobile menu is closed
      expect(links[0]).toHaveTextContent(label)
      expect(links[0]).toHaveAttribute('href', href)
    })

    it('renders the links in order', () => {
      renderNavbar()
      const nav = screen.getByTestId('nav')
      const labels = Array.from(nav.querySelectorAll('[data-testid^="nav-link-"]')).map((el) => el.textContent)
      expect(labels).toEqual(expectedLinks.map((l) => l.label))
    })

    it('scrolls to the section and prevents the default anchor jump on the home page', () => {
      renderNavbar('/')
      const defaultNotPrevented = fireEvent.click(screen.getByTestId('nav-link-about'))

      expect(defaultNotPrevented).toBe(false)
      expect(scrollIntoView).toHaveBeenCalledOnce()
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
      expect(scrollIntoView.mock.contexts[0]).toBe(about)
      expect(screen.getByTestId('location').textContent).toBe('/')
    })

    it('goes back home then scrolls to the section from another page', () => {
      renderNavbar('/qa')
      fireEvent.click(screen.getByTestId('nav-link-about'))

      expect(screen.getByTestId('location').textContent).toBe('/')
      expect(scrollIntoView).toHaveBeenCalledOnce()
      expect(scrollIntoView.mock.contexts[0]).toBe(about)
    })

    it('navigates to the QA page through a router link', () => {
      renderNavbar('/')
      fireEvent.click(screen.getByTestId('nav-link-who-tests-the-tester'))
      expect(screen.getByTestId('location').textContent).toBe('/qa')
      expect(scrollIntoView).not.toHaveBeenCalled()
    })
  })

  describe('mobile menu', () => {
    it('is closed by default', () => {
      renderNavbar()
      const toggle = screen.getByTestId('nav-mobile-toggle')
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu')
      expect(screen.queryByTestId('nav-mobile-menu')).not.toBeInTheDocument()
    })

    it('opens with a second copy of every link, then closes again', async () => {
      renderNavbar()
      const toggle = screen.getByTestId('nav-mobile-toggle')

      fireEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      const menu = screen.getByTestId('nav-mobile-menu')
      expect(menu).toHaveAttribute('id', 'mobile-menu')
      for (const { testid, href } of expectedLinks) {
        const copies = screen.getAllByTestId(testid)
        expect(copies).toHaveLength(2)
        expect(menu).toContainElement(copies[1])
        expect(copies[1]).toHaveAttribute('href', href)
        expect(copies[1]).toHaveClass('block')
        expect(copies[0]).not.toHaveClass('block')
      }

      fireEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      await waitFor(() => expect(screen.queryByTestId('nav-mobile-menu')).not.toBeInTheDocument())
    })

    it('closes the menu first, then scrolls once the close animation is over', () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
      renderNavbar('/')
      fireEvent.click(screen.getByTestId('nav-mobile-toggle'))
      const mobileAbout = screen.getAllByTestId('nav-link-about')[1]

      const defaultNotPrevented = fireEvent.click(mobileAbout)

      expect(defaultNotPrevented).toBe(false)
      expect(screen.getByTestId('nav-mobile-toggle')).toHaveAttribute('aria-expanded', 'false')
      expect(scrollIntoView).not.toHaveBeenCalled()

      act(() => vi.advanceTimersByTime(299))
      expect(scrollIntoView).not.toHaveBeenCalled()

      act(() => vi.advanceTimersByTime(1))
      expect(scrollIntoView).toHaveBeenCalledOnce()
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
      expect(scrollIntoView.mock.contexts[0]).toBe(about)
    })

    it('goes back home after the close animation when on another page', () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
      renderNavbar('/qa')
      fireEvent.click(screen.getByTestId('nav-mobile-toggle'))
      fireEvent.click(screen.getAllByTestId('nav-link-about')[1])

      expect(screen.getByTestId('location').textContent).toBe('/qa')
      expect(scrollIntoView).not.toHaveBeenCalled()

      act(() => vi.advanceTimersByTime(300))
      expect(screen.getByTestId('location').textContent).toBe('/')
      expect(scrollIntoView).toHaveBeenCalledOnce()
      expect(scrollIntoView.mock.contexts[0]).toBe(about)
    })

    it('closes the menu when a router link is used', () => {
      renderNavbar('/')
      const toggle = screen.getByTestId('nav-mobile-toggle')
      fireEvent.click(toggle)
      fireEvent.click(screen.getAllByTestId('nav-link-who-tests-the-tester')[1])

      expect(screen.getByTestId('location').textContent).toBe('/qa')
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    it('exposes a dedicated theme toggle for mobile', () => {
      renderNavbar()
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
      expect(screen.getByTestId('theme-toggle-mobile')).toBeInTheDocument()
    })
  })
})
