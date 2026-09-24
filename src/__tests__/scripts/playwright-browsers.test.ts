// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { browserEngines } from '../../../scripts/playwright-browsers.ts'

const devices = {
  'Desktop Chrome': { defaultBrowserType: 'chromium' },
  'iPhone 14': { defaultBrowserType: 'webkit' },
  'Pixel 7': { defaultBrowserType: 'chromium' },
  'Desktop Firefox': { defaultBrowserType: 'firefox' },
}

describe('browserEngines', () => {
  it('lists each engine once, in first-use order', () => {
    // Catches CI installing chromium twice, or the install line changing order between runs
    const projects = [{ device: 'Desktop Chrome' }, { device: 'iPhone 14' }, { device: 'Pixel 7' }]
    expect(browserEngines(projects, devices)).toEqual(['chromium', 'webkit'])
  })

  it("uses each device's engine, not a fixed list", () => {
    // Catches a new Firefox project running in CI without firefox installed
    const projects = [{ device: 'Desktop Firefox' }, { device: 'iPhone 14' }]
    expect(browserEngines(projects, devices)).toEqual(['firefox', 'webkit'])
  })

  it('fails on a device Playwright does not know', () => {
    // Catches a typo in e2e/browsers.ts printing nothing, which makes `playwright install` fetch every browser
    expect(() => browserEngines([{ device: 'iPhone 99' }], devices)).toThrow(
      'Unknown Playwright device "iPhone 99" in e2e/browsers.ts',
    )
  })
})
