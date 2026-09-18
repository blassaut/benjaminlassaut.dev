/**
 * Layout tests for the PDF resume.
 *
 * jsPDF is replaced by a recorder so we can assert *what* is written, *where*
 * and *how* (font, size, colour), instead of only checking that a non-empty
 * blob comes out. Smoke tests against the real jsPDF live in
 * generateResume.test.ts.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { experience } from '../../data/experience'
import { skillCategories } from '../../data/skills'
import { certifications } from '../../data/certifications'
import { LINKEDIN_URL, GITHUB_URL } from '../../data/links'

interface TextCall {
  text: string
  lines: number
  font: string
  x: number
  y: number
  page: number
  style: string
  size: number
  color: number[]
}

interface LineCall {
  x1: number
  y1: number
  x2: number
  y2: number
  color: number[]
  width: number
}

const { RecorderPDF } = vi.hoisted(() => {
  class RecorderPDF {
    static last: RecorderPDF
    texts: TextCall[] = []
    drawnLines: LineCall[] = []
    pages = 1
    /** Override to simulate long wrapped text; reset to null after use. */
    static splitOverride: ((text: string, width: number) => string[]) | null = null
    splitCalls: Array<[string, number]> = []
    private font = ''
    private style = ''
    private size = 0
    private color: number[] = []
    private drawColor: number[] = []
    private lineWidth = 0

    constructor(public readonly options: unknown) {
      RecorderPDF.last = this
    }
    setFont(name: string, style: string) {
      this.font = name
      this.style = style
    }
    setFontSize(size: number) {
      this.size = size
    }
    setTextColor(...rgb: number[]) {
      this.color = rgb
    }
    setDrawColor(...rgb: number[]) {
      this.drawColor = rgb
    }
    setLineWidth(width: number) {
      this.lineWidth = width
    }
    line(x1: number, y1: number, x2: number, y2: number) {
      this.drawnLines.push({ x1, y1, x2, y2, color: this.drawColor, width: this.lineWidth })
    }
    getTextWidth(text: string) {
      return text.length * 2
    }
    splitTextToSize(text: string, width: number): string[] {
      this.splitCalls.push([text, width])
      return RecorderPDF.splitOverride ? RecorderPDF.splitOverride(text, width) : [text]
    }
    text(text: string | string[], x: number, y: number) {
      const lines = Array.isArray(text) ? text : [text]
      this.texts.push({
        text: lines.join('\n'),
        lines: lines.length,
        font: this.font,
        x,
        y,
        page: this.pages,
        style: this.style,
        size: this.size,
        color: this.color,
      })
    }
    addPage() {
      this.pages++
    }
    output(kind: string) {
      return new Blob([`%PDF-fake-${kind}`], { type: 'application/pdf' })
    }
  }
  return { RecorderPDF }
})

vi.mock('jspdf', () => ({ default: RecorderPDF }))

const { generateResume } = await import('../../lib/generateResume')

const MARGIN_LEFT = 15
const RIGHT_EDGE = 195 // 210 - 15
const CONTENT_WIDTH = 180
const PAGE_TOP = 12

const TEAL = [20, 184, 166]
const DARK = [30, 30, 30]
const MUTED = [120, 120, 120]
const BLACK = [0, 0, 0]

function run() {
  const blob = generateResume()
  const doc = RecorderPDF.last
  const find = (text: string) => {
    const call = doc.texts.find((t) => t.text === text)
    if (!call) throw new Error(`No text call for ${JSON.stringify(text)}`)
    return call
  }
  const findAll = (predicate: (t: TextCall) => boolean) => doc.texts.filter(predicate)
  const width = (text: string) => doc.getTextWidth(text)
  return { blob, doc, find, findAll, width }
}

beforeEach(() => {
  RecorderPDF.splitOverride = null
})

