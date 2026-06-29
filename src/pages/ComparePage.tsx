import { useMemo, useState } from 'react'
import { COMPARISON_METRICS, CAPEX_SERIES } from '../data/commitmentsRegistry'
import { ExplorerLayout } from '../components/layout/ExplorerLayout'
import { ConfidenceBadge } from '../components/explorer/ConfidenceBadge'
import { getCapexByCompany } from '../utils/commitmentStats'
import type { ConfidenceLevel } from '../types/commitments'

const COMPANIES = ['Amazon', 'Microsoft', 'Alphabet', 'Meta', 'Oracle', 'Apple']

const ERA_TABS = [
  { id: 'pre_ai_boom', label: 'Pre-AI boom' },
  { id: 'ai_boom', label: 'AI boom' },
  { id: 'current', label: 'Current' },
] as const

export function ComparePage() {
  const [era, setEra] = useState<string>('current')
  const [selectedCompany, setSelectedCompany] = useState('Microsoft')

  const eraMetrics = useMemo(
    () => COMPARISON_METRICS.filter((m) => m.era === era && COMPANIES.includes(m.company)),
    [era]
  )

  const capexSeries = getCapexByCompany(selectedCompany)
  const maxCapex = Math.max(...capexSeries.map((c) => c.capexUsdB), 1)

  return (
    <ExplorerLayout
      route="compare"
      title="Company comparison"
      lede="Compare capex, nuclear PPAs, and disclosed energy commitments across hyperscalers. Toggle era to see pre-AI vs post-AI acceleration."
    >
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Era comparison">
        {ERA_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={era === tab.id}
            onClick={() => setEra(tab.id)}
            className={`min-h-[40px] rounded-xl border px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
              era === tab.id
                ? 'border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-secondary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-white/3 text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Metric</th>
              <th className="px-4 py-3 font-semibold text-right">Value</th>
              <th className="px-4 py-3 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {eraMetrics.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                  No comparison metrics for this era.
                </td>
              </tr>
            ) : (
              eraMetrics.map((m, i) => (
                <tr key={`${m.company}-${m.metric}-${i}`} className="border-b border-[var(--border)]/50">
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{m.company}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{m.metric.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-right font-mono text-[var(--text-primary)]">
                    {m.metric.includes('capex') ? `$${m.value}B` : m.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-tertiary)]">{m.source}</span>
                      <ConfidenceBadge level={m.confidence as ConfidenceLevel} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <section className="mt-10" aria-labelledby="capex-compare-heading">
        <h2 id="capex-compare-heading" className="text-sm font-semibold text-[var(--text-primary)]">
          Capex history by company
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[...new Set(CAPEX_SERIES.map((c) => c.company))].map((company) => (
              <button
                key={company}
                type="button"
                onClick={() => setSelectedCompany(company)}
                aria-pressed={selectedCompany === company}
                className={`min-h-[36px] rounded-lg border px-3 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  selectedCompany === company
                    ? 'border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                {company}
              </button>
            ))}
        </div>

        <ul className="mt-4 space-y-2">
          {capexSeries.map((point) => (
            <li key={point.fiscalYear} className="flex items-center gap-3">
              <span className="w-12 font-mono text-xs text-[var(--text-tertiary)]">{point.fiscalYear}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/6">
                <div
                  className="h-full rounded-full bg-[var(--accent-secondary)]"
                  style={{ width: `${(point.capexUsdB / maxCapex) * 100}%` }}
                  role="meter"
                  aria-label={`${selectedCompany} capex ${point.fiscalYear}: ${point.capexUsdB} billion`}
                  aria-valuenow={point.capexUsdB}
                  aria-valuemin={0}
                  aria-valuemax={maxCapex}
                />
              </div>
              <span className="w-16 text-right font-mono text-xs text-[var(--text-primary)]">${point.capexUsdB}B</span>
            </li>
          ))}
        </ul>
      </section>
    </ExplorerLayout>
  )
}