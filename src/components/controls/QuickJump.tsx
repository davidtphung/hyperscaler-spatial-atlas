import { QUICK_JUMP_TARGETS } from '../../data/nodes'

interface QuickJumpProps {
  onJump: (nodeId: string) => void
}

export function QuickJump({ onJump }: QuickJumpProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Quick jump to regions">
      <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-tertiary)]">
        Jump
      </span>
      {QUICK_JUMP_TARGETS.map((target) => (
        <button
          key={target.id}
          type="button"
          onClick={() => onJump(target.id)}
          className="min-h-[36px] rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          {target.label}
        </button>
      ))}
    </div>
  )
}