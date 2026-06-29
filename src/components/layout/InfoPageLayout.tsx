import type { ReactNode } from 'react'
import type { AppRoute } from '../../utils/routes'
import { SiteNav } from './SiteNav'
import { BuilderCredit } from './BuilderCredit'
import { routeHref } from '../../utils/routes'

interface InfoPageLayoutProps {
  route: AppRoute
  title: string
  lede: string
  children: ReactNode
}

export function InfoPageLayout({ route, title, lede, children }: InfoPageLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col overflow-y-auto bg-[var(--canvas-bg)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5 md:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={routeHref('map')}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Hyperscaler Atlas
            </a>
            <SiteNav current={route} compact />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              {lede}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)]/50 px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <BuilderCredit />
          <SiteNav current={route} compact />
        </div>
      </footer>
    </div>
  )
}