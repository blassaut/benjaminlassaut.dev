import { useState } from 'react'

export default function DownloadResumeButton() {
  const [generating, setGenerating] = useState(false)

  async function handleClick() {
    if (generating) return
    setGenerating(true)
    try {
      const { generateResume } = await import('../../lib/generateResume')
      const blob = generateResume()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'benjamin-lassaut-resume.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      console.error('Failed to generate resume PDF:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={generating}
      aria-label="Download Resume"
      title="Download Resume"
      data-testid="download-resume-button"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-muted/60 hover:text-teal-400 border border-white/5 hover:border-teal-400/20 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {generating ? (
        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
      <span>{generating ? 'Generating...' : 'Download Resume'}</span>
    </button>
  )
}
