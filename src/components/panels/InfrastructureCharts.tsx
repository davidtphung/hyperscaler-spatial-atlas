import type { SpatialNode } from '../../types'
import {
  formatAcres,
  formatGpus,
  formatPower,
  formatWatts,
  getFleetBenchmarks,
  pctOfMax,
} from '../../utils/metrics'
import { SPATIAL_NODES } from '../../data/nodes'
import { MetricBar } from './MetricBar'

interface InfrastructureChartsProps {
  node: SpatialNode
}

function getRank(nodes: SpatialNode[], key: keyof SpatialNode['infrastructure'], nodeId: string): number {
  const sorted = [...nodes]
    .filter((n) => n.infrastructure[key] > 0)
    .sort((a, b) => b.infrastructure[key] - a.infrastructure[key])
  const idx = sorted.findIndex((n) => n.id === nodeId)
  return idx >= 0 ? idx + 1 : sorted.length
}

export function InfrastructureCharts({ node }: InfrastructureChartsProps) {
  const fleet = getFleetBenchmarks(SPATIAL_NODES)
  const { powerMW, landAcres, gpuCount } = node.infrastructure
  const isPlanned = node.status === 'planned'

  const metrics = [
    {
      key: 'power',
      label: 'Power draw',
      value: isPlanned && powerMW === 0 ? 'Planned' : formatPower(powerMW),
      subValue: powerMW > 0 ? formatWatts(powerMW) : undefined,
      percent: pctOfMax(powerMW, fleet.maxPowerMW),
      color: '#f0b429',
      rank: powerMW > 0 ? getRank(SPATIAL_NODES, 'powerMW', node.id) : undefined,
      total: SPATIAL_NODES.filter((n) => n.infrastructure.powerMW > 0).length,
    },
    {
      key: 'land',
      label: 'Land footprint',
      value: isPlanned && landAcres === 0 ? 'Planned' : formatAcres(landAcres),
      subValue: landAcres > 0 ? `${(landAcres * 4046.86).toLocaleString(undefined, { maximumFractionDigits: 0 })} m²` : undefined,
      percent: pctOfMax(landAcres, fleet.maxLandAcres),
      color: '#34d399',
      rank: landAcres > 0 ? getRank(SPATIAL_NODES, 'landAcres', node.id) : undefined,
      total: SPATIAL_NODES.filter((n) => n.infrastructure.landAcres > 0).length,
    },
    {
      key: 'gpu',
      label: 'GPU / accelerators',
      value: isPlanned && gpuCount === 0 ? 'Planned' : formatGpus(gpuCount),
      subValue: gpuCount > 0 ? `${gpuCount.toLocaleString()} units` : 'CPU / network only',
      percent: pctOfMax(gpuCount, fleet.maxGpuCount),
      color: '#e879f9',
      rank: gpuCount > 0 ? getRank(SPATIAL_NODES, 'gpuCount', node.id) : undefined,
      total: SPATIAL_NODES.filter((n) => n.infrastructure.gpuCount > 0).length,
    },
  ]

  return (
    <section aria-labelledby="infra-metrics-heading" className="mt-6">
      <h3
        id="infra-metrics-heading"
        className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]"
      >
        Infrastructure metrics
      </h3>
      <p className="mt-1 text-xs text-[var(--text-tertiary)]">
        Bars show share of largest site in fleet
      </p>
      <div className="mt-4 space-y-5">
        {metrics.map((m) => (
          <MetricBar
            key={m.key}
            label={m.label}
            value={m.value}
            subValue={m.subValue}
            percent={m.percent}
            color={m.color}
            rank={m.rank}
            total={m.total}
          />
        ))}
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-[var(--border)] bg-white/3 p-3">
        <div>
          <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Buildings</dt>
          <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">
            {node.infrastructure.buildings || '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">MW / acre</dt>
          <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">
            {landAcres > 0 && powerMW > 0 ? (powerMW / landAcres).toFixed(1) : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">GPUs / MW</dt>
          <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">
            {powerMW > 0 && gpuCount > 0 ? Math.round(gpuCount / powerMW) : '—'}
          </dd>
        </div>
      </dl>
    </section>
  )
}