import clsx from 'clsx'
import type { CommitmentRecord } from '../../types/commitments'
import { CATEGORY_LABELS, ERA_LABELS } from '../../types/commitments'
import { formatCommitmentValue, parseYear } from '../../utils/commitmentStats'
import { ConfidenceBadge } from './ConfidenceBadge'

const ERA_COLORS: Record<string, string> = {
  pre_ai_boom: '#94a3b8',
  ai_boom_onset: '#7c8cff',
  post_ai_acceleration: '#e879f9',
  current: '#3dd6c6',
  forecast: '#f0b429',
}

interface TimelineViewProps {
  records: CommitmentRecord[]
  density: 'compact' | 'detailed'
  onSelect: (record: CommitmentRecord) => void
  selectedId?: string | null
}

export function TimelineView({ records, density, onSelect, selectedId }: TimelineViewProps) {
  const sorted = [...records].sort((a, b) => parseYear(b.date) - parseYear(a.date) || b.date.localeCompare(a.date))

  const byYear = sorted.reduce<Record<number, CommitmentRecord[]>>((acc, r) => {
    const y = parseYear(r.date) || 0
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
        <section key={year} className="relative mb-8" aria-labelledby={`year-${year}`}>
          <div className="sticky top-0 z-10 mb-4 flex items-center gap-3 bg-[var(--canvas-bg)]/90 py-2 backdrop-blur-sm">
            <span
              className="relative z-10 h-[22px] w-[22px] rounded-full border-2 border-[var(--accent)] bg-[var(--canvas-bg)]"
              aria-hidden
            />
            <h3 id={`year-${year}`} className="font-mono text-lg font-semibold text-[var(--text-primary)]">
              {year}
            </h3>
            <span className="text-xs text-[var(--text-tertiary)]">{byYear[year].length} events</span>
          </div>

          <ul className="ml-8 space-y-3">
            {byYear[year].map((record) => {
              const selected = selectedId === record.id
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
                        : 'border-[var(--border)] bg-[var(--surface)]/40 hover:border-[var(--accent)]/30 hover:bg-white/5'
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: ERA_COLORS[record.era] ?? '#94a3b8' }}
                        aria-hidden
                      />
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{record.company}</span>
                      <ConfidenceBadge level={record.confidenceLevel} />
                      <span className="text-[10px] text-[var(--text-tertiary)]">{ERA_LABELS[record.era]}</span>
                    </div>
                    <p className={clsx('mt-1 font-medium text-[var(--text-primary)]', density === 'compact' && 'text-sm')}>
                      {record.commitmentType}
                    </p>
                    {density === 'detailed' && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-tertiary)]">
                        <span>{CATEGORY_LABELS[record.category]}</span>
                        <span>{record.geography}</span>
                        <span className="font-mono text-[var(--text-secondary)]">{formatCommitmentValue(record)}</span>
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