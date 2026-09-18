/**
 * Project-specific settings for the E2E mutation runner.
 *
 * This is the only file to edit when porting `e2e/mutation/` to another
 * project. Everything else is generic. See README.md, "Port it to your project".
 */
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = fileURLToPath(new URL('.', import.meta.url))

export const config = {
  /** Where the catalog files live. */
  mutantsDir: resolve(HERE, 'mutants'),

  /**
   * Directory and extension of the test files that `scope.files` refers to.
   * Here: Gherkin feature files, whose names end up in the generated spec
   * paths, so Playwright's file filter matches them directly.
   * For a plain Playwright project: `tests` and `.spec.ts`.
   */
  testFilesDir: resolve(HERE, '..', 'features'),
  testFileExtension: '.feature',

  /** Command run once before any Playwright invocation (empty to skip). */
  prepareCommand: 'npx bddgen',

  /** How Playwright is launched. Extra CLI args are appended by the runner. */
  playwrightCommand: 'npx playwright test',

  /** Where reports are written, relative to the repo root. */
  reportDir: 'reports/mutation-e2e',
}
