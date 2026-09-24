#!/usr/bin/env node
/**
 * E2E mutation runner.
 *
 *   node e2e/mutation/run.ts [options]
 *
 * For every mutant in the catalog:
 *   1. run the scenarios in its scope without the mutant (baseline, must be green),
 *   2. run the same scenarios with the mutant planted, stopping at the first failure,
 *   3. classify: killed (a test failed), survived (all green), not-applied
 *      (green, but the mutant never changed anything), and a few error states.
 *
 * Writes reports/mutation-e2e/report.{json,md} and exits 1 when at least one
 * mutant is not killed, so it can be used as a CI gate.
 *
 * This file is the CLI and the main loop; the logic lives in select.ts,
 * playwright.ts and report.ts.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { CatalogError, loadCatalog } from './catalog.ts'
import { config } from './config.ts'
import {
  baselineProblem,
  classify,
  runPlaywright,
  scopeArgs,
  type MutantResult,
  type RunSettings,
  type Status,
} from './playwright.ts'
import { icon, printCatalog, printSummary, writeReports } from './report.ts'
import { selectMutants } from './select.ts'

const USAGE = `Usage: node e2e/mutation/run.ts [options]

  --list                 print the catalog and exit
  --only <ids>           comma-separated mutant ids
  --changed-since <ref>  only mutants the e2e changes since <ref> can affect
  --project <name>       forward to Playwright (--project)
  --workers <n|n%>       Playwright workers per run (default ${config.workers})
  --stability <n>        run the baseline n times (default 1)
  --no-fail              always exit 0 (informational run)
`

const { values: options } = parseArgs({
  options: {
    list: { type: 'boolean', default: false },
    only: { type: 'string' },
    'changed-since': { type: 'string' },
    project: { type: 'string' },
    workers: { type: 'string', default: config.workers },
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

async function main() {
  const since = options['changed-since']
  const { mutants: selected, reason } = selectMutants(loadCatalog(), {
    only: options.only,
    changedFiles: since ? changedFilesSince(since) : undefined,
  })
  if (reason) console.log(`Since ${since}, ${reason}`)

  if (options.list) {
    printCatalog(selected)
    return
  }
  if (selected.length === 0) {
    console.log('No mutant selected. Nothing to run.')
    return
  }

  if (config.prepareCommand) run(config.prepareCommand)

  const settings: RunSettings = { project: options.project, workers: options.workers }
  const stability = Math.max(1, Number(options.stability))
  const baselines = new Map<string, { status: Status; details: string } | undefined>()
  const results: MutantResult[] = []

  console.log(`\nRunning ${selected.length} mutant(s), baseline x${stability}, workers ${settings.workers}\n`)

  for (const mutant of selected) {
    process.stdout.write(`▶ ${mutant.id.padEnd(46)} `)
    const started = Date.now()

    const scopeKey = scopeArgs(mutant, settings).join(' ')
    if (!baselines.has(scopeKey)) {
      let problem: ReturnType<typeof baselineProblem>
      for (let i = 0; i < stability && !problem; i++) problem = baselineProblem(runPlaywright(mutant, null, settings))
      baselines.set(scopeKey, problem)
    }
    const problem = baselines.get(scopeKey)

    const result: MutantResult = problem
      ? { mutant, status: problem.status, killedBy: [], tests: 0, durationMs: 0, details: problem.details }
      : classify(mutant, runPlaywright(mutant, mutant.id, settings))
    result.durationMs = Date.now() - started
    results.push(result)
    console.log(`${icon(result.status)} ${result.status}  ${(result.durationMs / 1000).toFixed(0)}s${result.killedBy[0] ? `  ← ${result.killedBy[0]}` : ''}`)
  }

  writeReports(results, config.reportDir)
  printSummary(results, config.reportDir)

  const bad = results.filter((r) => r.status !== 'killed')
  if (bad.length > 0 && !options['no-fail']) process.exit(1)
}

function changedFilesSince(ref: string): string[] {
  const out = execFileSync('git', ['diff', '--name-only', `${ref}...HEAD`, '--', 'e2e/'], { encoding: 'utf8' })
  return out.split('\n').filter(Boolean)
}

function run(command: string) {
  const proc = spawnSync(command, { shell: true, stdio: 'inherit' })
  if (proc.status !== 0) throw new Error(`Command failed: ${command}`)
}
