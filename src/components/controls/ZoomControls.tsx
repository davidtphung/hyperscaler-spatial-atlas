import { ZoomInIcon, ZoomOutIcon, ResetIcon } from '../icons'
import { IconButton } from '../ui/IconButton'

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  scale: number
}

export function ZoomControls({ onZoomIn, onZoomOut, onReset, scale }: ZoomControlsProps) {
  return (
    <div
      className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-1.5 backdrop-blur-md"
      role="group"
      aria-label="Zoom controls"
    >
      <IconButton label="Zoom in" onClick={onZoomIn}>
        <ZoomInIcon />
      </IconButton>
      <IconButton label="Zoom out" onClick={onZoomOut}>
        <ZoomOutIcon />
      </IconButton>
      <div className="mx-1 my-0.5 h-px bg-[var(--border)]" aria-hidden />
      <IconButton label="Reset view to fit all regions" onClick={onReset}>
        <ResetIcon />
      </IconButton>
      <span className="px-1 py-1 text-center font-mono text-[10px] text-[var(--text-tertiary)]" aria-hidden>
        {Math.round(scale * 100)}%
      </span>
    </div>
  )
}