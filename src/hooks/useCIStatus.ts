import { useEffect, useState } from 'react'

export type CIStatus = 'passing' | 'failing' | 'unknown' | 'loading'

/**
 * Reads a GitHub Actions badge SVG and reports the workflow status. Anything
 * it cannot confirm (network error, non-2xx, unrecognised badge) is 'unknown',
 * never 'passing'.
 */
export function useCIStatus(badgeUrl: string): CIStatus {
  const [status, setStatus] = useState<CIStatus>('loading')

  useEffect(() => {
    fetch(badgeUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Badge request failed: ${res.status}`)
        return res.text()
      })
      .then((svg) => {
        if (svg.includes('passing')) setStatus('passing')
        else if (svg.includes('failing')) setStatus('failing')
        else setStatus('unknown')
      })
      .catch(() => setStatus('unknown'))
  }, [badgeUrl])

  return status
}
