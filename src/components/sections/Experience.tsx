import { motion } from 'framer-motion'
import AnimatedSection from '../AnimatedSection'
import SectionHeading from '../ui/SectionHeading'
import DownloadResumeButton from '../ui/DownloadResumeButton'
import { experience } from '../../data/experience'
import { slugify } from '../../lib/slugify'
import { groupByCompany } from '../../lib/experience'

export default function Experience() {
  const groups = groupByCompany(experience)

  return (
    <AnimatedSection id="experience" className="py-28 px-6" data-testid="experience-section">
      <div className="max-w-3xl mx-auto">
        <SectionHeading size="lg" action={<DownloadResumeButton />}>Experience</SectionHeading>

        <div className="relative">
          {/* Continuous timeline line */}
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-teal-400/40 via-hairline/10 to-transparent" />

          <div className="space-y-10">
            {groups.map((group, groupIndex) => (
              <motion.div
                key={groupIndex}
                data-testid={`experience-card-${slugify(group.company)}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: groupIndex * 0.08 }}
                className="relative pl-10"
              >
                {/* Timeline node */}
                <div className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 ${
                  group.current
                    ? 'bg-teal-400 border-teal-400 shadow-[0_0_10px] shadow-teal-400/60'
                    : 'bg-surface border-hairline/20'
                }`} />

                {/* Connector arrow from node to card */}
                <div className="absolute left-[15px] top-[6px] w-[17px] h-px bg-hairline/10" />
                <div className="absolute left-[29px] top-[3px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-hairline/10" />

                {/* Card */}
                <div className="rounded-xl border border-hairline/5 bg-surface-raised/30 p-5 shadow-card hover:shadow-card-hover hover:border-teal-400/20 transition-all">
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
                      <div key={roleIndex} className={roleIndex > 0 ? 'pt-5 border-t border-hairline/5' : ''}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-2">
                          <h3 className="text-lg font-heading font-semibold text-content">
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
