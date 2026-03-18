import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { Given, When, Then } = createBdd()

Given('I am on the homepage', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

Then('I should see the intro section', async ({ page }) => {
  await expect(page.getByTestId('intro-section')).toBeAttached()
})

Then('I should see the about section', async ({ page }) => {
  await expect(page.getByTestId('about-section')).toBeAttached()
})

Then('I should see the experience section', async ({ page }) => {
  await expect(page.getByTestId('experience-section')).toBeAttached()
})

Then('I should see the skills section', async ({ page }) => {
  await expect(page.getByTestId('skills-section')).toBeAttached()
})

Then('I should see the blog preview section', async ({ page }) => {
  await expect(page.getByTestId('blog-preview-section')).toBeAttached()
})

Then('I should see the contact section', async ({ page }) => {
  await expect(page.getByTestId('contact-section')).toBeAttached()
})

Then('I should see {string} in the intro section', async ({ page }, text: string) => {
  const intro = page.getByTestId('intro-section')
  // Name may be split across elements (e.g. "Benjamin<br>Lassaut")
  for (const part of text.split(' ')) {
    await expect(intro.getByText(part, { exact: false })).toBeVisible()
  }
})

When('I scroll to the experience section', async ({ page }) => {
  await page.getByTestId('experience-section').scrollIntoViewIfNeeded()
})

When('I scroll to the skills section', async ({ page }) => {
  await page.getByTestId('skills-section').scrollIntoViewIfNeeded()
})

When('I scroll to the contact section', async ({ page }) => {
  await page.getByTestId('contact-section').scrollIntoViewIfNeeded()
})

Then('I should see at least one experience card', async ({ page }) => {
  const cards = page.locator('[data-testid^="experience-card-"]')
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeGreaterThan(0)
})

Then('I should see at least one skill category', async ({ page }) => {
  const categories = page.locator('[data-testid^="skills-category-"]')
  await expect(categories.first()).toBeVisible()
  expect(await categories.count()).toBeGreaterThan(0)
})

When('I scroll down the page', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 1000))
})

Then('the navbar should still be visible', async ({ page }) => {
  await expect(page.getByTestId('nav')).toBeVisible()
})

When('I scroll to the bottom of the page', async ({ page }) => {
  await page.getByTestId('footer').scrollIntoViewIfNeeded()
})

Then('I should see the footer', async ({ page }) => {
  await expect(page.getByTestId('footer')).toBeVisible()
})
