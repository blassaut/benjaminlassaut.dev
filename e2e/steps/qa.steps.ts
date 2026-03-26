import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { Given, Then } = createBdd()

/** Scroll to the bottom of the page to trigger all whileInView animations */
async function scrollToBottom(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
    // Scroll in steps, re-reading scrollHeight each time (iframe may extend it)
    let pos = 0
    while (pos < document.documentElement.scrollHeight) {
      pos += 400
      window.scrollTo(0, pos)
      await delay(100)
    }
    // Final scroll to absolute bottom
    window.scrollTo(0, document.documentElement.scrollHeight)
    await delay(300)
  })
}

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
  const first = sections.first()
  await first.locator('button').click()
  const codeBlock = first.locator('pre')
  await expect(codeBlock).toBeVisible()
  await expect(codeBlock).toHaveText(/Feature:|Scenario:|Given |When |Then /)
})

Then('I should see the CI status badge', async ({ page }) => {
  await expect(page.getByTestId('qa-status-badge')).toBeVisible()
})

Then('I should see at least one web3 feature file section', async ({ page }) => {
  await scrollToBottom(page)
  const sections = page.locator('[data-testid^="web3-feature-"]')
  expect(await sections.count()).toBeGreaterThan(0)
})

