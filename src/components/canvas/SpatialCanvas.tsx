import { useCallback, useEffect, useRef, useState } from 'react'
import type { MapViewMode, SpatialNode, ViewportState } from '../../types'
import { NodeMarker } from './NodeMarker'
import { WorldMap } from './WorldMap'
import { announce } from '../../utils/a11y'
import { getNodeMapPosition, MAP_HEIGHT, MAP_WIDTH } from '../../utils/geo'
import { useNodesLivePower } from '../../hooks/useLivePower'

interface SpatialCanvasProps {
  nodes: SpatialNode[]
  viewport: ViewportState
  selectedId: string | null
  hoveredId: string | null
  viewMode: MapViewMode
  onSelect: (node: SpatialNode) => void
  onHover: (node: SpatialNode | null) => void
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onWheel: (e: React.WheelEvent) => void
  reducedMotion: boolean
  isEmpty: boolean
}

export function SpatialCanvas({
  nodes,
  viewport,
  selectedId,
  hoveredId,
  viewMode,
  onSelect,
  onHover,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  reducedMotion,
  isEmpty,
}: SpatialCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const liveByNode = useNodesLivePower(nodes, viewMode === 'energy')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleSelect = useCallback(
    (node: SpatialNode) => {
      onSelect(node)
      announce(`Selected ${node.name}, ${node.provider}`)
    },
    [onSelect]
  )

  const transform = `translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full touch-none overflow-hidden bg-[var(--ocean-fill)]"
      role="application"
      aria-label="Interactive world map of cloud infrastructure. Use arrow keys to pan, plus and minus to zoom, Tab to navigate nodes."
    >
      <svg
        width={dimensions.width || '100%'}
        height={dimensions.height || '100%'}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        aria-hidden={isEmpty}
      >
        <g transform={transform}>
          <WorldMap />

          {/* Connection lines between related nodes */}
          {nodes.map((node) => {
            const [x1, y1] = getNodeMapPosition(node)
            return node.relatedIds
              .filter((rid) => nodes.some((n) => n.id === rid))
              .map((rid) => {
                const related = nodes.find((n) => n.id === rid)
                if (!related) return null
                const [x2, y2] = getNodeMapPosition(related)
                return (
                  <line
                    key={`${node.id}-${rid}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="var(--connection-line)"
                    strokeWidth={1}
                    strokeDasharray="4 6"
                    opacity={0.55}
                  />
                )
              })
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const [x, y] = getNodeMapPosition(node)
            const isSelected = selectedId === node.id
            const isHovered = hoveredId === node.id
            const isDimmed =
              hoveredId != null && !isHovered && !isSelected && selectedId != null

            const liveMW = liveByNode[node.id]?.itLoadMW

            return (
              <NodeMarker
                key={node.id}
                node={node}
                x={x}
                y={y}
                isSelected={isSelected}
                isHovered={isHovered}
                isDimmed={!!isDimmed}
                viewMode={viewMode}
                liveMW={viewMode === 'energy' ? liveMW : undefined}
                onSelect={handleSelect}
                onHover={onHover}
                reducedMotion={reducedMotion}
                tabIndex={0}
              />
            )
          })}
        </g>
      </svg>

      {/* Keyboard pan alternative buttons */}
      <div className="sr-only-focusable absolute bottom-4 left-4 flex gap-2" role="group" aria-label="Pan map with buttons">
        {(['up', 'down', 'left', 'right'] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            data-pan={dir}
            className="min-h-[44px] min-w-[44px] rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm focus:not-sr-only"
            aria-label={`Pan ${dir}`}
          >
            {dir === 'up' ? '↑' : dir === 'down' ? '↓' : dir === 'left' ? '←' : '→'}
          </button>
        ))}
      </div>
    </div>
  )
}

export const SPATIAL_CANVAS_WIDTH = MAP_WIDTH
export const SPATIAL_CANVAS_HEIGHT = MAP_HEIGHT