import type { CommitmentRecord } from '../types/commitments'
import type { TrackableCommitment } from '../types/trackableCommitment'

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const TRACKABLE_COLUMNS: (keyof TrackableCommitment)[] = [
  'id',
  'company',
  'hyperscaler',
  'commitmentFamily',
  'commitmentName',
  'commitmentType',
  'domain',
  'announcementDate',
  'startDate',
  'endDate',
  'termLength',
  'committedValue',
  'committedValueMax',
  'committedUnit',
  'actualValue',
  'actualUnit',
  'utilizationPct',
  'remainingValue',
  'geography',
  'serviceScope',
  'productScope',
  'category',
  'subcategory',
  'era',
  'status',
  'confidenceLevel',
  'sourceTitle',
  'sourceUrl',
  'sourceType',
  'notes',
  'sourceExcerpt',
  'forecastSignal',
]

export function trackableToCsv(records: TrackableCommitment[]): string {
  const header = TRACKABLE_COLUMNS.join(',')
  const rows = records.map((r) =>
    TRACKABLE_COLUMNS.map((col) => {
      const val = r[col]
      if (Array.isArray(val)) return escapeCsv(val.join(';'))
      return escapeCsv(String(val ?? ''))
    }).join(',')
  )
  return [header, ...rows].join('\n')
}

export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportTrackableCsv(records: TrackableCommitment[], filename = 'hyperscaler-commitments.csv') {
  downloadFile(trackableToCsv(records), filename, 'text/csv;charset=utf-8')
}

export function exportTrackableJson(records: TrackableCommitment[], filename = 'hyperscaler-commitments.json') {
  downloadFile(JSON.stringify(records, null, 2), filename, 'application/json')
}

/** @deprecated use exportTrackableCsv */
export function exportRecordsCsv(records: CommitmentRecord[] | TrackableCommitment[], filename?: string) {
  exportTrackableCsv(records as TrackableCommitment[], filename)
}

/** @deprecated use exportTrackableJson */
export function exportRecordsJson(records: CommitmentRecord[] | TrackableCommitment[], filename?: string) {
  exportTrackableJson(records as TrackableCommitment[], filename)
}

export function shareExplorerUrl(filters?: { company?: string; era?: string }) {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`
  const params = new URLSearchParams()
  if (filters?.company) params.set('company', filters.company)
  if (filters?.era) params.set('era', filters.era)
  const qs = params.toString()
  return `${base}${qs ? `?${qs}` : ''}#/timeline`
}