import clsx from 'clsx'
import { CATEGORY_META, STATUS_META } from '../../data/categories'
import { getComputeProfile, getDominantEnergySource, ENERGY_SOURCE_META } from '../../data/nodeProfiles'
import type { MapViewMode, SpatialNode } from '../../types'
import { formatPower } from '../../utils/metrics'

interface NodeMarkerProps {
  node: SpatialNode
  x: number
  y: number
  isSelected: boolean
  isHovered: boolean
  isDimmed: boolean
  viewMode: MapViewMode
  liveMW?: number
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
  viewMode,
  liveMW,
  onSelect,
  onHover,
  reducedMotion,
  tabIndex,
}: NodeMarkerProps) {
  const category = CATEGORY_META[node.category]
  const status = STATUS_META[node.status]
  const active = isSelected || isHovered

  const markerColor =
    viewMode === 'energy'
      ? ENERGY_SOURCE_META[getDominantEnergySource(node)].color
      : category.color

  const computeProfile = viewMode === 'compute' ? getComputeProfile(node) : null
  const sublabel =
    viewMode === 'energy' && liveMW != null
      ? formatPower(liveMW)
      : viewMode === 'compute' && computeProfile
        ? computeProfile.dominantWorkload.length > 22
          ? computeProfile.dominantWorkload.slice(0, 20) + '…'
          : computeProfile.dominantWorkload
        : null

  const radius = active ? 8 : 6
  const label = node.name.length > 32 ? node.name.slice(0, 30) + '…' : node.name
  const labelWidth = Math.max((sublabel ? label.length + sublabel.length : label.length) * 6 + 20, 90)

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={clsx('cursor-pointer', isDimmed && 'opacity-35')}
      role="button"
      tabIndex={tabIndex}
      aria-label={`${node.name}, ${node.provider}, ${status.label}${liveMW != null ? `, ${formatPower(liveMW)} live` : ''}`}
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
          fill={markerColor}
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
        stroke={markerColor}
        strokeWidth={isSelected ? 3 : 2}
        strokeDasharray={node.status === 'planned' ? '3 2' : undefined}
        opacity={node.status === 'planned' ? 0.7 : 1}
      />

      <circle r={3} fill={markerColor} stroke="var(--marker-fill)" strokeWidth={1} />

      {active && (
        <g transform={`translate(0, ${sublabel ? -30 : -22})`}>
          <rect
            x={-labelWidth / 2}
            y={-14}
            width={labelWidth}
            height={sublabel ? 34 : 22}
            rx={5}
            fill="var(--label-bg)"
            stroke={markerColor}
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
          {sublabel && (
            <text
              textAnchor="middle"
              y={16}
              fill="var(--text-secondary)"
              fontSize={9}
              fontFamily="ui-monospace, monospace"
            >
              {sublabel}
            </text>
          )}
        </g>
      )}
    </g>
  )
}