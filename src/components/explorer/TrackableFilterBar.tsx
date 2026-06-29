import clsx from 'clsx'
import type { CommitmentEra, ConfidenceLevel } from '../../types/commitments'
import { ERA_LABELS, CONFIDENCE_LABELS } from '../../types/commitments'
import type { CommitmentDomain, CommitmentFamily } from '../../types/trackableCommitment'
import { DOMAIN_LABELS, FAMILY_LABELS } from '../../types/trackableCommitment'
import { CLOUD_FAMILIES } from '../../data/unifiedRegistry'

interface TrackableFilterBarProps {
  query: string
  onQueryChange: (q: string) => void
  hyperscalers: Set<string>
  families: Set<CommitmentFamily>
  domains: Set<CommitmentDomain>
  eras: Set<CommitmentEra>
  confidenceLevels: Set<ConfidenceLevel>
  onToggleHyperscaler: (h: string) => void
  onToggleFamily: (f: CommitmentFamily) => void
  onToggleDomain: (d: CommitmentDomain) => void
  onToggleEra: (e: CommitmentEra) => void
  onToggleConfidence: (c: ConfidenceLevel) => void
  onReset: () => void
  hasActiveFilters: boolean
  resultCount: number
  reviewMode?: boolean
  onReviewModeChange?: (v: boolean) => void
}

const HYPERSCALERS = ['Microsoft', 'Amazon', 'Google', 'Meta', 'Oracle', 'Multi', 'Industry'] as const

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        'min-h-[32px] shrink-0 rounded-lg border px-2.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
        active
          ? 'border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent)]'
          : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      )}
    >
      {label}
    </button>
  )
}

export function TrackableFilterBar(props: TrackableFilterBarProps) {
  const {
    query,
    onQueryChange,
    hyperscalers,
    families,
    domains,
    eras,
    confidenceLevels,
    onToggleHyperscaler,
    onToggleFamily,
    onToggleDomain,
    onToggleEra,
    onToggleConfidence,
    onReset,
    hasActiveFilters,
    resultCount,
    reviewMode,
    onReviewModeChange,
  } = props

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex-1">
          <span className="sr-only">Search commitments</span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search MACC, savings plans, PPAs, capex..."
            className="w-full min-h-[44px] rounded-xl border border-[var(--border)] bg-white/5 px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          />
        </label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--text-tertiary)]">{resultCount} results</span>
          {onReviewModeChange && (
            <button
              type="button"
              onClick={() => onReviewModeChange(!reviewMode)}
              aria-pressed={reviewMode}
              className={clsx(
                'min-h-[36px] rounded-lg border px-3 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
                reviewMode
                  ? 'border-[var(--accent-secondary)]/40 bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)]'
              )}
            >
              Review mode
            </button>
          )}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-[36px] rounded-lg border border-[var(--border)] px-3 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Domain</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(DOMAIN_LABELS) as CommitmentDomain[]).map((d) => (
            <Chip key={d} active={domains.has(d)} onClick={() => onToggleDomain(d)} label={DOMAIN_LABELS[d]} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Cloud families</p>
        <div className="flex flex-wrap gap-1.5">
          {CLOUD_FAMILIES.map((f) => (
            <Chip key={f} active={families.has(f)} onClick={() => onToggleFamily(f)} label={FAMILY_LABELS[f]} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Hyperscaler</p>
        <div className="flex flex-wrap gap-1.5">
          {HYPERSCALERS.map((h) => (
            <Chip key={h} active={hyperscalers.has(h)} onClick={() => onToggleHyperscaler(h)} label={h} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Era</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(ERA_LABELS) as CommitmentEra[]).map((e) => (
            <Chip key={e} active={eras.has(e)} onClick={() => onToggleEra(e)} label={ERA_LABELS[e]} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Confidence</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(CONFIDENCE_LABELS) as ConfidenceLevel[]).map((c) => (
            <Chip key={c} active={confidenceLevels.has(c)} onClick={() => onToggleConfidence(c)} label={CONFIDENCE_LABELS[c]} />
          ))}
        </div>
      </div>
    </div>
  )
}