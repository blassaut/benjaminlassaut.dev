import { useState } from 'react'
import { Link } from 'react-router-dom'
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
  const navigateToHash = useHashNavigation()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleHashClick(e: React.MouseEvent, hash: string) {
    setMobileOpen(false)
    navigateToHash(e, hash)
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
          onClick={(e) => handleHashClick(e, item.hash)}
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
        <Link to="/" className="font-heading text-lg font-bold text-teal-400">
          BL
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
