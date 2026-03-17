import { useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useHashNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const pendingHash = useRef<string | null>(null)

  // Scroll to hash after navigation completes
  useEffect(() => {
    if (location.pathname === '/' && pendingHash.current) {
      const hash = pendingHash.current
      pendingHash.current = null
      // Wait for DOM to render the target section
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [location.pathname])

  const navigateToHash = useCallback(
    (e: React.MouseEvent, hash: string) => {
      e.preventDefault()
      if (location.pathname === '/') {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        pendingHash.current = hash
        navigate('/')
      }
    },
    [location.pathname, navigate],
  )

  return navigateToHash
}
