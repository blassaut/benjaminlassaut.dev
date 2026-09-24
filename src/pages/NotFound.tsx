import { Link } from 'react-router-dom'
import { primaryButton } from '../components/ui/primaryButton'

export default function NotFound() {
  return (
    <div data-testid="not-found-page" className="min-h-[60vh] flex items-center justify-center px-6">
      <title>404 - Page Not Found - Benjamin Lassaut</title>
      <div className="text-center">
        <h1 className="text-8xl font-heading font-bold text-teal-400 mb-4">404</h1>
        <p className="text-xl text-muted font-body mb-8">This page doesn't exist.</p>
        <Link
          to="/"
          className={primaryButton()}
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
