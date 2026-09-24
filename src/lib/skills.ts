import type { SkillEntry } from '../data/skills'

/** The label of a skill, whether it is a plain string or a tagged entry. */
export function getSkillName(skill: SkillEntry): string {
  return typeof skill === 'string' ? skill : skill.name
}

/**
 * A deliberately planted duplicate (the "Playwright listed twice" easter egg):
 * shown on the site with its bug popover, left out of the PDF resume.
 */
export function isBugSkill(skill: SkillEntry): skill is { name: string; bug: true } {
  return typeof skill !== 'string' && skill.bug
}
