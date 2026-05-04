import fs from 'fs'
import path from 'path'
import { staticRoutes } from './routes.js'

const SITE_URL = 'https://benjaminlassaut.dev'
const OUTPUT = path.resolve('dist/sitemap.xml')

const today = new Date().toISOString().split('T')[0]

const allRoutes = staticRoutes.map((r) => ({
  loc: r.path,
  priority: r.priority,
  changefreq: r.changefreq,
  lastmod: today,
}))

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

fs.writeFileSync(OUTPUT, xml)
console.log(`Sitemap generated: ${allRoutes.length} URLs`)
