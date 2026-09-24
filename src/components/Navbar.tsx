import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useHashNavigation } from '../hooks/useHashNavigation'
import { navLinks, type NavLink } from '../data/navigation'
import { slugify } from '../lib/slugify'
import ThemeToggle from './ui/ThemeToggle'
import Logo from './ui/Logo'

export default function Navbar() {
  const navigateToHash = useHashNavigation()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleHashClick(e: React.MouseEvent, hash: string, mobile = false) {
    if (mobile) {
      e.preventDefault()
      setMobileOpen(false)
      // Wait for menu close animation (250ms) before scrolling
      setTimeout(() => navigateToHash(e, hash), 300)
    } else {
      navigateToHash(e, hash)
    }
  }

  function handleLinkClick() {
    setMobileOpen(false)
  }

  function renderNavItem(item: NavLink, mobile = false) {
    const className = mobile
      ? 'block py-3 text-sm text-muted hover:text-content transition-colors font-body'
      : 'text-sm text-muted hover:text-content transition-colors font-body'

    const testid = `nav-link-${slugify(item.label)}`

    if ('hash' in item) {
      return (
        <a
          key={item.label}
          data-testid={testid}
          href={item.hash}
          onClick={(e) => handleHashClick(e, item.hash, mobile)}
          className={className}
        >
          {item.label}
        </a>
      )
    }
    return (
      <Link
        key={item.label}
        data-testid={testid}
        to={item.href}
        onClick={handleLinkClick}
        className={className}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <nav data-testid="nav" className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-hairline/5">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" data-testid="nav-logo" className="block" aria-label="Home">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => renderNavItem(item))}
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle testId="theme-toggle-mobile" />
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
          <motion.span
            className="block w-5 h-px bg-content"
            animate={mobileOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-px bg-content"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-px bg-content"
            animate={mobileOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            data-testid="nav-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-hairline/5 bg-surface/95 backdrop-blur-md"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((item) => renderNavItem(item, true))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
