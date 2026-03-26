import { GHERKIN_KEYWORDS, GHERKIN_META, GHERKIN_TAGS } from '../../lib/gherkin'

export function GherkinLine({ line }: { line: string }) {
  const trimmed = line.trimStart()
  const indent = line.length - trimmed.length

  for (const tag of GHERKIN_TAGS) {
    if (trimmed.startsWith(tag)) {
      return (
        <span className="block">
          {indent > 0 && <span>{' '.repeat(indent)}</span>}
          <span className="text-amber-400/80 font-semibold">{tag}</span>
          <span className="text-light/60">{trimmed.slice(tag.length)}</span>
        </span>
      )
    }
  }

  for (const kw of GHERKIN_KEYWORDS) {
    if (trimmed.startsWith(kw)) {
      const rest = trimmed.slice(kw.length)
      return (
        <span className="block">
          {indent > 0 && <span>{' '.repeat(indent)}</span>}
          <span className="text-teal-400 font-semibold">{kw}</span>
          <span className="text-light/90">{rest}</span>
        </span>
      )
    }
  }

  for (const meta of GHERKIN_META) {
    if (trimmed.startsWith(meta)) {
      return (
        <span className="block">
          {indent > 0 && <span>{' '.repeat(indent)}</span>}
          <span className="text-teal-400/50 italic">{trimmed}</span>
        </span>
      )
    }
  }

  if (trimmed.startsWith('|')) {
    return (
      <span className="block">
        {indent > 0 && <span>{' '.repeat(indent)}</span>}
        <span className="text-light/40">{trimmed}</span>
      </span>
    )
  }

  if (!trimmed || trimmed.startsWith('#')) {
    return <span className="block text-white/10">{line || ' '}</span>
  }

  return (
    <span className="block">
      <span className="text-muted/60">{line}</span>
    </span>
  )
}
