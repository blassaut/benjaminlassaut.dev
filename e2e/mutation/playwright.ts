/**
 * Running Playwright for one mutant (or its baseline) and turning the JSON
 * report into a verdict. Everything except runPlaywright() is pure.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Mutant } from './catalog.ts'
import { config } from './config.ts'
import { NOT_APPLIED_ANNOTATION } from './inject.ts'

export type Status = 'killed' | 'survived' | 'not-applied' | 'no-tests' | 'baseline-failed' | 'error'

export interface TestOutcome {
  title: string
  project: string
  passed: boolean
  notApplied: boolean
}

export interface RunOutcome {
  tests: TestOutcome[]
  error?: string
}

export interface MutantResult {
  mutant: Mutant
  status: Status
  /** Failing tests. Mutant runs stop at the first failure, so usually one. */
  killedBy: string[]
  tests: number
  durationMs: number
  details?: string
}

export interface RunSettings {
  project?: string
  workers: string
}

/** File filters and tag grep derived from the mutant scope. Identical scopes share one baseline. */
export function scopeArgs(mutant: Mutant, { project }: Pick<RunSettings, 'project'>): string[] {
  const args = [...mutant.scope.files]
  if (mutant.scope.tags?.length) args.push('--grep', mutant.scope.tags.join('|'))
  if (project) args.push('--project', project)
  return args
}

/**
 * Full Playwright arguments. A mutant run stops at the first failing test:
 * one failure is enough to call it killed. A baseline runs everything, since
 * any red test there invalidates the verdict.
 */
export function playwrightArgs(mutant: Mutant, settings: RunSettings, isMutantRun: boolean): string[] {
  const args = [...scopeArgs(mutant, settings), '--retries=0', `--workers=${settings.workers}`, '--reporter=json']
  if (isMutantRun) args.push('--max-failures=1')
  return args
}

export function runPlaywright(mutant: Mutant, mutantId: string | null, settings: RunSettings): RunOutcome {
  const tmpDir = resolve(config.reportDir, 'tmp')
  const jsonFile = resolve(tmpDir, `${mutantId ?? 'baseline'}.json`)
  mkdirSync(tmpDir, { recursive: true })
  rmSync(jsonFile, { force: true })

  const env: NodeJS.ProcessEnv = { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: jsonFile, CI: process.env.CI ?? '' }
  if (mutantId) env.MUTANT = mutantId
  else delete env.MUTANT

  const [program, ...baseArgs] = config.playwrightCommand
  const proc = spawnSync(program, [...baseArgs, ...playwrightArgs(mutant, settings, mutantId !== null)], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (!existsSync(jsonFile)) {
    return { tests: [], error: `Playwright produced no report (exit ${proc.status}).\n${proc.stderr}\n${proc.stdout}`.trim() }
  }
  return { tests: parseReport(JSON.parse(readFileSync(jsonFile, 'utf8'))) }
}

interface Suite {
  title: string
  specs?: { title: string; tests?: { projectName: string; status: string; annotations?: { type: string }[] }[] }[]
  suites?: Suite[]
}

/** Flattens Playwright's JSON report into one outcome per test × project. */
export function parseReport(report: { suites?: Suite[] }): TestOutcome[] {
  const outcomes: TestOutcome[] = []
  const walk = (suite: Suite, path: string[]) => {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        outcomes.push({
          title: [...path, spec.title].join(' › '),
          project: test.projectName,
          passed: test.status === 'expected' || test.status === 'skipped',
          notApplied: (test.annotations ?? []).some((a) => a.type === NOT_APPLIED_ANNOTATION),
        })
      }
    }
    for (const child of suite.suites ?? []) walk(child, [...path, child.title])
  }
  for (const suite of report.suites ?? []) walk(suite, [suite.title])
  return outcomes
}

/** Verdict for a mutant run whose baseline was green. */
export function classify(mutant: Mutant, outcome: RunOutcome): MutantResult {
  const base = { mutant, killedBy: [] as string[], tests: outcome.tests.length, durationMs: 0 }
  if (outcome.error) return { ...base, status: 'error', details: outcome.error }
  const failed = outcome.tests.filter((t) => !t.passed)
  if (failed.length > 0) return { ...base, status: 'killed', killedBy: failed.map(label) }
  if (outcome.tests.every((t) => t.notApplied)) return { ...base, status: 'not-applied' }
  return { ...base, status: 'survived' }
}

/** Verdict for a baseline run: undefined when green. */
export function baselineProblem(outcome: RunOutcome): { status: Status; details: string } | undefined {
  if (outcome.error) return { status: 'baseline-failed', details: outcome.error }
  if (outcome.tests.length === 0) return { status: 'no-tests', details: 'scope matches no test' }
  const red = outcome.tests.filter((t) => !t.passed)
  if (red.length > 0) return { status: 'baseline-failed', details: `baseline red: ${red.map(label).join('; ')}` }
  return undefined
}

export function label(t: TestOutcome): string {
  return `${t.title} [${t.project}]`
}
