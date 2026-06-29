import { useMemo } from 'react'
import { ALL_COMMITMENTS } from '../data/unifiedRegistry'
import { ExplorerLayout } from '../components/layout/ExplorerLayout'
import { StatCard } from '../components/explorer/StatCard'
import { CapexChart } from '../components/explorer/CapexChart'
import { ExportMenu } from '../components/explorer/ExportMenu'
import { UtilizationChart } from '../components/explorer/UtilizationChart'
import { ERA_LABELS } from '../types/commitments'
import { routeHref } from '../utils/routes'

export function DashboardPage() {
  const stats = useMemo(() => {
    const cloud = ALL_COMMITMENTS.filter((c) => c.domain === 'cloud_spend')
    const energy = ALL_COMMITMENTS.filter((c) => c.domain === 'energy')
    const direct = ALL_COMMITMENTS.filter((c) => c.confidenceLevel === 'direct')
    const macc = cloud.filter((c) => c.commitmentFamily === 'macc')
    const nuclearMw = ALL_COMMITMENTS.filter((c) => c.commitmentFamily === 'nuclear_ppa' && c.committedUnit === 'MW')
      .reduce((s, c) => s + (c.committedValue ?? 0), 0)

    const byEra = {} as Record<string, number>
    for (const r of ALL_COMMITMENTS) {
      byEra[r.era] = (byEra[r.era] ?? 0) + 1
    }

    return {
      total: ALL_COMMITMENTS.length,
      cloud: cloud.length,
      energy: energy.length,
      direct: direct.length,
      macc: macc.length,
      nuclearMw,
      byEra,
    }
  }, [])

  return (
    <ExplorerLayout
      route="dashboard"
      title="Overview"
      lede="Cloud spend commitments (MACC, savings plans), energy procurement, capex, and policy on one platform. Every record is trackable with source, term, and confidence."
      actions={<ExportMenu records={ALL_COMMITMENTS} />}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total commitments" value={String(stats.total)} sub="Cloud + energy + infrastructure" accent="var(--accent)" />
        <StatCard label="Cloud spend deals" value={String(stats.cloud)} sub={`${stats.macc} MACC agreements`} accent="#7c8cff" />
        <StatCard label="Energy records" value={String(stats.energy)} sub={`${(stats.nuclearMw / 1000).toFixed(1)} GW nuclear disclosed`} accent="#34d399" />
        <StatCard label="Direct-source backed" value={String(stats.direct)} sub="Filings and public announcements" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-5" aria-labelledby="era-heading">
          <h2 id="era-heading" className="text-sm font-semibold text-[var(--text-primary)]">
            Commitments by era
          </h2>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">Pre-AI vs post-AI acceleration</p>
          <ul className="mt-4 space-y-3">
            {Object.entries(ERA_LABELS).map(([era, label]) => {
              const count = stats.byEra[era] ?? 0
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0
              return (
                <li key={era}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">{label}</span>
                    <span className="font-mono text-[var(--text-primary)]">{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-5">
          <UtilizationChart
            records={ALL_COMMITMENTS.filter((c) => c.domain === 'cloud_spend')}
            title="Cloud commitment utilization"
          />
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-5" aria-labelledby="capex-heading">
        <h2 id="capex-heading" className="text-sm font-semibold text-[var(--text-primary)]">
          Capex trajectory (SEC-sourced)
        </h2>
        <p className="mt-1 text-xs text-[var(--text-tertiary)]">
          Infrastructure spend step-change alongside cloud and energy commitments.
        </p>
        <div className="mt-4">
          <CapexChart />
        </div>
      </section>

      <nav className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Explore further">
        {[
          { href: routeHref('cloud'), label: 'Cloud spend', desc: 'MACC, Azure and AWS plans' },
          { href: routeHref('timeline'), label: 'Timeline', desc: 'Unified commitment history' },
          { href: routeHref('review'), label: 'Audit', desc: 'Analyst review table' },
          { href: routeHref('forecasts'), label: 'Forecasts', desc: '2030 scenarios' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="rounded-xl border border-[var(--border)] bg-white/3 p-4 transition-colors hover:border-[var(--accent)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <p className="font-medium text-[var(--text-primary)]">{item.label}</p>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">{item.desc}</p>
          </a>
        ))}
      </nav>
    </ExplorerLayout>
  )
}