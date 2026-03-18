# BDD Testing + "Who tests the tester?" Page - Design Spec

**Date:** 2026-03-18
**Status:** Final

## Goal

Add `data-testid` attributes to all components, migrate e2e tests from plain Playwright specs to BDD using `playwright-bdd` with Gherkin feature files, and create a new "Who tests the tester?" page (`/qa`) that showcases the BDD test suite - a meta demonstration of QA skills on a QA portfolio.

## 1. data-testid Attributes

### Naming Convention

Pattern: `{section}-{element}-{qualifier?}`

All attributes use `data-testid` (Playwright's `getByTestId()` default).

### Attribute Map

| Component | Attributes |
|-----------|-----------|
| **Navbar** | `nav`, `nav-logo`, `nav-link-about`, `nav-link-experience`, `nav-link-skills`, `nav-link-blog`, `nav-link-contact`, `nav-link-qa`, `nav-mobile-toggle`, `nav-mobile-menu` |
| **Hero** | `hero-section`, `hero-cta-work`, `hero-cta-contact` |
| **About** | `about-section`, `about-stat-{key}` (e.g. `about-stat-years`) |
| **Experience** | `experience-section`, `experience-card-{company-slug}` (e.g. `experience-card-kiln`) |
| **Skills** | `skills-section`, `skills-category-{slug}` (e.g. `skills-category-blockchain`) |
| **Blog Preview** | `blog-preview-section`, `blog-preview-card-{slug}` |
| **Contact** | `contact-section`, `contact-form`, `contact-input-name`, `contact-input-email`, `contact-input-message`, `contact-submit`, `contact-status`, `contact-link-{label}` (e.g. `contact-link-linkedin`) |
| **Footer** | `footer`, `footer-link-{label}` |
| **Blog Index** | `blog-index`, `blog-tag-{tag}`, `blog-post-{slug}` |
| **Blog Post** | `blog-post`, `blog-post-back` |
| **Who tests the tester?** | `qa`, `qa-feature-{name}`, `qa-status-badge` |

### Rules

- Slugify qualifiers: lowercase, hyphens, no special chars (e.g. "Kiln" becomes `kiln`, "Smart Contract Testing" becomes `smart-contract-testing`).
- Dynamic qualifiers derived from data (company name, post slug, tag name).
- No `data-testid` on purely decorative elements (gradients, grain overlays, animation wrappers).
- Step definitions slugify parameters from feature files before testid lookup (e.g. "LinkedIn" in Gherkin becomes `linkedin` in `contact-link-linkedin`).
- `Hero.tsx` currently has no `id` attribute (unlike other sections that use `AnimatedSection` with `id`). It needs `data-testid="hero-section"` added; the hero is identified by testid only (no hash nav target needed).

## 2. BDD Setup with playwright-bdd

### Dependencies

- `playwright-bdd` - Bridges Playwright and Cucumber, generates Playwright test files from `.feature` files.
- `@cucumber/cucumber` - Peer dependency for Gherkin parsing.

### Configuration

`playwright.config.ts` changes:

```ts
import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  features: 'e2e/features/**/*.feature',
  steps: 'e2e/steps/**/*.steps.ts',
})

export default defineConfig({
  testDir,
  // ... rest of config unchanged
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
})
```

Note: `defineBddConfig()` returns a `testDir` string (typically `.features-gen/`) where generated test files are written. This replaces the previous `testDir: './e2e'`.

Tag filtering: `@desktop` and `@mobile` tags are handled via `grepInvert` on each project. Desktop skips `@mobile` scenarios; mobile projects skip `@desktop` scenarios. Untagged scenarios run on all projects (intentional - they should work everywhere).

### Test Scripts

```json
{
  "test:e2e": "npx bddgen && npx playwright test",
  "test:e2e:ui": "npx bddgen && npx playwright test --ui"
}
```

CI must use `npm run test:e2e` (not `npx playwright test` directly) so that `bddgen` runs first.

### File Structure

```
e2e/
  features/
    recruiter-visits-portfolio.feature
    visitor-navigates-site.feature
    reader-browses-blog.feature
    visitor-contacts-benjamin.feature
    visitor-explores-qa.feature
  steps/
    homepage.steps.ts
    navigation.steps.ts
    blog.steps.ts
    contact.steps.ts
    qa.steps.ts
```

### Files Removed

- `e2e/display.spec.ts` - Replaced by `recruiter-visits-portfolio.feature`.
- `e2e/navigation.spec.ts` - Replaced by `visitor-navigates-site.feature`.

## 3. Feature Files

### recruiter-visits-portfolio.feature

```gherkin
Feature: Recruiter visits portfolio
  As a recruiter
  I want to see Benjamin's experience and skills
  So that I can evaluate him as a candidate

  Scenario: Homepage sections are all visible
    Given I am on the homepage
    Then I should see the hero section
    And I should see the about section
    And I should see the experience section
    And I should see the skills section
    And I should see the blog preview section
    And I should see the contact section

  Scenario: Hero displays name and role
    Given I am on the homepage
    Then I should see "Benjamin Lassaut" in the hero section

  Scenario: Experience entries are displayed
    Given I am on the homepage
    When I scroll to the experience section
    Then I should see at least one experience card

  Scenario: Skills categories are displayed
    Given I am on the homepage
    When I scroll to the skills section
    Then I should see at least one skill category

  Scenario: Navbar stays visible while scrolling
    Given I am on the homepage
    When I scroll down the page
    Then the navbar should still be visible

  Scenario: Footer is visible
    Given I am on the homepage
    When I scroll to the bottom of the page
    Then I should see the footer
```

### visitor-navigates-site.feature

```gherkin
Feature: Visitor navigates the site
  As a visitor
  I want to navigate between sections and pages
  So that I can find the information I need

  @desktop
  Scenario: Desktop nav links scroll to sections
    Given I am on the homepage
    When I click the "<section>" nav link
    Then the "<section>" section should be visible

    Examples:
      | section    |
      | about      |
      | experience |
      | skills     |
      | contact    |

  @desktop
  Scenario: Blog link navigates to blog page
    Given I am on the homepage
    When I click the "blog" nav link
    Then I should be on the "/blog" page

  @desktop
  Scenario: Logo navigates back to home
    Given I am on the blog page
    When I click the logo
    Then I should be on the "/" page

  @desktop
  Scenario: Desktop shows nav links and hides hamburger
    Given I am on the homepage
    Then I should see the desktop nav links
    And the hamburger menu should not be visible

  @mobile
  Scenario: Mobile shows hamburger and hides desktop nav
    Given I am on the homepage
    Then I should see the hamburger button
    And the desktop nav links should not be visible

  @mobile
  Scenario: Mobile menu opens and closes
    Given I am on the homepage
    When I tap the hamburger button
    Then the mobile menu should be visible
    When I tap the hamburger button
    Then the mobile menu should not be visible

  @mobile
  Scenario: Mobile menu links navigate to sections
    Given I am on the homepage
    When I tap the hamburger button
    And I tap the "<section>" link in the mobile menu
    Then the mobile menu should not be visible
    And the "<section>" section should be visible

    Examples:
      | section    |
      | about      |
      | experience |
      | skills     |
      | contact    |

  @mobile
  Scenario: Mobile blog link navigates to blog page
    Given I am on the homepage
    When I tap the hamburger button
    And I tap the "blog" link in the mobile menu
    Then I should be on the "/blog" page
```

### reader-browses-blog.feature

```gherkin
Feature: Reader browses the blog
  As a reader
  I want to browse and read blog posts
  So that I can learn from Benjamin's insights

  Scenario: Blog index loads and shows posts
    Given I am on the blog page
    Then I should see the blog index
    And I should see at least one blog post card

  Scenario: Blog post opens from index
    Given I am on the blog page
    When I click on the first blog post card
    Then I should be on a blog post page
    And I should see the blog post content

  Scenario: Back link returns to blog index
    Given I am reading a blog post
    When I click the back link
    Then I should be on the "/blog" page
```

### visitor-contacts-benjamin.feature

```gherkin
Feature: Visitor contacts Benjamin
  As a visitor
  I want to send a message through the contact form
  So that I can get in touch with Benjamin

  Scenario: Contact form is displayed
    Given I am on the homepage
    When I scroll to the contact section
    Then I should see the contact form
    And I should see the name input
    And I should see the email input
    And I should see the message input
    And I should see the submit button

  Scenario: Social links are displayed
    Given I am on the homepage
    When I scroll to the contact section
    Then I should see the "LinkedIn" contact link
    And I should see the "GitHub" contact link
```

### visitor-explores-qa.feature

```gherkin
Feature: Visitor explores the QA lab
  As a visitor
  I want to see how this portfolio tests itself
  So that I can appreciate the meta QA approach

  @desktop
  Scenario: QA lab is accessible from navigation
    Given I am on the homepage
    When I click the "qa" nav link
    Then I should be on the "/qa" page

  Scenario: QA lab page displays feature files
    Given I am on the QA lab page
    Then I should see at least one feature file section

  Scenario: Feature files show Gherkin content
    Given I am on the QA lab page
    Then each feature file section should contain Gherkin syntax

  Scenario: CI status badge is displayed
    Given I am on the QA lab page
    Then I should see the CI status badge
```

## 4. Step Definitions

Step definitions live in `e2e/steps/` and use `createBdd()` from `playwright-bdd`. Each step uses `page.getByTestId()` selectors wherever possible.

### Tag Filtering

Tag filtering is configured at the Playwright project level using `grepInvert` (see Configuration section above):
- Desktop Chrome: skips scenarios tagged `@mobile`.
- Mobile Safari / Mobile Android: skip scenarios tagged `@desktop`.
- Untagged scenarios run on all three projects (intentional).

## 5. Who tests the tester? Page

### Route

`/qa` - New route in `App.tsx`, new page component `src/pages/QaLab.tsx`.

### Navigation

"Who tests the tester?" added to `navItems` in `Navbar.tsx` using the route link pattern (same as Blog):
```ts
{ label: 'Who tests the tester?', href: '/qa' }
```
This uses `href` (not `hash`), so `renderNavItem` renders it as a `<Link>` component.

### Page Structure

1. **Header** - Page title "Who tests the tester?" with a subtitle explaining the meta concept: "This site tests itself. The BDD scenarios below describe expected behavior of this very portfolio - and they run on every push."

2. **CI Status Badge** - GitHub Actions badge showing latest workflow status. Links to the Actions tab. Uses the standard GitHub badge URL format for the existing CI workflow.

3. **Playwright Report** - The Playwright HTML report (`playwright-report/index.html`) embedded in an iframe or linked prominently. This lets visitors browse real test results interactively - seeing pass/fail status, test durations, and error details.

3. **Feature Files** - Each `.feature` file rendered as a collapsible card. Feature name as the card title, Gherkin content displayed with syntax highlighting. Gherkin keywords (`Feature`, `Scenario`, `Given`, `When`, `Then`, `And`, `Examples`) highlighted in teal accent color.

4. **Meta Callout** - A small note at the bottom: "Yes, this page is also tested. See visitor-explores-qa.feature."

### Implementation Details

- Feature files imported as raw strings using Vite's `?raw` import suffix. Since feature files live in `e2e/` (outside `src/`), Vite config needs `server.fs.allow` to include the `e2e/` directory, or alternatively copy the feature file contents into a `src/data/features.ts` module at build time. The simpler approach: hardcode or import from a `src/data/features.ts` that re-exports the raw strings, avoiding Vite fs restrictions.
- A simple Gherkin syntax highlighter component that applies teal color to keywords and muted color to comments.
- Collapsible cards use Framer Motion for expand/collapse animation.
- Same design language as the rest of the site (dark background, teal accents, Space Grotesk headings, Inter body, border-white/5 cards).

## 6. Files Changed Summary

### Modified
- `src/components/Navbar.tsx` - Add `data-testid` attrs + "Who tests the tester?" nav link
- `src/components/Footer.tsx` - Add `data-testid` attrs
- `src/components/sections/Hero.tsx` - Add `data-testid` attrs
- `src/components/sections/About.tsx` - Add `data-testid` attrs
- `src/components/sections/Experience.tsx` - Add `data-testid` attrs
- `src/components/sections/Skills.tsx` - Add `data-testid` attrs
- `src/components/sections/BlogPreview.tsx` - Add `data-testid` attrs
- `src/components/sections/Contact.tsx` - Add `data-testid` attrs
- `src/pages/BlogIndex.tsx` - Add `data-testid` attrs
- `src/pages/BlogPost.tsx` - Add `data-testid` attrs
- `src/App.tsx` - Add `/qa` route
- `playwright.config.ts` - Switch to `playwright-bdd` config
- `package.json` - Add `playwright-bdd`, `@cucumber/cucumber`; update scripts
- `.github/workflows/ci.yml` - Switch from `npx playwright test` to `npm run test:e2e` so `bddgen` runs first

### New
- `src/pages/QaLab.tsx` - Who tests the tester? page component
- `e2e/features/recruiter-visits-portfolio.feature`
- `e2e/features/visitor-navigates-site.feature`
- `e2e/features/reader-browses-blog.feature`
- `e2e/features/visitor-contacts-benjamin.feature`
- `e2e/features/visitor-explores-qa.feature`
- `e2e/steps/homepage.steps.ts`
- `e2e/steps/navigation.steps.ts`
- `e2e/steps/blog.steps.ts`
- `e2e/steps/contact.steps.ts`
- `e2e/steps/qa.steps.ts`

### Deleted
- `e2e/display.spec.ts`
- `e2e/navigation.spec.ts`
