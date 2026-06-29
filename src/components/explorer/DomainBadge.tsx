import { DOMAIN_COLORS, DOMAIN_LABELS, type CommitmentDomain } from '../../types/trackableCommitment'

export function DomainBadge({ domain }: { domain: CommitmentDomain }) {
  const color = DOMAIN_COLORS[domain]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ borderColor: `${color}44`, backgroundColor: `${color}18`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {DOMAIN_LABELS[domain]}
    </span>
  )
}