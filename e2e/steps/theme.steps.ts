import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { When, Then } = createBdd()

When('I toggle the theme', async ({ page }) => {
  await page.getByTestId('theme-toggle').click()
})

When('I toggle the theme on mobile', async ({ page }) => {
  await page.getByTestId('theme-toggle-mobile').click()
})

When('I reload the page', async ({ page }) => {
  await page.reload()
  await page.waitForLoadState('networkidle')
})

Then('the theme should be dark', async ({ page }) => {
  await expect(page.locator('html')).toHaveClass(/dark/)
})

Then('the theme should be light', async ({ page }) => {
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})
