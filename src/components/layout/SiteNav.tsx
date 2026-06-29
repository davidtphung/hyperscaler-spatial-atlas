import clsx from 'clsx'
import type { AppRoute } from '../../utils/routes'
import { routeHref } from '../../utils/routes'

const LINKS: { route: AppRoute; label: string; short?: string }[] = [
  { route: 'dashboard', label: 'Overview', short: 'Home' },
  { route: 'timeline', label: 'Timeline' },
  { route: 'map', label: 'Map' },
  { route: 'compare', label: 'Compare' },
  { route: 'forecasts', label: 'Forecasts' },
  { route: 'sources', label: 'Sources', short: 'Data' },
  { route: 'about', label: 'About' },
]

interface SiteNavProps {
  current: AppRoute
  compact?: boolean
}

export function SiteNav({ current, compact }: SiteNavProps) {
  return (
    <nav
      aria-label="Site"
      className={clsx(
        'flex items-center gap-0.5 overflow-x-auto',
        compact ? 'text-xs' : 'text-sm'
      )}
    >
      {LINKS.map((link) => {
        const active = current === link.route
        return (
          <a
            key={link.route}
            href={routeHref(link.route)}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'min-h-[36px] shrink-0 rounded-lg px-2.5 py-2 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
              active
                ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {compact && link.short ? link.short : link.label}
          </a>
        )
      })}
    </nav>
  )
}