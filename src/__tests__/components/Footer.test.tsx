import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import Footer from '../../components/Footer'
import { LINKEDIN_URL, GITHUB_URL } from '../../data/links'

function LocationProbe() {
  return <span data-testid="location">{useLocation().pathname}</span>
}

function renderFooter(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Footer />
      <LocationProbe />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Footer - Legal Notice link', () => {
  it('renders the Legal Notice link pointing to /legal', () => {
    renderFooter()
    const link = screen.getByTestId('footer-link-legal')
    expect(link).toHaveTextContent('Legal Notice')
    expect(link).toHaveAttribute('href', '/legal')
  })

  it('keeps the copyright with the current year', () => {
    renderFooter()
    expect(
      screen.getByText(`© ${new Date().getFullYear()} Benjamin Lassaut`),
    ).toBeInTheDocument()
  })

  it('keeps the existing navigation links', () => {
    renderFooter()
    expect(screen.getByTestId('footer-link-about')).toHaveAttribute('href', '#about')
    expect(screen.getByTestId('footer-link-contact')).toHaveAttribute('href', '#contact')
    expect(screen.getByTestId('footer-link-who tests the tester?')).toHaveAttribute(
      'href',
      '/qa',
    )
  })
})

describe('Footer - navigation', () => {
  const navigation = [
    ['footer-link-about', 'About', '#about'],
    ['footer-link-experience', 'Experience', '#experience'],
    ['footer-link-skills', 'Skills', '#skills'],
    ['footer-link-who tests the tester?', 'Who tests the tester?', '/qa'],
    ['footer-link-contact', 'Contact', '#contact'],
  ] as const

  it.each(navigation)('renders %s with label "%s" pointing to %s', (testid, label, href) => {
    renderFooter()
    const link = screen.getByTestId(testid)
    expect(link).toHaveTextContent(label)
    expect(link).toHaveAttribute('href', href)
  })

  it('renders the navigation links in order', () => {
    renderFooter()
    const labels = screen
      .getAllByText(/./, { selector: '[data-testid^="footer-link-"]' })
      .map((el) => el.textContent)
    expect(labels).toEqual([...navigation.map((n) => n[1]), 'LinkedIn', 'GitHub', 'Legal Notice'])
  })

  it('links to the social profiles in a new tab', () => {
    renderFooter()
    const linkedin = screen.getByTestId('footer-link-linkedin')
    expect(linkedin).toHaveTextContent('LinkedIn')
    expect(linkedin).toHaveAttribute('href', LINKEDIN_URL)
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')

    const github = screen.getByTestId('footer-link-github')
    expect(github).toHaveTextContent('GitHub')
    expect(github).toHaveAttribute('href', GITHUB_URL)
    expect(github).toHaveAttribute('target', '_blank')
  })

  it('scrolls to the section instead of jumping when clicking a hash link on the home page', () => {
    const scrollIntoView = vi.fn()
    const contact = document.createElement('section')
    contact.id = 'contact'
    contact.scrollIntoView = scrollIntoView
    document.body.appendChild(contact)

    renderFooter('/')
    const defaultNotPrevented = fireEvent.click(screen.getByTestId('footer-link-contact'))

    expect(defaultNotPrevented).toBe(false)
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(scrollIntoView.mock.contexts[0]).toBe(contact)
    contact.remove()
  })

  it('goes back home when clicking a hash link from another page', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 0
    })
    renderFooter('/legal')
    fireEvent.click(screen.getByTestId('footer-link-about'))
    expect(screen.getByTestId('location').textContent).toBe('/')
  })
})
