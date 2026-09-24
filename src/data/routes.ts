// Single source of truth for the site's pages: App.tsx renders one <Route> per
// entry with its <title>, and scripts/generate-seo-files.ts lists them in sitemap.xml
// and writes each one's HTML head (title, description, link preview, canonical).
// Node runs this file directly (type stripping), so keep it free of imports:
// %SITE_HOST% is filled in at build time from src/data/links.ts.
export const staticRoutes = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'monthly',
    title: 'Benjamin Lassaut - Lead QA Engineer / SDET',
    description:
      'Benjamin Lassaut - Lead QA Engineer / SDET, ex-Kiln, with 10+ years building quality into software. Test automation with TypeScript, Playwright, Cypress, BDD and CI/CD.',
  },
  {
    path: '/qa',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Who tests the tester? - Benjamin Lassaut',
    description:
      'This portfolio tests itself. BDD scenarios written in Gherkin describe expected behavior and run on every push via Playwright and GitHub Actions CI.',
  },
  {
    path: '/legal',
    priority: '0.3',
    changefreq: 'yearly',
    title: 'Legal Notice - Benjamin Lassaut',
    description: 'Legal notice for %SITE_HOST% - publisher, hosting and personal data information.',
  },
] as const

export type RoutePath = (typeof staticRoutes)[number]['path']
