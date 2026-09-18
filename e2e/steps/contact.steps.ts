import { createBdd } from 'playwright-bdd'
import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { LINKEDIN_URL, GITHUB_URL } from '../../src/data/links'

const { Then } = createBdd(test)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

Then('I should see the contact form', async ({ page }) => {
  await expect(page.getByTestId('contact-form')).toBeVisible()
})

Then('I should see the name input', async ({ page }) => {
  await expect(page.getByTestId('contact-input-name')).toBeVisible()
})

Then('I should see the email input', async ({ page }) => {
  await expect(page.getByTestId('contact-input-email')).toBeVisible()
})

Then('I should see the message input', async ({ page }) => {
  await expect(page.getByTestId('contact-input-message')).toBeVisible()
})

Then('I should see the submit button', async ({ page }) => {
  await expect(page.getByTestId('contact-submit')).toBeVisible()
  await expect(page.getByTestId('contact-submit')).toBeEnabled()
})

const CONTACT_LINKS: Record<string, string> = { linkedin: LINKEDIN_URL, github: GITHUB_URL }

Then('I should see the {string} contact link', async ({ page }, label: string) => {
  const slug = slugify(label)
  const link = page.getByTestId(`contact-link-${slug}`)
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', CONTACT_LINKS[slug])
})
