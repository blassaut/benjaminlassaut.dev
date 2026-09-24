import { describe, it, expect } from 'vitest'
import { primaryButton } from '../../../components/ui/primaryButton'

// The teal CTA of the hero, the contact form, the 404 page and the QA page
describe('primaryButton', () => {
  const look = [
    'bg-teal-400', // teal fill
    'text-ink', // dark label, readable on teal in both themes
    'font-body',
    'font-semibold',
    'rounded-lg',
    'hover:shadow-[0_0_30px]', // glow on hover...
    'hover:shadow-teal-400/30', // ...in the accent colour
    'transition-all',
  ]

  it('is the full-size teal button by default', () => {
    expect(primaryButton().split(' ')).toEqual(['px-7', 'py-3', ...look])
  })

  // The mobile "Open the demo" link on /qa
  it('has a smaller, tighter variant', () => {
    expect(primaryButton('sm').split(' ')).toEqual(['px-5', 'py-2.5', 'text-sm', ...look])
  })
})
