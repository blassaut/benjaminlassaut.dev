import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const projectRoot = join(__dirname, '..', '..')

describe('SEO: vercel.json www redirect', () => {
  const vercelConfig = JSON.parse(
    readFileSync(join(projectRoot, 'vercel.json'), 'utf-8')
  )

  it('has redirects configured', () => {
    expect(vercelConfig.redirects).toBeDefined()
    expect(Array.isArray(vercelConfig.redirects)).toBe(true)
  })

  it('redirects www to non-www', () => {
    const wwwRedirect = vercelConfig.redirects.find(
      (r: { source: string }) => r.source === '/:path*'
    )
    expect(wwwRedirect).toBeDefined()
    expect(wwwRedirect.destination).toBe('https://benjaminlassaut.dev/:path*')
    expect(wwwRedirect.statusCode).toBe(308)
    expect(wwwRedirect.has).toEqual([
      { type: 'host', value: 'www.benjaminlassaut.dev' },
    ])
  })
})

describe('SEO: index.html does not hardcode canonical', () => {
  const html = readFileSync(join(projectRoot, 'index.html'), 'utf-8')

  it('does not have a static canonical tag (Helmet handles per-page)', () => {
    expect(html).not.toContain('<link rel="canonical"')
  })
})

describe('SEO: Intro H1 accessible text', () => {
  const introSrc = readFileSync(
    join(projectRoot, 'src', 'components', 'sections', 'Intro.tsx'),
    'utf-8'
  )

  it('H1 produces a space between first and last name', () => {
    const hasSeparation =
      introSrc.includes("Benjamin{' '}") ||
      introSrc.includes('Benjamin ') ||
      introSrc.includes(' Lassaut')
    expect(hasSeparation).toBe(true)
  })
})

describe('SEO: BlogIndex structured data', () => {
  const blogIndexSrc = readFileSync(
    join(projectRoot, 'src', 'pages', 'BlogIndex.tsx'),
    'utf-8'
  )

  it('has JSON-LD structured data', () => {
    expect(blogIndexSrc).toContain('application/ld+json')
  })

  it('uses CollectionPage schema type', () => {
    expect(blogIndexSrc).toContain('CollectionPage')
  })
})

describe('SEO: QA page structured data', () => {
  const qaSrc = readFileSync(
    join(projectRoot, 'src', 'pages', 'QA.tsx'),
    'utf-8'
  )

  it('has JSON-LD structured data', () => {
    expect(qaSrc).toContain('application/ld+json')
  })

  it('uses WebPage schema type', () => {
    expect(qaSrc).toContain('WebPage')
  })
})

describe('SEO: sitemap uses git-based lastmod', () => {
  const script = readFileSync(
    join(projectRoot, 'scripts', 'generate-sitemap.js'),
    'utf-8'
  )

  it('uses spawnSync for git-based lastmod (no shell injection)', () => {
    expect(script).toContain('spawnSync')
    expect(script).toContain('git')
    expect(script).toContain('log')
  })

  it('does not use execSync', () => {
    expect(script).not.toContain('execSync')
  })
})
