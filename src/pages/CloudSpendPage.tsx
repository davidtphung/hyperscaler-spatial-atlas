import { useMemo, useState } from 'react'
import { ALL_COMMITMENTS } from '../data/unifiedRegistry'
import { useTrackableFilters } from '../hooks/useTrackableFilters'
import { useIsMobile } from '../hooks/useMediaQuery'
import { ExplorerLayout } from '../components/layout/ExplorerLayout'
import { TrackableFilterBar } from '../components/explorer/TrackableFilterBar'
import { TrackableDrawer } from '../components/explorer/TrackableDrawer'
import { UtilizationChart } from '../components/explorer/UtilizationChart'
import { CommitmentTable } from '../components/explorer/CommitmentTable'
import { ExportMenu } from '../components/explorer/ExportMenu'
import { StatCard } from '../components/explorer/StatCard'
import type { TrackableCommitment } from '../types/trackableCommitment'

const CLOUD_RECORDS = ALL_COMMITMENTS.filter((c) => c.domain === 'cloud_spend')

export function CloudSpendPage() {
  const isMobile = useIsMobile()
  const [selected, setSelected] = useState<TrackableCommitment | null>(null)
  const filters = useTrackableFilters(CLOUD_RECORDS)

  const stats = useMemo(() => {
    const macc = filters.filtered.filter((c) => c.commitmentFamily === 'macc')
    const azureSp = filters.filtered.filter((c) => c.commitmentFamily === 'azure_savings_plans')
    const aws = filters.filtered.filter(
      (c) =>
        c.commitmentFamily === 'aws_savings_plans' ||
        c.commitmentFamily === 'aws_reserved_instances' ||
        c.commitmentFamily === 'aws_enterprise_deals'
    )
    const avgUtil =
      filters.filtered.filter((c) => c.utilizationPct != null).reduce((s, c) => s + (c.utilizationPct ?? 0), 0) /
      Math.max(1, filters.filtered.filter((c) => c.utilizationPct != null).length)

    return { macc: macc.length, azureSp: azureSp.length, aws: aws.length, avgUtil: Math.round(avgUtil) }
  }, [filters.filtered])

  return (
    <ExplorerLayout
      route="cloud"
      title="Cloud spend commitments"
      lede="Track Microsoft MACC, Azure Savings Plans, AWS Savings Plans, Reserved Instances, enterprise deals, and GCP committed spend with term dates, utilization, and source evidence."
      actions={<ExportMenu records={filters.filtered} />}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="MACC agreements" value={String(stats.macc)} sub="Azure Consumption Commitments" accent="#7c8cff" />
        <StatCard label="Azure Savings Plans" value={String(stats.azureSp)} sub="Hourly compute commitment" />
        <StatCard label="AWS commitment stack" value={String(stats.aws)} sub="SP, RI, and EDP deals" accent="#f0b429" />
        <StatCard label="Avg utilization" value={stats.avgUtil ? `${stats.avgUtil}%` : 'n/a'} sub="Drawdown across tracked deals" accent="var(--accent)" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-5">
          <UtilizationChart records={filters.filtered} title="MACC and savings plan utilization" />
        </section>
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Reporting guidance</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            <li>
              <strong className="text-[var(--text-primary)]">MACC:</strong> Dollar-based Azure consumption minimum over EA term. Track in Partner Center and Cost Management.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Azure Savings Plans:</strong> Hourly commitment with utilization workbook in Azure Cost Management.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">AWS:</strong> Savings Plans coverage and RI utilization in Cost Explorer and billing reports.
            </li>
          </ul>
          <p className="mt-4 text-xs text-[var(--text-tertiary)]">
            Sample enterprise values are illustrative unless confidence is Direct. Extend with customer-specific billing exports.
          </p>
        </section>
      </div>

      <div className="mt-8">
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
        />
      </div>

      <div className="mt-6">
        <CommitmentTable records={filters.filtered} onSelect={setSelected} selectedId={selected?.id} reviewMode />
      </div>

      <TrackableDrawer record={selected} onClose={() => setSelected(null)} isMobile={isMobile} />
    </ExplorerLayout>
  )
}