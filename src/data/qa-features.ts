// The site's own Gherkin feature files, shown on /qa. A new file in
// e2e/features/ appears automatically (after the pinned ones, alphabetically);
// FEATURE_ORDER only pins the display order.
const files = import.meta.glob<string>('../../e2e/features/*.feature', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const FEATURE_ORDER = [
  'visitor-explores-qa',
  'recruiter-visits-portfolio',
  'visitor-navigates-site',
  'visitor-contacts-benjamin',
  'visitor-toggles-theme',
  'visitor-finds-bug-easter-egg',
  'visitor-reads-legal-notice',
]

function rank(path: string): number {
  const index = FEATURE_ORDER.indexOf(path.replace(/^.*\/|\.feature$/g, ''))
  return index === -1 ? FEATURE_ORDER.length : index
}

export const siteFeatures: string[] = Object.keys(files)
  .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
  .map((path) => files[path])
