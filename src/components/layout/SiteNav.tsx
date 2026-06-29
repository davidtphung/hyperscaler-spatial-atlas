import clsx from 'clsx'
import type { AppRoute } from '../../utils/routes'
import { routeHref } from '../../utils/routes'

const LINKS: { route: AppRoute; label: string }[] = [
  { route: 'map', label: 'Map' },
  { route: 'sources', label: 'Data sources' },
  { route: 'about', label: 'About' },
]

interface SiteNavProps {
  current: AppRoute
  compact?: boolean
}

export function SiteNav({ current, compact }: SiteNavProps) {
  return (
    <nav aria-label="Site" className={clsx('flex items-center gap-1', compact ? 'text-xs' : 'text-sm')}>
      {LINKS.map((link) => {
        const active = current === link.route
        return (
          <a
            key={link.route}
            href={routeHref(link.route)}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'min-h-[36px] rounded-lg px-3 py-2 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
              active
                ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {link.label}
          </a>
        )
      })}
    </nav>
  )
}