import AnimatedSection from '../AnimatedSection'
import { experience } from '../../data/experience'

export default function Experience() {
  return (
    <AnimatedSection id="experience" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-heading font-bold mb-12">Experience</h2>
        <div className="space-y-12">
          {experience.map((entry) => (
            <div key={entry.company} className="relative pl-8 border-l-2 border-teal-400/30">
              {entry.current && (
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-teal-400" />
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-3">
                <div>
                  <h3 className="text-xl font-heading font-semibold">{entry.role}</h3>
                  <p className="text-teal-400 font-body">{entry.company}</p>
                </div>
                <span className="text-sm text-muted font-mono">{entry.period}</span>
              </div>
              <ul className="space-y-2">
                {entry.highlights.map((h, i) => (
                  <li key={i} className="text-muted font-body text-sm leading-relaxed">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
