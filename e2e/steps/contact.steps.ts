import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { Then } = createBdd()

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
})

Then('I should see the {string} contact link', async ({ page }, label: string) => {
  const slug = slugify(label)
  await expect(page.getByTestId(`contact-link-${slug}`)).toBeVisible()
})
