import { Link } from 'react-router-dom'
import { useHashNavigation } from '../hooks/useHashNavigation'
import { LINKEDIN_URL, GITHUB_URL } from '../data/links'
import { navLinks } from '../data/navigation'
import { profile } from '../data/profile'
import { slugify } from '../lib/slugify'
import Logo from './ui/Logo'

const socials = [
  { label: 'LinkedIn', href: LINKEDIN_URL },
  { label: 'GitHub', href: GITHUB_URL },
]

export default function Footer() {
  const navigateToHash = useHashNavigation()

  return (
    <footer data-testid="footer" className="border-t border-hairline/5 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="shrink-0" aria-label="Home">
              <Logo />
            </Link>
            <p className="text-sm text-muted font-body max-w-xs">
              Lead QA Engineer / SDET building automated quality into software end-to-end.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-12">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted/60 mb-3">Navigate</h4>
              <div className="flex flex-col gap-2">
                {navLinks.map((item) =>
                  'hash' in item ? (
                    <a
                      key={item.label}
                      data-testid={`footer-link-${slugify(item.label)}`}
                      href={item.hash}
                      onClick={(e) => navigateToHash(e, item.hash)}
                      className="text-sm text-muted hover:text-content transition-colors font-body"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      data-testid={`footer-link-${slugify(item.label)}`}
                      to={item.href}
                      className="text-sm text-muted hover:text-content transition-colors font-body"
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
                    data-testid={`footer-link-${slugify(link.label)}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-content transition-colors font-body"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-hairline/5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted/50 font-body">
          <span>&copy; {new Date().getFullYear()} {profile.name}</span>
          <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
          <Link
            data-testid="footer-link-legal"
            to="/legal"
            className="hover:text-content transition-colors"
          >
            Legal Notice
          </Link>
        </div>
      </div>
    </footer>
  )
}
