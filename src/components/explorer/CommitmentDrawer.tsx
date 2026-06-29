import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import type { CommitmentRecord } from '../../types/commitments'
import { CATEGORY_LABELS, ERA_LABELS } from '../../types/commitments'
import { formatCommitmentValue } from '../../utils/commitmentStats'
import { ConfidenceBadge } from './ConfidenceBadge'
import { CloseIcon } from '../icons'
import { IconButton } from '../ui/IconButton'

interface CommitmentDrawerProps {
  record: CommitmentRecord | null
  onClose: () => void
  isMobile?: boolean
}

export function CommitmentDrawer({ record, onClose, isMobile }: CommitmentDrawerProps) {
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
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={clsx(
          'fixed z-50 flex flex-col overflow-hidden border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl',
          isMobile
            ? 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl'
            : 'right-0 top-0 h-full w-full max-w-lg border-l shadow-2xl'
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
              <ConfidenceBadge level={record.confidenceLevel} />
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
                {ERA_LABELS[record.era]}
              </span>
            </div>
            <h2 id="drawer-title" className="text-lg font-semibold leading-tight text-[var(--text-primary)]">
              {record.commitmentType}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {record.company}
              {record.parentCompany ? ` · ${record.parentCompany}` : ''}
            </p>
          </div>
          <IconButton label="Close detail panel" onClick={onClose} size="sm">
            <CloseIcon />
          </IconButton>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Date</dt>
              <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">{record.date}</dd>
            </div>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Value</dt>
              <dd className="mt-0.5 font-mono text-sm text-[var(--text-primary)]">
                {formatCommitmentValue(record)}
              </dd>
            </div>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Category</dt>
              <dd className="mt-0.5 text-sm text-[var(--text-primary)]">{CATEGORY_LABELS[record.category]}</dd>
            </div>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Geography</dt>
              <dd className="mt-0.5 text-sm text-[var(--text-primary)]">{record.geography}</dd>
            </div>
          </dl>

          {record.quoteOrExcerpt && (
            <blockquote className="mt-6 border-l-2 border-[var(--accent)] pl-4 text-sm italic leading-relaxed text-[var(--text-secondary)]">
              {record.quoteOrExcerpt}
            </blockquote>
          )}

          {record.notes && (
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{record.notes}</p>
          )}

          <section className="mt-6 rounded-xl border border-[var(--border)] bg-white/3 p-4" aria-labelledby="source-heading">
            <h3 id="source-heading" className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
              Source review
            </h3>
            <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{record.sourceTitle}</p>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">Type: {record.sourceType.replace(/_/g, ' ')}</p>
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