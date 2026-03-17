import { Link } from 'react-router-dom'

const navItems = [
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-heading text-lg font-bold text-teal-400">
          BL
        </Link>
        <div className="flex gap-6">
          {navItems.map((item) =>
            item.href.startsWith('#') ? (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-muted hover:text-light transition-colors font-body"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm text-muted hover:text-light transition-colors font-body"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
