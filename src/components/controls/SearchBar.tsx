import { useId } from 'react'
import { SearchIcon } from '../icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
  resultCount: number
}

export function SearchBar({ value, onChange, inputRef, resultCount }: SearchBarProps) {
  const id = useId()

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor={id} className="sr-only">
        Search regions, providers, and tags
      </label>
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search regions, providers, tags…"
        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 pl-10 pr-20 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] backdrop-blur-sm transition-colors focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        autoComplete="off"
        spellCheck={false}
      />
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--text-tertiary)]"
        aria-live="polite"
      >
        {resultCount} found
      </span>
    </div>
  )
}