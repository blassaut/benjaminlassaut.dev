import fs from 'fs'
import path from 'path'
import http from 'http'
import { chromium } from 'playwright-core'
import { staticRoutes } from './routes.js'

const DIST = path.resolve('dist')
const BLOG_DIR = path.resolve('src/content/blog')
const PORT = 4173

function getRoutes() {
  const blogFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  const blogSlugs = blogFiles.map((f) => f.replace('.md', ''))
  return [
    ...staticRoutes.map((r) => r.path),
    ...blogSlugs.map((s) => `/blog/${s}`),
  ]
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`)
      let filePath = path.join(DIST, url.pathname)

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html')
      }

      if (!fs.existsSync(filePath)) {
        // SPA fallback
        filePath = path.join(DIST, 'index.html')
      }

      const ext = path.extname(filePath)
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      })
      res.end(fs.readFileSync(filePath))
    })

    server.listen(PORT, () => {
      console.log(`Preview server on http://localhost:${PORT}`)
      resolve(server)
    })
  })
}

async function prerender() {
  const routes = getRoutes()
  console.log(`Prerendering ${routes.length} routes...`)

  const server = await startServer()
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const route of routes) {
    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: 'networkidle',
    })

    // Wait for React to finish rendering
    await page.waitForSelector('#root > *', { timeout: 10000 })

    // Remove duplicate tags that Helmet re-injected alongside the static originals
    const html = await page.evaluate(() => {
      // Deduplicate <title> - keep the last one (Helmet's)
      const titles = document.querySelectorAll('title')
      if (titles.length > 1) {
        for (let i = 0; i < titles.length - 1; i++) titles[i].remove()
      }
      // Deduplicate meta[name="description"] - keep the last one
      const descs = document.querySelectorAll('meta[name="description"]')
      if (descs.length > 1) {
        for (let i = 0; i < descs.length - 1; i++) descs[i].remove()
      }
      return document.documentElement.outerHTML
    })

    const outputPath =
      route === '/'
        ? path.join(DIST, 'index.html')
        : path.join(DIST, route, 'index.html')

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, `<!DOCTYPE html>${html}`)
    console.log(`  ${route}`)
  }

  await browser.close()
  server.close()
  console.log('Prerendering complete!')
}

prerender()
