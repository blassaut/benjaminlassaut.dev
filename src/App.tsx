import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, type ComponentType } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/Layout'
import Home from './pages/Home'
import QA from './pages/QA'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import { staticRoutes, type RoutePath } from './data/routes'
import { scrollToHash } from './hooks/useHashNavigation'

// One page per route in staticRoutes: the build fails if a route has no page or a page has no route.
const pages: Record<RoutePath, ComponentType> = {
  '/': Home,
  '/qa': QA,
  '/legal': Legal,
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Wait for the target page to render the section before scrolling
      requestAnimationFrame(() => scrollToHash(hash))
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            {staticRoutes.map(({ path }) => {
              const Page = pages[path]
              return <Route key={path} path={path} element={<Page />} />
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  )
}
