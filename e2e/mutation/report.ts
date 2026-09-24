/** Console output and the report.{json,md} files. renderMarkdown() is pure. */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Mutant } from './catalog.ts'
import type { MutantResult, Status } from './playwright.ts'

export function writeReports(results: MutantResult[], reportDir: string) {
  mkdirSync(reportDir, { recursive: true })
  rmSync(resolve(reportDir, 'tmp'), { recursive: true, force: true })

  const generatedAt = new Date().toISOString()
  writeFileSync(join(reportDir, 'report.json'), JSON.stringify({ generatedAt, results }, null, 2))
  writeFileSync(join(reportDir, 'report.md'), renderMarkdown(results, generatedAt))
}

export function renderMarkdown(results: MutantResult[], generatedAt: string): string {
  const lines = [
    '# E2E mutation report',
    '',
    `Generated ${generatedAt} · ${results.length} mutant(s) · ` +
      Object.entries(countBy(results)).map(([k, v]) => `${k}: ${v}`).join(' · '),
    '',
    '| Status | Mutant | Ticket | Concern | Scope | Killed by | Time |',
    '|---|---|---|---|---|---|---|',
    ...results.map(
      (r) =>
        `| ${icon(r.status)} ${r.status} | \`${r.mutant.id}\` | ${r.mutant.ticket} | ${r.mutant.concern} | ${scopeLabel(r.mutant)} | ${r.killedBy[0] ?? '—'} | ${(r.durationMs / 1000).toFixed(0)}s |`,
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
  return lines.join('\n') + '\n'
}

export function nextStep(status: Status): string {
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

export function printCatalog(mutants: Mutant[]) {
  console.log(`\n${mutants.length} mutant(s)\n`)
  for (const m of mutants) {
    console.log(`  ${m.id}`)
    console.log(`      ${m.ticket} · ${m.concern}`)
    console.log(`      scope: ${scopeLabel(m)} · ${m.dom ? `dom (${m.dom.length} op)` : 'response'}`)
  }
  console.log()
}

export function printSummary(results: MutantResult[], reportDir: string) {
  console.log('\n' + Object.entries(countBy(results)).map(([k, v]) => `${icon(k as Status)} ${k}: ${v}`).join('   '))
  console.log(`\nReport: ${reportDir}/report.md\n`)
}

export function icon(status: Status): string {
  return { killed: '✅', survived: '🟥', 'not-applied': '⚠️', 'no-tests': '⚠️', 'baseline-failed': '⛔', error: '💥' }[status]
}

function scopeLabel(m: Mutant): string {
  return `${m.scope.files.join(', ')}${m.scope.tags ? ' ' + m.scope.tags.join(' ') : ''}`
}

function countBy(results: MutantResult[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const r of results) counts[r.status] = (counts[r.status] ?? 0) + 1
  return counts
}
