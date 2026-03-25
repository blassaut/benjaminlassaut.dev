import { describe, it, expect } from 'vitest'
import { slugify, extractFeatureName, countScenarios, countTestRuns } from '../../lib/gherkin'

describe('gherkin utilities', () => {
  describe('slugify', () => {
    it('converts spaces to hyphens and lowercases', () => {
      expect(slugify('Visitor Connects Wallet')).toBe('visitor-connects-wallet')
    })

    it('removes special characters', () => {
      expect(slugify("Who tests the tester?")).toBe('who-tests-the-tester')
    })
  })

  describe('extractFeatureName', () => {
    it('extracts name from Feature: line', () => {
      expect(extractFeatureName('Feature: Visitor connects wallet\n  Scenario: ...')).toBe(
        'Visitor connects wallet',
      )
    })
  })

  describe('countScenarios', () => {
    it('counts Scenario and Scenario Outline lines', () => {
      const raw = `Feature: Test
  Scenario: One
    Given something
  Scenario Outline: Two
    Given <thing>
  Scenario: Three
    Given another`
      expect(countScenarios(raw)).toBe(3)
    })

    it('returns 0 for no scenarios', () => {
      expect(countScenarios('Feature: Empty')).toBe(0)
    })
  })

  describe('countTestRuns', () => {
    it('counts 3 runs per untagged scenario (desktop + 2 mobile)', () => {
      const raw = `Feature: Test
  Scenario: One
    Given something`
      expect(countTestRuns(raw)).toBe(3)
    })

    it('counts 1 run for @desktop scenario', () => {
      const raw = `Feature: Test
  @desktop
  Scenario: One
    Given something`
      expect(countTestRuns(raw)).toBe(1)
    })

    it('counts 2 runs for @mobile scenario', () => {
      const raw = `Feature: Test
  @mobile
  Scenario: One
    Given something`
      expect(countTestRuns(raw)).toBe(2)
    })

    it('multiplies Scenario Outline data rows by browser count', () => {
      const raw = `Feature: Test
  Scenario Outline: Parameterized
    Given I visit <page>
    Examples:
      | page  |
      | home  |
      | about |`
      expect(countTestRuns(raw)).toBe(6)
    })
  })
})
