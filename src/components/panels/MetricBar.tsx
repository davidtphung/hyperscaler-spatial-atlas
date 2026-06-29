interface MetricBarProps {
  label: string
  value: string
  subValue?: string
  percent: number
  color: string
  rank?: number
  total?: number
}

export function MetricBar({ label, value, subValue, percent, color, rank, total }: MetricBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
        <div className="text-right">
          <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">{value}</span>
          {subValue && (
            <span className="ml-1.5 font-mono text-[10px] text-[var(--text-tertiary)]">{subValue}</span>
          )}
        </div>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-white/6"
        role="meter"
        aria-label={`${label}: ${value}`}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500 motion-reduce:transition-none"
          style={{ width: `${Math.max(percent, percent > 0 ? 4 : 0)}%`, backgroundColor: color }}
        />
      </div>
      {rank != null && total != null && (
        <p className="text-[10px] text-[var(--text-tertiary)]">
          #{rank} of {total} in fleet
        </p>
      )}
    </div>
  )
}