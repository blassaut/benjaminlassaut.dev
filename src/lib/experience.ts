import type { ExperienceEntry } from '../data/experience'

export interface CompanyGroup {
  company: string
  current: boolean
  roles: ExperienceEntry[]
}

/** Merges consecutive roles at the same company into one timeline card. */
export function groupByCompany(entries: ExperienceEntry[]): CompanyGroup[] {
  const groups: CompanyGroup[] = []
  for (const entry of entries) {
    const last = groups[groups.length - 1]
    if (last && last.company === entry.company) {
      last.roles.push(entry)
    } else {
      groups.push({ company: entry.company, current: !!entry.current, roles: [entry] })
    }
  }
  return groups
}
