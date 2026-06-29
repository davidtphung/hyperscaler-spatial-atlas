import type { TrackableCommitment } from '../../types/trackableCommitment'
import { formatCommittedValue } from '../../utils/trackableFormat'
import { ConfidenceBadge } from './ConfidenceBadge'
import { DomainBadge } from './DomainBadge'
import { FamilyBadge } from './FamilyBadge'
import { StatusBadge } from './StatusBadge'

interface CommitmentTableProps {
  records: TrackableCommitment[]
  onSelect: (record: TrackableCommitment) => void
  selectedId?: string | null
  reviewMode?: boolean
}

export function CommitmentTable({ records, onSelect, selectedId, reviewMode }: CommitmentTableProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white/3 px-6 py-12 text-center">
        <p className="text-sm text-[var(--text-secondary)]">No commitments match the current filters.</p>
        <p className="mt-1 text-xs text-[var(--text-tertiary)]">Try resetting filters or broadening your search.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-white/3 text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
            <th className="px-4 py-3 font-semibold">Domain</th>
            <th className="px-4 py-3 font-semibold">Family</th>
            <th className="px-4 py-3 font-semibold">Commitment</th>
            <th className="px-4 py-3 font-semibold">Hyperscaler</th>
            <th className="px-4 py-3 font-semibold">Announced</th>
            {reviewMode && <th className="px-4 py-3 font-semibold">Term</th>}
            <th className="px-4 py-3 font-semibold text-right">Committed</th>
            {reviewMode && <th className="px-4 py-3 font-semibold text-right">Util %</th>}
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const selected = selectedId === record.id
            return (
              <tr
                key={record.id}
                className={`border-b border-[var(--border)]/50 transition-colors ${
                  selected ? 'bg-[var(--accent)]/10' : 'hover:bg-white/3'
                }`}
              >
                <td className="px-4 py-3">
                  <DomainBadge domain={record.domain} />
                </td>
                <td className="px-4 py-3">
                  <FamilyBadge family={record.commitmentFamily} />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(record)}
                    className="max-w-xs text-left font-medium text-[var(--text-primary)] underline decoration-transparent underline-offset-2 hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {record.commitmentName}
                  </button>
                  <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{record.company}</p>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{record.hyperscaler}</td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">
                  {record.announcementDate}
                </td>
                {reviewMode && (
                  <td className="px-4 py-3 text-xs text-[var(--text-tertiary)]">
                    {record.termLength ?? 'n/a'}
                  </td>
                )}
                <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text-primary)]">
                  {formatCommittedValue(record)}
                </td>
                {reviewMode && (
                  <td className="px-4 py-3 text-right font-mono text-xs text-[var(--text-primary)]">
                    {record.utilizationPct != null ? `${record.utilizationPct}%` : 'n/a'}
                  </td>
                )}
                <td className="px-4 py-3">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-4 py-3">
                  <ConfidenceBadge level={record.confidenceLevel} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}