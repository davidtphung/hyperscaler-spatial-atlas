import { useState } from 'react'
import { FORECAST_SCENARIOS } from '../data/commitmentsRegistry'
import { ExplorerLayout } from '../components/layout/ExplorerLayout'
import { ConfidenceBadge } from '../components/explorer/ConfidenceBadge'

const SCENARIO_LABELS: Record<string, string> = {
  conservative: 'Conservative',
  base_case: 'Base case',
  aggressive: 'Aggressive',
  grid_constrained: 'Grid constrained',
}

const SCENARIO_COLORS: Record<string, string> = {
  conservative: '#94a3b8',
  base_case: '#3dd6c6',
  aggressive: '#e879f9',
  grid_constrained: '#f0b429',
}

export function ForecastsPage() {
  const scenarios = [...new Set(FORECAST_SCENARIOS.map((s) => s.scenario))]
  const [active, setActive] = useState(scenarios.includes('base_case') ? 'base_case' : scenarios[0])

  const selected = FORECAST_SCENARIOS.filter((s) => s.scenario === active)

  return (
    <ExplorerLayout
      route="forecasts"
      title="Forecasts and scenarios"
      lede="Forward-looking estimates for global data center electricity, hyperscaler capex, and implied energy mix. All scenarios are labeled estimates, not operator forecasts."
    >
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Forecast scenarios">
        {scenarios.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={active === s}
            onClick={() => setActive(s)}
            className={`min-h-[44px] rounded-xl border px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
              active === s
                ? 'border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-secondary)]'
            }`}
          >
            {SCENARIO_LABELS[s] ?? s}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {selected.map((scenario) => (
          <article
            key={scenario.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-5"
            style={{ borderTopColor: SCENARIO_COLORS[scenario.scenario], borderTopWidth: 3 }}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-mono text-lg font-semibold text-[var(--text-primary)]">{scenario.year}</h2>
              <ConfidenceBadge level="estimated" />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                  Global DC electricity
                </dt>
                <dd className="mt-0.5 font-mono text-xl text-[var(--text-primary)]">
                  {scenario.globalDcElectricityTwh} TWh
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                  Hyperscaler capex
                </dt>
                <dd className="mt-0.5 font-mono text-xl text-[var(--text-primary)]">
                  ${scenario.hyperscalerCapexUsdB}B
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                  Nuclear share
                </dt>
                <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">{scenario.nuclearSharePct}%</dd>
              </div>
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                  Renewable PPA share
                </dt>
                <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">
                  {scenario.renewablePpaSharePct}%
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                  Avg PUE
                </dt>
                <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">{scenario.avgPue}</dd>
              </div>
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                  Grid constraint
                </dt>
                <dd className="mt-0.5 text-sm capitalize text-[var(--text-primary)]">
                  {scenario.gridConstraintIndex.replace(/_/g, ' ')}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {scenario.keyAssumption}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-white/3 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
          Implied energy mix
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Scenarios model rising nuclear and renewable procurement alongside grid reliance. Grid-constrained
          paths assume interconnect queues bind and push more behind-the-meter nuclear and gas. Compare
          scenario nuclear share against disclosed PPAs on the{' '}
          <a href="#/timeline" className="text-[var(--accent)] underline underline-offset-2">
            timeline
          </a>
          .
        </p>
      </section>
    </ExplorerLayout>
  )
}