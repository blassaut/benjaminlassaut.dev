import { createBdd } from 'playwright-bdd'
import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { slugify } from '../../src/lib/slugify'

const { Given, When, Then } = createBdd(test)

Given('I am on the qa page', async ({ page }) => {
  await page.goto('/qa')
  // Not 'networkidle': the embedded live-demo iframe keeps the network busy
  await expect(page.locator('[data-testid^="qa-feature-"]').first()).toBeVisible()
})

When('I click the {string} nav link', async ({ page }, section: string) => {
  const slug = slugify(section)
  await page.getByTestId(`nav-link-${slug}`).click()
})

Then('the {string} section should be visible', async ({ page }, section: string) => {
  const slug = slugify(section)
  await expect(page.getByTestId(`${slug}-section`)).toBeVisible()
})

Then('I should be on the {string} page', async ({ page }, path: string) => {
  await expect(page).toHaveURL(path)
})

When('I click the logo', async ({ page }) => {
  await page.getByTestId('nav-logo').click()
})

Then('I should see the desktop nav links', async ({ page }) => {
  await expect(page.getByTestId('nav-link-about')).toBeVisible()
})

Then('the hamburger menu should not be visible', async ({ page }) => {
  await expect(page.getByTestId('nav-mobile-toggle')).not.toBeVisible()
})

Then('I should see the hamburger button', async ({ page }) => {
  await expect(page.getByTestId('nav-mobile-toggle')).toBeVisible()
})

Then('the desktop nav links should not be visible', async ({ page }) => {
  await expect(page.getByTestId('nav-link-about')).not.toBeVisible()
})

When('I tap the hamburger button', async ({ page }) => {
  await page.getByTestId('nav-mobile-toggle').click()
})

Then('the mobile menu should be visible', async ({ page }) => {
  await expect(page.getByTestId('nav-mobile-menu')).toBeVisible()
})

Then('the mobile menu should not be visible', async ({ page }) => {
  await expect(page.getByTestId('nav-mobile-menu')).not.toBeVisible()
})

When('I tap the {string} link in the mobile menu', async ({ page }, section: string) => {
  const slug = slugify(section)
  await page.getByTestId('nav-mobile-menu').getByTestId(`nav-link-${slug}`).click()
})

Given('I am on a page that does not exist', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  // Readiness: the app shell has rendered, so the 404 checks judge the routed content
  await expect(page.getByTestId('nav')).toBeVisible()
})

Then('I should see the 404 page', async ({ page }) => {
  await expect(page.getByTestId('not-found-page')).toBeVisible()
})

Then('I should see a link back to the homepage', async ({ page }) => {
  const link = page.getByTestId('not-found-page').getByRole('link', { name: 'Back to home' })
  await expect(link).toBeVisible()
})
