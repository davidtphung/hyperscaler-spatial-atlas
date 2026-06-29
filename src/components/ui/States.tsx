export function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-8"
      role="status"
      aria-label="Loading spatial data"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)] motion-reduce:animate-none motion-reduce:border-[var(--accent)]" />
      <p className="text-sm text-[var(--text-secondary)]">Loading infrastructure map…</p>
    </div>
  )
}

export function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center" role="status">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50">
        <span className="text-2xl opacity-40" aria-hidden>◎</span>
      </div>
      <h3 className="text-base font-medium text-[var(--text-primary)]">No regions match</h3>
      <p className="max-w-xs text-sm text-[var(--text-secondary)]">
        {query
          ? `No results for "${query}". Try adjusting filters or search terms.`
          : 'All filters are off. Enable at least one category or provider.'}
      </p>
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center" role="alert">
      <h3 className="text-base font-medium text-[var(--text-primary)]">Unable to load map data</h3>
      <p className="max-w-xs text-sm text-[var(--text-secondary)]">
        Something went wrong while loading the spatial layer.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-xl bg-[var(--accent)]/15 px-4 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Retry
        </button>
      )}
    </div>
  )
}