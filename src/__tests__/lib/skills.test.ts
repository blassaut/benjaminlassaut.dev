import { describe, it, expect } from 'vitest'
import { getSkillName, isBugSkill } from '../../lib/skills'

describe('getSkillName', () => {
  it('shows a plain skill under its own label', () => {
    expect(getSkillName('Docker')).toBe('Docker')
  })

  it('shows the planted duplicate on the site under its name, not as an object or blank', () => {
    expect(getSkillName({ name: 'Playwright', bug: true })).toBe('Playwright')
  })
})

describe('isBugSkill', () => {
  it('flags the planted duplicate, so the site gives it the bug popover and the PDF drops it', () => {
    expect(isBugSkill({ name: 'Playwright', bug: true })).toBe(true)
  })

  it('leaves a plain skill alone, so it renders as a normal tag and stays in the PDF', () => {
    expect(isBugSkill('Playwright')).toBe(false)
  })
})
