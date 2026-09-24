import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { staticRoutes } from '../src/data/routes.ts'
import { SITE_URL, SITE_HOST } from '../src/data/links.ts'

// sitemap.xml, robots.txt and one HTML file per route, written into dist/ after the Vite build.
// Link-preview crawlers do not run JavaScript: each page's head has to be in its HTML file.
const OUT_DIR = path.resolve('dist')

interface Page {
  path: string
  title: string
  description: string
}

const escapeAttr = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

// Swaps the one tag matching `pattern`; throws when index.html lost it, so the build fails instead of shipping it.
function replaceTag(html: string, pattern: RegExp, tag: string): string {
  const matches = html.match(new RegExp(pattern, 'g')) ?? []
  if (matches.length !== 1) throw new Error(`Expected one ${pattern} in index.html, found ${matches.length}`)
  return html.replace(pattern, () => tag)
}

const meta = (attr: 'name' | 'property', key: string) =>
  new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`)

/** The built index.html with the head tags of `page`: title, description, link preview and canonical URL. */
export function renderPageHtml(html: string, page: Page): string {
  const url = page.path === '/' ? SITE_URL : `${SITE_URL}${page.path}`
  const title = escapeAttr(page.title)
  const description = escapeAttr(page.description.replaceAll('%SITE_HOST%', SITE_HOST))
  const tags: [RegExp, string][] = [
    [/<title>[^<]*<\/title>/, `<title>${title}</title>`],
    [meta('name', 'description'), `<meta name="description" content="${description}" />`],
    [meta('property', 'og:title'), `<meta property="og:title" content="${title}" />`],
    [meta('property', 'og:description'), `<meta property="og:description" content="${description}" />`],
    [meta('property', 'og:url'), `<meta property="og:url" content="${url}" />`],
    [meta('name', 'twitter:title'), `<meta name="twitter:title" content="${title}" />`],
    [meta('name', 'twitter:description'), `<meta name="twitter:description" content="${description}" />`],
    [/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`],
  ]
  return tags.reduce((out, [pattern, tag]) => replaceTag(out, pattern, tag), html)
}

function main() {
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

  // /qa -> dist/qa/index.html: Vercel serves a directory's index.html at /qa before the SPA rewrite
  // (a dist/qa.html would need cleanUrls). / overwrites dist/index.html itself, read once beforehand.
  const template = fs.readFileSync(path.join(OUT_DIR, 'index.html'), 'utf8')
  for (const route of staticRoutes) {
    const file = path.join(OUT_DIR, route.path, 'index.html')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, renderPageHtml(template, route))
  }
  console.log(`Page HTML written: ${staticRoutes.length} pages`)
}

// Run only when executed, not when imported by the tests. Real paths, so a symlinked path still runs it.
const invoked = process.argv[1] ? fs.realpathSync(process.argv[1]) : ''
if (invoked === fs.realpathSync(fileURLToPath(import.meta.url))) main()
