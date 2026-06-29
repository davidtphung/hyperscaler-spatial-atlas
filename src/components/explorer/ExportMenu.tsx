import { useState } from 'react'
import type { CommitmentRecord } from '../../types/commitments'
import { exportRecordsCsv, exportRecordsJson, shareExplorerUrl } from '../../utils/exportData'

interface ExportMenuProps {
  records: CommitmentRecord[]
}

export function ExportMenu({ records }: ExportMenuProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = shareExplorerUrl()
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Export and share">
      <button
        type="button"
        onClick={() => exportRecordsCsv(records)}
        className="min-h-[40px] rounded-xl border border-[var(--border)] px-3 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        Export CSV
      </button>
      <button
        type="button"
        onClick={() => exportRecordsJson(records)}
        className="min-h-[40px] rounded-xl border border-[var(--border)] px-3 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="min-h-[40px] rounded-xl border border-[var(--border)] px-3 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        {copied ? 'Link copied' : 'Share view'}
      </button>
    </div>
  )
}