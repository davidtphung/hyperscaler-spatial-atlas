import clsx from 'clsx'
import type { ConfidenceLevel } from '../../types/commitments'
import { CONFIDENCE_LABELS } from '../../types/commitments'

const STYLES: Record<ConfidenceLevel, string> = {
  direct: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  inferred: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
  estimated: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  speculative: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25',
}

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return (
    <span
      className={clsx(
        'inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        STYLES[level]
      )}
    >
      {CONFIDENCE_LABELS[level]}
    </span>
  )
}