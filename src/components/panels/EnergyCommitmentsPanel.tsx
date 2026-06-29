import { ENERGY_COMMITMENTS } from '../../data/commitments'

const RESOURCE_COLORS: Record<string, string> = {
  Renewable: '#34d399',
  Gas: '#f0b429',
  Geothermal: '#f97316',
  'Fuel cells': '#7c8cff',
  Nuclear: '#e879f9',
}

const maxMw = Math.max(...ENERGY_COMMITMENTS.map((c) => c.megawatts))

export function EnergyCommitmentsPanel() {
  return (
    <aside
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur-md"
      aria-label="Public energy procurement commitments"
    >
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
        Energy commitments
      </h2>
      <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">
        Sourced public MW deals · research/data/hyperscaler_commitments.csv
      </p>

      <ul className="mt-3 space-y-3">
        {ENERGY_COMMITMENTS.map((c) => {
          const pct = (c.megawatts / maxMw) * 100
          const color = RESOURCE_COLORS[c.resourceType] ?? 'var(--accent)'
          return (
            <li key={c.id}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {c.company} / {c.counterparty}
                </span>
                <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                  {(c.megawatts / 1000).toFixed(1)} GW
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                {c.resourceType} · {c.geography} · {c.announcementDate}
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/6">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(pct, 6)}%`, backgroundColor: color }}
                />
              </div>
              <a
                href={c.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-[10px] text-[var(--accent)] underline underline-offset-2 hover:text-[var(--text-primary)]"
              >
                Source
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}