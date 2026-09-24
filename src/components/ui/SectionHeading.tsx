const sizes = {
  md: { wrapper: 'mb-8', title: 'text-2xl' },
  lg: { wrapper: 'mb-14', title: 'text-3xl' },
}

interface Props {
  children: React.ReactNode
  /** lg: the home page sections; md: the blocks of the QA page */
  size?: keyof typeof sizes
  /** Title centred between two hairlines instead of followed by one */
  centered?: boolean
  /** Shown right after the title, e.g. a download button */
  action?: React.ReactNode
}

export default function SectionHeading({ children, size = 'md', centered, action }: Props) {
  return (
    <div className={`flex items-center ${centered ? 'justify-center ' : ''}gap-4 ${sizes[size].wrapper}`}>
      {centered && <div className="flex-1 h-px bg-gradient-to-l from-teal-400/30 to-transparent" />}
      <h2 className={`${sizes[size].title} font-heading font-bold`}>{children}</h2>
      {action}
      <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
    </div>
  )
}
