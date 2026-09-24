// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { SITE_URL, SITE_HOST, OG_IMAGE_URL } from '../../data/links'

// The site URL lives in src/data/links.ts only; a copy elsewhere drifts the day the domain changes
const HARDCODED = /https?:\/\/(www\.)?benjaminlassaut\.dev/

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (name === '__tests__') return []
    return statSync(path).isDirectory() ? files(path) : [path]
  })
}

describe('site URL', () => {
  it('derives the host and the link-preview image from SITE_URL', () => {
    expect(SITE_HOST).toBe('benjaminlassaut.dev')
    expect(OG_IMAGE_URL).toBe(`${SITE_URL}/og-image.png`)
  })

  it('is not hardcoded anywhere but src/data/links.ts', () => {
    const candidates = [...files('src'), ...files('scripts'), ...files('public'), 'index.html'].filter(
      (f) => /\.(tsx?|jsx?|html|txt|xml|json)$/.test(f) && f !== join('src', 'data', 'links.ts'),
    )
    expect(candidates.filter((f) => HARDCODED.test(readFileSync(f, 'utf8')))).toEqual([])
  })

  it('reaches index.html through the %SITE_URL% placeholder', () => {
    const html = readFileSync('index.html', 'utf8')
    expect(html).toContain('<meta property="og:image" content="%SITE_URL%/og-image.png" />')
  })
})
