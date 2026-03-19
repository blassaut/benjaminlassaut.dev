import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { When, Then } = createBdd()

Then('I should see a bug-tagged skill in the infrastructure category', async ({ page }) => {
  const infraCategory = page.getByTestId('skills-category-infrastructure')
  // Scroll past the skills section to ensure all whileInView animations trigger
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="skills-category-infrastructure"]')
    el?.scrollIntoView({ block: 'center' })
  })
  const bugTag = infraCategory.getByTestId('bug-skill-tag')
  await expect(bugTag).toBeVisible()
  await expect(bugTag).toContainText('Playwright')
})

When('I hover the bug-tagged skill', async ({ page }) => {
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="bug-skill-tag"]')
    el?.scrollIntoView({ block: 'center' })
  })
  const bugTag = page.getByTestId('bug-skill-tag')
  await expect(bugTag).toBeVisible()
  await bugTag.hover()
})

Then('I should see the bug popover mentioning the QA page', async ({ page }) => {
  const popover = page.getByTestId('bug-popover')
  await expect(popover).toBeVisible()
  await expect(popover).toContainText('You found a deliberate bug!')
  await expect(popover).toContainText('Who tests the tester?')
})
