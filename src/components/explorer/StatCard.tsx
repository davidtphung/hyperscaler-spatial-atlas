interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: string
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-5 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
        {label}
      </p>
      <p
        className="mt-2 font-mono text-2xl font-semibold tracking-tight"
        style={{ color: accent ?? 'var(--text-primary)' }}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-[var(--text-tertiary)]">{sub}</p>}
    </article>
  )
}