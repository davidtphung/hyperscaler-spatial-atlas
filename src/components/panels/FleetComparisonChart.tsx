import { useMemo } from 'react'
import type { SpatialNode } from '../../types'
import { SPATIAL_NODES } from '../../data/nodes'
import { formatPower, formatGpus, formatAcres } from '../../utils/metrics'

interface FleetComparisonChartProps {
  node: SpatialNode
}

type MetricKey = 'powerMW' | 'landAcres' | 'gpuCount'

const CHART_METRICS: { key: MetricKey; label: string; color: string; format: (v: number) => string }[] = [
  { key: 'powerMW', label: 'Power', color: '#f0b429', format: formatPower },
  { key: 'landAcres', label: 'Land', color: '#34d399', format: formatAcres },
  { key: 'gpuCount', label: 'GPUs', color: '#e879f9', format: formatGpus },
]

export function FleetComparisonChart({ node }: FleetComparisonChartProps) {
  const topSites = useMemo(() => {
    return [...SPATIAL_NODES]
      .filter((n) => n.infrastructure.powerMW > 0 || n.infrastructure.gpuCount > 0)
      .sort((a, b) => b.infrastructure.powerMW - a.infrastructure.powerMW)
      .slice(0, 6)
  }, [])

  const maxPower = Math.max(...topSites.map((n) => n.infrastructure.powerMW), 1)
  const maxLand = Math.max(...topSites.map((n) => n.infrastructure.landAcres), 1)
  const maxGpu = Math.max(...topSites.map((n) => n.infrastructure.gpuCount), 1)

  const getMax = (key: MetricKey) =>
    key === 'powerMW' ? maxPower : key === 'landAcres' ? maxLand : maxGpu

  return (
    <section aria-labelledby="fleet-chart-heading" className="mt-6">
      <h3
        id="fleet-chart-heading"
        className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]"
      >
        Fleet comparison
      </h3>
      <p className="mt-1 text-xs text-[var(--text-tertiary)]">
        Top sites by power — highlighted row is selected
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-tertiary)]">
              <th className="pb-2 pr-2 font-medium">Site</th>
              {CHART_METRICS.map((m) => (
                <th key={m.key} className="pb-2 pr-1 font-medium text-right">
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topSites.map((site) => {
              const isSelected = site.id === node.id
              return (
                <tr
                  key={site.id}
                  className={
                    isSelected
                      ? 'bg-[var(--accent)]/10 border-l-2 border-l-[var(--accent)]'
                      : 'border-b border-[var(--border)]/50'
                  }
                >
                  <td className="py-2 pr-2">
                    <span
                      className={
                        isSelected
                          ? 'font-semibold text-[var(--accent)]'
                          : 'text-[var(--text-secondary)]'
                      }
                    >
                      {site.name.split('—')[0].trim()}
                    </span>
                  </td>
                  {CHART_METRICS.map((m) => {
                    const val = site.infrastructure[m.key]
                    const pct = (val / getMax(m.key)) * 100
                    return (
                      <td key={m.key} className="py-2 pr-1 text-right">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-mono text-[10px] text-[var(--text-primary)]">
                            {m.format(val)}
                          </span>
                          <div className="h-1 w-12 overflow-hidden rounded-full bg-white/6">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${Math.max(pct, val > 0 ? 8 : 0)}%`, backgroundColor: m.color }}
                            />
                          </div>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}