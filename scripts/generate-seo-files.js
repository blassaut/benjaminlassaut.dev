import fs from 'fs'
import path from 'path'
import { staticRoutes } from '../src/data/routes.ts'
import { SITE_URL } from '../src/data/links.ts'

// sitemap.xml and robots.txt, written into dist/ after the Vite build.
const OUT_DIR = path.resolve('dist')

const today = new Date().toISOString().split('T')[0]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(OUT_DIR, 'robots.txt'), robots)
console.log(`Sitemap generated: ${staticRoutes.length} URLs, robots.txt written`)
