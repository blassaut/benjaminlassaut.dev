// Canonical URLs — single source of truth for the site, profile and repo links.
// No imports: Vite's config (index.html) and the Node sitemap script read it too.
export const SITE_URL = 'https://benjaminlassaut.dev'
export const SITE_HOST = new URL(SITE_URL).host
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`

export const LINKEDIN_URL = 'https://linkedin.com/in/benjaminlassaut'
export const GITHUB_URL = 'https://github.com/blassaut'
export const REPO_URL = 'https://github.com/blassaut/benjaminlassaut.dev'
export const LOCKBOX_REPO_URL = 'https://github.com/blassaut/lockbox'
export const LOCKBOX_DEMO_URL = 'https://lockbox.benjaminlassaut.dev'
export const CONTACT_FORM_URL = 'https://formspree.io/f/xkoqpbkr'
