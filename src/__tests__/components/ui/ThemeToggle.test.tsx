import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '../../../components/ui/ThemeToggle'

beforeEach(() => {
  document.documentElement.className = ''
  localStorage.clear()
})

describe('ThemeToggle', () => {
  it('renders in light mode with an invitation to switch to dark', () => {
    render(<ThemeToggle />)
    const button = screen.getByTestId('theme-toggle')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
    expect(button).toHaveAttribute('title', 'Switch to dark mode')
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('appends a custom className to its own classes', () => {
    render(<ThemeToggle className="ml-auto" />)
    const button = screen.getByTestId('theme-toggle')
    expect(button).toHaveClass('ml-auto')
    expect(button).toHaveClass('inline-flex')
  })

  it('switches to dark on click and back to light', () => {
    render(<ThemeToggle />)
    const button = screen.getByTestId('theme-toggle')

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
    expect(button).toHaveAttribute('title', 'Switch to light mode')

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('honours a custom testId', () => {
    render(<ThemeToggle testId="theme-toggle-mobile" />)
    expect(screen.getByTestId('theme-toggle-mobile')).toBeInTheDocument()
  })
})
