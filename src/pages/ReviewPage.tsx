import { useState } from 'react'
import { ALL_COMMITMENTS } from '../data/unifiedRegistry'
import { useTrackableFilters } from '../hooks/useTrackableFilters'
import { useIsMobile } from '../hooks/useMediaQuery'
import { ExplorerLayout } from '../components/layout/ExplorerLayout'
import { TrackableFilterBar } from '../components/explorer/TrackableFilterBar'
import { CommitmentTable } from '../components/explorer/CommitmentTable'
import { TrackableDrawer } from '../components/explorer/TrackableDrawer'
import { ExportMenu } from '../components/explorer/ExportMenu'
import type { TrackableCommitment } from '../types/trackableCommitment'

export function ReviewPage() {
  const isMobile = useIsMobile()
  const [selected, setSelected] = useState<TrackableCommitment | null>(null)
  const filters = useTrackableFilters(ALL_COMMITMENTS)

  const directCount = filters.filtered.filter((r) => r.confidenceLevel === 'direct').length
  const estimatedCount = filters.filtered.filter((r) => r.confidenceLevel === 'estimated').length

  return (
    <ExplorerLayout
      route="review"
      title="Audit and review"
      lede="Analyst mode for source-backed data review. Every row shows provenance, term, utilization, and confidence. Export filtered results as CSV or JSON."
      actions={<ExportMenu records={filters.filtered} />}
    >
      <div className="mb-6 flex flex-wrap gap-4 rounded-xl border border-[var(--border)] bg-white/3 px-4 py-3 text-sm">
        <span className="text-[var(--text-secondary)]">
          <span className="font-mono font-semibold text-emerald-300">{directCount}</span> direct
        </span>
        <span className="text-[var(--text-secondary)]">
          <span className="font-mono font-semibold text-amber-300">{estimatedCount}</span> estimated
        </span>
        <span className="text-[var(--text-tertiary)]">
          Cloud and energy commitments share one auditable timeline.
        </span>
      </div>

      <TrackableFilterBar
        query={filters.query}
        onQueryChange={filters.setQuery}
        hyperscalers={filters.hyperscalers}
        families={filters.families}
        domains={filters.domains}
        eras={filters.eras}
        confidenceLevels={filters.confidenceLevels}
        onToggleHyperscaler={filters.toggleHyperscaler}
        onToggleFamily={filters.toggleFamily}
        onToggleDomain={filters.toggleDomain}
        onToggleEra={filters.toggleEra}
        onToggleConfidence={filters.toggleConfidence}
        onReset={filters.reset}
        hasActiveFilters={filters.hasActiveFilters}
        resultCount={filters.filtered.length}
        reviewMode={filters.reviewMode}
        onReviewModeChange={filters.setReviewMode}
      />

      <div className="mt-6">
        <CommitmentTable
          records={filters.filtered}
          onSelect={setSelected}
          selectedId={selected?.id}
          reviewMode={filters.reviewMode}
        />
      </div>

      <TrackableDrawer record={selected} onClose={() => setSelected(null)} isMobile={isMobile} />
    </ExplorerLayout>
  )
}