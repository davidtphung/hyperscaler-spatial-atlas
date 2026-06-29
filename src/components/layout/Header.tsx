import { SearchBar } from '../controls/SearchBar'
import { CategoryToggles } from '../controls/CategoryToggles'
import { ViewModeToggle } from '../controls/ViewModeToggle'
import type { MapViewMode, NodeCategory } from '../../types'
import { formatPower } from '../../utils/metrics'
import type { LivePowerSnapshot } from '../../types'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  searchRef: React.RefObject<HTMLInputElement | null>
  resultCount: number
  activeCategories: Set<NodeCategory>
  onToggleCategory: (cat: NodeCategory) => void
  totalNodes: number
  visibleNodes: number
  showFilters: boolean
  onToggleFilters: () => void
  viewMode: MapViewMode
  onViewModeChange: (mode: MapViewMode) => void
  fleetPower?: LivePowerSnapshot | null
}

export function Header({
  searchQuery,
  onSearchChange,
  searchRef,
  resultCount,
  activeCategories,
  onToggleCategory,
  totalNodes,
  visibleNodes,
  showFilters,
  onToggleFilters,
  viewMode,
  onViewModeChange,
  fleetPower,
}: HeaderProps) {
  return (
    <header className="relative z-20 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Global Infrastructure Atlas
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl lg:text-4xl">
              Hyperscaler Atlas
            </h1>
            <p className="mt-1 max-w-lg text-base leading-relaxed text-[var(--text-secondary)]">
              Explore cloud regions, data centers, and network hubs on a real world map.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
            <div
              className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 px-3 py-2 sm:flex"
              role="status"
              aria-label={`Showing ${visibleNodes} of ${totalNodes} regions${fleetPower ? `, fleet IT load ${formatPower(fleetPower.itLoadMW)}` : ''}`}
            >
              <span className="h-2 w-2 animate-pulse-soft rounded-full bg-[var(--accent)] motion-reduce:animate-none" aria-hidden />
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                {visibleNodes}/{totalNodes} live
                {fleetPower && viewMode === 'energy' && (
                  <span className="ml-2 text-[var(--accent)]">
                    · {formatPower(fleetPower.itLoadMW)} IT
                  </span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleFilters}
              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--border)] px-3 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] lg:hidden"
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            inputRef={searchRef}
            resultCount={resultCount}
          />
          <div className="hidden lg:block">
            <CategoryToggles active={activeCategories} onToggle={onToggleCategory} />
          </div>
        </div>

        {(showFilters || typeof window !== 'undefined') && (
          <div
            id="filter-panel"
            className="lg:hidden"
            hidden={!showFilters}
          >
            <CategoryToggles active={activeCategories} onToggle={onToggleCategory} compact />
          </div>
        )}
      </div>
    </header>
  )
}