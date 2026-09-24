import { createBdd } from 'playwright-bdd'
import { test } from '../fixtures'
import { expect } from '@playwright/test'

const { When, Then } = createBdd(test)

When('I toggle the theme', async ({ page }) => {
  await page.getByTestId('theme-toggle').click()
})

When('I toggle the theme on mobile', async ({ page }) => {
  await page.getByTestId('theme-toggle-mobile').click()
})

When('I reload the page', async ({ page }) => {
  await page.reload()
  // Readiness: the reloaded app has rendered before the theme is read
  await expect(page.getByTestId('nav')).toBeVisible()
})

Then('the theme should be dark', async ({ page }) => {
  await expect(page.locator('html')).toHaveClass(/dark/)
})

Then('the theme should be light', async ({ page }) => {
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})
