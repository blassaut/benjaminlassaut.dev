// @vitest-environment node
import { describe, it, expect } from 'vitest'
import type { Mutant } from './catalog.ts'
import { selectMutants } from './select.ts'

function mutant(id: string, files: string[], file = 'e2e/mutation/mutants/contact.yaml'): Mutant {
  return { id, ticket: 'T-1', concern: 'c', expect: 'e', scope: { files }, dom: [{ remove: 'a' }], file }
}

const contactEmail = mutant('contact-email', ['visitor-contacts-benjamin'])
const legalLink = mutant('legal-link', ['visitor-reads-legal-notice'], 'e2e/mutation/mutants/legal-notice.yaml')
const navMenu = mutant('nav-menu', ['visitor-navigates-site'], 'e2e/mutation/mutants/navigation.yaml')
const all = [contactEmail, legalLink, navMenu]
const ids = (s: { mutants: Mutant[] }) => s.mutants.map((m) => m.id)

describe('selectMutants', () => {
  it('runs the whole catalog by default', () => {
    expect(ids(selectMutants(all, {}))).toEqual(['contact-email', 'legal-link', 'nav-menu'])
  })

  it('keeps only the ids given to --only', () => {
    expect(ids(selectMutants(all, { only: 'nav-menu, contact-email' }))).toEqual(['contact-email', 'nav-menu'])
  })

  it('rejects an unknown --only id instead of silently running nothing', () => {
    expect(() => selectMutants(all, { only: 'nope' })).toThrow('--only: unknown mutant "nope"')
  })

  describe('--changed-since', () => {
    it('picks the mutants whose scope includes a changed feature file', () => {
      const s = selectMutants(all, { changedFiles: ['e2e/features/visitor-reads-legal-notice.feature'] })
      expect(ids(s)).toEqual(['legal-link'])
    })

    it('picks the mutants defined in a changed catalog file, not the whole catalog', () => {
      const s = selectMutants(all, { changedFiles: ['e2e/mutation/mutants/navigation.yaml'] })
      expect(ids(s)).toEqual(['nav-menu'])
    })

    it('ignores documentation changes', () => {
      const s = selectMutants(all, { changedFiles: ['e2e/mutation/README.md'] })
      expect(ids(s)).toEqual([])
      expect(s.reason).toBe('changed: nothing relevant')
    })

    it('runs every mutant when shared e2e code changed', () => {
      const s = selectMutants(all, { changedFiles: ['e2e/steps/contact.steps.ts', 'e2e/mutation/README.md'] })
      expect(ids(s)).toEqual(['contact-email', 'legal-link', 'nav-menu'])
      expect(s.reason).toBe('shared e2e code changed (e2e/steps/contact.steps.ts): running every mutant')
    })

    it('combines with --only', () => {
      const s = selectMutants(all, { only: 'contact-email', changedFiles: ['e2e/features/visitor-navigates-site.feature'] })
      expect(ids(s)).toEqual([])
    })
  })
})
