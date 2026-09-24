import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import { MotionGlobalConfig } from 'framer-motion'
import Reveal from '../../../components/ui/Reveal'

// Lets a test scroll an element into, and out of, the viewport
let reportIntersection: IntersectionObserverCallback = () => {}
function scroll(el: Element, into: boolean) {
  act(() => reportIntersection([{ target: el, isIntersecting: into } as IntersectionObserverEntry], {} as IntersectionObserver))
}

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        reportIntersection = callback
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  // Values jump straight to their target: the tests check where blocks end up, not the easing
  MotionGlobalConfig.skipAnimations = true
})

afterAll(() => {
  vi.unstubAllGlobals()
  MotionGlobalConfig.skipAnimations = false
})

// Opacity and position. Tailwind scans test files too, and a CSS property name standing alone in the source
// becomes an (unused) rule in the site's stylesheet: the parentheses keep the scanner from reading it that way.
const look = (el: HTMLElement) => [el.style.opacity, (el.style.transform)]
const hidden20 = ['0', 'translateY(20px)']
const shown = ['1', 'none']

describe('Reveal', () => {
  it('keeps a block invisible, 20px low, until it is scrolled into view, then shows it in place', async () => {
    render(
      <>
        <Reveal immediate>Top of the page</Reveal>
        <Reveal className="mb-20">Feature files</Reveal>
      </>,
    )
    const block = screen.getByText('Feature files')
    expect(block).toHaveAttribute('class', 'mb-20')
    // Once the block at the top has appeared, animations have run: this one must still be waiting
    await waitFor(() => expect(look(screen.getByText('Top of the page'))).toEqual(shown))
    expect(look(block)).toEqual(hidden20)

    scroll(block, true)
    await waitFor(() => expect(look(block)).toEqual(shown))
  })

  // Otherwise every block would flicker out again when scrolled past
  it('stays visible once revealed, even when scrolled out of view', async () => {
    render(<Reveal>Section divider</Reveal>)
    const block = screen.getByText('Section divider')
    scroll(block, true)
    await waitFor(() => expect(look(block)).toEqual(shown))

    scroll(block, false)
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)))
    expect(look(block)).toEqual(shown)
  })

  it('starts from a custom distance', () => {
    render(<Reveal y={12}>Explore the test suite</Reveal>)
    expect(look(screen.getByText('Explore the test suite'))).toEqual(['0', 'translateY(12px)'])
  })

  // The top of /qa is on screen at load: it must not wait for a scroll that may never come
  it('shows an immediate block without any scrolling', async () => {
    render(<Reveal immediate>Who tests the tester?</Reveal>)
    const block = screen.getByText('Who tests the tester?')
    await waitFor(() => expect(look(block)).toEqual(shown))
  })
})
