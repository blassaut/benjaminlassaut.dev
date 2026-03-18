import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  id?: string
  'data-testid'?: string
}

export default function AnimatedSection({ children, className = '', id, ...rest }: Props) {
  return (
    <motion.section
      id={id}
      {...rest}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
