# BDD Testing + "Who tests the tester?" Page - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add data-testid attributes to all components, migrate e2e tests to BDD with playwright-bdd, and create a "Who tests the tester?" page at `/qa`.

**Architecture:** Component-level `data-testid` attributes added to existing React components. Playwright-bdd bridges Cucumber Gherkin feature files with Playwright test runner. Feature files organized by user journey with step definitions in separate files. A new `/qa` page renders the feature files with Gherkin syntax highlighting.

**Tech Stack:** playwright-bdd, @cucumber/cucumber, Playwright, React, Vite `?raw` imports, Framer Motion

---

## File Structure

### New Files
- `e2e/features/recruiter-visits-portfolio.feature` - Homepage display scenarios
- `e2e/features/visitor-navigates-site.feature` - Navigation scenarios (desktop + mobile)
- `e2e/features/reader-browses-blog.feature` - Blog browsing scenarios
- `e2e/features/visitor-contacts-benjamin.feature` - Contact form scenarios
- `e2e/features/visitor-explores-qa.feature` - QA page scenarios
- `e2e/steps/homepage.steps.ts` - Step defs for homepage assertions
- `e2e/steps/navigation.steps.ts` - Step defs for nav interactions
- `e2e/steps/blog.steps.ts` - Step defs for blog browsing
- `e2e/steps/contact.steps.ts` - Step defs for contact form
- `e2e/steps/qa.steps.ts` - Step defs for QA page
- `src/pages/QaLab.tsx` - "Who tests the tester?" page component

### Modified Files
- `src/components/AnimatedSection.tsx` - Forward rest props (including `data-testid`) to `<motion.section>`
- `src/components/sections/Hero.tsx` - Add `data-testid` attrs
- `src/components/sections/About.tsx` - Add `data-testid` attrs
- `src/components/sections/Experience.tsx` - Add `data-testid` attrs
- `src/components/sections/Skills.tsx` - Add `data-testid` attrs
- `src/components/sections/BlogPreview.tsx` - Add `data-testid` attrs
- `src/components/sections/Contact.tsx` - Add `data-testid` attrs
- `src/components/Navbar.tsx` - Add `data-testid` attrs + "Who tests the tester?" nav link
- `src/components/Footer.tsx` - Add `data-testid` attrs
- `src/pages/BlogIndex.tsx` - Add `data-testid` attrs
- `src/pages/BlogPost.tsx` - Add `data-testid` attrs
- `src/App.tsx` - Add `/qa` route
- `playwright.config.ts` - Switch to playwright-bdd config
- `package.json` - Add deps, update scripts
- `.github/workflows/ci.yml` - Use `npm run test:e2e`
- `.gitignore` - Add `.features-gen/`
- `vite.config.ts` - Add `server.fs.allow` for `e2e/` directory

### Deleted Files
- `e2e/display.spec.ts`
- `e2e/navigation.spec.ts`

---

### Task 1: Create feature branch and install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feat/bdd-testing-qa-page
```

- [ ] **Step 2: Install playwright-bdd**

```bash
npm install -D playwright-bdd @cucumber/cucumber
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add playwright-bdd and @cucumber/cucumber dependencies"
```

---

### Task 2: Add data-testid attributes to all components

**Files:**
- Modify: `src/components/AnimatedSection.tsx` - Forward rest props including `data-testid`
- Modify: `src/components/sections/Hero.tsx` - Add `data-testid="hero-section"` to `<section>`, CTAs
- Modify: `src/components/sections/About.tsx` - Add `data-testid="about-section"` to `<AnimatedSection>`, stat cards
- Modify: `src/components/sections/Experience.tsx` - Add `data-testid="experience-section"`, experience cards
- Modify: `src/components/sections/Skills.tsx` - Add `data-testid="skills-section"`, category cards
- Modify: `src/components/sections/BlogPreview.tsx` - Add `data-testid="blog-preview-section"`, post cards
- Modify: `src/components/sections/Contact.tsx` - Add `data-testid="contact-section"`, form, inputs, submit, status, social links
- Modify: `src/components/Navbar.tsx` - Add `data-testid="nav"`, logo, nav links, hamburger, mobile menu
- Modify: `src/components/Footer.tsx` - Add `data-testid="footer"`, footer links
- Modify: `src/pages/BlogIndex.tsx` - Add `data-testid="blog-index"`, tags, post cards
- Modify: `src/pages/BlogPost.tsx` - Add `data-testid="blog-post"`, back link

- [ ] **Step 1: Update AnimatedSection.tsx to forward rest props**

The component currently only destructures `children`, `className`, and `id`. Update it to spread remaining props onto `<motion.section>`:

```tsx
interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
  id?: string
}

