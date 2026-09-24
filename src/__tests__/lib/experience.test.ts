import { describe, it, expect } from 'vitest'
import { groupByCompany } from '../../lib/experience'
import type { ExperienceEntry } from '../../data/experience'

function role(company: string, title: string, current?: boolean): ExperienceEntry {
  return { company, role: title, period: '', highlights: [], ...(current ? { current } : {}) }
}

describe('groupByCompany', () => {
  it('shows no timeline card when there is no experience', () => {
    expect(groupByCompany([])).toEqual([])
  })

  it('puts consecutive roles at one company on one card, in timeline order', () => {
    const lead = role('Kiln', 'Lead')
    const senior = role('Kiln', 'Senior')
    const qa = role('Coinhouse', 'QA Lead')

    const groups = groupByCompany([lead, senior, qa])

    expect(groups.map((g) => g.company)).toEqual(['Kiln', 'Coinhouse'])
    expect(groups[0].roles).toEqual([lead, senior])
    expect(groups[1].roles).toEqual([qa])
  })

  it('gives a company a new card when it comes back after another employer', () => {
    const groups = groupByCompany([role('A', '1'), role('B', '2'), role('A', '3')])
    expect(groups.map((g) => [g.company, g.roles.map((r) => r.role)])).toEqual([
      ['A', ['1']],
      ['B', ['2']],
      ['A', ['3']],
    ])
  })

  it('marks only the card whose latest role is current with the Current badge', () => {
    const groups = groupByCompany([role('Kiln', 'Lead', true), role('Kiln', 'Senior'), role('Coinhouse', 'QA Lead')])
    expect(groups.map((g) => g.current)).toStrictEqual([true, false])
  })
})
