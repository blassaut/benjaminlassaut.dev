import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTheme } from '../../hooks/useTheme'

let themeColorMeta: HTMLMetaElement

beforeEach(() => {
  document.documentElement.className = ''
  localStorage.clear()
  themeColorMeta = document.createElement('meta')
  themeColorMeta.setAttribute('name', 'theme-color')
  themeColorMeta.setAttribute('content', 'initial')
  document.head.appendChild(themeColorMeta)
})

afterEach(() => {
  themeColorMeta.remove()
  vi.restoreAllMocks()
})

describe('useTheme', () => {
  it('defaults to light when nothing is stored', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('reads dark from a pre-set html class (no flash)', () => {
    document.documentElement.classList.add('dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('falls back to the stored preference when the html class is absent', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('treats any stored value other than "dark" as light', () => {
    localStorage.setItem('theme', 'blue')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('falls back to light when localStorage is unreadable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('toggles the theme, the html class and localStorage together', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')

    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('updates the browser chrome colour through the theme-color meta tag', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setTheme('dark'))
    expect(themeColorMeta.getAttribute('content')).toBe('#0a0a0f')

    act(() => result.current.setTheme('light'))
    expect(themeColorMeta.getAttribute('content')).toBe('#faf9f6')
  })

  it('sets an explicit theme regardless of the current one', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setTheme('dark'))
    act(() => result.current.setTheme('dark'))
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('still applies the theme when localStorage cannot be written', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    const { result } = renderHook(() => useTheme())

    expect(() => act(() => result.current.toggleTheme())).not.toThrow()
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('keeps every mounted consumer in sync via the shared store', () => {
    const a = renderHook(() => useTheme())
    const b = renderHook(() => useTheme())

    act(() => a.result.current.toggleTheme())

    expect(a.result.current.theme).toBe('dark')
    expect(b.result.current.theme).toBe('dark')
  })
})
