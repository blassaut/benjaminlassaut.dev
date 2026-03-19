import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { When, Then } = createBdd()

Then('I should see a bug-tagged skill in the infrastructure category', async ({ page }) => {
  const infraCategory = page.getByTestId('skills-category-infrastructure')
  const bugTag = infraCategory.getByTestId('bug-skill-tag')
  await expect(bugTag).toBeVisible()
  await expect(bugTag).toContainText('Playwright')
})

When('I hover the bug-tagged skill', async ({ page }) => {
  const bugTag = page.getByTestId('bug-skill-tag')
  await bugTag.hover()
})

Then('I should see the bug popover with a link to the QA page', async ({ page }) => {
  const popover = page.getByTestId('bug-popover')
  await expect(popover).toBeVisible()
  await expect(popover).toContainText('You found the bug!')
  await expect(popover.getByTestId('bug-popover-link')).toHaveAttribute('href', '/qa')
})

When('I click the QA link in the popover', async ({ page }) => {
  await page.getByTestId('bug-popover-link').click()
})

Then('I should be on the QA page', async ({ page }) => {
  await expect(page).toHaveURL(/\/qa$/)
})
