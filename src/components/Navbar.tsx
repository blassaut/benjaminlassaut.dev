import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useHashNavigation } from '../hooks/useHashNavigation'

const navItems = [
  { label: 'About', hash: '#about' },
  { label: 'Experience', hash: '#experience' },
  { label: 'Skills', hash: '#skills' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', hash: '#contact' },
]

export default function Navbar() {
  const location = useLocation()
  const navigateToHash = useHashNavigation()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleHashClick(e: React.MouseEvent, hash: string, mobile = false) {
    if (mobile) {
      e.preventDefault()
      setMobileOpen(false)
      // Wait for menu close animation (250ms) before scrolling
      setTimeout(() => {
        if (location.pathname === '/') {
          document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
        } else {
          navigateToHash(e, hash)
        }
      }, 300)
    } else {
      navigateToHash(e, hash)
    }
  }

  function handleLinkClick() {
    setMobileOpen(false)
  }

  function renderNavItem(item: (typeof navItems)[number], mobile = false) {
    const className = mobile
      ? 'block py-3 text-sm text-muted hover:text-light transition-colors font-body'
      : 'text-sm text-muted hover:text-light transition-colors font-body'

    if (item.hash) {
      return (
        <a
          key={item.label}
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
        to={item.href!}
        onClick={handleLinkClick}
        className={className}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="block" aria-label="Home">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-8 h-8" role="img" aria-hidden="true">
            <defs>
              <linearGradient id="nav-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#14b8a6'}} />
                <stop offset="100%" style={{stopColor:'#0d9488'}} />
              </linearGradient>
            </defs>
            <polygon points="100,14 180,54 180,146 100,186 20,146 20,54" fill="transparent" stroke="url(#nav-logo-grad)" strokeWidth="2.5"/>
            <text x="100" y="126" textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="80" letterSpacing="-4" fill="url(#nav-logo-grad)">BL</text>
          </svg>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => renderNavItem(item))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <motion.span
            className="block w-5 h-px bg-light"
            animate={mobileOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-px bg-light"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-px bg-light"
            animate={mobileOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-dark-900/95 backdrop-blur-md"
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => renderNavItem(item, true))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
