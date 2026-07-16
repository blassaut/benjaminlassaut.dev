import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { When, Then } = createBdd()

Then('I should see a bug-tagged skill in the skills section', async ({ page }) => {
  const skillsSection = page.getByTestId('skills-section')
  // Scroll to the skills section to ensure all whileInView animations trigger
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="skills-section"]')
    el?.scrollIntoView({ block: 'center' })
  })
  const bugTag = skillsSection.getByTestId('bug-skill-tag')
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
  await expect(popover).toContainText('This shouldn\'t be here.')
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
