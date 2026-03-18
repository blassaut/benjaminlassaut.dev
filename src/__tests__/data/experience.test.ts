import { describe, it, expect } from 'vitest'
import { experience } from '../../data/experience'

describe('experience data', () => {
  it('contains at least one entry', () => {
    expect(experience.length).toBeGreaterThan(0)
  })

  it('has exactly one current role', () => {
    const currentRoles = experience.filter((e) => e.current)
    expect(currentRoles).toHaveLength(1)
  })

  it('every entry has required fields', () => {
    for (const entry of experience) {
      expect(entry.company).toBeTruthy()
      expect(entry.role).toBeTruthy()
      expect(entry.period).toBeTruthy()
      expect(entry.highlights.length).toBeGreaterThan(0)
    }
  })

  it('is ordered newest first', () => {
    const first = experience[0]
    expect(first.current).toBe(true)
  })
})
