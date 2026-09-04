import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Legal from '../../pages/Legal'

function renderLegal() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/legal']}>
        <Legal />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('Legal page', () => {
  it('renders the page with its heading', () => {
    renderLegal()
    expect(screen.getByTestId('legal-page')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Legal Notice' }),
    ).toBeInTheDocument()
  })

  it('renders all legal sections', () => {
    renderLegal()
    expect(screen.getByText('Website publisher')).toBeInTheDocument()
    expect(screen.getByText('Professional status')).toBeInTheDocument()
    expect(screen.getByText('Hosting')).toBeInTheDocument()
    expect(screen.getByText('Intellectual property')).toBeInTheDocument()
    expect(screen.getByText('Personal data')).toBeInTheDocument()
  })

  it('links to the home contact form via hash', () => {
    renderLegal()
    const link = screen.getByRole('link', { name: 'contact form' })
    expect(link).toHaveAttribute('href', '/#contact')
  })

  it('opens external links in a new tab with safe rel attributes', () => {
    renderLegal()
    for (const name of ['LinkedIn', 'www.cosens.fr', 'vercel.com', 'GitHub']) {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('renders the incubator contact details', () => {
    renderLegal()
    const mail = screen.getByRole('link', { name: 'info@cosens.fr' })
    expect(mail).toHaveAttribute('href', 'mailto:info@cosens.fr')
    expect(screen.getByText(/SIRET: 419 369 798 00030/)).toBeInTheDocument()
  })
})
