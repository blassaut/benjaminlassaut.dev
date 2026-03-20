import jsPDF from 'jspdf'
import { experience } from '../data/experience'
import { skillCategories, type SkillEntry } from '../data/skills'

const TEAL = [20, 184, 166] as const
const DARK = [30, 30, 30] as const
const MUTED = [120, 120, 120] as const
const BLACK = [0, 0, 0] as const

const MARGIN_LEFT = 20
const MARGIN_RIGHT = 20
const PAGE_WIDTH = 210 // A4 mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
const PAGE_HEIGHT = 297
const PAGE_BOTTOM = PAGE_HEIGHT - 20

// Sourced from Contact.tsx links array - keep in sync
const LINKEDIN_URL = 'https://linkedin.com/in/benjaminlassaut'
const GITHUB_URL = 'https://github.com/blassaut'

const ABOUT_SUMMARY =
  'I build systems that continuously validate software quality, from CI to production. ' +
  'At Kiln, I designed the QA architecture from zero and scaled it across teams - BDD frameworks, ' +
  'cross-chain transaction flows spanning 20+ networks, and hourly production monitoring ' +
  'that catches issues before clients ever notice.'

export function getSkillName(skill: SkillEntry): string | null {
  if (typeof skill === 'string') return skill
  if (skill.bug) return null
  return skill.name
}

export function generateResume(): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = 20

  function checkPageBreak(needed: number) {
    if (y + needed > PAGE_BOTTOM) {
      doc.addPage()
      y = 20
    }
  }

  // --- Header ---
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(...BLACK)
  doc.text('Benjamin Lassaut', MARGIN_LEFT, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...MUTED)
  doc.text('Lead QA Engineer  |  Opio, France', MARGIN_LEFT, y)
  y += 5

  doc.setFontSize(9)
  doc.text(`LinkedIn: ${LINKEDIN_URL}  |  GitHub: ${GITHUB_URL}`, MARGIN_LEFT, y)
  y += 3

  // Teal accent bar
  doc.setDrawColor(...TEAL)
  doc.setLineWidth(0.8)
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
  y += 8

  // --- About ---
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...TEAL)
  doc.text('About', MARGIN_LEFT, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...DARK)
  const aboutLines = doc.splitTextToSize(ABOUT_SUMMARY, CONTENT_WIDTH)
  doc.text(aboutLines, MARGIN_LEFT, y)
  y += aboutLines.length * 4.2 + 6

  // --- Experience ---
  checkPageBreak(15)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...TEAL)
  doc.text('Experience', MARGIN_LEFT, y)
  y += 7

  for (const entry of experience) {
    const estimatedHeight = 6 + entry.highlights.length * 5 + 4
    checkPageBreak(estimatedHeight)

    // Company + Role line
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...BLACK)
    doc.text(`${entry.company} - ${entry.role}`, MARGIN_LEFT, y)

    // Period right-aligned
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...MUTED)
    const periodWidth = doc.getTextWidth(entry.period)
    doc.text(entry.period, PAGE_WIDTH - MARGIN_RIGHT - periodWidth, y)
    y += 5

    // Highlights
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    for (const highlight of entry.highlights) {
      const lines = doc.splitTextToSize(highlight, CONTENT_WIDTH - 6)
      checkPageBreak(lines.length * 4)
      doc.text('-', MARGIN_LEFT + 2, y)
      doc.text(lines, MARGIN_LEFT + 6, y)
      y += lines.length * 4
    }
    y += 4
  }

  // --- Skills ---
  checkPageBreak(15)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...TEAL)
  doc.text('Skills', MARGIN_LEFT, y)
  y += 7

  for (const category of skillCategories) {
    const skillNames = category.skills
      .map(getSkillName)
      .filter((name): name is string => name !== null)
    const skillLine = skillNames.join(', ')

    checkPageBreak(10)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(...BLACK)
    doc.text(`${category.name}:`, MARGIN_LEFT, y)

    const labelWidth = doc.getTextWidth(`${category.name}: `)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    const skillLines = doc.splitTextToSize(skillLine, CONTENT_WIDTH - labelWidth)
    doc.text(skillLines, MARGIN_LEFT + labelWidth, y)
    y += skillLines.length * 4 + 3
  }

  return doc.output('blob')
}
