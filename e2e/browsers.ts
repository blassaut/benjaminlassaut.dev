// The browser projects the e2e suite runs on. playwright.config.ts builds its
// projects from this list and the /qa page derives its browser and test-run
// counts from it, so the two cannot drift. Plain data, no Playwright import:
// the app bundles it.

export interface BrowserProject {
  name: string
  /** Key in Playwright's `devices`. */
  device: string
  /** How /qa names the browser. */
  label: string
  /** Desktop projects skip @mobile scenarios, mobile projects skip @desktop ones. */
  form: 'desktop' | 'mobile'
}

export const browserProjects: BrowserProject[] = [
  { name: 'desktop-chrome', device: 'Desktop Chrome', label: 'Chrome', form: 'desktop' },
  { name: 'mobile-safari', device: 'iPhone 14', label: 'Mobile Safari', form: 'mobile' },
  { name: 'mobile-android', device: 'Pixel 7', label: 'Mobile Chrome', form: 'mobile' },
]

/** How many projects run a scenario tagged @desktop, tagged @mobile, or untagged (both). */
export const projectsPerForm = {
  desktop: browserProjects.filter((p) => p.form === 'desktop').length,
  mobile: browserProjects.filter((p) => p.form === 'mobile').length,
}
