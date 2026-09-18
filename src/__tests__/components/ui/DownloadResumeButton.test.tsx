import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DownloadResumeButton from '../../../components/ui/DownloadResumeButton'

const { generateResume } = vi.hoisted(() => ({ generateResume: vi.fn() }))
vi.mock('../../../lib/generateResume', () => ({ generateResume }))

const blob = new Blob(['%PDF-fake'], { type: 'application/pdf' })
const createObjectURL = vi.fn(() => 'blob:fake-url')
const revokeObjectURL = vi.fn()
let anchorClick: ReturnType<typeof vi.spyOn>
let consoleError: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  generateResume.mockReset()
  generateResume.mockReturnValue(blob)
  createObjectURL.mockClear()
  revokeObjectURL.mockClear()
  vi.stubGlobal('URL', Object.assign(URL, { createObjectURL, revokeObjectURL }))
  anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('DownloadResumeButton', () => {
  it('renders an idle, enabled button', () => {
    render(<DownloadResumeButton />)
    const button = screen.getByTestId('download-resume-button')
    expect(button).toBeEnabled()
    expect(button).toHaveAttribute('aria-label', 'Download Resume')
    expect(button).toHaveTextContent('Resume (PDF)')
  })

  it('shows a busy state while generating, then returns to idle', async () => {
    render(<DownloadResumeButton />)
    const button = screen.getByTestId('download-resume-button')

    fireEvent.click(button)
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Generating...')

    await waitFor(() => expect(button).toHaveTextContent('Resume (PDF)'))
    expect(button).toBeEnabled()
  })

  it('generates the PDF and triggers a download through a temporary anchor', async () => {
    render(<DownloadResumeButton />)
    fireEvent.click(screen.getByTestId('download-resume-button'))

    await waitFor(() => expect(anchorClick).toHaveBeenCalledOnce())
    expect(generateResume).toHaveBeenCalledOnce()
    expect(createObjectURL).toHaveBeenCalledWith(blob)

    const anchor = anchorClick.mock.contexts[0] as HTMLAnchorElement
    expect(anchor.getAttribute('href')).toBe('blob:fake-url')
    expect(anchor.download).toBe('benjamin-lassaut-resume.pdf')
    expect(document.body.contains(anchor)).toBe(false)
  })

  it('revokes the object URL after a short delay', async () => {
    render(<DownloadResumeButton />)
    fireEvent.click(screen.getByTestId('download-resume-button'))

    await waitFor(() => expect(anchorClick).toHaveBeenCalledOnce())
    expect(revokeObjectURL).not.toHaveBeenCalled()

    await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-url'), { timeout: 2000 })
  })

  it('logs and recovers when generation fails', async () => {
    const failure = new Error('jspdf exploded')
    generateResume.mockImplementation(() => {
      throw failure
    })
    render(<DownloadResumeButton />)
    const button = screen.getByTestId('download-resume-button')

    fireEvent.click(button)

    await waitFor(() => expect(consoleError).toHaveBeenCalledWith('Failed to generate resume PDF:', failure))
    expect(anchorClick).not.toHaveBeenCalled()
    expect(button).toBeEnabled()
    expect(button).toHaveTextContent('Resume (PDF)')
  })
})
