import { motion } from 'framer-motion'
import AnimatedSection from '../AnimatedSection'
import DownloadResumeButton from '../ui/DownloadResumeButton'
import { experience, type ExperienceEntry } from '../../data/experience'

interface CompanyGroup {
  company: string
  current: boolean
  roles: ExperienceEntry[]
}

function groupByCompany(entries: ExperienceEntry[]): CompanyGroup[] {
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

export default function Experience() {
  const groups = groupByCompany(experience)

  return (
    <AnimatedSection id="experience" className="py-28 px-6" data-testid="experience-section">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-3xl font-heading font-bold">Experience</h2>
          <DownloadResumeButton />
          <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
        </div>

        <div className="relative">
          {/* Continuous timeline line */}
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-teal-400/40 via-white/10 to-transparent" />

          <div className="space-y-10">
            {groups.map((group, groupIndex) => (
              <motion.div
                key={groupIndex}
                data-testid={`experience-card-${group.company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: groupIndex * 0.08 }}
                className="relative pl-10"
              >
                {/* Timeline node */}
                <div className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 ${
                  group.current
                    ? 'bg-teal-400 border-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.6)]'
                    : 'bg-dark-900 border-white/20'
                }`} />

                {/* Connector arrow from node to card */}
                <div className="absolute left-[15px] top-[6px] w-[17px] h-px bg-white/10" />
                <div className="absolute left-[29px] top-[3px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-white/10" />

                {/* Card */}
                <div className="rounded-xl border border-white/5 bg-dark-800/30 p-5 hover:border-teal-400/20 transition-colors">
                  {/* Company header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-mono text-teal-400 tracking-wide">{group.company}</span>
                    {group.current && (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-teal-400 border border-teal-400/30 rounded-full bg-teal-400/5">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Roles */}
                  <div className="space-y-5">
                    {group.roles.map((entry, roleIndex) => (
                      <div key={roleIndex} className={roleIndex > 0 ? 'pt-5 border-t border-white/5' : ''}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-2">
                          <h3 className="text-lg font-heading font-semibold text-light">
                            {entry.role}
                          </h3>
                          <span className="text-xs text-muted font-mono tracking-wide shrink-0">{entry.period}</span>
                        </div>
                        <div className="space-y-1">
                          {entry.highlights.map((h, i) => (
                            <p key={i} className="text-sm text-muted font-body leading-relaxed">
                              {h}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
