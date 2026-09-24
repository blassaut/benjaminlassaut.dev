// @vitest-environment node
import { describe, it, expect } from 'vitest'
import type { Mutant } from './catalog.ts'
import { NOT_APPLIED_ANNOTATION } from './inject.ts'
import { baselineProblem, classify, parseReport, playwrightArgs, type TestOutcome } from './playwright.ts'

const mutant: Mutant = {
  id: 'nav-menu',
  ticket: 'T-1',
  concern: 'c',
  expect: 'e',
  scope: { files: ['visitor-navigates-site'], tags: ['@mobile'] },
  dom: [{ remove: 'a' }],
  file: 'e2e/mutation/mutants/navigation.yaml',
}

const pass = (title: string): TestOutcome => ({ title, project: 'desktop-chrome', passed: true, notApplied: false })
const fail = (title: string): TestOutcome => ({ ...pass(title), passed: false })

describe('playwrightArgs', () => {
  it('stops a mutant run at the first failure: one failing test is enough to call it killed', () => {
    expect(playwrightArgs(mutant, { workers: '50%' }, true)).toEqual([
      'visitor-navigates-site', '--grep', '@mobile', '--retries=0', '--workers=50%', '--reporter=json', '--max-failures=1',
    ])
  })

  it('runs the whole scope for a baseline, since any red test invalidates the verdict', () => {
    expect(playwrightArgs(mutant, { workers: '2', project: 'desktop-chrome' }, false)).toEqual([
      'visitor-navigates-site', '--grep', '@mobile', '--project', 'desktop-chrome', '--retries=0', '--workers=2', '--reporter=json',
    ])
  })
})

describe('parseReport', () => {
  it('flattens nested suites into one outcome per test and project', () => {
    const outcomes = parseReport({
      suites: [
        {
          title: 'nav.feature.spec.js',
          suites: [
            {
              title: 'Visitor navigates',
              specs: [
                {
                  title: 'Mobile menu',
                  tests: [
                    { projectName: 'mobile-safari', status: 'expected' },
                    { projectName: 'mobile-android', status: 'unexpected', annotations: [{ type: NOT_APPLIED_ANNOTATION }] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
    expect(outcomes).toEqual([
      { title: 'nav.feature.spec.js › Visitor navigates › Mobile menu', project: 'mobile-safari', passed: true, notApplied: false },
      { title: 'nav.feature.spec.js › Visitor navigates › Mobile menu', project: 'mobile-android', passed: false, notApplied: true },
    ])
  })
})

describe('classify', () => {
  it('is killed as soon as one test fails, and names it', () => {
    const r = classify(mutant, { tests: [pass('a'), fail('b')] })
    expect(r.status).toBe('killed')
    expect(r.killedBy).toEqual(['b [desktop-chrome]'])
  })

  it('survives when every test passes and the mutant changed something', () => {
    expect(classify(mutant, { tests: [pass('a'), { ...pass('b'), notApplied: true }] }).status).toBe('survived')
  })

  it('is not-applied when every test passes but the mutant never changed the page', () => {
    expect(classify(mutant, { tests: [{ ...pass('a'), notApplied: true }] }).status).toBe('not-applied')
  })

  it('reports a Playwright crash as an error, not as a kill', () => {
    const r = classify(mutant, { tests: [], error: 'boom' })
    expect(r.status).toBe('error')
    expect(r.details).toBe('boom')
  })
})

describe('baselineProblem', () => {
  it('accepts a green baseline', () => {
    expect(baselineProblem({ tests: [pass('a')] })).toBeUndefined()
  })

  it('flags a red baseline with the failing tests', () => {
    expect(baselineProblem({ tests: [pass('a'), fail('b')] })).toEqual({
      status: 'baseline-failed',
      details: 'baseline red: b [desktop-chrome]',
    })
  })

  it('flags a scope that matches no test', () => {
    expect(baselineProblem({ tests: [] })).toEqual({ status: 'no-tests', details: 'scope matches no test' })
  })
})
