import { FAMILY_LABELS, type CommitmentFamily } from '../../types/trackableCommitment'

export function FamilyBadge({ family }: { family: CommitmentFamily }) {
  return (
    <span className="rounded-md border border-[var(--border)] bg-white/4 px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">
      {FAMILY_LABELS[family]}
    </span>
  )
}