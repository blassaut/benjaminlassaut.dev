import { Link } from 'react-router-dom'
import { useHashNavigation } from '../hooks/useHashNavigation'

const footerLinks = [
  { label: 'About', hash: '#about' },
  { label: 'Experience', hash: '#experience' },
  { label: 'Skills', hash: '#skills' },
  { label: 'Blog', href: '/blog' },
  { label: 'Who tests the tester?', href: '/qa' },
  { label: 'Contact', hash: '#contact' },
]

const socials = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/benjaminlassaut' },
  { label: 'GitHub', href: 'https://github.com/blassaut' },
]

export default function Footer() {
  const navigateToHash = useHashNavigation()

  return (
    <footer data-testid="footer" className="border-t border-white/5 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="shrink-0" aria-label="Home">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-8 h-8" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="footer-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#14b8a6'}} />
                    <stop offset="100%" style={{stopColor:'#0d9488'}} />
                  </linearGradient>
                </defs>
                <polygon points="100,14 180,54 180,146 100,186 20,146 20,54" fill="transparent" stroke="url(#footer-logo-grad)" strokeWidth="2.5"/>
                <text x="100" y="126" textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="80" letterSpacing="-4" fill="url(#footer-logo-grad)">BL</text>
              </svg>
            </Link>
            <p className="text-sm text-muted font-body max-w-xs">
              Lead QA Engineer building quality into web3 infrastructure.
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
                      data-testid={`footer-link-${item.label.toLowerCase()}`}
                      href={item.hash}
                      onClick={(e) => navigateToHash(e, item.hash)}
                      className="text-sm text-muted hover:text-light transition-colors font-body"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      data-testid={`footer-link-${item.label.toLowerCase()}`}
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
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
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
