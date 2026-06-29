import type { CommitmentRecord, CommitmentEra } from '../types/commitments'
import { CAPEX_SERIES } from '../data/commitmentsRegistry'

export function parseYear(date: string): number {
  const y = parseInt(date.slice(0, 4), 10)
  return Number.isNaN(y) ? 0 : y
}

export function formatCommitmentValue(record: CommitmentRecord): string {
  if (record.value == null) return 'Disclosed'
  const unit = record.unit ?? ''
  if (record.valueMax != null) return `${record.value.toLocaleString()}-${record.valueMax.toLocaleString()} ${unit}`
  if (unit === 'USD_billion') return `$${record.value}B`
  if (unit === 'USD_billion_program') return `$${record.value}B program`
  if (unit === 'MW') return `${record.value.toLocaleString()} MW`
  if (unit === 'TWh_per_year') return `${record.value} TWh/yr`
  if (unit === 'regions') return `${record.value} regions`
  if (unit === 'percent_yoy') return `${record.value}% YoY`
  return `${record.value.toLocaleString()} ${unit}`.trim()
}

export function getDashboardStats(records: CommitmentRecord[]) {
  const nuclearMw = records
    .filter((r) => r.category === 'nuclear_ppas' && r.unit === 'MW' && r.value)
    .reduce((sum, r) => sum + (r.value ?? 0), 0)

  const renewableMw = records
    .filter((r) => r.category === 'renewable_ppas' && r.unit === 'MW' && r.value)
    .reduce((sum, r) => sum + (r.value ?? 0), 0)

  const directCount = records.filter((r) => r.confidenceLevel === 'direct').length
  const aiEraCount = records.filter(
    (r) => r.era === 'post_ai_acceleration' || r.era === 'current'
  ).length

  const latestCapex = CAPEX_SERIES.filter((c) => c.era === 'current' || c.fiscalYear >= 2025)
  const cohortCapex = latestCapex.reduce((s, c) => s + c.capexUsdB, 0)

  return {
    totalRecords: records.length,
    nuclearMw,
    renewableMw,
    directCount,
    aiEraCount,
    cohortCapex,
    companyCount: new Set(records.map((r) => r.company)).size,
  }
}

export function groupByEra(records: CommitmentRecord[]): Record<CommitmentEra, number> {
  const counts = {} as Record<CommitmentEra, number>
  for (const r of records) {
    counts[r.era] = (counts[r.era] ?? 0) + 1
  }
  return counts
}

export function groupByCompany(records: CommitmentRecord[]): { company: string; count: number }[] {
  const map = new Map<string, number>()
  for (const r of records) {
    map.set(r.company, (map.get(r.company) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
}

export function getCapexByCompany(company: string) {
  return CAPEX_SERIES.filter((c) => c.company === company).sort(
    (a, b) => a.fiscalYear - b.fiscalYear
  )
}