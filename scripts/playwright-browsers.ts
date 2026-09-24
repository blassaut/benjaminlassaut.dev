/**
 * Prints the browser engines the e2e projects need, for CI to install only those:
 *
 *   npx playwright install --with-deps $(node scripts/playwright-browsers.ts)
 *
 * The projects live in e2e/browsers.ts; each names a Playwright device, and
 * the device decides the engine (Pixel 7 runs on chromium, iPhone 14 on webkit).
 */
import { realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { devices } from '@playwright/test'
import { browserProjects } from '../e2e/browsers.ts'

/** Distinct engines of the projects' devices, in first-use order. */
export function browserEngines(
  projects: readonly { device: string }[],
  deviceTable: Readonly<Record<string, { defaultBrowserType: string }>>,
): string[] {
  const engines = projects.map(({ device }) => {
    const descriptor = deviceTable[device]
    if (!descriptor) throw new Error(`Unknown Playwright device "${device}" in e2e/browsers.ts`)
    return descriptor.defaultBrowserType
  })
  return [...new Set(engines)]
}

// Run only when executed, not when imported by the tests. Real paths, so a symlinked path still runs it.
const invoked = process.argv[1] ? realpathSync(process.argv[1]) : ''
if (invoked === realpathSync(fileURLToPath(import.meta.url))) {
  console.log(browserEngines(browserProjects, devices).join(' '))
}
