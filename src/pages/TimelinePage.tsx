import { useState } from 'react'
import { COMMITMENT_RECORDS } from '../data/commitmentsRegistry'
import { useCommitmentFilters } from '../hooks/useCommitmentFilters'
import { useIsMobile } from '../hooks/useMediaQuery'
import { ExplorerLayout } from '../components/layout/ExplorerLayout'
import { FilterBar } from '../components/explorer/FilterBar'
import { TimelineView } from '../components/explorer/TimelineView'
import { CommitmentDrawer } from '../components/explorer/CommitmentDrawer'
import { ExportMenu } from '../components/explorer/ExportMenu'
import type { CommitmentRecord } from '../types/commitments'

export function TimelinePage() {
  const isMobile = useIsMobile()
  const [selected, setSelected] = useState<CommitmentRecord | null>(null)
  const filters = useCommitmentFilters(COMMITMENT_RECORDS)

  return (
    <ExplorerLayout
      route="timeline"
      title="Timeline"
      lede="Scroll through major hyperscaler commitments by year. Click any event to review source-backed evidence."
      actions={<ExportMenu records={filters.filtered} />}
    >
      <FilterBar
        query={filters.query}
        onQueryChange={filters.setQuery}
        companies={filters.companies}
        categories={filters.categories}
        eras={filters.eras}
        confidenceLevels={filters.confidenceLevels}
        onToggleCompany={filters.toggleCompany}
        onToggleCategory={filters.toggleCategory}
        onToggleEra={filters.toggleEra}
        onToggleConfidence={filters.toggleConfidence}
        onReset={filters.reset}
        hasActiveFilters={filters.hasActiveFilters}
        resultCount={filters.filtered.length}
        density={filters.density}
        onDensityChange={filters.setDensity}
      />

      <div className="mt-8">
        <TimelineView
          records={filters.filtered}
          density={filters.density}
          onSelect={setSelected}
          selectedId={selected?.id}
        />
      </div>

      <CommitmentDrawer record={selected} onClose={() => setSelected(null)} isMobile={isMobile} />
    </ExplorerLayout>
  )
}