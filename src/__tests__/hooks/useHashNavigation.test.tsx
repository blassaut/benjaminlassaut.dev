import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useHashNavigation } from '../../hooks/useHashNavigation'

function makeWrapper(initialPath: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
  }
}

function renderNavigation(initialPath: string) {
  return renderHook(() => ({ navigateToHash: useHashNavigation(), location: useLocation() }), {
    wrapper: makeWrapper(initialPath),
  })
}

function clickEvent() {
  const preventDefault = vi.fn()
  return { event: { preventDefault } as unknown as React.MouseEvent, preventDefault }
}

const scrollIntoView = vi.fn()
let target: HTMLElement

beforeEach(() => {
  target = document.createElement('section')
  target.id = 'about'
  target.scrollIntoView = scrollIntoView
  document.body.appendChild(target)
})

afterEach(() => {
  document.body.removeChild(target)
  scrollIntoView.mockClear()
})

describe('useHashNavigation', () => {
  it('prevents the default anchor behaviour', () => {
    const { result } = renderNavigation('/')
    const { event, preventDefault } = clickEvent()

    act(() => result.current.navigateToHash(event, '#about'))

    expect(preventDefault).toHaveBeenCalledOnce()
  })

  it('scrolls smoothly to the section when already on the home page', () => {
    const { result } = renderNavigation('/')

    act(() => result.current.navigateToHash(clickEvent().event, '#about'))

    expect(scrollIntoView).toHaveBeenCalledOnce()
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(scrollIntoView.mock.contexts[0]).toBe(target)
    expect(result.current.location.pathname).toBe('/')
    expect(result.current.location.hash).toBe('')
  })

  it('does nothing when the target section is missing on the home page', () => {
    const { result } = renderNavigation('/')

    expect(() =>
      act(() => result.current.navigateToHash(clickEvent().event, '#missing')),
    ).not.toThrow()
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('does not crash when the hash is not a valid CSS selector', () => {
    const { result } = renderNavigation('/')

    expect(() => act(() => result.current.navigateToHash(clickEvent().event, '#123'))).not.toThrow()
  })

  // Scrolling on arrival is ScrollToTop's job (App.test.tsx): it also works when
  // the clicked component unmounts on navigation, like the QA page CTA.
  it('navigates to the home page with the section hash from another page', () => {
    const { result } = renderNavigation('/qa')

    act(() => result.current.navigateToHash(clickEvent().event, '#about'))

    expect(result.current.location.pathname).toBe('/')
    expect(result.current.location.hash).toBe('#about')
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('scrolls directly on the second click, now that the route is home', () => {
    const { result } = renderNavigation('/qa')

    act(() => result.current.navigateToHash(clickEvent().event, '#about'))
    expect(result.current.location.pathname).toBe('/')

    act(() => result.current.navigateToHash(clickEvent().event, '#about'))

    expect(scrollIntoView).toHaveBeenCalledOnce()
    expect(scrollIntoView.mock.contexts[0]).toBe(target)
  })
})
