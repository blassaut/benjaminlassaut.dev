import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('navbar links scroll to correct sections', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'desktop only - mobile nav tested separately')

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const sections = ['about', 'experience', 'skills', 'contact']

    for (const section of sections) {
      const link = page.locator(`nav a[href="#${section}"]`)
      await link.click()
      const target = page.locator(`#${section}`)
      await expect(target).toBeVisible()
    }
  })

  test('blog link navigates to blog page', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'desktop only - mobile nav tested separately')

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.locator('nav a[href="/blog"]').click()
    await expect(page).toHaveURL('/blog')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('logo navigates back to home', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    await page.locator('nav a[aria-label="Home"]').click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('Mobile navigation', () => {
  test('hamburger menu opens and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only')

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const hamburger = page.locator('button[aria-label="Toggle menu"]')
    await expect(hamburger).toBeVisible()

    // Menu should be hidden initially
    await expect(page.locator('#mobile-menu')).not.toBeVisible()

    // Open menu
    await hamburger.click()
    await expect(page.locator('#mobile-menu')).toBeVisible()

    // Close menu
    await hamburger.click()
    await expect(page.locator('#mobile-menu')).not.toBeVisible()
  })

  test('mobile menu links navigate to sections', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only')

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const hamburger = page.locator('button[aria-label="Toggle menu"]')

    const sections = ['about', 'experience', 'skills', 'contact']

    for (const section of sections) {
      await hamburger.click()
      await expect(page.locator('#mobile-menu')).toBeVisible()

      await page.locator(`#mobile-menu a[href="#${section}"]`).click()

      // Menu should close after clicking
      await expect(page.locator('#mobile-menu')).not.toBeVisible()

      // Section should be visible
      const target = page.locator(`#${section}`)
      await expect(target).toBeVisible()
    }
  })

  test('mobile blog link navigates to blog page', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only')

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.locator('button[aria-label="Toggle menu"]').click()
    await page.locator('#mobile-menu a[href="/blog"]').click()
    await expect(page).toHaveURL('/blog')
  })
})
