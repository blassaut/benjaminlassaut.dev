#!/usr/bin/env node
/**
 * E2E mutation runner.
 *
 *   node e2e/mutation/run.ts [options]
 *
 * For every mutant in the catalog:
 *   1. run the scenarios in its scope without the mutant (baseline, must be green),
 *   2. run the same scenarios with the mutant planted,
 *   3. classify: killed (a test failed), survived (all green), not-applied
 *      (green, but the mutant never changed anything), and a few error states.
 *
 * Writes reports/mutation-e2e/report.{json,md} and exits 1 when at least one
 * mutant is not killed, so it can be used as a CI gate.
 *
 * Options: see USAGE below.
 */
import { execSync, spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { CatalogError, loadCatalog, type Mutant } from './catalog.ts'
import { config } from './config.ts'

const NOT_APPLIED_ANNOTATION = 'mutant-not-applied'

const USAGE = `Usage: node e2e/mutation/run.ts [options]

  --list                 print the catalog and exit
  --only <ids>           comma-separated mutant ids
  --changed-since <ref>  only mutants whose scope includes a test file changed since <ref>
  --project <name>       forward to Playwright (--project)
  --stability <n>        run the baseline n times (default 1)
  --no-fail              always exit 0 (informational run)
`

type Status = 'killed' | 'survived' | 'not-applied' | 'no-tests' | 'baseline-failed' | 'error'

interface TestOutcome {
  title: string
  project: string
  passed: boolean
  notApplied: boolean
}

interface MutantResult {
  mutant: Mutant
  status: Status
  killedBy: string[]
  tests: number
  durationMs: number
  details?: string
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const { values: options } = parseArgs({
  options: {
    list: { type: 'boolean', default: false },
    only: { type: 'string' },
    'changed-since': { type: 'string' },
    project: { type: 'string' },
    stability: { type: 'string', default: '1' },
    'no-fail': { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  },
})

if (options.help) {
  console.log(USAGE)
  process.exit(0)
}

main().catch((err) => {
  console.error(err instanceof CatalogError ? `Catalog error: ${err.message}` : err)
  process.exit(2)
})

// ---------------------------------------------------------------------------
// Main flow
// ---------------------------------------------------------------------------

async function main() {
  const all = loadCatalog()
  const selected = selectMutants(all)

  if (options.list) {
    printCatalog(selected)
    return
  }
  if (selected.length === 0) {
    console.log('No mutant selected. Nothing to run.')
    return
  }

  if (config.prepareCommand) run(config.prepareCommand)

  const results: MutantResult[] = []
  const baselineCache = new Map<string, { ok: boolean; details?: string }>()
  const stability = Math.max(1, Number(options.stability))

  console.log(`\nRunning ${selected.length} mutant(s), baseline x${stability}\n`)

  for (const mutant of selected) {
    const scopeKey = scopeArgs(mutant).join(' ')
    process.stdout.write(`▶ ${mutant.id.padEnd(46)} `)
    const started = Date.now()

    let baseline = baselineCache.get(scopeKey)
    if (!baseline) {
      baseline = { ok: true }
      for (let i = 0; i < stability && baseline.ok; i++) {
        const outcome = runPlaywright(mutant, null)
        if (outcome.error) baseline = { ok: false, details: outcome.error }
        else if (outcome.tests.length === 0) baseline = { ok: false, details: 'scope matches no test' }
        else if (outcome.tests.some((t) => !t.passed)) {
          baseline = { ok: false, details: `baseline red: ${outcome.tests.filter((t) => !t.passed).map(label).join('; ')}` }
        }
      }
      baselineCache.set(scopeKey, baseline)
    }

    let result: MutantResult
    if (!baseline.ok) {
      const status: Status = baseline.details === 'scope matches no test' ? 'no-tests' : 'baseline-failed'
      result = { mutant, status, killedBy: [], tests: 0, durationMs: 0, details: baseline.details }
    } else {
      const outcome = runPlaywright(mutant, mutant.id)
      result = classify(mutant, outcome)
    }
    result.durationMs = Date.now() - started
    results.push(result)
    console.log(`${icon(result.status)} ${result.status}${result.killedBy.length ? `  (${result.killedBy.length} test(s))` : ''}  ${(result.durationMs / 1000).toFixed(0)}s`)
  }

  writeReports(results)
  printSummary(results)

  const bad = results.filter((r) => r.status !== 'killed')
  if (bad.length > 0 && !options['no-fail']) process.exit(1)
}

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------

function selectMutants(all: Mutant[]): Mutant[] {
  let selected = all
  if (options.only) {
    const ids = options.only.split(',').map((s) => s.trim())
    for (const id of ids) {
      if (!all.some((m) => m.id === id)) throw new CatalogError(`--only: unknown mutant "${id}"`)
    }
    selected = selected.filter((m) => ids.includes(m.id))
  }
  if (options['changed-since']) {
    const changed = changedFilesSince(options['changed-since'])
    const sharedCodeChanged = changed.some((f) => !f.endsWith(config.testFileExtension) && f.startsWith('e2e/'))
    if (!sharedCodeChanged) {
      const changedTests = changed
        .filter((f) => f.endsWith(config.testFileExtension))
        .map((f) => f.split('/').pop()!.replace(config.testFileExtension, ''))
      selected = selected.filter((m) => m.scope.files.some((f) => changedTests.includes(f)))
      console.log(`Changed test files since ${options['changed-since']}: ${changedTests.join(', ') || 'none'}`)
    } else {
      console.log(`Shared e2e code changed since ${options['changed-since']}: running every mutant`)
    }
  }
  return selected
}

function changedFilesSince(ref: string): string[] {
  const out = execSync(`git diff --name-only ${ref}...HEAD -- e2e/`, { encoding: 'utf8' })
  return out.split('\n').filter(Boolean)
}

// ---------------------------------------------------------------------------
// Running Playwright
// ---------------------------------------------------------------------------

/** File filters and tag grep derived from the mutant scope, as Playwright CLI args. */
function scopeArgs(mutant: Mutant): string[] {
  const args = [...mutant.scope.files]
  if (mutant.scope.tags?.length) args.push('--grep', mutant.scope.tags.join('|'))
  if (options.project) args.push('--project', options.project)
  return args
}

function runPlaywright(mutant: Mutant, mutantId: string | null): { tests: TestOutcome[]; error?: string } {
  const jsonFile = resolve(config.reportDir, 'tmp', `${mutantId ?? 'baseline'}.json`)
  mkdirSync(resolve(config.reportDir, 'tmp'), { recursive: true })
  rmSync(jsonFile, { force: true })

  const args = [...scopeArgs(mutant), '--retries=0', '--reporter=json']
  const command = `${config.playwrightCommand} ${args.map(quote).join(' ')}`

  const env = { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: jsonFile, CI: process.env.CI ?? '' }
  if (mutantId) env.MUTANT = mutantId
  else delete env.MUTANT

  const proc = spawnSync(command, { shell: true, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  if (!existsSync(jsonFile)) {
    return { tests: [], error: `Playwright produced no report (exit ${proc.status}).\n${proc.stderr}\n${proc.stdout}`.trim() }
  }
  return { tests: parseReport(JSON.parse(readFileSync(jsonFile, 'utf8'))) }
}

/** Flattens Playwright's JSON report into one outcome per test × project. */
function parseReport(report: { suites?: Suite[] }): TestOutcome[] {
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

interface Suite {
  title: string
  specs?: { title: string; tests?: { projectName: string; status: string; annotations?: { type: string }[] }[] }[]
  suites?: Suite[]
}

function classify(mutant: Mutant, outcome: { tests: TestOutcome[]; error?: string }): MutantResult {
  const base = { mutant, killedBy: [] as string[], tests: outcome.tests.length, durationMs: 0 }
  if (outcome.error) return { ...base, status: 'error', details: outcome.error }
  const failed = outcome.tests.filter((t) => !t.passed)
  if (failed.length > 0) return { ...base, status: 'killed', killedBy: failed.map(label) }
  if (outcome.tests.every((t) => t.notApplied)) return { ...base, status: 'not-applied' }
  return { ...base, status: 'survived' }
}

function label(t: TestOutcome): string {
  return `${t.title} [${t.project}]`
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

function writeReports(results: MutantResult[]) {
  mkdirSync(config.reportDir, { recursive: true })
  rmSync(resolve(config.reportDir, 'tmp'), { recursive: true, force: true })

  const generatedAt = new Date().toISOString()
  writeFileSync(
    join(config.reportDir, 'report.json'),
    JSON.stringify({ generatedAt, results: results.map((r) => ({ ...r, mutant: { ...r.mutant } })) }, null, 2),
  )

  const counts = countBy(results)
  const lines = [
    '# E2E mutation report',
    '',
    `Generated ${generatedAt} · ${results.length} mutant(s) · ` +
      Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(' · '),
    '',
    '| Status | Mutant | Ticket | Concern | Scope | Killed by | Time |',
    '|---|---|---|---|---|---|---|',
    ...results.map(
      (r) =>
        `| ${icon(r.status)} ${r.status} | \`${r.mutant.id}\` | ${r.mutant.ticket} | ${r.mutant.concern} | ${r.mutant.scope.files.join(', ')}${r.mutant.scope.tags ? ' ' + r.mutant.scope.tags.join(' ') : ''} | ${r.killedBy.length ? `${r.killedBy.length} test(s)` : '—'} | ${(r.durationMs / 1000).toFixed(0)}s |`,
    ),
  ]

  const todo = results.filter((r) => r.status !== 'killed')
  if (todo.length > 0) {
    lines.push('', '## Action required', '')
    for (const r of todo) {
      lines.push(`### ${icon(r.status)} \`${r.mutant.id}\` — ${r.status}`, '')
      lines.push(`- **Ticket:** ${r.mutant.ticket}`)
      lines.push(`- **Concern:** ${r.mutant.concern}`)
      lines.push(`- **A good test would:** ${r.mutant.expect}`)
      lines.push(`- **Catalog file:** ${r.mutant.file}`)
      lines.push(`- **Next step:** ${nextStep(r.status)}`)
      if (r.details) lines.push('', '```', r.details.slice(0, 2000), '```')
      lines.push('')
    }
  }
  writeFileSync(join(config.reportDir, 'report.md'), lines.join('\n') + '\n')
}

function nextStep(status: Status): string {
  switch (status) {
    case 'survived':
      return 'the scenarios in scope ran green with this bug planted. Add the missing assertion, then re-run with --only.'
    case 'not-applied':
      return 'the mutant never changed anything. Fix its selector/url in the catalog, or widen its scope to scenarios that reach the mutated element.'
    case 'no-tests':
      return 'no scenario matches this scope. Check scope.files and scope.tags.'
    case 'baseline-failed':
      return 'the scenarios fail without any mutant. Fix the suite first; a red baseline makes every result meaningless.'
    case 'error':
      return 'Playwright could not run. See details.'
    default:
      return ''
  }
}

function printCatalog(mutants: Mutant[]) {
  console.log(`\n${mutants.length} mutant(s)\n`)
  for (const m of mutants) {
    console.log(`  ${m.id}`)
    console.log(`      ${m.ticket} · ${m.concern}`)
    console.log(`      scope: ${m.scope.files.join(', ')}${m.scope.tags ? ' ' + m.scope.tags.join(' ') : ''} · ${m.dom ? `dom (${m.dom.length} op)` : 'response'}`)
  }
  console.log()
}

function printSummary(results: MutantResult[]) {
  const counts = countBy(results)
  console.log('\n' + Object.entries(counts).map(([k, v]) => `${icon(k as Status)} ${k}: ${v}`).join('   '))
  console.log(`\nReport: ${config.reportDir}/report.md\n`)
}

function countBy(results: MutantResult[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const r of results) counts[r.status] = (counts[r.status] ?? 0) + 1
  return counts
}

function icon(status: Status): string {
  return { killed: '✅', survived: '🟥', 'not-applied': '⚠️', 'no-tests': '⚠️', 'baseline-failed': '⛔', error: '💥' }[status]
}

function run(command: string) {
  const proc = spawnSync(command, { shell: true, stdio: 'inherit' })
  if (proc.status !== 0) throw new Error(`Command failed: ${command}`)
}

function quote(arg: string): string {
  return /^[\w./=@|-]+$/.test(arg) ? arg : `'${arg.replace(/'/g, "'\\''")}'`
}
