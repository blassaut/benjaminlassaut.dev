import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { GherkinLine } from '../../../components/qa/GherkinLine'
import { GHERKIN_KEYWORDS, GHERKIN_META, GHERKIN_TAGS } from '../../../lib/gherkin'

function renderLine(line: string) {
  const { container } = render(<GherkinLine line={line} />)
  const block = container.firstElementChild as HTMLElement
  return { block, spans: Array.from(block.children) as HTMLElement[] }
}

describe('GherkinLine', () => {
  describe('keywords', () => {
    it.each(GHERKIN_KEYWORDS)('highlights "%s" and keeps the rest of the line', (kw) => {
      const { block, spans } = renderLine(`  ${kw} something happens`)
      expect(block.textContent).toBe(`  ${kw} something happens`)
      expect(spans).toHaveLength(3)
      expect(spans[0].textContent).toBe('  ')
      expect(spans[1]).toHaveClass('text-teal-400')
      expect(spans[1].textContent).toBe(kw)
      expect(spans[2].textContent).toBe(' something happens')
    })

    it('does not treat a keyword in the middle of a line as a keyword', () => {
      const { spans } = renderLine('some text Given here')
      expect(spans).toHaveLength(1)
      expect(spans[0]).toHaveClass('text-muted/60')
    })

    it('omits the indent span when the line is not indented', () => {
      const { block, spans } = renderLine('Feature: Wallet')
      expect(block.textContent).toBe('Feature: Wallet')
      expect(spans).toHaveLength(2)
      expect(spans[0].textContent).toBe('Feature:')
    })
  })

  describe('tags', () => {
    it.each(GHERKIN_TAGS)('highlights the "%s" tag in amber', (tag) => {
      const { block, spans } = renderLine(`  ${tag} @slow`)
      expect(block.textContent).toBe(`  ${tag} @slow`)
      expect(spans).toHaveLength(3)
      expect(spans[0].textContent).toBe('  ')
      expect(spans[1]).toHaveClass('text-amber-400/80')
      expect(spans[1].textContent).toBe(tag)
      expect(spans[2].textContent).toBe(' @slow')
    })

    it('omits the indent span for an unindented tag', () => {
      const { spans } = renderLine('@desktop')
      expect(spans).toHaveLength(2)
    })
  })

  describe('meta lines', () => {
    it.each(GHERKIN_META)('renders "%s ..." as an italic meta line', (meta) => {
      const { block, spans } = renderLine(`  ${meta} visitor`)
      expect(block.textContent).toBe(`  ${meta} visitor`)
      expect(spans).toHaveLength(2)
      expect(spans[0].textContent).toBe('  ')
      expect(spans[1]).toHaveClass('italic')
      expect(spans[1].textContent).toBe(`${meta} visitor`)
    })

    it('omits the indent span for an unindented meta line', () => {
      const { spans } = renderLine('As a visitor')
      expect(spans).toHaveLength(1)
      expect(spans[0]).toHaveClass('italic')
    })
  })

  describe('tables, comments and blanks', () => {
    it('dims table rows and preserves indentation', () => {
      const { block, spans } = renderLine('      | page | home |')
      expect(block.textContent).toBe('      | page | home |')
      expect(spans).toHaveLength(2)
      expect(spans[0].textContent).toBe('      ')
      expect(spans[1]).toHaveClass('text-light/40')
    })

    it('omits the indent span for an unindented table row', () => {
      const { spans } = renderLine('| a |')
      expect(spans).toHaveLength(1)
      expect(spans[0]).toHaveClass('text-light/40')
    })

    it('renders comments as hairline text', () => {
      const { block } = renderLine('  # a comment')
      expect(block).toHaveClass('text-hairline/10')
      expect(block.textContent).toBe('  # a comment')
    })

    it('renders an empty line as a single space so the row keeps its height', () => {
      const { block } = renderLine('')
      expect(block).toHaveClass('text-hairline/10')
      expect(block.textContent).toBe(' ')
    })

    it('renders whitespace-only lines as hairline text without substitution', () => {
      const { block } = renderLine('   ')
      expect(block).toHaveClass('text-hairline/10')
      expect(block.textContent).toBe('   ')
    })

    it('renders any other text as muted, untouched', () => {
      const { block, spans } = renderLine('  free text')
      expect(spans).toHaveLength(1)
      expect(spans[0]).toHaveClass('text-muted/60')
      expect(block.textContent).toBe('  free text')
    })
  })
})
