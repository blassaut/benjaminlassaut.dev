import { motion } from 'framer-motion'
import AnimatedSection from '../AnimatedSection'
import { skillCategories } from '../../data/skills'

export default function Skills() {
  return (
    <AnimatedSection id="skills" className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-3xl font-heading font-bold">Skills</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
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
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-mono bg-white/[0.03] border border-white/5 rounded text-light/60 hover:text-teal-400 hover:border-teal-400/20 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
