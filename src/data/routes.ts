// Single source of truth for the site's pages: App.tsx renders one <Route> per
// entry and scripts/generate-sitemap.js lists them in sitemap.xml.
// Node runs this file directly (type stripping), so keep it free of imports.
export const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/qa', priority: '0.8', changefreq: 'monthly' },
  { path: '/legal', priority: '0.3', changefreq: 'yearly' },
] as const

export type RoutePath = (typeof staticRoutes)[number]['path']
