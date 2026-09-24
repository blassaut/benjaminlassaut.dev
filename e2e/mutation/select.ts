/**
 * Which mutants a run covers. Pure: the runner passes in the CLI options and,
 * for --changed-since, the list of changed files (repo-relative, under e2e/).
 */
import { CatalogError, type Mutant } from './catalog.ts'
import { config } from './config.ts'

export interface SelectOptions {
  /** Comma-separated mutant ids (--only). */
  only?: string
  /** Files changed since the --changed-since ref; undefined when the option is not used. */
  changedFiles?: string[]
}

export interface Selection {
  mutants: Mutant[]
  /** Why this subset was picked, for the console. */
  reason?: string
}

/**
 * --changed-since picks the mutants that the change can affect:
 * - a changed test file selects the mutants whose scope includes it,
 * - a changed catalog file selects the mutants it defines,
 * - documentation (.md) is ignored,
 * - any other e2e change (steps, fixtures, runner) can affect every mutant.
 */
export function selectMutants(all: Mutant[], { only, changedFiles }: SelectOptions): Selection {
  let mutants = all
  if (only) {
    const ids = only.split(',').map((s) => s.trim())
    for (const id of ids) {
      if (!all.some((m) => m.id === id)) throw new CatalogError(`--only: unknown mutant "${id}"`)
    }
    mutants = mutants.filter((m) => ids.includes(m.id))
  }
  if (!changedFiles) return { mutants }

  const relevant = changedFiles.filter((f) => !f.endsWith('.md'))
  const isTestFile = (f: string) => f.endsWith(config.testFileExtension)
  const isCatalogFile = (f: string) => f.startsWith('e2e/mutation/mutants/')
  const shared = relevant.filter((f) => !isTestFile(f) && !isCatalogFile(f))
  if (shared.length > 0) {
    return { mutants, reason: `shared e2e code changed (${shared.join(', ')}): running every mutant` }
  }

  const changedTests = relevant.filter(isTestFile).map((f) => f.split('/').pop()!.replace(config.testFileExtension, ''))
  const changedCatalog = relevant.filter(isCatalogFile)
  const picked = mutants.filter(
    (m) => m.scope.files.some((f) => changedTests.includes(f)) || changedCatalog.includes(m.file),
  )
  const what = [...changedTests, ...changedCatalog].join(', ') || 'nothing relevant'
  return { mutants: picked, reason: `changed: ${what}` }
}
