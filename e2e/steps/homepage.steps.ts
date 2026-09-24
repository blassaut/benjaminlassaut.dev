import { createBdd } from 'playwright-bdd'
import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { experience } from '../../src/data/experience'
import { skillCategories } from '../../src/data/skills'
import { testimonials } from '../../src/data/testimonials'
import { SITE_URL, OG_IMAGE_URL } from '../../src/data/links'
import { staticRoutes } from '../../src/data/routes'

const { Given, When, Then } = createBdd(test)

Given('I am on the homepage', async ({ page }) => {
  await page.goto('/')
  // Readiness: the app has rendered (nav and page sections mount in the same render)
  await expect(page.getByTestId('nav')).toBeVisible()
})

// Section checks use toBeVisible, not toBeAttached: the scroll reveal only sets opacity,
// which Playwright still counts as visible, and display:none or zero size now fails
Then('I should see the intro section', async ({ page }) => {
  await expect(page.getByTestId('intro-section')).toBeVisible()
})

Then('I should see the about section', async ({ page }) => {
  await expect(page.getByTestId('about-section')).toBeVisible()
})

Then('I should see the experience section', async ({ page }) => {
  await expect(page.getByTestId('experience-section')).toBeVisible()
})

Then('I should see the skills section', async ({ page }) => {
  await expect(page.getByTestId('skills-section')).toBeVisible()
})

Then('I should see the contact section', async ({ page }) => {
  await expect(page.getByTestId('contact-section')).toBeVisible()
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

Then('I should see one experience card per company', async ({ page }) => {
  const cards = page.locator('[data-testid^="experience-card-"]')
  await expect(cards.first()).toBeVisible()
  // Consecutive roles at the same company share one card
  const companies = experience.filter((e, i) => i === 0 || e.company !== experience[i - 1].company)
  await expect(cards).toHaveCount(companies.length)
})

Then('I should see every skill category', async ({ page }) => {
  const categories = page.locator('[data-testid^="skills-category-"]')
  await expect(categories.first()).toBeVisible()
  await expect(categories).toHaveCount(skillCategories.length)
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

Then('I should see the testimonials section', async ({ page }) => {
  await expect(page.getByTestId('testimonials-section')).toBeVisible()
})

When('I scroll to the testimonials section', async ({ page }) => {
  await page.getByTestId('testimonials-section').scrollIntoViewIfNeeded()
})

Then('I should see one card per testimonial', async ({ page }) => {
  const cards = page.locator('[data-testid^="testimonial-card-"]')
  await expect(cards.first()).toBeVisible()
  await expect(cards).toHaveCount(testimonials.length)
})

When('I click {string} on the first testimonial', async ({ page }, buttonText: string) => {
  const card = page.locator('[data-testid^="testimonial-card-"]').first()
  await card.getByRole('button', { name: buttonText }).click()
})

Then('I should see the full testimonial text', async ({ page }) => {
  const card = page.locator('[data-testid^="testimonial-card-"]').first()
  // One <p> per paragraph of the full text, in order
  await expect(card.locator('blockquote p')).toHaveText(testimonials[0].fullText.split('\n\n'))
})

Then('I should see the excerpt testimonial text', async ({ page }) => {
  const card = page.locator('[data-testid^="testimonial-card-"]').first()
  await expect(card.locator('blockquote p')).toHaveText([testimonials[0].excerpt])
})

Then('the first testimonial should have a LinkedIn link', async ({ page }) => {
  const card = page.locator('[data-testid^="testimonial-card-"]').first()
  const link = card.getByRole('link', { name: 'View original recommendation on LinkedIn' })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', testimonials[0].linkedinUrl)
  await expect(link).toHaveAttribute('target', '_blank')
})

// Link-preview crawlers (LinkedIn, Slack, X) read the raw HTML without running JS, so this
// checks the served HTML, written per page by scripts/generate-seo-files.ts at build time.
// vite preview serves dist/qa/index.html at /qa/ (Vercel also at /qa), hence the trailing slash.
Then('each page should carry its own link preview', async ({ page }) => {
  for (const route of staticRoutes) {
    const html = await (await page.request.get(route.path === '/' ? '/' : `${route.path}/`)).text()
    const url = route.path === '/' ? SITE_URL : `${SITE_URL}${route.path}`
    const tags = (pattern: RegExp) => [...html.matchAll(pattern)].map((m) => m[1])
    expect(tags(/<title>([^<]*)<\/title>/g), route.path).toEqual([route.title])
    expect(tags(/<meta property="og:title" content="([^"]*)"/g), route.path).toEqual([route.title])
    expect(tags(/<meta property="og:url" content="([^"]*)"/g), route.path).toEqual([url])
    expect(tags(/<link rel="canonical" href="([^"]*)"/g), route.path).toEqual([url])
    expect(tags(/<meta property="og:image" content="([^"]*)"/g), route.path).toEqual([OG_IMAGE_URL])
  }
})
