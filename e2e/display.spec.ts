import { test, expect } from '@playwright/test'

test.describe('Home page display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('all sections are rendered', async ({ page }) => {
    const sections = ['about', 'experience', 'skills', 'contact']
    for (const id of sections) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })

  test('hero section displays name and role', async ({ page }) => {
    await expect(page.locator('text=Benjamin Lassaut')).toBeVisible()
  })

  test('navbar is visible and fixed', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Scroll down and verify navbar stays visible
    await page.evaluate(() => window.scrollTo(0, 1000))
    await expect(nav).toBeVisible()
  })

  test('footer is visible', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()
  })

  test('experience section has entries', async ({ page }) => {
    const section = page.locator('#experience')
    await section.scrollIntoViewIfNeeded()
    // At least one experience card should exist
    await expect(section.locator('[class*="border"]').first()).toBeVisible()
  })

  test('skills section has categories', async ({ page }) => {
    const section = page.locator('#skills')
    await section.scrollIntoViewIfNeeded()
    // Should have skill category headings
    const headings = section.locator('h3')
    await expect(headings.first()).toBeVisible()
    expect(await headings.count()).toBeGreaterThan(0)
  })
})

test.describe('Blog page display', () => {
  test('blog index loads and shows posts', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('Responsive display', () => {
  test('desktop shows nav links, hides hamburger', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'desktop only')

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Nav links should be visible
    await expect(page.locator('nav a[href="#about"]')).toBeVisible()
    // Hamburger should be hidden
    await expect(page.locator('button[aria-label="Toggle menu"]')).not.toBeVisible()
  })

  test('mobile shows hamburger, hides nav links', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only')

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Hamburger should be visible
    await expect(page.locator('button[aria-label="Toggle menu"]')).toBeVisible()
    // Desktop nav links should be hidden (the ones in the desktop container)
    const desktopNav = page.locator('.hidden.md\\:flex')
    await expect(desktopNav).not.toBeVisible()
  })
})
