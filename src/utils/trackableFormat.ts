import type { TrackableCommitment } from '../types/trackableCommitment'

export function formatCommittedValue(record: TrackableCommitment): string {
  if (record.committedValue == null) return 'Disclosed'
  const unit = record.committedUnit ?? ''
  if (record.committedValueMax != null) {
    return `${record.committedValue.toLocaleString()}-${record.committedValueMax.toLocaleString()} ${unit}`
  }
  if (unit === 'USD_million') return `$${record.committedValue}M`
  if (unit === 'USD_billion') return `$${record.committedValue}B`
  if (unit === 'USD_per_hour') return `$${record.committedValue}/hr`
  if (unit === 'USD_million_annual') return `$${record.committedValue}M/yr`
  if (unit === 'MW') return `${record.committedValue.toLocaleString()} MW`
  return `${record.committedValue.toLocaleString()} ${unit}`.trim()
}

export function formatTerm(record: TrackableCommitment): string {
  if (record.termLength) return record.termLength
  if (record.startDate && record.endDate) return `${record.startDate} to ${record.endDate}`
  return 'Not disclosed'
}

export function parseAnnouncementYear(date: string): number {
  const y = parseInt(date.slice(0, 4), 10)
  return Number.isNaN(y) ? 0 : y
}