import type { CommitmentRecord } from '../types/commitments'

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const CSV_COLUMNS: (keyof CommitmentRecord)[] = [
  'id',
  'company',
  'parentCompany',
  'date',
  'era',
  'category',
  'subcategory',
  'commitmentType',
  'value',
  'valueMax',
  'unit',
  'geography',
  'facilityOrProject',
  'confidenceLevel',
  'sourceTitle',
  'sourceUrl',
  'sourceType',
  'notes',
  'quoteOrExcerpt',
]

export function recordsToCsv(records: CommitmentRecord[]): string {
  const header = CSV_COLUMNS.join(',')
  const rows = records.map((r) =>
    CSV_COLUMNS.map((col) => escapeCsv(String(r[col] ?? ''))).join(',')
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

export function exportRecordsCsv(records: CommitmentRecord[], filename = 'hyperscaler-commitments.csv') {
  downloadFile(recordsToCsv(records), filename, 'text/csv;charset=utf-8')
}

export function exportRecordsJson(records: CommitmentRecord[], filename = 'hyperscaler-commitments.json') {
  downloadFile(JSON.stringify(records, null, 2), filename, 'application/json')
}

export function shareExplorerUrl(filters?: { company?: string; era?: string }) {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`
  const params = new URLSearchParams()
  if (filters?.company) params.set('company', filters.company)
  if (filters?.era) params.set('era', filters.era)
  const qs = params.toString()
  return `${base}${qs ? `?${qs}` : ''}#/timeline`
}