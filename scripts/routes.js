// Single source of truth for static routes used by sitemap generation and prerendering.
// When adding a new page, add it here - both scripts will pick it up automatically.

export const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/qa', priority: '0.8', changefreq: 'monthly' },
]
