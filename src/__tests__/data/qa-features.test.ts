import { describe, it, expect } from 'vitest'
import { readdirSync } from 'node:fs'
import { siteFeatures } from '../../data/qa-features'
import { extractFeatureName } from '../../lib/gherkin'

describe('siteFeatures', () => {
  it('includes every feature file of the e2e suite, so /qa stats never go stale', () => {
    const files = readdirSync('e2e/features').filter((f) => f.endsWith('.feature'))
    expect(siteFeatures).toHaveLength(files.length)
  })

  it('lists the page\'s own feature first, then the pinned order', () => {
    expect(siteFeatures.map(extractFeatureName)).toEqual([
      'Visitor explores "Who tests the tester?"',
      'Recruiter visits portfolio',
      'Visitor navigates the site',
      'Visitor contacts Benjamin',
      'Visitor toggles the color theme',
      'Visitor finds the deliberate bug easter egg',
      'Visitor reads the legal notice',
    ])
  })
})
