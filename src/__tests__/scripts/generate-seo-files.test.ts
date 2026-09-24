// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { renderPageHtml } from '../../../scripts/generate-seo-files.ts'
import { staticRoutes } from '../../data/routes'
import { SITE_URL, SITE_HOST } from '../../data/links'

// Shaped like the built dist/index.html: multi-line tags, and tags the build must leave alone
const built = `<head>
    <title>Old title</title>
    <meta
        name="description"
        content="Old description"
    />
    <meta property="og:title" content="Old title" />
    <meta property="og:description" content="Old description" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}/old" />
    <meta property="og:image" content="${SITE_URL}/og-image.png" />
    <meta name="twitter:title" content="Old title" />
    <meta name="twitter:description" content="Old description" />
    <link rel="canonical" href="${SITE_URL}/old" />
    <script type="module" crossorigin src="/assets/index-abc123.js"></script>
</head>`

const route = (path: string) => staticRoutes.find((r) => r.path === path)!

describe('renderPageHtml', () => {
  // A /qa link shared on LinkedIn/Slack/X previewed the home page: crawlers only read the HTML head
  it("writes the page's title, description, link preview and canonical URL, and keeps every other tag", () => {
    expect(renderPageHtml(built, route('/qa'))).toBe(`<head>
    <title>Who tests the tester? - Benjamin Lassaut</title>
    <meta name="description" content="This portfolio tests itself. BDD scenarios written in Gherkin describe expected behavior and run on every push via Playwright and GitHub Actions CI." />
    <meta property="og:title" content="Who tests the tester? - Benjamin Lassaut" />
    <meta property="og:description" content="This portfolio tests itself. BDD scenarios written in Gherkin describe expected behavior and run on every push via Playwright and GitHub Actions CI." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}/qa" />
    <meta property="og:image" content="${SITE_URL}/og-image.png" />
    <meta name="twitter:title" content="Who tests the tester? - Benjamin Lassaut" />
    <meta name="twitter:description" content="This portfolio tests itself. BDD scenarios written in Gherkin describe expected behavior and run on every push via Playwright and GitHub Actions CI." />
    <link rel="canonical" href="${SITE_URL}/qa" />
    <script type="module" crossorigin src="/assets/index-abc123.js"></script>
</head>`)
  })

  // A trailing slash on the home canonical would split it from the URL search engines already index
  it('points the home page at the bare site URL', () => {
    const html = renderPageHtml(built, route('/'))
    expect(html).toContain(`<meta property="og:url" content="${SITE_URL}" />`)
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}" />`)
  })

  // The legal description would otherwise show a literal %SITE_HOST% in search results
  it('fills the site host into the description', () => {
    const html = renderPageHtml(built, route('/legal'))
    const description = `Legal notice for ${SITE_HOST} - publisher, hosting and personal data information.`
    expect(html).toContain(`<meta name="description" content="${description}" />`)
    expect(html).toContain(`<meta property="og:description" content="${description}" />`)
    expect(html).toContain(`<meta name="twitter:description" content="${description}" />`)
  })

  // A quote in the copy would end the attribute early and cut the preview text
  it('escapes HTML in the copy', () => {
    const html = renderPageHtml(built, { path: '/x', title: 'Q&A <"lab">', description: 'd' })
    expect(html).toContain('<title>Q&amp;A &lt;&quot;lab&quot;&gt;</title>')
    expect(html).toContain('<meta property="og:title" content="Q&amp;A &lt;&quot;lab&quot;&gt;" />')
  })

  // Without these, a tag dropped from index.html ships every page without it, and a duplicated
  // one gives crawlers two og:url to choose from
  it('fails the build when index.html is missing a tag or has it twice', () => {
    const page = route('/qa')
    expect(() => renderPageHtml(built.replace(/<link rel="canonical"[^>]*>/, ''), page)).toThrow(
      'found 0',
    )
    const twoUrls = built.replace('<meta property="og:type"', `<meta property="og:url" content="x" />\n<meta property="og:type"`)
    expect(() => renderPageHtml(twoUrls, page)).toThrow('found 2')
  })

  // index.html is the template of every page: each route must find each tag in it exactly once
  it('renders every route from the real index.html', () => {
    const source = readFileSync('index.html', 'utf8')
    for (const r of staticRoutes) {
      expect(renderPageHtml(source, r)).toContain(`<title>${r.title}</title>`)
    }
  })
})
