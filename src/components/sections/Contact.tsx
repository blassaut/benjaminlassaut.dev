import AnimatedSection from '../AnimatedSection'

const links = [
  { label: 'Email', href: 'mailto:benjamin@lassaut.dev', icon: '✉' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/benjaminlassaut', icon: 'in' },
  { label: 'GitHub', href: 'https://github.com/benjaminlassaut', icon: 'gh' },
  { label: 'X / Twitter', href: 'https://x.com/benjaminlassaut', icon: '𝕏' },
]

export default function Contact() {
  return (
    <AnimatedSection id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">Get in Touch</h2>
        <p className="text-muted font-body mb-10">
          Open to interesting opportunities and conversations about QA in web3.
        </p>
        <div className="flex justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg hover:bg-dark-700 transition-colors group"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-sm text-muted group-hover:text-teal-400 transition-colors font-body">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
