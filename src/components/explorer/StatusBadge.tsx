import { STATUS_COLORS, STATUS_LABELS, type CommitmentStatus } from '../../types/trackableCommitment'

export function StatusBadge({ status }: { status: CommitmentStatus }) {
  const color = STATUS_COLORS[status]
  return (
    <span
      className="inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}