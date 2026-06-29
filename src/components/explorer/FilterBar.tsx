import clsx from 'clsx'
import type { CommitmentCategory, CommitmentEra, ConfidenceLevel } from '../../types/commitments'
import { CATEGORY_LABELS, CONFIDENCE_LABELS, ERA_LABELS } from '../../types/commitments'
import { COMPANIES } from '../../data/commitmentsRegistry'

interface FilterBarProps {
  query: string
  onQueryChange: (q: string) => void
  companies: Set<string>
  categories: Set<CommitmentCategory>
  eras: Set<CommitmentEra>
  confidenceLevels: Set<ConfidenceLevel>
  onToggleCompany: (c: string) => void
  onToggleCategory: (c: CommitmentCategory) => void
  onToggleEra: (e: CommitmentEra) => void
  onToggleConfidence: (c: ConfidenceLevel) => void
  onReset: () => void
  hasActiveFilters: boolean
  resultCount: number
  density: 'compact' | 'detailed'
  onDensityChange: (d: 'compact' | 'detailed') => void
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
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

export function FilterBar({
  query,
  onQueryChange,
  companies,
  categories,
  eras,
  confidenceLevels,
  onToggleCompany,
  onToggleCategory,
  onToggleEra,
  onToggleConfidence,
  onReset,
  hasActiveFilters,
  resultCount,
  density,
  onDensityChange,
}: FilterBarProps) {
  const topCompanies = COMPANIES.filter((c) =>
    ['Amazon', 'Microsoft', 'Alphabet', 'Google', 'Meta', 'Oracle', 'Apple', 'AWS', 'Azure'].some(
      (t) => c.includes(t) || t.includes(c)
    )
  ).slice(0, 8)

  const displayCompanies = topCompanies.length > 0 ? topCompanies : COMPANIES.slice(0, 8)

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex-1">
          <span className="sr-only">Search commitments</span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search company, geography, commitment type..."
            className="w-full min-h-[44px] rounded-xl border border-[var(--border)] bg-white/5 px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          />
        </label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--text-tertiary)]">{resultCount} results</span>
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

      <div className="flex flex-wrap gap-2" role="group" aria-label="Density">
        {(['compact', 'detailed'] as const).map((d) => (
          <Chip
            key={d}
            active={density === d}
            onClick={() => onDensityChange(d)}
            label={d === 'compact' ? 'Compact' : 'Detailed'}
          />
        ))}
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Company</p>
        <div className="flex flex-wrap gap-1.5">
          {displayCompanies.map((c) => (
            <Chip key={c} active={companies.has(c)} onClick={() => onToggleCompany(c)} label={c} />
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
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(CATEGORY_LABELS) as CommitmentCategory[]).slice(0, 8).map((c) => (
            <Chip key={c} active={categories.has(c)} onClick={() => onToggleCategory(c)} label={CATEGORY_LABELS[c]} />
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