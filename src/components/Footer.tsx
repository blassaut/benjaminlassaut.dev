import { Link } from 'react-router-dom'
import { useHashNavigation } from '../hooks/useHashNavigation'

const footerLinks = [
  { label: 'About', hash: '#about' },
  { label: 'Experience', hash: '#experience' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', hash: '#contact' },
]

const socials = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/benjaminlassaut' },
  { label: 'GitHub', href: 'https://github.com/benjaminlassaut' },
]

export default function Footer() {
  const navigateToHash = useHashNavigation()

  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="font-heading text-lg font-bold text-teal-400">
              BL
            </Link>
            <p className="mt-2 text-sm text-muted font-body max-w-xs">
              QA Lead building quality into web3 infrastructure.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-12">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted/60 mb-3">Navigate</h4>
              <div className="flex flex-col gap-2">
                {footerLinks.map((item) =>
                  item.hash ? (
                    <a
                      key={item.label}
                      href={item.hash}
                      onClick={(e) => navigateToHash(e, item.hash)}
                      className="text-sm text-muted hover:text-light transition-colors font-body"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.href!}
                      className="text-sm text-muted hover:text-light transition-colors font-body"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted/60 mb-3">Connect</h4>
              <div className="flex flex-col gap-2">
                {socials.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-light transition-colors font-body"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/5 text-center text-xs text-muted/50 font-body">
          &copy; {new Date().getFullYear()} Benjamin Lassaut
        </div>
      </div>
    </footer>
  )
}
