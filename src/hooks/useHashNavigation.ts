import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/** Smoothly scrolls to the element a URL hash ("#contact") points at, if it exists. */
export function scrollToHash(hash: string) {
  // getElementById: a URL hash is user-controlled and may not be a valid CSS selector
  document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
}

/**
 * Click handler for links to a home page section. On the home page it scrolls
 * straight to the section; anywhere else it navigates to "/#section" and
 * ScrollToTop (App.tsx) scrolls once the home page has rendered, which also
 * works when the clicked component unmounts on navigation.
 */
export function useHashNavigation() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return useCallback(
    (e: React.MouseEvent, hash: string) => {
      e.preventDefault()
      if (pathname === '/') {
        scrollToHash(hash)
      } else {
        navigate({ pathname: '/', hash })
      }
    },
    [pathname, navigate],
  )
}
