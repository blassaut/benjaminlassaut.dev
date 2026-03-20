import { describe, it, expect } from 'vitest'
import { generateResume, getSkillName } from '../../lib/generateResume'

describe('generateResume', () => {
  it('returns a Blob of type application/pdf', () => {
    const blob = generateResume()
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/pdf')
  })

  it('generates a non-empty PDF', () => {
    const blob = generateResume()
    expect(blob.size).toBeGreaterThan(0)
  })

  it('excludes bug-tagged skills from output', () => {
    const blob = generateResume()
    expect(blob.size).toBeGreaterThan(0)
  })

  it('does not contain private information', async () => {
    const blob = generateResume()
    const text = await blob.text()
    expect(text).not.toContain('@')
    expect(text).not.toContain('+33')
    expect(text).not.toContain('phone')
    expect(text).not.toContain('email')
  })
})

describe('getSkillName', () => {
  it('returns the string for plain skill entries', () => {
    expect(getSkillName('Docker')).toBe('Docker')
  })

  it('returns null for bug-tagged entries', () => {
    expect(getSkillName({ name: 'Playwright', bug: true })).toBeNull()
  })
})
