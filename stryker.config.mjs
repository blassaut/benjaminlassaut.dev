// @ts-check
/**
 * Mutation testing (StrykerJS) — see "Mutation testing" in README.md.
 *
 * Stryker plants small bugs ("mutants") in the source (`<` becomes `<=`,
 * a condition becomes `true`, a block becomes empty...) and reruns the unit
 * tests against each one. A mutant that no test kills means that line is
 * executed but never actually checked: coverage without relevance.
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  testRunner: 'vitest',
  vitest: { configFile: 'vite.config.ts' },
  coverageAnalysis: 'perTest',

  // Scope: code that carries behaviour and is unit-tested. Purely
  // presentational sections/pages and static data tables are excluded on
  // purpose: mutating a className or a label there produces hundreds of
  // "survived" mutants that carry no information (those are covered by the
  // Playwright E2E suite instead). Widen this list when a file gains logic.
  mutate: [
    'src/App.tsx',
    'src/lib/**/*.ts',
    'src/hooks/**/*.ts',
    'src/components/qa/**/*.tsx',
    'src/components/ui/**/*.tsx',
    'src/components/Footer.tsx',
    'src/components/Navbar.tsx',
    '!src/**/*.test.{ts,tsx}',
    '!src/__tests__/**',
  ],

  // Incremental mode: results are kept in `incrementalFile` and the next run
  // only re-tests mutants whose code or covering tests changed. CI caches the
  // file; every push to main runs with --force to rebuild it from scratch,
  // because a change outside the mutated and test files (e.g. src/data) is
  // not detected. Locally: `npm run test:mutation -- --force` for a full run.
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',

  reporters: ['clear-text', 'progress', 'html', 'json'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  jsonReporter: { fileName: 'reports/mutation/mutation.json' },
  clearTextReporter: { allowColor: true, logTests: false, maxTestsToLog: 0 },

  // Score thresholds. `break` makes `stryker run` exit non-zero below that
  // value: it is the merge gate. It is a ratchet: raise it as tests improve,
  // never lower it.
  thresholds: { high: 80, low: 60, break: 80 },

  timeoutMS: 10000,
  timeoutFactor: 2,
  concurrency: 4,
  tempDirName: '.stryker-tmp',
  cleanTempDir: true,
}
