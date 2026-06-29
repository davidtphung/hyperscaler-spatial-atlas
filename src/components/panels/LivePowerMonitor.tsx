import type { LivePowerSnapshot } from '../../types'
import { formatPower, formatWatts } from '../../utils/metrics'

interface LivePowerMonitorProps {
  snapshot: LivePowerSnapshot | null
  capacityMW?: number
}

function Sparkline({ values, max }: { values: number[]; max: number }) {
  if (values.length < 2) return null
  const w = 120
  const h = 28
  const pad = 2
  const range = max > 0 ? max : Math.max(...values, 1)
  const step = (w - pad * 2) / (values.length - 1)

  const points = values
    .map((v, i) => {
      const x = pad + i * step
      const y = h - pad - (v / range) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} aria-hidden className="opacity-80">
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LivePowerMonitor({ snapshot, capacityMW }: LivePowerMonitorProps) {
  if (!snapshot) {
    return (
      <section aria-labelledby="live-power-heading" className="mt-6">
        <h3
          id="live-power-heading"
          className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]"
        >
          Live power input
        </h3>
        <p className="mt-2 text-xs text-[var(--text-tertiary)]">Awaiting feed…</p>
      </section>
    )
  }

  const trendMax = capacityMW ?? Math.max(...snapshot.trend, snapshot.itLoadMW)

  return (
    <section aria-labelledby="live-power-heading" className="mt-6">
      <div className="flex items-baseline justify-between gap-2">
        <h3
          id="live-power-heading"
          className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]"
        >
          Live power input
        </h3>
        <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-tertiary)]">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-[var(--accent)] motion-reduce:animate-none" aria-hidden />
          Modeled
        </span>
      </div>
      <p className="mt-1 text-xs text-[var(--text-tertiary)]">{snapshot.sourceLabel}</p>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-white/3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              IT load
            </p>
            <p className="mt-0.5 font-mono text-2xl font-semibold text-[var(--text-primary)]">
              {formatPower(snapshot.itLoadMW)}
            </p>
            <p className="font-mono text-[10px] text-[var(--text-tertiary)]">
              {formatWatts(snapshot.itLoadMW)}
            </p>
          </div>
          <Sparkline values={snapshot.trend} max={trendMax} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
          <div>
            <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Facility input
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">
              {formatPower(snapshot.facilityInputMW)}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Utilization
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">
              {snapshot.utilizationPct}%
            </dd>
          </div>
        </dl>

        {capacityMW != null && capacityMW > 0 && (
          <div className="mt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500 motion-reduce:transition-none"
                style={{ width: `${Math.min(100, snapshot.utilizationPct)}%` }}
              />
            </div>
            <p className="mt-1 font-mono text-[10px] text-[var(--text-tertiary)]">
              {formatPower(snapshot.itLoadMW)} of {formatPower(capacityMW)} capacity
            </p>
          </div>
        )}
      </div>
    </section>
  )
}