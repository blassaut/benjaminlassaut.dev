import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { Given, When, Then } = createBdd()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

Given('I am on the blog page', async ({ page }) => {
  await page.goto('/blog')
  await page.waitForLoadState('networkidle')
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
