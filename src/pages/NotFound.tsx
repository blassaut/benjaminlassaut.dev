import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <div data-testid="not-found-page" className="min-h-[60vh] flex items-center justify-center px-6">
      <Helmet>
        <title>404 - Page Not Found - Benjamin Lassaut</title>
      </Helmet>
      <div className="text-center">
        <h1 className="text-8xl font-heading font-bold text-teal-400 mb-4">404</h1>
        <p className="text-xl text-muted font-body mb-8">This page doesn't exist.</p>
        <Link
          to="/"
          className="px-7 py-3 bg-teal-400 text-dark-900 font-body font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
