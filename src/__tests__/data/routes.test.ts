import { describe, it, expect } from 'vitest'
import { staticRoutes } from '../../../scripts/routes.js'

describe('sitemap static routes', () => {
  it('contains the /legal route with sitemap metadata', () => {
    const legal = staticRoutes.find((r) => r.path === '/legal')
    expect(legal).toBeDefined()
    expect(legal?.priority).toBe('0.3')
    expect(legal?.changefreq).toBe('yearly')
  })

  it('has no duplicate paths', () => {
    const paths = staticRoutes.map((r) => r.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('every route has a path, priority and changefreq', () => {
    for (const route of staticRoutes) {
      expect(route.path).toMatch(/^\//)
      expect(route.priority).toBeTruthy()
      expect(route.changefreq).toBeTruthy()
    }
  })
})
