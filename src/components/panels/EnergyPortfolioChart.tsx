import type { SpatialNode, LivePowerSnapshot } from '../../types'
import { getEnergyPortfolio } from '../../data/nodeProfiles'
import { ENERGY_SOURCE_META } from '../../data/nodeProfiles'
import { formatPower } from '../../utils/metrics'

interface EnergyPortfolioChartProps {
  node: SpatialNode
  live?: LivePowerSnapshot | null
}

export function EnergyPortfolioChart({ node, live }: EnergyPortfolioChartProps) {
  const portfolio = getEnergyPortfolio(node)
  const sorted = [...portfolio.sources].sort((a, b) => b.sharePct - a.sharePct)

  return (
    <section aria-labelledby="energy-portfolio-heading" className="mt-6">
      <div className="flex items-baseline justify-between gap-2">
        <h3
          id="energy-portfolio-heading"
          className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]"
        >
          Energy source portfolio
        </h3>
        {portfolio.gridRegion && (
          <span className="font-mono text-[10px] text-[var(--text-tertiary)]">{portfolio.gridRegion}</span>
        )}
      </div>
      <p className="mt-1 text-xs text-[var(--text-tertiary)]">
        Facility input mix · PUE {portfolio.pue.toFixed(2)}
      </p>

      {/* Stacked bar */}
      <div
        className="mt-3 flex h-4 overflow-hidden rounded-full"
        role="img"
        aria-label={`Energy mix: ${sorted.map((s) => `${s.label} ${s.sharePct}%`).join(', ')}`}
      >
        {sorted.map((s) => (
          <div
            key={s.type}
            style={{
              width: `${s.sharePct}%`,
              backgroundColor: ENERGY_SOURCE_META[s.type].color,
            }}
            title={`${s.label}: ${s.sharePct}%`}
          />
        ))}
      </div>

      {/* Source rows */}
      <ul className="mt-4 space-y-2.5">
        {sorted.map((s) => {
          const meta = ENERGY_SOURCE_META[s.type]
          const liveMW = live?.bySourceMW[s.type]
          return (
            <li key={s.type} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: meta.color }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs text-[var(--text-secondary)]">{s.label}</span>
                  <span className="shrink-0 font-mono text-xs font-semibold text-[var(--text-primary)]">
                    {s.sharePct}%
                  </span>
                </div>
                {liveMW != null && liveMW > 0 && (
                  <p className="font-mono text-[10px] text-[var(--text-tertiary)]">
                    {formatPower(liveMW)} live input
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}