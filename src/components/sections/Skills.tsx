import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from '../AnimatedSection'
import { skillCategories } from '../../data/skills'
import type { SkillEntry } from '../../data/skills'

function getSkillName(skill: SkillEntry): string {
  return typeof skill === 'string' ? skill : skill.name
}

function isBugSkill(skill: SkillEntry): skill is { name: string; bug: true } {
  return typeof skill !== 'string' && skill.bug === true
}

function BugSkillTag({ name }: { name: string }) {
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative px-2.5 py-1 text-xs font-mono bg-white/[0.03] border border-white/5 rounded text-light/60 hover:text-teal-400 hover:border-teal-400/20 transition-colors cursor-pointer inline-flex items-center gap-1.5"
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-expanded={open}
      data-testid="bug-skill-tag"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((prev) => !prev)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      {name}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-light/40"
        aria-hidden="true"
      >
        <path d="M8 2l1.88 1.88" />
        <path d="M14.12 3.88 16 2" />
        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
        <path d="M12 20v-9" />
        <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
        <path d="M6 13H2" />
        <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
        <path d="M22 13h-4" />
        <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
      </svg>

      {open && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 rounded-lg bg-[#1a1a2e] border border-teal-500/30 text-left z-50"
          data-testid="bug-popover"
          role="tooltip"
        >
          <span className="block font-heading text-sm text-teal-400 mb-1">
            You found a deliberate bug!
          </span>
          <span className="block text-xs text-light/60 font-sans">
            Playwright doesn't belong in Infrastructure. Visit the{' '}
            <span className="text-teal-400">"Who tests the tester?"</span>{' '}
            page to see how this site tests itself.
          </span>
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-teal-500/30" />
        </span>
      )}
    </span>
  )
}

export default function Skills() {
  return (
    <AnimatedSection id="skills" className="py-28 px-6" data-testid="skills-section">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-3xl font-heading font-bold">Skills</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
              data-testid={`skills-category-${category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: catIndex * 0.1 }}
              className="p-5 rounded-xl border border-white/5 bg-dark-800/30 hover:border-teal-400/20 transition-colors"
            >
              <h3 className="text-sm font-mono tracking-wide text-teal-400 mb-4 uppercase">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => {
                  const name = getSkillName(skill)
                  if (isBugSkill(skill)) {
                    return <BugSkillTag key={`${category.name}-${name}`} name={name} />
                  }
                  return (
                    <span
                      key={`${category.name}-${name}`}
                      className="px-2.5 py-1 text-xs font-mono bg-white/[0.03] border border-white/5 rounded text-light/60 hover:text-teal-400 hover:border-teal-400/20 transition-colors cursor-default"
                    >
                      {name}
                    </span>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
