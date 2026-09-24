import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Logo from '../../../components/ui/Logo'

function parts(svg: SVGSVGElement) {
  return {
    gradient: svg.querySelector('linearGradient')!,
    stops: Array.from(svg.querySelectorAll('stop')).map((s) => [s.getAttribute('offset'), s.getAttribute('style')]),
    outline: svg.querySelector('polygon')!.getAttribute('stroke'),
    letters: svg.querySelector('text')!,
  }
}

// The "BL" hexagon of the navbar and the footer
describe('Logo', () => {
  it('draws the hexagon and the "BL" letters in the teal gradient', () => {
    const { container } = render(<Logo />)
    const { gradient, stops, outline, letters } = parts(container.querySelector('svg')!)
    expect(stops).toEqual([
      ['0%', 'stop-color: rgb(20, 184, 166);'], // teal-400
      ['100%', 'stop-color: rgb(13, 148, 136);'], // teal-500
    ])
    expect(outline).toBe(`url(#${gradient.id})`)
    expect(letters).toHaveTextContent('BL')
    expect(letters).toHaveAttribute('fill', `url(#${gradient.id})`)
  })

  // Navbar and footer are on every page: with a shared id one logo would paint with the other's gradient
  it('gives each logo on the page its own gradient', () => {
    const { container } = render(
      <>
        <Logo />
        <Logo />
      </>,
    )
    const [first, second] = Array.from(container.querySelectorAll('svg')).map(parts)
    expect(first.gradient.id).not.toBe(second.gradient.id)
    expect(first.outline).toBe(`url(#${first.gradient.id})`)
    expect(second.outline).toBe(`url(#${second.gradient.id})`)
    expect(second.letters).toHaveAttribute('fill', `url(#${second.gradient.id})`)
  })
})