describe('generateResume layout', () => {
  it('creates an A4 document in millimetres and returns it as a PDF blob', () => {
    const { blob, doc } = run()
    expect(doc.options).toEqual({ unit: 'mm', format: 'a4' })
    expect(blob.type).toBe('application/pdf')
  })

  it('lays out the header block: name, title, links and a teal rule', () => {
    const { find, doc } = run()

    const name = find('Benjamin Lassaut')
    expect(name).toMatchObject({ x: MARGIN_LEFT, y: PAGE_TOP, style: 'bold', size: 18, color: BLACK })

    const title = find('Lead QA Engineer / SDET  |  Opio, France')
    expect(title).toMatchObject({ x: MARGIN_LEFT, y: 17.5, style: 'normal', size: 9.5, color: MUTED })

    const links = find(`LinkedIn: ${LINKEDIN_URL}  |  GitHub: ${GITHUB_URL}  |  benjaminlassaut.dev`)
    expect(links).toMatchObject({ x: MARGIN_LEFT, y: 21.5, size: 8, color: MUTED })

    expect(doc.drawnLines).toEqual([
      { x1: MARGIN_LEFT, y1: 24, x2: RIGHT_EDGE, y2: 24, color: TEAL, width: 0.6 },
    ])
  })

  it('renders the section headings in order, bold teal 11pt', () => {
    const { findAll } = run()
    const headings = ['Summary', 'Experience', 'Skills', 'Certifications', 'Education', 'Languages']
    const calls = findAll((t) => headings.includes(t.text))

    expect(calls.map((c) => c.text)).toEqual(headings)
    for (const call of calls) {
      expect(call).toMatchObject({ x: MARGIN_LEFT, style: 'bold', size: 11, color: TEAL })
    }
  })

  it('wraps the summary to the content width and places Experience right after it', () => {
    const { find, doc } = run()

    const summary = find('Summary')
    expect(summary.y).toBe(29)

    const about = doc.texts[doc.texts.indexOf(summary) + 1]
    expect(about).toMatchObject({ x: MARGIN_LEFT, y: 33.5, style: 'normal', size: 8.5, color: DARK })
    expect(doc.splitCalls).toContainEqual([about.text, CONTENT_WIDTH])
    for (const fragment of [
      "we're not sure it works",
      'shippable confidence',
      'First quality hire',
      '20+ networks',
      'GitHub Actions, and BDD.',
    ]) {
      expect(about.text).toContain(fragment)
    }

    // 33.5 + 1 line * 3.5 + 4 gap = 41
    expect(find('Experience').y).toBe(41)
  })

  it('writes every experience entry with a right-aligned period and indented highlights', () => {
    const { find, doc, width } = run()
    expect(experience.length).toBeGreaterThan(0)

    let previousEnd: number | null = null
    for (const entry of experience) {
      const title = find(`${entry.company} - ${entry.role}`)
      expect(title).toMatchObject({ x: MARGIN_LEFT, style: 'bold', size: 9, color: BLACK })
      if (previousEnd !== null) expect(title.y).toBe(previousEnd + 2)

      const period = doc.texts[doc.texts.indexOf(title) + 1]
      expect(period).toMatchObject({ text: entry.period, y: title.y, style: 'normal', size: 7.5, color: MUTED })
      expect(period.x + width(entry.period)).toBe(RIGHT_EDGE)

      let cursor = doc.texts.indexOf(period) + 1
      let y = title.y + 3.8
      for (const highlight of entry.highlights) {
        const bullet = doc.texts[cursor]
        const body = doc.texts[cursor + 1]
        expect(bullet).toMatchObject({ text: '-', x: MARGIN_LEFT + 2, y })
        expect(body).toMatchObject({ text: highlight, x: MARGIN_LEFT + 6, y, style: 'normal', size: 8, color: DARK })
        expect(doc.splitCalls).toContainEqual([highlight, CONTENT_WIDTH - 6])
        y += 3.2
        cursor += 2
      }
      previousEnd = y
    }
  })

  it('uses Helvetica for every piece of text', () => {
    const { doc } = run()
    expect(doc.texts.length).toBeGreaterThan(0)
    for (const call of doc.texts) expect(call.font).toBe('helvetica')
  })

  it('lists skills per category, excluding bug-tagged entries, aligned after the label', () => {
    const { find, doc, width } = run()

    const hasBugTaggedSkill = skillCategories.some((c) =>
      c.skills.some((s) => typeof s !== 'string' && s.bug),
    )
    expect(hasBugTaggedSkill).toBe(true)

    let previousLabelY: number | null = null
    for (const category of skillCategories) {
      const label = find(`${category.name}:`)
      expect(label).toMatchObject({ x: MARGIN_LEFT, style: 'bold', size: 8.5, color: BLACK })
      if (previousLabelY !== null) expect(label.y).toBe(previousLabelY + 3.2 + 2)
      previousLabelY = label.y

      const expected = category.skills.filter((s): s is string => typeof s === 'string').join(', ')
      const skills = doc.texts[doc.texts.indexOf(label) + 1]
      const labelWidth = width(`${category.name}: `)
      expect(skills).toMatchObject({ text: expected, x: MARGIN_LEFT + labelWidth, y: label.y, style: 'normal', color: DARK })
      expect(doc.splitCalls).toContainEqual([expected, CONTENT_WIDTH - labelWidth])
    }
  })

  it('lists certifications with the year right-aligned', () => {
    const { find, doc, width } = run()
    expect(certifications.length).toBeGreaterThan(0)

    for (const cert of certifications) {
      const line = find(`- ${cert.name} (${cert.issuer})`)
      expect(line).toMatchObject({ x: MARGIN_LEFT, style: 'normal', size: 8.5, color: DARK })

      const year = doc.texts[doc.texts.indexOf(line) + 1]
      expect(year).toMatchObject({ text: cert.year, y: line.y, size: 7.5, color: MUTED })
      expect(year.x + width(cert.year)).toBe(RIGHT_EDGE)
    }

    const first = find(`- ${certifications[0].name} (${certifications[0].issuer})`)
    expect(find('Certifications').y).toBe(first.y - 5)
    const last = find(`- ${certifications.at(-1)!.name} (${certifications.at(-1)!.issuer})`)
    expect(last.y).toBe(first.y + 4 * (certifications.length - 1))
    expect(find('Education').y).toBe(last.y + 4 + 2)
  })

  it('writes the education block with a right-aligned period', () => {
    const { find, width } = run()

    const school = find("Institut Superieur d'Electronique de Paris")
    expect(school).toMatchObject({ x: MARGIN_LEFT, style: 'bold', size: 9, color: BLACK })

    const period = find('2009 - 2012')
    expect(period).toMatchObject({ y: school.y, style: 'normal', size: 7.5, color: MUTED })
    expect(period.x + width('2009 - 2012')).toBe(RIGHT_EDGE)

    const degree = find("Master's Degree in Engineering - Electronics & Computer Science")
    expect(degree).toMatchObject({ x: MARGIN_LEFT, y: school.y + 3.5, style: 'normal', size: 8, color: DARK })
  })

  it('writes the languages line', () => {
    const { find } = run()
    expect(find('French (Native)  |  English (Professional)')).toMatchObject({
      x: MARGIN_LEFT,
      style: 'normal',
      size: 8.5,
      color: DARK,
    })
  })

  it('never writes upwards on a page: y only grows until a page break', () => {
    const { doc } = run()
    for (let i = 1; i < doc.texts.length; i++) {
      const prev = doc.texts[i - 1]
      const curr = doc.texts[i]
      if (curr.page === prev.page) {
        expect(curr.y, `${JSON.stringify(curr.text)} after ${JSON.stringify(prev.text)}`).toBeGreaterThanOrEqual(prev.y)
      } else {
        expect(curr.y).toBe(PAGE_TOP)
      }
    }
  })

  it('breaks the page when the next block would overflow the bottom margin', () => {
    const { doc: short } = run()
    const pagesWithShortSummary = short.pages

    // Wrap the summary onto 80 lines: 33.5 + 80 * 3.5 + 4 = 317.5 > 285
    RecorderPDF.splitOverride = (text, width) =>
      width === CONTENT_WIDTH && text.includes('shippable confidence')
        ? Array.from({ length: 80 }, () => text)
        : [text]
    const { doc, find } = run()

    expect(doc.pages).toBe(pagesWithShortSummary + 1)
    expect(find('Experience')).toMatchObject({ page: 2, y: PAGE_TOP })
  })

  it('breaks the page before a highlight that would not fit', () => {
    RecorderPDF.splitOverride = (text, width) =>
      width === CONTENT_WIDTH - 6 && text === experience[0].highlights[0]
        ? Array.from({ length: 90 }, () => text)
        : [text]
    const { doc, find } = run()

    const first = find(`${experience[0].company} - ${experience[0].role}`)
    const body = doc.texts[doc.texts.indexOf(first) + 3]
    expect(body.text.split('\n')).toHaveLength(90)
    expect(body).toMatchObject({ page: 2, y: PAGE_TOP, x: MARGIN_LEFT + 6 })
    expect(first.page).toBe(1)
  })

  describe('page-break thresholds', () => {
    /** Re-run with the summary wrapped onto `lines` lines; every later block shifts by 3.5 * (lines - 1). */
    function runWithSummaryLines(lines: number) {
      RecorderPDF.splitOverride = (text, width) =>
        width === CONTENT_WIDTH && text.includes('shippable confidence')
          ? Array.from({ length: lines }, () => text)
          : [text]
      return run()
    }

    it('fits on one page with single-line wrapping (precondition for the window tests)', () => {
      expect(run().doc.pages).toBe(1)
    })

    it('estimates an experience entry as 5 + 3.5 per highlight + 2 before breaking', () => {
      // Experience loop starts at 42.5 + 3.5 * lines. With 64 lines: 266.5.
      // Entry 0 estimate = 5 + 4 * 3.5 + 2 = 21 -> 287.5 > 285: break.
      // A wrong estimate (17, -9 or 8.1) would keep it on page 1.
      const entry = experience[0]
      expect(entry.highlights).toHaveLength(4)
      const { find } = runWithSummaryLines(64)
      expect(find('Experience')).toMatchObject({ page: 1, y: 261.5 })
      expect(find(`${entry.company} - ${entry.role}`)).toMatchObject({ page: 2, y: PAGE_TOP })
    })

    it('keeps an experience entry on the page when its estimate still fits', () => {
      // 63 lines: loop starts at 263, 263 + 21 = 284 <= 285: no break.
      const entry = experience[0]
      const { find, doc } = runWithSummaryLines(63)
      expect(find(`${entry.company} - ${entry.role}`)).toMatchObject({ page: 1, y: 263 })
      expect(doc.pages).toBe(2) // later blocks overflow, but not this one
    })

    it('reserves 10 + 4 per certification before the Certifications heading', () => {
      const base = run().find('Certifications').y
      const needed = 10 + certifications.length * 4
      // Find the shift that lands the heading in (285 - needed, 285 - 10.5]:
      // the real estimate overflows, the mutated ones (10 - 4n, 10 + n/4) do not.
      const lower = 285 - needed
      const upper = 285 - (10 + certifications.length / 4)
      const shift = Math.ceil((lower - base) / 3.5 + Number.EPSILON)
      const target = base + 3.5 * shift
      expect(target).toBeGreaterThan(lower)
      expect(target).toBeLessThanOrEqual(upper)

      const { find } = runWithSummaryLines(shift + 1)
      expect(find('Certifications')).toMatchObject({ page: 2, y: PAGE_TOP })
    })
  })
})
