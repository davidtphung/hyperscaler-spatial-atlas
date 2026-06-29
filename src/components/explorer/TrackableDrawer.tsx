import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import type { TrackableCommitment } from '../../types/trackableCommitment'
import { CATEGORY_LABELS, ERA_LABELS } from '../../types/commitments'
import { formatCommittedValue, formatTerm } from '../../utils/trackableFormat'
import { ConfidenceBadge } from './ConfidenceBadge'
import { DomainBadge } from './DomainBadge'
import { FamilyBadge } from './FamilyBadge'
import { StatusBadge } from './StatusBadge'
import { CloseIcon } from '../icons'
import { IconButton } from '../ui/IconButton'

interface TrackableDrawerProps {
  record: TrackableCommitment | null
  onClose: () => void
  isMobile?: boolean
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === '') return null
  return (
    <div>
      <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">{label}</dt>
      <dd className="mt-0.5 text-sm text-[var(--text-primary)]">{value}</dd>
    </div>
  )
}

export function TrackableDrawer({ record, onClose, isMobile }: TrackableDrawerProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (record) ref.current?.focus()
  }, [record?.id])

  useEffect(() => {
    if (!record) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [record, onClose])

  if (!record) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <aside
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trackable-drawer-title"
        className={clsx(
          'fixed z-50 flex flex-col overflow-hidden border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl',
          isMobile
            ? 'inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl'
            : 'right-0 top-0 h-full w-full max-w-xl border-l shadow-2xl'
        )}
      >
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1" aria-hidden>
            <div className="h-1 w-10 rounded-full bg-[var(--border)]" />
          </div>
        )}

        <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <DomainBadge domain={record.domain} />
              <FamilyBadge family={record.commitmentFamily} />
              <StatusBadge status={record.status} />
              <ConfidenceBadge level={record.confidenceLevel} />
            </div>
            <h2 id="trackable-drawer-title" className="text-lg font-semibold leading-tight text-[var(--text-primary)]">
              {record.commitmentName}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {record.company} · {record.hyperscaler}
            </p>
          </div>
          <IconButton label="Close detail panel" onClick={onClose} size="sm">
            <CloseIcon />
          </IconButton>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {record.utilizationPct != null && (
            <div className="mb-6 rounded-xl border border-[var(--border)] bg-white/3 p-4">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Utilization
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold text-[var(--accent)]">{record.utilizationPct}%</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/6">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${Math.min(100, record.utilizationPct)}%` }}
                  role="meter"
                  aria-valuenow={record.utilizationPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Utilization ${record.utilizationPct} percent`}
                />
              </div>
              {record.remainingValue != null && (
                <p className="mt-2 font-mono text-xs text-[var(--text-tertiary)]">
                  Remaining: {record.remainingValue.toLocaleString()} {record.committedUnit?.replace('USD_', '$') ?? ''}
                </p>
              )}
            </div>
          )}

          <dl className="grid grid-cols-2 gap-4">
            <Field label="Announced" value={record.announcementDate} />
            <Field label="Term" value={formatTerm(record)} />
            <Field label="Start" value={record.startDate} />
            <Field label="End" value={record.endDate} />
            <Field label="Committed" value={formatCommittedValue(record)} />
            <Field
              label="Actual"
              value={
                record.actualValue != null
                  ? `${record.actualValue.toLocaleString()} ${record.actualUnit ?? ''}`
                  : undefined
              }
            />
            <Field label="Era" value={ERA_LABELS[record.era]} />
            <Field label="Category" value={CATEGORY_LABELS[record.category]} />
            <Field label="Geography" value={record.geography} />
            <Field label="Service scope" value={record.serviceScope} />
            <Field label="Product scope" value={record.productScope} />
          </dl>

          {record.sourceExcerpt && (
            <blockquote className="mt-6 border-l-2 border-[var(--accent)] pl-4 text-sm italic leading-relaxed text-[var(--text-secondary)]">
              {record.sourceExcerpt}
            </blockquote>
          )}

          {record.forecastSignal && (
            <div className="mt-4 rounded-lg border border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary)]/8 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--accent-secondary)]">
                Forecast signal
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{record.forecastSignal}</p>
            </div>
          )}

          {record.notes && (
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{record.notes}</p>
          )}

          <section className="mt-6 rounded-xl border border-[var(--border)] bg-white/3 p-4" aria-labelledby="evidence-heading">
            <h3 id="evidence-heading" className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
              Source evidence
            </h3>
            <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{record.sourceTitle}</p>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Type: {record.sourceType.replace(/_/g, ' ')} · {record.confidenceLevel === 'direct' ? 'Publicly reported' : record.confidenceLevel === 'estimated' ? 'Analyst estimate' : record.confidenceLevel === 'inferred' ? 'Derived from usage' : 'Forecast'}
            </p>
            <a
              href={record.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[44px] items-center text-sm text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
            >
              Open primary source
            </a>
          </section>
        </div>
      </aside>
    </>
  )
}