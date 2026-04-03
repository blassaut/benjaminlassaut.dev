import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { staticRoutes } from './routes.js'

const SITE_URL = 'https://benjaminlassaut.dev'
const BLOG_DIR = path.resolve('src/content/blog')
const OUTPUT = path.resolve('dist/sitemap.xml')

const today = new Date().toISOString().split('T')[0]

const sitemapRoutes = staticRoutes.map((r) => ({
  loc: r.path,
  priority: r.priority,
  changefreq: r.changefreq,
  lastmod: today,
}))

const blogFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
const blogRoutes = blogFiles.map((file) => {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
  const { data } = matter(raw)
  const slug = file.replace('.md', '')
  const date = new Date(data.date).toISOString().split('T')[0]
  return {
    loc: `/blog/${slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: date,
  }
})

// Set blog index lastmod to most recent post date
const sorted = [...blogRoutes].sort((a, b) =>
  b.lastmod.localeCompare(a.lastmod),
)
const blogIndex = sitemapRoutes.find((r) => r.loc === '/blog')
if (blogIndex) {
  blogIndex.lastmod = sorted.length > 0 ? sorted[0].lastmod : today
}

const allRoutes = [...sitemapRoutes, ...blogRoutes]

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
