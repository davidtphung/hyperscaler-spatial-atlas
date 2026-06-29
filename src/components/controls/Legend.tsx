import { CATEGORY_META, STATUS_META } from '../../data/categories'

export function Legend() {
  return (
    <aside
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur-md"
      aria-label="Map legend"
    >
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
        Legend
      </h2>
      <div className="space-y-3">
        <div>
          <h3 className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
            Categories
          </h3>
          <ul className="space-y-1">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <li key={key} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden />
                {meta.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
            Status
          </h3>
          <ul className="space-y-1">
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <li key={key} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: meta.pattern === 'dashed' ? 'transparent' : meta.color,
                    border: meta.pattern === 'dashed' ? `1.5px dashed ${meta.color}` : 'none',
                  }}
                  aria-hidden
                />
                {meta.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}