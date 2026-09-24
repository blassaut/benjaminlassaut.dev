/**
 * Mutation gate for pull requests: fails when a Stryker mutant on a line the
 * PR adds or changes is not killed. The global `thresholds.break` only guards
 * the overall score; this guards the new code.
 *
 *   node scripts/mutation-gate.ts [--base origin/main] [--report reports/mutation/mutation.json]
 *
 * A mutant skipped on purpose with `// Stryker disable next-line <Mutator>: <reason>`
 * is reported as Ignored and does not fail the gate.
 */
import { execFileSync } from 'node:child_process'
import { appendFileSync, readFileSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

interface Position {
  line: number
  column: number
}

export interface ReportMutant {
  id: string
  mutatorName: string
  replacement?: string
  status: string
  location: { start: Position; end: Position }
}

export interface MutationReport {
  files: Record<string, { source?: string; mutants: ReportMutant[] }>
}

export interface Uncaught {
  file: string
  line: number
  column: number
  mutator: string
  status: string
  original: string
  replacement: string
}

/** Statuses that mean no test noticed the mutant. */
const UNCAUGHT = new Set(['Survived', 'NoCoverage'])

/** Lines added or changed per file, from `git diff --unified=0` output. */
export function parseChangedLines(diff: string): Map<string, Set<number>> {
  const changed = new Map<string, Set<number>>()
  let current: Set<number> | undefined
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) {
      const path = line.slice(4)
      current = path === '/dev/null' ? undefined : new Set()
      if (current) changed.set(path.replace(/^b\//, ''), current)
      continue
    }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line)
    if (hunk && current) {
      const start = Number(hunk[1])
      const count = hunk[2] === undefined ? 1 : Number(hunk[2])
      for (let n = start; n < start + count; n++) current.add(n)
    }
  }
  return changed
}

/** Mutants that no test killed, on at least one changed line. */
export function findUncaughtOnChangedLines(report: MutationReport, changed: Map<string, Set<number>>): Uncaught[] {
  const uncaught: Uncaught[] = []
  for (const [file, { source, mutants }] of Object.entries(report.files)) {
    const lines = changed.get(file)
    if (!lines) continue
    for (const m of mutants) {
      if (!UNCAUGHT.has(m.status)) continue
      const { start, end } = m.location
      let touched = false
      for (let n = start.line; n <= end.line && !touched; n++) touched = lines.has(n)
      if (!touched) continue
      uncaught.push({
        file,
        line: start.line,
        column: start.column,
        mutator: m.mutatorName,
        status: m.status,
        original: source ? excerpt(source, m.location) : '',
        replacement: m.replacement ?? '',
      })
    }
  }
  return uncaught.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column)
}

/** Source text of a mutant's location (1-based lines and columns), single-lined and shortened. */
function excerpt(source: string, { start, end }: { start: Position; end: Position }): string {
  const lines = source.split('\n').slice(start.line - 1, end.line)
  if (lines.length === 0) return ''
  lines[lines.length - 1] = lines[lines.length - 1].slice(0, end.column - 1)
  lines[0] = lines[0].slice(start.column - 1)
  const text = lines.join(' ').replace(/\s+/g, ' ').trim()
  return text.length > 80 ? `${text.slice(0, 77)}...` : text
}

/**
 * GitHub workflow command that annotates the PR diff. Escaped as GitHub
 * requires: `%`, CR and LF everywhere, plus `:` and `,` in property values.
 */
export function formatAnnotation(u: Uncaught): string {
  const data = (s: string) => s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
  const property = (s: string) => data(s).replace(/:/g, '%3A').replace(/,/g, '%2C')
  const message = `${u.mutator} mutant ${u.status.toLowerCase()}: ${u.original} → ${u.replacement}`
  return `::error file=${property(u.file)},line=${u.line},col=${u.column}::${data(message)}`
}

export function formatMarkdown(uncaught: Uncaught[]): string {
  if (uncaught.length === 0) return '### Mutation gate: every mutant on a changed line was killed ✅\n'
  return [
    `### Mutation gate: ${uncaught.length} mutant(s) on changed lines not killed ❌`,
    '',
    'Add a test that fails because of the change, or skip it on purpose with',
    '`// Stryker disable next-line <Mutator>: <reason>` above the line.',
    '',
    '| Where | Mutator | Status | Original | Mutated to |',
    '|---|---|---|---|---|',
    ...uncaught.map(
      (u) => `| \`${u.file}:${u.line}\` | ${u.mutator} | ${u.status} | \`${cell(u.original)}\` | \`${cell(u.replacement)}\` |`,
    ),
    '',
  ].join('\n')
}

function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/`/g, "'")
}

function main() {
  const { values } = parseArgs({
    options: {
      base: { type: 'string', default: 'origin/main' },
      report: { type: 'string', default: 'reports/mutation/mutation.json' },
    },
  })
  const report: MutationReport = JSON.parse(readFileSync(values.report, 'utf8'))
  const diff = execFileSync('git', ['diff', '--unified=0', '--no-color', `${values.base}...HEAD`, '--', ...Object.keys(report.files)], {
    encoding: 'utf8',
  })
  const uncaught = findUncaughtOnChangedLines(report, parseChangedLines(diff))

  const markdown = formatMarkdown(uncaught)
  console.log(markdown)
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown)
  if (process.env.GITHUB_ACTIONS) {
    for (const u of uncaught) console.log(formatAnnotation(u))
  }
  if (uncaught.length > 0) process.exit(1)
}

// Run only when executed, not when imported by the tests. Real paths, so a symlinked path still runs it.
const invoked = process.argv[1] ? realpathSync(process.argv[1]) : ''
if (invoked === realpathSync(fileURLToPath(import.meta.url))) main()
