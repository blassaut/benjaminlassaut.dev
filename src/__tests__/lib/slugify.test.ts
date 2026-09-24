import { describe, it, expect } from 'vitest'
import { slugify } from '../../lib/slugify'

describe('slugify', () => {
  it('converts spaces to hyphens and lowercases', () => {
    expect(slugify('Visitor Connects Wallet')).toBe('visitor-connects-wallet')
  })

  it('collapses consecutive whitespace into a single hyphen', () => {
    expect(slugify('Visitor   connects\twallet')).toBe('visitor-connects-wallet')
  })

  it('removes special characters', () => {
    expect(slugify('Who tests the tester?')).toBe('who-tests-the-tester')
  })
})
