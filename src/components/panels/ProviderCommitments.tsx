import { getCommitmentsByCompany } from '../../data/commitments'

interface ProviderCommitmentsProps {
  provider: string
}

export function ProviderCommitments({ provider }: ProviderCommitmentsProps) {
  const commitments = getCommitmentsByCompany(provider)
  if (commitments.length === 0) return null

  return (
    <section aria-labelledby="provider-commitments-heading" className="mt-6">
      <h3
        id="provider-commitments-heading"
        className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]"
      >
        Public energy commitments ({provider})
      </h3>
      <ul className="mt-2 space-y-2">
        {commitments.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-[var(--border)] bg-white/3 px-3 py-2"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {c.counterparty}
              </span>
              <span className="font-mono text-xs text-[var(--accent)]">
                {(c.megawatts / 1000).toFixed(2)} GW
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {c.resourceType} · {c.geography} · {c.announcementDate}
            </p>
            <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">{c.notes}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}