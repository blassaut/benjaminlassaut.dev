import AnimatedSection from '../AnimatedSection'
import { skillCategories } from '../../data/skills'

export default function Skills() {
  return (
    <AnimatedSection id="skills" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-heading font-bold mb-12">Skills</h2>
        <div className="space-y-10">
          {skillCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-lg font-heading font-semibold text-teal-400 mb-4">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-mono bg-dark-700 border border-white/5 rounded-md text-light/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
