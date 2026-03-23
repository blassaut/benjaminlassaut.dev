import { readdirSync, writeFileSync } from 'fs'
import { spawnSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const blogDir = join(__dirname, '..', 'src', 'content', 'blog')
const outPath = join(__dirname, '..', 'public', 'sitemap.xml')

const SITE = 'https://benjaminlassaut.dev'

function getGitLastmod(filePath) {
  const result = spawnSync('git', ['log', '-1', '--format=%aI', '--', filePath], {
    encoding: 'utf-8',
  })
  const date = result.stdout?.trim()
  return date ? date.split('T')[0] : null
}

const staticPages = [
  { loc: '/', file: 'src/pages/Home.tsx', priority: '1.0', changefreq: 'monthly' },
  { loc: '/blog', file: 'src/pages/BlogIndex.tsx', priority: '0.8', changefreq: 'weekly' },
  { loc: '/qa', file: 'src/pages/QA.tsx', priority: '0.8', changefreq: 'monthly' },
]

const blogSlugs = readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace('.md', ''))
  .sort()
  .reverse()

function buildUrlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${SITE}${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

const urls = [
  ...staticPages.map((p) =>
    buildUrlEntry({
      loc: p.loc,
      lastmod: getGitLastmod(p.file) || new Date().toISOString().split('T')[0],
      changefreq: p.changefreq,
      priority: p.priority,
    })
  ),
  ...blogSlugs.map((slug) => {
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/)
    const gitDate = getGitLastmod(`src/content/blog/${slug}.md`)
    const lastmod = gitDate || (dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0])
    return buildUrlEntry({
      loc: `/blog/${slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.6',
    })
  }),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

writeFileSync(outPath, sitemap)
console.log(`Sitemap generated with ${urls.length} URLs -> public/sitemap.xml`)
