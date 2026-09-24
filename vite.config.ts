import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import type { Plugin } from 'vite'
import { SITE_URL } from './src/data/links'

// index.html writes the site URL as %SITE_URL%; src/data/links.ts is the single source.
function siteUrl(): Plugin {
  return { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL) }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
  server: {
    fs: {
      allow: ['.', path.resolve(__dirname, 'e2e')],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'e2e/mutation/**/*.test.ts'],
  },
})
