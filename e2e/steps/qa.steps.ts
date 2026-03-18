import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { Given, Then } = createBdd()

Given('I am on the QA lab page', async ({ page }) => {
  await page.goto('/qa')
  await page.waitForLoadState('networkidle')
})

Then('I should see at least one feature file section', async ({ page }) => {
  const sections = page.locator('[data-testid^="feature-file-section-"]')
  expect(await sections.count()).toBeGreaterThan(0)
})

Then('each feature file section should contain Gherkin syntax', async ({ page }) => {
  const sections = page.locator('[data-testid^="feature-file-section-"]')
  const count = await sections.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const section = sections.nth(i)
    const text = await section.innerText()
    const hasGherkin = /Feature:|Scenario:|Given|When|Then/.test(text)
    expect(hasGherkin).toBe(true)
  }
})

Then('I should see the CI status badge', async ({ page }) => {
  await expect(page.getByTestId('ci-status-badge')).toBeVisible()
})
