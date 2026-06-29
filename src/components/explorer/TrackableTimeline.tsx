import clsx from 'clsx'
import type { TrackableCommitment } from '../../types/trackableCommitment'
import { DOMAIN_COLORS } from '../../types/trackableCommitment'
import { ERA_LABELS } from '../../types/commitments'
import { formatCommittedValue, parseAnnouncementYear } from '../../utils/trackableFormat'
import { ConfidenceBadge } from './ConfidenceBadge'
import { DomainBadge } from './DomainBadge'
import { FamilyBadge } from './FamilyBadge'

interface TrackableTimelineProps {
  records: TrackableCommitment[]
  density: 'compact' | 'detailed'
  onSelect: (record: TrackableCommitment) => void
  selectedId?: string | null
}

export function TrackableTimeline({ records, density, onSelect, selectedId }: TrackableTimelineProps) {
  const sorted = [...records].sort(
    (a, b) => parseAnnouncementYear(b.announcementDate) - parseAnnouncementYear(a.announcementDate)
  )

  const byYear = sorted.reduce<Record<number, TrackableCommitment[]>>((acc, r) => {
    const y = parseAnnouncementYear(r.announcementDate) || 0
    if (!acc[y]) acc[y] = []
    acc[y].push(r)
    return acc
  }, {})

  const years = Object.keys(byYear)
    .map(Number)
    .filter((y) => y > 0)
    .sort((a, b) => b - a)

  if (years.length === 0) {
    return <p className="text-sm text-[var(--text-tertiary)]">No commitments match the current filters.</p>
  }

  return (
    <div className="relative" role="list" aria-label="Commitments timeline">
      <div className="absolute bottom-0 left-[11px] top-0 w-px bg-[var(--border)]" aria-hidden />

      {years.map((year) => (
        <section key={year} className="relative mb-8">
          <div className="sticky top-0 z-10 mb-4 flex items-center gap-3 bg-[var(--canvas-bg)]/90 py-2 backdrop-blur-sm">
            <span className="relative z-10 h-[22px] w-[22px] rounded-full border-2 border-[var(--accent)] bg-[var(--canvas-bg)]" aria-hidden />
            <h3 className="font-mono text-lg font-semibold text-[var(--text-primary)]">{year}</h3>
            <span className="text-xs text-[var(--text-tertiary)]">{byYear[year].length} records</span>
          </div>

          <ul className="ml-8 space-y-3">
            {byYear[year].map((record) => {
              const selected = selectedId === record.id
              const color = DOMAIN_COLORS[record.domain]
              return (
                <li key={record.id} role="listitem">
                  <button
                    type="button"
                    onClick={() => onSelect(record)}
                    aria-pressed={selected}
                    className={clsx(
                      'w-full rounded-xl border text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
                      density === 'compact' ? 'p-3' : 'p-4',
                      selected
                        ? 'border-[var(--accent)]/50 bg-[var(--accent)]/10'
                        : 'border-[var(--border)] bg-[var(--surface)]/40 hover:border-[var(--accent)]/30'
                    )}
                    style={{ borderLeftWidth: 3, borderLeftColor: color }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <DomainBadge domain={record.domain} />
                      <FamilyBadge family={record.commitmentFamily} />
                      <ConfidenceBadge level={record.confidenceLevel} />
                      <span className="text-[10px] text-[var(--text-tertiary)]">{ERA_LABELS[record.era]}</span>
                    </div>
                    <p className={clsx('mt-1 font-medium text-[var(--text-primary)]', density === 'compact' && 'text-sm')}>
                      {record.commitmentName}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {record.hyperscaler} · {record.company}
                    </p>
                    {density === 'detailed' && (
                      <div className="mt-2 flex flex-wrap gap-x-4 text-xs text-[var(--text-tertiary)]">
                        <span>{record.geography}</span>
                        <span className="font-mono text-[var(--text-secondary)]">{formatCommittedValue(record)}</span>
                        {record.utilizationPct != null && <span>{record.utilizationPct}% utilized</span>}
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}