export default function AnimatedSection({ children, className = '', id, ...rest }: Props) {
  return (
    <motion.section
      id={id}
      {...rest}
      // ... existing animation props
      className={className}
    >
      {children}
    </motion.section>
  )
}
```

This is required because About, Experience, Skills, BlogPreview, and Contact all pass `data-testid` to `<AnimatedSection>`.

- [ ] **Step 2: Add data-testid to Hero.tsx (no AnimatedSection here)**

Add to the `<section>` element:
```tsx
<section data-testid="hero-section" className="relative min-h-screen ...">
```
Add to "See my work" link:
```tsx
<a data-testid="hero-cta-work" href="#experience" ...>
```
Add to "Get in touch" link:
```tsx
<a data-testid="hero-cta-contact" href="#contact" ...>
```

- [ ] **Step 3: Add data-testid to About.tsx**

Add to `<AnimatedSection>`:
```tsx
<AnimatedSection id="about" data-testid="about-section" ...>
```

Add to each stat card:
```tsx
<motion.div
  key={stat.label}
  data-testid={`about-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
  ...>
```

- [ ] **Step 4: Add data-testid to Experience.tsx**

Add to `<AnimatedSection>`:
```tsx
<AnimatedSection id="experience" data-testid="experience-section" ...>
```
Add to each group card:
```tsx
<motion.div
  key={groupIndex}
  data-testid={`experience-card-${group.company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
  ...>
```

- [ ] **Step 5: Add data-testid to Skills.tsx**

Add to `<AnimatedSection>`:
```tsx
<AnimatedSection id="skills" data-testid="skills-section" ...>
```
Add to each category card:
```tsx
<motion.div
  key={category.name}
  data-testid={`skills-category-${category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
  ...>
```

- [ ] **Step 6: Add data-testid to BlogPreview.tsx**

Add to `<AnimatedSection>`:
```tsx
<AnimatedSection id="blog" data-testid="blog-preview-section" ...>
```
Add to each post Link:
```tsx
<Link data-testid={`blog-preview-card-${post.slug}`} to={`/blog/${post.slug}`} ...>
```

- [ ] **Step 7: Add data-testid to Contact.tsx**

Add to `<AnimatedSection>`:
```tsx
<AnimatedSection id="contact" data-testid="contact-section" ...>
```
Add to form:
```tsx
<motion.form data-testid="contact-form" onSubmit={handleSubmit} ...>
```
Add to inputs:
```tsx
<input data-testid="contact-input-name" type="text" name="name" .../>
<input data-testid="contact-input-email" type="email" name="email" .../>
<textarea data-testid="contact-input-message" name="message" .../>
```
Add to submit button:
```tsx
<button data-testid="contact-submit" type="submit" ...>
```
Add to status messages:
```tsx
{status === 'sent' && (<p data-testid="contact-status" ...>Message sent!...</p>)}
{status === 'error' && (<p data-testid="contact-status" ...>Something went wrong...</p>)}
```
Add to social links:
```tsx
<a data-testid={`contact-link-${link.label.toLowerCase()}`} key={link.label} href={link.href} ...>
```

- [ ] **Step 8: Add data-testid to Navbar.tsx**

Add to `<nav>`:
```tsx
<nav data-testid="nav" className="fixed top-0 ...">
```
Add to logo Link:
```tsx
<Link data-testid="nav-logo" to="/" ...>
```
Add to nav items in `renderNavItem` - both the `<a>` and `<Link>` branches:
```tsx
data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
```
Add to hamburger button:
```tsx
<button data-testid="nav-mobile-toggle" onClick={...} ...>
```
Add to mobile menu:
```tsx
<motion.div data-testid="nav-mobile-menu" id="mobile-menu" ...>
```

- [ ] **Step 9: Add data-testid to Footer.tsx**

Add to `<footer>`:
```tsx
<footer data-testid="footer" className="border-t ...">
```
Add to footer nav links (both `<a>` and `<Link>` branches):
```tsx
data-testid={`footer-link-${item.label.toLowerCase()}`}
```
Add to social links:
```tsx
<a data-testid={`footer-link-${link.label.toLowerCase()}`} ...>
```

- [ ] **Step 10: Add data-testid to BlogIndex.tsx**

Add to root div:
```tsx
<div data-testid="blog-index" className="pt-24 pb-16 px-6">
```
Add to tag filter buttons:
```tsx
<button data-testid={`blog-tag-${tag}`} key={tag} ...>
```
Add to post links:
```tsx
<Link data-testid={`blog-post-${post.slug}`} to={`/blog/${post.slug}`} ...>
```

- [ ] **Step 11: Add data-testid to BlogPost.tsx**

Add to root div:
```tsx
<div data-testid="blog-post" className="pt-24 pb-16 px-6">
```
Add to back link:
```tsx
<Link data-testid="blog-post-back" to="/blog" ...>
```

- [ ] **Step 12: Verify build passes**

```bash
npm run build
```
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 13: Commit**

```bash
git add src/
git commit -m "feat: add data-testid attributes to all components"
```

---

### Task 3: Configure playwright-bdd and update CI

**Files:**
- Modify: `playwright.config.ts`
- Modify: `package.json` (scripts)
- Modify: `.github/workflows/ci.yml`
- Modify: `.gitignore` (add `.features-gen/`)

- [ ] **Step 1: Update playwright.config.ts**

Replace the entire file with:

```ts
import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  features: 'e2e/features/**/*.feature',
  steps: 'e2e/steps/**/*.steps.ts',
})

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: /@mobile/,
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
      grepInvert: /@desktop/,
    },
    {
      name: 'mobile-android',
      use: { ...devices['Pixel 7'] },
      grepInvert: /@desktop/,
    },
  ],
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] **Step 2: Update package.json scripts**

Change the test scripts to:
```json
"test:e2e": "npx bddgen && npx playwright test",
"test:e2e:ui": "npx bddgen && npx playwright test --ui"
```

- [ ] **Step 3: Update CI workflow**

In `.github/workflows/ci.yml`, change line 33 from:
```yaml
      - run: npx playwright test
```
to:
```yaml
      - run: npm run test:e2e
```

- [ ] **Step 4: Add .features-gen/ to .gitignore**

Append to `.gitignore`:
```
.features-gen/
```

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts package.json .github/workflows/ci.yml .gitignore
git commit -m "feat: configure playwright-bdd and update CI to use bddgen"
```

---

### Task 4: Write feature files

**Files:**
- Create: `e2e/features/recruiter-visits-portfolio.feature`
- Create: `e2e/features/visitor-navigates-site.feature`
- Create: `e2e/features/reader-browses-blog.feature`
- Create: `e2e/features/visitor-contacts-benjamin.feature`
- Create: `e2e/features/visitor-explores-qa.feature`

- [ ] **Step 1: Create recruiter-visits-portfolio.feature**

Write the file with content from the spec (Section 3).

- [ ] **Step 2: Create visitor-navigates-site.feature**

Write the file with content from the spec (Section 3). Includes `@desktop` and `@mobile` tags, Scenario Outlines with Examples tables.

- [ ] **Step 3: Create reader-browses-blog.feature**

Write the file with content from the spec (Section 3).

- [ ] **Step 4: Create visitor-contacts-benjamin.feature**

Write the file with content from the spec (Section 3).

- [ ] **Step 5: Create visitor-explores-qa.feature**

Write the file with content from the spec (Section 3).

- [ ] **Step 6: Commit**

```bash
git add e2e/features/
git commit -m "feat: add BDD feature files for all user journeys"
```

---

### Task 5: Write step definitions

**Files:**
- Create: `e2e/steps/homepage.steps.ts`
- Create: `e2e/steps/navigation.steps.ts`
- Create: `e2e/steps/blog.steps.ts`
- Create: `e2e/steps/contact.steps.ts`
- Create: `e2e/steps/qa.steps.ts`

- [ ] **Step 1: Create homepage.steps.ts**

```ts
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

Given('I am on the homepage', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

Then('I should see the hero section', async ({ page }) => {
  await expect(page.getByTestId('hero-section')).toBeAttached()
})

Then('I should see the about section', async ({ page }) => {
  await expect(page.getByTestId('about-section')).toBeAttached()
})

Then('I should see the experience section', async ({ page }) => {
  await expect(page.getByTestId('experience-section')).toBeAttached()
})

Then('I should see the skills section', async ({ page }) => {
  await expect(page.getByTestId('skills-section')).toBeAttached()
})

Then('I should see the blog preview section', async ({ page }) => {
  await expect(page.getByTestId('blog-preview-section')).toBeAttached()
})

Then('I should see the contact section', async ({ page }) => {
  await expect(page.getByTestId('contact-section')).toBeAttached()
})

Then('I should see {string} in the hero section', async ({ page }, text: string) => {
  const hero = page.getByTestId('hero-section')
  await expect(hero.getByText(text)).toBeVisible()
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

Then('I should see at least one experience card', async ({ page }) => {
  const cards = page.locator('[data-testid^="experience-card-"]')
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeGreaterThan(0)
})

Then('I should see at least one skill category', async ({ page }) => {
  const categories = page.locator('[data-testid^="skills-category-"]')
  await expect(categories.first()).toBeVisible()
  expect(await categories.count()).toBeGreaterThan(0)
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
```

- [ ] **Step 2: Create navigation.steps.ts**

```ts
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

When('I click the {string} nav link', async ({ page }, section: string) => {
  const slug = section.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  await page.getByTestId(`nav-link-${slug}`).click()
})

Then('the {string} section should be visible', async ({ page }, section: string) => {
  const slug = section.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  await expect(page.getByTestId(`${slug}-section`)).toBeVisible()
})

Then('I should be on the {string} page', async ({ page }, path: string) => {
  await expect(page).toHaveURL(path)
})

Given('I am on the blog page', async ({ page }) => {
  await page.goto('/blog')
  await page.waitForLoadState('networkidle')
})

When('I click the logo', async ({ page }) => {
  await page.getByTestId('nav-logo').click()
})

Then('I should see the desktop nav links', async ({ page }) => {
  await expect(page.getByTestId('nav-link-about')).toBeVisible()
})

Then('the hamburger menu should not be visible', async ({ page }) => {
  await expect(page.getByTestId('nav-mobile-toggle')).not.toBeVisible()
})

Then('I should see the hamburger button', async ({ page }) => {
  await expect(page.getByTestId('nav-mobile-toggle')).toBeVisible()
})

Then('the desktop nav links should not be visible', async ({ page }) => {
  await expect(page.getByTestId('nav-link-about')).not.toBeVisible()
})

When('I tap the hamburger button', async ({ page }) => {
  await page.getByTestId('nav-mobile-toggle').click()
})

Then('the mobile menu should be visible', async ({ page }) => {
  await expect(page.getByTestId('nav-mobile-menu')).toBeVisible()
})

Then('the mobile menu should not be visible', async ({ page }) => {
  await expect(page.getByTestId('nav-mobile-menu')).not.toBeVisible()
})

When('I tap the {string} link in the mobile menu', async ({ page }, section: string) => {
  const slug = section.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  await page.getByTestId('nav-mobile-menu').getByTestId(`nav-link-${slug}`).click()
})
```

Note: The mobile menu nav links reuse the same `nav-link-{slug}` testids. The step scopes the lookup within `nav-mobile-menu` to target the mobile instance. If this causes ambiguity, prefix mobile links with `nav-mobile-link-{slug}` instead.

- [ ] **Step 3: Create blog.steps.ts**

```ts
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

Then('I should see the blog index', async ({ page }) => {
  await expect(page.getByTestId('blog-index')).toBeVisible()
})

Then('I should see at least one blog post card', async ({ page }) => {
  const cards = page.locator('[data-testid^="blog-post-"]')
  await expect(cards.first()).toBeVisible()
})

When('I click on the first blog post card', async ({ page }) => {
  await page.locator('[data-testid^="blog-post-"]').first().click()
})

Then('I should be on a blog post page', async ({ page }) => {
  await expect(page).toHaveURL(/\/blog\/.+/)
})

Then('I should see the blog post content', async ({ page }) => {
  await expect(page.getByTestId('blog-post')).toBeVisible()
})

Given('I am reading a blog post', async ({ page }) => {
  await page.goto('/blog')
  await page.waitForLoadState('networkidle')
  await page.locator('[data-testid^="blog-post-"]').first().click()
  await expect(page).toHaveURL(/\/blog\/.+/)
})

When('I click the back link', async ({ page }) => {
  await page.getByTestId('blog-post-back').click()
})
```

- [ ] **Step 4: Create contact.steps.ts**

```ts
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Then } = createBdd()

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
  const slug = label.toLowerCase()
  await expect(page.getByTestId(`contact-link-${slug}`)).toBeVisible()
})
```

- [ ] **Step 5: Create qa.steps.ts**

```ts
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, Then } = createBdd()

Given('I am on the QA lab page', async ({ page }) => {
  await page.goto('/qa')
  await page.waitForLoadState('networkidle')
})

Then('I should see at least one feature file section', async ({ page }) => {
  const features = page.locator('[data-testid^="qa-feature-"]')
  await expect(features.first()).toBeVisible()
})

Then('each feature file section should contain Gherkin syntax', async ({ page }) => {
  const features = page.locator('[data-testid^="qa-feature-"]')
  const count = await features.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const text = await features.nth(i).textContent()
    expect(text).toMatch(/Feature:|Scenario:|Given |When |Then /)
  }
})

Then('I should see the CI status badge', async ({ page }) => {
  await expect(page.getByTestId('qa-status-badge')).toBeVisible()
})
```

- [ ] **Step 6: Commit**

```bash
git add e2e/steps/
git commit -m "feat: add BDD step definitions for all feature files"
```

---

### Task 6: Delete old spec files and run tests

**Files:**
- Delete: `e2e/display.spec.ts`
- Delete: `e2e/navigation.spec.ts`

- [ ] **Step 1: Delete old spec files**

```bash
rm e2e/display.spec.ts e2e/navigation.spec.ts
```

- [ ] **Step 2: Run bddgen to verify generation works**

```bash
npx bddgen
```
Expected: Generates test files in `.features-gen/` without errors.

- [ ] **Step 3: Build the project to verify no TS errors**

```bash
npm run build
```

- [ ] **Step 4: Run e2e tests (homepage + navigation + blog + contact features)**

```bash
npm run test:e2e
```
Expected: All scenarios pass except `visitor-explores-qa.feature` (the QA page doesn't exist yet). If the QA feature scenarios fail, that's expected - they'll pass after Task 7.

- [ ] **Step 5: Commit**

```bash
git rm e2e/display.spec.ts e2e/navigation.spec.ts
git commit -m "feat: migrate e2e tests from plain specs to BDD feature files"
```

---

### Task 7: Create the "Who tests the tester?" page

**Files:**
- Create: `src/pages/QaLab.tsx`
- Modify: `src/App.tsx` - Add import and route for QaLab
- Modify: `src/components/Navbar.tsx` - Add "Who tests the tester?" to navItems
- Modify: `vite.config.ts` - Add `server.fs.allow` for `e2e/` directory

- [ ] **Step 1: Update vite.config.ts to allow importing from e2e/**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      allow: ['.', path.resolve(__dirname, 'e2e')],
    },
  },
})
```

- [ ] **Step 2: Create src/pages/QaLab.tsx**

The page imports each `.feature` file as raw text using Vite's `?raw` suffix, renders them with Gherkin keyword highlighting in teal, and includes a CI badge.

Key elements:
- `data-testid="qa"` on root container
- `data-testid="qa-feature-{slugified-name}"` on each feature card
- `data-testid="qa-status-badge"` on the CI badge
- Collapsible cards with Framer Motion
- Gherkin syntax highlighting: regex-match keywords (`Feature`, `Scenario`, `Given`, `When`, `Then`, `And`, `But`, `Examples`, `Scenario Outline`) and color them teal
- GitHub Actions badge image linking to the workflow
- Meta callout at the bottom: "Yes, this page is also tested. See visitor-explores-qa.feature."
- Verify `?raw` imports from `e2e/` work in both `npm run dev` and `npm run build`. If they fail in production build, fall back to a `src/data/features.ts` re-export approach.

- [ ] **Step 3: Add route to App.tsx**

Add import:
```tsx
import QaLab from './pages/QaLab'
```
Add route:
```tsx
<Route path="/qa" element={<QaLab />} />
```

- [ ] **Step 4: Add nav link to Navbar.tsx**

Add a `testid` optional property to the navItems type. Then add the QA item to `navItems` array (after Blog, before Contact):
```ts
{ label: 'Who tests the tester?', href: '/qa', testid: 'qa' },
```

Update `renderNavItem` to use `item.testid ?? item.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')` for the `data-testid` slug. This ensures the nav link gets `data-testid="nav-link-qa"` instead of `nav-link-who-tests-the-tester`.

Also add the same `testid` override in `Footer.tsx` if the QA link is added there.

- [ ] **Step 5: Verify build**

```bash
npm run build
```

- [ ] **Step 6: Verify locally**

```bash
npm run dev
```
Open `http://localhost:5173/qa` and verify:
- Page renders with title and subtitle
- Feature files display with Gherkin syntax highlighted
- Cards are collapsible
- CI badge is visible

- [ ] **Step 7: Run full e2e suite**

```bash
npm run test:e2e
```
Expected: All scenarios pass including `visitor-explores-qa.feature`.

- [ ] **Step 8: Commit**

```bash
git add src/pages/QaLab.tsx src/App.tsx src/components/Navbar.tsx vite.config.ts
git commit -m "feat: add 'Who tests the tester?' page with BDD feature file showcase"
```

---

### Task 8: Final verification and cleanup

- [ ] **Step 1: Run full build**

```bash
npm run build
```

- [ ] **Step 2: Run full e2e suite**

```bash
npm run test:e2e
```
Expected: All scenarios pass across all three browser projects.

- [ ] **Step 3: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Review all changes**

```bash
git log --oneline feat/bdd-testing-qa-page ^main
```

Verify commit history is clean and logical.
