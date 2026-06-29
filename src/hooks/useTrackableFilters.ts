import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import type { CommitmentCategory, CommitmentEra, ConfidenceLevel } from '../types/commitments'
import type {
  CommitmentDomain,
  CommitmentFamily,
  CommitmentStatus,
  TrackableCommitment,
} from '../types/trackableCommitment'

function matchesQuery(record: TrackableCommitment, query: string): boolean {
  if (!query.trim()) return true
  const q = query.toLowerCase()
  return [
    record.company,
    record.hyperscaler,
    record.commitmentName,
    record.commitmentType,
    record.geography,
    record.serviceScope,
    record.notes,
    record.sourceTitle,
    record.commitmentFamily,
  ]
    .filter(Boolean)
    .some((s) => String(s).toLowerCase().includes(q))
}

export function useTrackableFilters(records: TrackableCommitment[]) {
  const [query, setQuery] = useState('')
  const [hyperscalers, setHyperscalers] = useState<Set<string>>(new Set())
  const [families, setFamilies] = useState<Set<CommitmentFamily>>(new Set())
  const [domains, setDomains] = useState<Set<CommitmentDomain>>(new Set())
  const [categories, setCategories] = useState<Set<CommitmentCategory>>(new Set())
  const [eras, setEras] = useState<Set<CommitmentEra>>(new Set())
  const [statuses, setStatuses] = useState<Set<CommitmentStatus>>(new Set())
  const [confidenceLevels, setConfidenceLevels] = useState<Set<ConfidenceLevel>>(new Set())
  const [density, setDensity] = useState<'compact' | 'detailed'>('detailed')
  const [reviewMode, setReviewMode] = useState(false)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (!matchesQuery(r, query)) return false
      if (hyperscalers.size > 0 && !hyperscalers.has(r.hyperscaler)) return false
      if (families.size > 0 && !families.has(r.commitmentFamily)) return false
      if (domains.size > 0 && !domains.has(r.domain)) return false
      if (categories.size > 0 && !categories.has(r.category)) return false
      if (eras.size > 0 && !eras.has(r.era)) return false
      if (statuses.size > 0 && !statuses.has(r.status)) return false
      if (confidenceLevels.size > 0 && !confidenceLevels.has(r.confidenceLevel)) return false
      return true
    })
  }, [records, query, hyperscalers, families, domains, categories, eras, statuses, confidenceLevels])

  const toggle = <T,>(set: Dispatch<SetStateAction<Set<T>>>, value: T) => {
    set((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  const reset = () => {
    setQuery('')
    setHyperscalers(new Set())
    setFamilies(new Set())
    setDomains(new Set())
    setCategories(new Set())
    setEras(new Set())
    setStatuses(new Set())
    setConfidenceLevels(new Set())
  }

  const hasActiveFilters =
    query.length > 0 ||
    hyperscalers.size > 0 ||
    families.size > 0 ||
    domains.size > 0 ||
    categories.size > 0 ||
    eras.size > 0 ||
    statuses.size > 0 ||
    confidenceLevels.size > 0

  return {
    query,
    setQuery,
    hyperscalers,
    families,
    domains,
    categories,
    eras,
    statuses,
    confidenceLevels,
    density,
    setDensity,
    reviewMode,
    setReviewMode,
    filtered,
    toggleHyperscaler: (h: string) => toggle(setHyperscalers, h),
    toggleFamily: (f: CommitmentFamily) => toggle(setFamilies, f),
    toggleDomain: (d: CommitmentDomain) => toggle(setDomains, d),
    toggleCategory: (c: CommitmentCategory) => toggle(setCategories, c),
    toggleEra: (e: CommitmentEra) => toggle(setEras, e),
    toggleStatus: (s: CommitmentStatus) => toggle(setStatuses, s),
    toggleConfidence: (c: ConfidenceLevel) => toggle(setConfidenceLevels, c),
    reset,
    hasActiveFilters,
  }
}