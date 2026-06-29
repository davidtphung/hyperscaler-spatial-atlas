import type { TrackableCommitment } from '../../types/trackableCommitment'
import { FAMILY_LABELS } from '../../types/trackableCommitment'

interface UtilizationChartProps {
  records: TrackableCommitment[]
  title?: string
}

export function UtilizationChart({ records, title = 'Utilization and drawdown' }: UtilizationChartProps) {
  const withUtil = records.filter((r) => r.utilizationPct != null).sort((a, b) => (b.utilizationPct ?? 0) - (a.utilizationPct ?? 0))

  if (withUtil.length === 0) {
    return (
      <p className="text-sm text-[var(--text-tertiary)]">No utilization data for the current selection.</p>
    )
  }

  return (
    <figure aria-labelledby="util-chart-title">
      <figcaption id="util-chart-title" className="text-sm font-semibold text-[var(--text-primary)]">
        {title}
      </figcaption>
      <ul className="mt-4 space-y-3" role="list">
        {withUtil.map((r) => (
          <li key={r.id}>
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="min-w-0 truncate text-[var(--text-secondary)]">
                {FAMILY_LABELS[r.commitmentFamily]} · {r.commitmentName.slice(0, 40)}
              </span>
              <span className="shrink-0 font-mono text-[var(--text-primary)]">{r.utilizationPct}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full transition-all duration-500 motion-reduce:transition-none"
                style={{
                  width: `${r.utilizationPct}%`,
                  backgroundColor:
                    r.domain === 'cloud_spend' ? '#7c8cff' : r.domain === 'energy' ? '#34d399' : '#3dd6c6',
                }}
                role="meter"
                aria-label={`${r.commitmentName} utilization ${r.utilizationPct} percent`}
                aria-valuenow={r.utilizationPct ?? 0}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            {r.endDate && (
              <p className="mt-0.5 font-mono text-[10px] text-[var(--text-tertiary)]">Ends {r.endDate}</p>
            )}
          </li>
        ))}
      </ul>
    </figure>
  )
}