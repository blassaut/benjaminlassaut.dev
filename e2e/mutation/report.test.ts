// @vitest-environment node
import { describe, it, expect } from 'vitest'
import type { Mutant } from './catalog.ts'
import type { MutantResult } from './playwright.ts'
import { renderMarkdown } from './report.ts'

const mutant = (id: string): Mutant => ({
  id,
  ticket: 'PORT-1',
  concern: 'The contact link is gone',
  expect: 'fail when the link is missing',
  scope: { files: ['visitor-contacts-benjamin'] },
  dom: [{ remove: 'a' }],
  file: 'e2e/mutation/mutants/contact.yaml',
})

const killed: MutantResult = {
  mutant: mutant('link-gone'),
  status: 'killed',
  killedBy: ['Contact › Social links [desktop-chrome]'],
  tests: 3,
  durationMs: 4200,
}
const survived: MutantResult = { mutant: mutant('link-moved'), status: 'survived', killedBy: [], tests: 3, durationMs: 9000 }

describe('renderMarkdown', () => {
  it('lists each mutant with the test that caught it', () => {
    const md = renderMarkdown([killed], '2026-09-24T00:00:00.000Z')
    expect(md).toContain('Generated 2026-09-24T00:00:00.000Z · 1 mutant(s) · killed: 1')
    expect(md).toContain(
      '| ✅ killed | `link-gone` | PORT-1 | The contact link is gone | visitor-contacts-benjamin | Contact › Social links [desktop-chrome] | 4s |',
    )
    expect(md).not.toContain('## Action required')
  })

  it('tells the author what to do for every mutant that was not killed', () => {
    const md = renderMarkdown([killed, survived], '2026-09-24T00:00:00.000Z')
    expect(md).toContain('| 🟥 survived | `link-moved` |')
    expect(md).toContain('## Action required')
    expect(md).toContain('### 🟥 `link-moved` — survived')
    expect(md).toContain('- **A good test would:** fail when the link is missing')
    expect(md).toContain('- **Next step:** the scenarios in scope ran green with this bug planted.')
    expect(md).not.toContain('### ✅ `link-gone`')
  })
})
