import { createBdd } from 'playwright-bdd'
import { test } from '../fixtures'
import { expect } from '@playwright/test'

const { Given, When, Then } = createBdd(test)

Given('I am on the legal page', async ({ page }) => {
  await page.goto('/legal')
  await expect(page.getByTestId('legal-page')).toBeVisible()
})

When('I click the {string} footer link', async ({ page }, label: string) => {
  await page.getByTestId('footer').getByRole('link', { name: label }).click()
})

Then('I should see the legal notice page', async ({ page }) => {
  await expect(page.getByTestId('legal-page')).toBeVisible()
})

Then('I should see the {string} legal section', async ({ page }, title: string) => {
  await expect(page.getByRole('heading', { name: title })).toBeVisible()
})

When('I click the contact form link', async ({ page }) => {
  await page.getByRole('link', { name: 'contact form' }).click()
})

Then('the contact section should be scrolled into view', async ({ page }) => {
  await expect(page).toHaveURL('/#contact')
  await expect(page.getByTestId('contact-section')).toBeInViewport()
})
