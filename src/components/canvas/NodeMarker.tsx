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
  const radius = active ? 8 : 6
  const label = node.name.length > 32 ? node.name.slice(0, 30) + '…' : node.name
  const labelWidth = Math.max(label.length * 6.5 + 16, 80)

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={clsx('cursor-pointer', isDimmed && 'opacity-35')}
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
      {active && (
        <circle
          r={radius + 10}
          fill={category.color}
          opacity={0.2}
          className={clsx(!reducedMotion && 'animate-pulse-soft')}
        />
      )}

      {(node.status === 'expanding' || node.status === 'maintenance') && !reducedMotion && (
        <circle
          r={radius + 5}
          fill="none"
          stroke={status.color}
          strokeWidth={1.5}
          opacity={0.6}
          className="animate-ping-slow"
        />
      )}

      <circle
        r={radius}
        fill="var(--marker-fill)"
        stroke={category.color}
        strokeWidth={isSelected ? 3 : 2}
        strokeDasharray={node.status === 'planned' ? '3 2' : undefined}
        opacity={node.status === 'planned' ? 0.7 : 1}
      />

      <circle r={3} fill={category.color} stroke="var(--marker-fill)" strokeWidth={1} />

      {active && (
        <g transform="translate(0, -22)">
          <rect
            x={-labelWidth / 2}
            y={-14}
            width={labelWidth}
            height={22}
            rx={5}
            fill="var(--label-bg)"
            stroke={category.color}
            strokeWidth={1}
            opacity={0.98}
          />
          <text
            textAnchor="middle"
            y={2}
            fill="var(--text-primary)"
            fontSize={11}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight={600}
          >
            {label}
          </text>
        </g>
      )}
    </g>
  )
}