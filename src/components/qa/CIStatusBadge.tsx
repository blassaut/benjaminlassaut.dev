import Tooltip from '../ui/Tooltip'
import { useCIStatus, type CIStatus } from '../../hooks/useCIStatus'

const NEUTRAL = { badge: 'text-muted/40 border-hairline/10 bg-hairline/5', dot: 'bg-muted/40' }

const STYLES: Record<CIStatus, { badge: string; dot: string }> = {
  passing: { badge: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10', dot: 'bg-emerald-400 animate-pulse' },
  failing: { badge: 'text-red-400 border-red-400/20 bg-red-400/10', dot: 'bg-red-400' },
  unknown: NEUTRAL,
  loading: NEUTRAL,
}

/** Live status of a repo's `ci.yml` GitHub Actions workflow, linking to its runs. */
export function CIStatusBadge({ repoUrl, testId }: { repoUrl: string; testId: string }) {
  const status = useCIStatus(`${repoUrl}/actions/workflows/ci.yml/badge.svg`)
  const style = STYLES[status]

  return (
    <Tooltip label="CI: GitHub Actions">
      <a
        data-testid={testId}
        href={`${repoUrl}/actions`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-widest hover:opacity-80 transition-opacity align-baseline ${style.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        {status === 'loading' ? '...' : status}
      </a>
    </Tooltip>
  )
}
