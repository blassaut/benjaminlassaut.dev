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
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })
})

afterEach(() => {
  document.body.removeChild(target)
  scrollIntoView.mockClear()
  vi.unstubAllGlobals()
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
  })

  it('does nothing when the target section is missing on the home page', () => {
    const { result } = renderNavigation('/')

    expect(() =>
      act(() => result.current.navigateToHash(clickEvent().event, '#missing')),
    ).not.toThrow()
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('navigates home first, then scrolls to the section once the route has changed', () => {
    const { result } = renderNavigation('/qa')

    act(() => result.current.navigateToHash(clickEvent().event, '#about'))

    expect(result.current.location.pathname).toBe('/')
    expect(scrollIntoView).toHaveBeenCalledOnce()
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(scrollIntoView.mock.contexts[0]).toBe(target)
  })

  it('does not scroll on mount when there is no pending hash', () => {
    renderNavigation('/')
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('consumes the pending hash so later route changes do not re-scroll', () => {
    const { result, rerender } = renderNavigation('/qa')

    act(() => result.current.navigateToHash(clickEvent().event, '#about'))
    expect(scrollIntoView).toHaveBeenCalledOnce()

    rerender()
    expect(scrollIntoView).toHaveBeenCalledOnce()
  })

  it('scrolls directly on the second click, now that the route is home', () => {
    const { result } = renderNavigation('/qa')

    act(() => result.current.navigateToHash(clickEvent().event, '#about'))
    scrollIntoView.mockClear()

    act(() => result.current.navigateToHash(clickEvent().event, '#about'))

    expect(scrollIntoView).toHaveBeenCalledOnce()
    expect(result.current.location.pathname).toBe('/')
  })
})
