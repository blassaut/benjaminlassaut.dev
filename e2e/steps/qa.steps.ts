import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { Given, Then } = createBdd()

Given('I am on the "Who tests the tester?" page', async ({ page }) => {
  await page.goto('/qa')
  await page.waitForLoadState('networkidle')
})

Then('I should see at least one feature file section', async ({ page }) => {
  const sections = page.locator('[data-testid^="qa-feature-"]')
  expect(await sections.count()).toBeGreaterThan(0)
})

Then('each feature file section should contain Gherkin syntax', async ({ page }) => {
  const sections = page.locator('[data-testid^="qa-feature-"]')
  const count = await sections.count()
  expect(count).toBeGreaterThan(0)
  // Expand the first card and wait for Gherkin content to render
  const first = sections.first()
  await first.locator('button').click()
  const codeBlock = first.locator('pre')
  await expect(codeBlock).toBeVisible()
  await expect(codeBlock).toHaveText(/Feature:|Scenario:|Given |When |Then /)
})

Then('I should see the CI status badge', async ({ page }) => {
  await expect(page.getByTestId('qa-status-badge')).toBeVisible()
})
