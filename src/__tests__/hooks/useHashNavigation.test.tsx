import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useHashNavigation } from '../../hooks/useHashNavigation'

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('useHashNavigation', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useHashNavigation(), { wrapper })
    expect(typeof result.current).toBe('function')
  })

  it('scrolls to element when on home page', () => {
    const scrollIntoView = vi.fn()
    const el = document.createElement('div')
    el.id = 'about'
    el.scrollIntoView = scrollIntoView
    document.body.appendChild(el)

    const { result } = renderHook(() => useHashNavigation(), { wrapper })

    act(() => {
      const event = { preventDefault: vi.fn() } as unknown as React.MouseEvent
      result.current(event, '#about')
    })

    document.body.removeChild(el)
  })

  it('prevents default event behavior', () => {
    const preventDefault = vi.fn()
    const { result } = renderHook(() => useHashNavigation(), { wrapper })

    act(() => {
      const event = { preventDefault } as unknown as React.MouseEvent
      result.current(event, '#contact')
    })

    expect(preventDefault).toHaveBeenCalled()
  })
})
