import { createBdd } from 'playwright-bdd'
import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { readdirSync } from 'node:fs'
import { web3Features } from '../../src/data/web3-features'

const { Given, Then } = createBdd(test)

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
  // Not 'networkidle': the embedded live-demo iframe keeps the network busy
  await expect(page.locator('[data-testid^="qa-feature-"]').first()).toBeVisible()
})

const featureFileCount = readdirSync('e2e/features').filter((f) => f.endsWith('.feature')).length

Then('I should see one section per feature file', async ({ page }) => {
  await expect(page.locator('[data-testid^="qa-feature-"]')).toHaveCount(featureFileCount)
})

Then('the {string} statistic should equal the number of feature files', async ({ page }, label: string) => {
  const stat = page.getByTestId('qa-stats').locator('> div').filter({ hasText: label })
  await expect(stat.locator('div').first()).toHaveText(String(featureFileCount))
})

Then('each feature file section should contain Gherkin syntax', async ({ page }) => {
  const sections = page.locator('[data-testid^="qa-feature-"]')
  await expect(sections).toHaveCount(featureFileCount)
  const first = sections.first()
  await first.locator('button').click()
  const codeBlock = first.locator('pre')
  await expect(codeBlock).toBeVisible()
  await expect(codeBlock).toHaveText(/Feature:|Scenario:|Given |When |Then /)
})

Then('I should see the CI status badge', async ({ page }) => {
  await expect(page.getByTestId('qa-status-badge')).toBeVisible()
})

Then('I should see one section per web3 feature file', async ({ page }) => {
  await scrollToBottom(page)
  await expect(page.locator('[data-testid^="web3-feature-"]')).toHaveCount(web3Features.length)
})

