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

Then('I should see the bug popover mentioning the "Who tests the tester?" page', async ({ page }) => {
  const popover = page.getByTestId('bug-popover')
  await expect(popover).toBeVisible()
  await expect(popover).toContainText('You found a deliberate bug!')
  await expect(popover.getByTestId('bug-popover-link')).toHaveAttribute('href', '/qa')
})

When('I click the "Who tests the tester?" link in the popover', async ({ page }) => {
  // On mobile, hover doesn't persist - ensure popover is open by clicking the tag
  const popover = page.getByTestId('bug-popover')
  if (!(await popover.isVisible())) {
    await page.getByTestId('bug-skill-tag').click()
  }
  await expect(popover).toBeVisible()
  // Use evaluate to click - avoids Playwright stability issues with popover elements
  await page.evaluate(() => {
    const link = document.querySelector('[data-testid="bug-popover-link"]') as HTMLElement
    link?.click()
  })
})
