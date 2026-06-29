import { useMemo, useState } from 'react'
import type { FilterState, NodeCategory, NodeStatus, SpatialNode } from '../types'
import { PROVIDERS } from '../data/categories'
import { trackEvent } from '../utils/analytics'

const ALL_CATEGORIES: NodeCategory[] = ['compute', 'storage', 'network', 'ai', 'edge']
const ALL_STATUSES: NodeStatus[] = ['operational', 'expanding', 'planned', 'maintenance']

export function useFilters(nodes: SpatialNode[]) {
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<Set<NodeCategory>>(new Set(ALL_CATEGORIES))
  const [providers, setProviders] = useState<Set<string>>(new Set(PROVIDERS))
  const [statuses, setStatuses] = useState<Set<NodeStatus>>(new Set(ALL_STATUSES))

  const filteredNodes = useMemo(() => {
    const q = query.trim().toLowerCase()
    return nodes.filter((node) => {
      if (!categories.has(node.category)) return false
      if (!providers.has(node.provider)) return false
      if (!statuses.has(node.status)) return false
      if (!q) return true
      const loc = node.location
      const locStr = [loc.campus, loc.city, loc.stateOrRegion, loc.country].filter(Boolean).join(' ')
      return (
        node.name.toLowerCase().includes(q) ||
        node.region.toLowerCase().includes(q) ||
        node.provider.toLowerCase().includes(q) ||
        locStr.toLowerCase().includes(q) ||
        node.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [nodes, query, categories, providers, statuses])

  const toggleCategory = (cat: NodeCategory) => {
    setCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      trackEvent({ type: 'filter_change', filter: `category:${cat}` })
      return next
    })
  }

  const toggleProvider = (provider: string) => {
    setProviders((prev) => {
      const next = new Set(prev)
      if (next.has(provider)) next.delete(provider)
      else next.add(provider)
      trackEvent({ type: 'filter_change', filter: `provider:${provider}` })
      return next
    })
  }

  const toggleStatus = (status: NodeStatus) => {
    setStatuses((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      trackEvent({ type: 'filter_change', filter: `status:${status}` })
      return next
    })
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    const q = value.trim().toLowerCase()
    if (q) {
      const count = nodes.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.region.toLowerCase().includes(q) ||
          n.provider.toLowerCase().includes(q)
      ).length
      trackEvent({ type: 'search', query: value, resultCount: count })
    }
  }

  const filterState: FilterState = { query, categories, providers, statuses }

  return {
    query,
    setQuery: handleSearch,
    categories,
    providers,
    statuses,
    filteredNodes,
    toggleCategory,
    toggleProvider,
    toggleStatus,
    filterState,
    allCategories: ALL_CATEGORIES,
    allStatuses: ALL_STATUSES,
  }
}