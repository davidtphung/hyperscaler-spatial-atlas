import clsx from 'clsx'
import type { MapViewMode } from '../../types'

const MODES: { id: MapViewMode; label: string; short: string; description: string }[] = [
  { id: 'standard', label: 'Standard', short: 'Std', description: 'Category & status' },
  { id: 'energy', label: 'Energy', short: 'Pwr', description: 'Power source portfolio' },
  { id: 'compute', label: 'Compute', short: 'Cmp', description: 'Workloads & data types' },
]

interface ViewModeToggleProps {
  mode: MapViewMode
  onChange: (mode: MapViewMode) => void
  compact?: boolean
}

export function ViewModeToggle({ mode, onChange, compact }: ViewModeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Map view mode"
      className={clsx(
        'inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-1',
        compact ? 'gap-0.5' : 'gap-1'
      )}
    >
      {MODES.map((m) => {
        const active = mode === m.id
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={m.description}
            onClick={() => onChange(m.id)}
            className={clsx(
              'min-h-[36px] rounded-lg px-3 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
              active
                ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {compact ? m.short : m.label}
          </button>
        )
      })}
    </div>
  )
}