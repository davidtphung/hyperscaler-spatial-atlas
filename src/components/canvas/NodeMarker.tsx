import clsx from 'clsx'
import { CATEGORY_META, STATUS_META } from '../../data/categories'
import type { SpatialNode } from '../../types'

interface NodeMarkerProps {
  node: SpatialNode
  x: number
  y: number
  isSelected: boolean
  isHovered: boolean
  isDimmed: boolean
  onSelect: (node: SpatialNode) => void
  onHover: (node: SpatialNode | null) => void
  reducedMotion: boolean
  tabIndex: number
}

export function NodeMarker({
  node,
  x,
  y,
  isSelected,
  isHovered,
  isDimmed,
  onSelect,
  onHover,
  reducedMotion,
  tabIndex,
}: NodeMarkerProps) {
  const category = CATEGORY_META[node.category]
  const status = STATUS_META[node.status]
  const active = isSelected || isHovered
  const radius = active ? 7 : 5

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={clsx('cursor-pointer', isDimmed && 'opacity-30')}
      role="button"
      tabIndex={tabIndex}
      aria-label={`${node.name}, ${node.provider}, ${status.label}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(node)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(node)
        }
      }}
      onMouseEnter={() => onHover(node)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node)}
      onBlur={() => onHover(null)}
    >
      {/* Glow */}
      {active && (
        <circle
          r={radius + 8}
          fill={category.color}
          opacity={0.15}
          className={clsx(!reducedMotion && 'animate-pulse-soft')}
        />
      )}

      {/* Pulse ring for expanding/maintenance */}
      {(node.status === 'expanding' || node.status === 'maintenance') && !reducedMotion && (
        <circle
          r={radius + 4}
          fill="none"
          stroke={status.color}
          strokeWidth={1}
          opacity={0.5}
          className="animate-ping-slow"
        />
      )}

      {/* Outer ring */}
      <circle
        r={radius}
        fill="var(--canvas-bg)"
        stroke={category.color}
        strokeWidth={isSelected ? 2.5 : 1.5}
        strokeDasharray={node.status === 'planned' ? '3 2' : undefined}
        opacity={node.status === 'planned' ? 0.6 : 1}
      />

      {/* Core dot */}
      <circle r={2.5} fill={category.color} />

      {/* Label on hover/select */}
      {active && (
        <g transform="translate(0, -18)">
          <rect
            x={-node.name.length * 3.2}
            y={-12}
            width={node.name.length * 6.4}
            height={18}
            rx={4}
            fill="var(--surface)"
            stroke="var(--border)"
            strokeWidth={0.5}
            opacity={0.95}
          />
          <text
            textAnchor="middle"
            y={0}
            fill="var(--text-primary)"
            fontSize={10}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight={500}
          >
            {node.name.length > 28 ? node.name.slice(0, 26) + '…' : node.name}
          </text>
        </g>
      )}
    </g>
  )
}