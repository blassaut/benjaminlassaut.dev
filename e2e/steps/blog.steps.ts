import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { Given, When, Then } = createBdd()

Then('I should see the blog index', async ({ page }) => {
  await expect(page.getByTestId('blog-index')).toBeVisible()
})

Then('I should see at least one blog post card', async ({ page }) => {
  const cards = page.locator('[data-testid^="blog-post-"]')
  expect(await cards.count()).toBeGreaterThan(0)
})

When('I click on the first blog post card', async ({ page }) => {
  await page.locator('[data-testid^="blog-post-"]').first().click()
})

Then('I should be on a blog post page', async ({ page }) => {
  await expect(page).toHaveURL(/\/blog\/.+/)
})

Then('I should see the blog post content', async ({ page }) => {
  await expect(page.getByTestId('blog-post')).toBeVisible()
})

Given('I am reading a blog post', async ({ page }) => {
  await page.goto('/blog')
  await page.waitForLoadState('networkidle')
  await page.locator('[data-testid^="blog-post-"]').first().click()
  await expect(page).toHaveURL(/\/blog\/.+/)
  await expect(page.getByTestId('blog-post')).toBeVisible()
})

When('I click the back link', async ({ page }) => {
  await page.getByTestId('blog-post-back').click()
})
