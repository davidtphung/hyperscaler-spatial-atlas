const PROFILE_URL = 'https://x.com/davidtphung'

export function BuilderCredit() {
  return (
    <p className="text-xs text-[var(--text-tertiary)]">
      Built by{' '}
      <a
        href={PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="min-h-[44px] min-w-[44px] font-medium text-[var(--text-secondary)] underline decoration-[var(--border)] underline-offset-2 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        David T Phung
      </a>
    </p>
  )
}