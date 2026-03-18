import { describe, it, expect } from 'vitest'
import { skillCategories } from '../../data/skills'

describe('skills data', () => {
  it('contains at least one category', () => {
    expect(skillCategories.length).toBeGreaterThan(0)
  })

  it('every category has a name and at least one skill', () => {
    for (const category of skillCategories) {
      expect(category.name).toBeTruthy()
      expect(category.skills.length).toBeGreaterThan(0)
    }
  })

  it('has no duplicate category names', () => {
    const names = skillCategories.map((c) => c.name)
    expect(new Set(names).size).toBe(names.length)
  })
})
