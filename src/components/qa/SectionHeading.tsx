export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-2xl font-heading font-bold">{children}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
    </div>
  )
}
