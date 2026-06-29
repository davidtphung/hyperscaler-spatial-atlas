import { useMemo, useState } from 'react'
import type {
  CommitmentCategory,
  CommitmentEra,
  CommitmentRecord,
  ConfidenceLevel,
} from '../types/commitments'

function matchesQuery(record: CommitmentRecord, query: string): boolean {
  if (!query.trim()) return true
  const q = query.toLowerCase()
  return [
    record.company,
    record.parentCompany,
    record.commitmentType,
    record.geography,
    record.facilityOrProject,
    record.notes,
    record.sourceTitle,
  ]
    .filter(Boolean)
    .some((s) => String(s).toLowerCase().includes(q))
}

export function useCommitmentFilters(records: CommitmentRecord[]) {
  const [query, setQuery] = useState('')
  const [companies, setCompanies] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<Set<CommitmentCategory>>(new Set())
  const [eras, setEras] = useState<Set<CommitmentEra>>(new Set())
  const [confidenceLevels, setConfidenceLevels] = useState<Set<ConfidenceLevel>>(new Set())
  const [density, setDensity] = useState<'compact' | 'detailed'>('detailed')

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (!matchesQuery(r, query)) return false
      if (companies.size > 0 && !companies.has(r.company)) return false
      if (categories.size > 0 && !categories.has(r.category)) return false
      if (eras.size > 0 && !eras.has(r.era)) return false
      if (confidenceLevels.size > 0 && !confidenceLevels.has(r.confidenceLevel)) return false
      return true
    })
  }, [records, query, companies, categories, eras, confidenceLevels])

  const toggleCompany = (c: string) => {
    setCompanies((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }

  const toggleCategory = (c: CommitmentCategory) => {
    setCategories((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }

  const toggleEra = (e: CommitmentEra) => {
    setEras((prev) => {
      const next = new Set(prev)
      if (next.has(e)) next.delete(e)
      else next.add(e)
      return next
    })
  }

  const toggleConfidence = (c: ConfidenceLevel) => {
    setConfidenceLevels((prev) => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }

  const reset = () => {
    setQuery('')
    setCompanies(new Set())
    setCategories(new Set())
    setEras(new Set())
    setConfidenceLevels(new Set())
  }

  const hasActiveFilters =
    query.length > 0 ||
    companies.size > 0 ||
    categories.size > 0 ||
    eras.size > 0 ||
    confidenceLevels.size > 0

  return {
    query,
    setQuery,
    companies,
    categories,
    eras,
    confidenceLevels,
    density,
    setDensity,
    filtered,
    toggleCompany,
    toggleCategory,
    toggleEra,
    toggleConfidence,
    reset,
    hasActiveFilters,
  }
}