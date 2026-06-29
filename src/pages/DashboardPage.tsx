import { COMMITMENT_RECORDS } from '../data/commitmentsRegistry'
import { ExplorerLayout } from '../components/layout/ExplorerLayout'
import { StatCard } from '../components/explorer/StatCard'
import { CapexChart } from '../components/explorer/CapexChart'
import { ExportMenu } from '../components/explorer/ExportMenu'
import { getDashboardStats, groupByCompany, groupByEra } from '../utils/commitmentStats'
import { ERA_LABELS } from '../types/commitments'
import { routeHref } from '../utils/routes'

export function DashboardPage() {
  const stats = getDashboardStats(COMMITMENT_RECORDS)
  const byEra = groupByEra(COMMITMENT_RECORDS)
  const byCompany = groupByCompany(COMMITMENT_RECORDS).slice(0, 8)

  return (
    <ExplorerLayout
      route="dashboard"
      title="Overview"
      lede="Key totals and trends across public hyperscaler commitments, from pre-AI cloud buildout through current energy procurement and forward scenarios."
      actions={<ExportMenu records={COMMITMENT_RECORDS} />}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sourced records" value={String(stats.totalRecords)} sub="Chronology + anchor sources" accent="var(--accent)" />
        <StatCard label="Direct-source backed" value={String(stats.directCount)} sub="Primary filings and press releases" />
        <StatCard label="Disclosed nuclear PPAs" value={`${(stats.nuclearMw / 1000).toFixed(1)} GW`} sub="MW-class public deals" accent="#e879f9" />
        <StatCard label="Renewable frameworks" value={`${(stats.renewableMw / 1000).toFixed(1)} GW`} sub="PPA and framework MW" accent="#34d399" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-5" aria-labelledby="era-heading">
          <h2 id="era-heading" className="text-sm font-semibold text-[var(--text-primary)]">
            Commitments by era
          </h2>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">What changed after AI?</p>
          <ul className="mt-4 space-y-3">
            {Object.entries(ERA_LABELS).map(([era, label]) => {
              const count = byEra[era as keyof typeof byEra] ?? 0
              const pct = stats.totalRecords > 0 ? (count / stats.totalRecords) * 100 : 0
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

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-5" aria-labelledby="company-heading">
          <h2 id="company-heading" className="text-sm font-semibold text-[var(--text-primary)]">
            Most documented companies
          </h2>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">Record count by entity</p>
          <ul className="mt-4 space-y-2">
            {byCompany.map(({ company, count }) => (
              <li key={company} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">{company}</span>
                <span className="font-mono text-[var(--text-primary)]">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-5" aria-labelledby="capex-heading">
        <h2 id="capex-heading" className="text-sm font-semibold text-[var(--text-primary)]">
          Capex trajectory (SEC-sourced)
        </h2>
        <p className="mt-1 text-xs text-[var(--text-tertiary)]">
          Property and equipment additions show the post-2023 step-change in infrastructure spend.
        </p>
        <div className="mt-4">
          <CapexChart />
        </div>
      </section>

      <nav className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Explore further">
        {[
          { href: routeHref('timeline'), label: 'Timeline', desc: 'Browse commitments by year' },
          { href: routeHref('compare'), label: 'Compare', desc: 'Pre-AI vs AI-era metrics' },
          { href: routeHref('forecasts'), label: 'Forecasts', desc: '2030 scenario modeling' },
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