import clsx from 'clsx'
import { CATEGORY_META } from '../../data/categories'
import type { NodeCategory } from '../../types'

interface CategoryTogglesProps {
  active: Set<NodeCategory>
  onToggle: (cat: NodeCategory) => void
  compact?: boolean
}

export function CategoryToggles({ active, onToggle, compact }: CategoryTogglesProps) {
  const categories = Object.keys(CATEGORY_META) as NodeCategory[]

  return (
    <div
      className={clsx('flex gap-1.5', compact ? 'flex-wrap' : 'flex-row flex-wrap')}
      role="group"
      aria-label="Filter by category"
    >
      {categories.map((cat) => {
        const meta = CATEGORY_META[cat]
        const isActive = active.has(cat)
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onToggle(cat)}
            aria-pressed={isActive}
            className={clsx(
              'inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
              isActive
                ? 'border-transparent text-[var(--text-primary)]'
                : 'border-[var(--border)] bg-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            )}
            style={
              isActive
                ? { backgroundColor: `${meta.color}18`, borderColor: `${meta.color}40`, color: meta.color }
                : undefined
            }
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: isActive ? meta.color : 'var(--text-tertiary)' }}
              aria-hidden
            />
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}