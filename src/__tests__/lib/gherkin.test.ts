import { describe, it, expect } from 'vitest'
import {
  GHERKIN_KEYWORDS,
  extractFeatureName,
  countScenarios,
  countTestRuns,
} from '../../lib/gherkin'

describe('gherkin utilities', () => {
  describe('GHERKIN_KEYWORDS', () => {
    it('lists "Scenario Outline:" before "Scenario:" so the longest prefix wins', () => {
      expect(GHERKIN_KEYWORDS.indexOf('Scenario Outline:')).toBeLessThan(
        GHERKIN_KEYWORDS.indexOf('Scenario:'),
      )
    })
  })

  describe('extractFeatureName', () => {
    it('extracts name from Feature: line', () => {
      expect(extractFeatureName('Feature: Visitor connects wallet\n  Scenario: ...')).toBe(
        'Visitor connects wallet',
      )
    })

    it('tolerates a missing space after the colon and trims trailing whitespace', () => {
      expect(extractFeatureName('Feature:Wallet   \n')).toBe('Wallet')
    })

    it('only strips "Feature:" when it is the line prefix', () => {
      expect(extractFeatureName('Scenario: Feature: nested')).toBe('Scenario: Feature: nested')
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

    it('ignores "Scenario:" appearing inside a step', () => {
      const raw = `Feature: Test
  Scenario: One
    Given the text "Scenario: not a heading"`
      expect(countScenarios(raw)).toBe(1)
    })
  })

  describe('countTestRuns', () => {
    // Today's playwright.config.ts: 1 desktop project, 2 mobile ones
    const CURRENT = { desktop: 1, mobile: 2 }

    it('follows the number of projects per form, so the /qa stats track playwright.config.ts', () => {
      const raw = [
        'Feature: X',
        '  Scenario: untagged',
        '  @desktop',
        '  Scenario: desktop only',
        '  @mobile',
        '  Scenario Outline: mobile rows',
        '    Examples:',
        '      | n |',
        '      | 1 |',
        '      | 2 |',
      ].join('\n')
      // untagged: 2 + 3, @desktop: 2, two @mobile rows: 2 x 3
      expect(countTestRuns(raw, { desktop: 2, mobile: 3 })).toBe(5 + 2 + 6)
    })

    it('counts 3 runs per untagged scenario (desktop + 2 mobile)', () => {
      const raw = `Feature: Test
  Scenario: One
    Given something`
      expect(countTestRuns(raw, CURRENT)).toBe(3)
    })

    it('counts 1 run for @desktop scenario', () => {
      const raw = `Feature: Test
  @desktop
  Scenario: One
    Given something`
      expect(countTestRuns(raw, CURRENT)).toBe(1)
    })

    it('counts 2 runs for @mobile scenario', () => {
      const raw = `Feature: Test
  @mobile
  Scenario: One
    Given something`
      expect(countTestRuns(raw, CURRENT)).toBe(2)
    })

    it('recognises a tag followed by other tags on the same line', () => {
      const desktop = `Feature: Test
  @desktop @slow
  Scenario: One
    Given something`
      const mobile = `Feature: Test
  @mobile @slow
  Scenario: One
    Given something`
      expect(countTestRuns(desktop, CURRENT)).toBe(1)
      expect(countTestRuns(mobile, CURRENT)).toBe(2)
    })

    it('resets the tag after each scenario', () => {
      const raw = `Feature: Test
  @desktop
  Scenario: One
    Given something
  Scenario: Two
    Given something else`
      expect(countTestRuns(raw, CURRENT)).toBe(1 + 3)
    })

    it('does not count "Scenario:" or "Scenario Outline:" inside a step', () => {
      const raw = `Feature: Test
  Scenario: One
    Given the text "Scenario: nope"
    And the text "Scenario Outline: nope"
      | with  |
      | a     |
      | table |`
      expect(countTestRuns(raw, CURRENT)).toBe(3)
    })

    it('multiplies Scenario Outline data rows by browser count', () => {
      const raw = `Feature: Test
  Scenario Outline: Parameterized
    Given I visit <page>
    Examples:
      | page  |
      | home  |
      | about |`
      expect(countTestRuns(raw, CURRENT)).toBe(6)
    })

    it('applies @desktop and @mobile tags to Scenario Outline rows', () => {
      const outline = (tag: string) => `Feature: Test
  ${tag}
  Scenario Outline: Parameterized
    Given I visit <page>
    Examples:
      | page  |
      | home  |
      | about |`
      expect(countTestRuns(outline('@desktop'), CURRENT)).toBe(2)
      expect(countTestRuns(outline('@mobile'), CURRENT)).toBe(4)
    })

    it('skips the header row of every Examples block', () => {
      const raw = `Feature: Test
  Scenario Outline: Parameterized
    Given I visit <page>
    Examples: first set
      | page |
      | home |
    Examples: second set
      | page  |
      | about |`
      expect(countTestRuns(raw, CURRENT)).toBe(6)
    })

    it('ignores blank lines inside an Examples block', () => {
      const raw = `Feature: Test
  Scenario Outline: Parameterized
    Given I visit <page>
    Examples:
      | page  |
      | home  |

      | about |
`
      expect(countTestRuns(raw, CURRENT)).toBe(6)
    })

    it('ignores tables that do not belong to a Scenario Outline', () => {
      const raw = `Feature: Test
  Background:
    Given these users
      | name  |
      | alice |
      | bob   |
  Scenario Outline: Parameterized
    Given I visit <page>
    Examples:
      | page |
      | home |
  Scenario: With a data table
    Given these rows
      | a |
      | b |
      | c |`
      expect(countTestRuns(raw, CURRENT)).toBe(3 + 3)
    })
  })
})
