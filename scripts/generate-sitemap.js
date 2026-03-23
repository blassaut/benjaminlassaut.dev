import { readdirSync } from 'fs'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const blogDir = join(__dirname, '..', 'src', 'content', 'blog')
const outPath = join(__dirname, '..', 'public', 'sitemap.xml')

const SITE = 'https://benjaminlassaut.dev'
const today = new Date().toISOString().split('T')[0]

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  { loc: '/qa', priority: '0.8', changefreq: 'monthly' },
]

const blogSlugs = readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace('.md', ''))
  .sort()
  .reverse()

const urls = [
  ...staticPages.map(
    (p) =>
      `  <url>\n    <loc>${SITE}${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  ),
  ...blogSlugs.map((slug) => {
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/)
    const lastmod = dateMatch ? dateMatch[1] : today
    return `  <url>\n    <loc>${SITE}/blog/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
  }),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

writeFileSync(outPath, sitemap)
console.log(`Sitemap generated with ${urls.length} URLs -> public/sitemap.xml`)
