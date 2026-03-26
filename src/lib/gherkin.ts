export const GHERKIN_KEYWORDS = [
  'Feature:',
  'Scenario Outline:',
  'Scenario:',
  'Background:',
  'Examples:',
  'Given',
  'When',
  'Then',
  'And',
  'But',
]

export const GHERKIN_META = ['As a', 'I want', 'So that']
export const GHERKIN_TAGS = ['@desktop', '@mobile']

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function extractFeatureName(raw: string): string {
  const firstLine = raw.split('\n')[0]
  return firstLine.replace(/^Feature:\s*/, '').trim()
}

export function countScenarios(raw: string): number {
  return (raw.match(/^\s*Scenario(?: Outline)?:/gm) || []).length
}

export function countTestRuns(raw: string): number {
  const lines = raw.split('\n')
  let runs = 0
  let currentTag: string | null = null
  let inOutline = false
  let outlineMultiplier = 3
  let seenExamplesHeader = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('@desktop')) currentTag = 'desktop'
    else if (trimmed.startsWith('@mobile')) currentTag = 'mobile'
    else if (/^Scenario Outline:/.test(trimmed)) {
      inOutline = true
      seenExamplesHeader = false
      outlineMultiplier = currentTag === 'desktop' ? 1 : currentTag === 'mobile' ? 2 : 3
      currentTag = null
    } else if (/^Scenario:/.test(trimmed)) {
      inOutline = false
      seenExamplesHeader = false
      runs += currentTag === 'desktop' ? 1 : currentTag === 'mobile' ? 2 : 3
      currentTag = null
    } else if (inOutline && trimmed.startsWith('Examples:')) {
      seenExamplesHeader = false // next pipe row is the header
    } else if (inOutline && trimmed.startsWith('|')) {
      if (!seenExamplesHeader) {
        seenExamplesHeader = true // this is the header row, skip it
      } else {
        runs += outlineMultiplier // data row = one scenario instance
      }
    }
  }
  return runs
}
