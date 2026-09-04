import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../../components/Footer'

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )
}

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
