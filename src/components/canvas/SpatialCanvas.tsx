import { useCallback, useEffect, useRef, useState } from 'react'
import type { SpatialNode, ViewportState } from '../../types'
import { NodeMarker } from './NodeMarker'
import { announce } from '../../utils/a11y'

interface SpatialCanvasProps {
  nodes: SpatialNode[]
  viewport: ViewportState
  selectedId: string | null
  hoveredId: string | null
  onSelect: (node: SpatialNode) => void
  onHover: (node: SpatialNode | null) => void
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onWheel: (e: React.WheelEvent) => void
  reducedMotion: boolean
  isEmpty: boolean
}

const CANVAS_W = 1000
const CANVAS_H = 500

export function SpatialCanvas({
  nodes,
  viewport,
  selectedId,
  hoveredId,
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
      className="relative h-full w-full touch-none overflow-hidden bg-[var(--canvas-bg)]"
      role="application"
      aria-label="Interactive infrastructure map. Use arrow keys to pan, plus and minus to zoom, Tab to navigate nodes."
    >
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />

      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 30%, var(--canvas-bg) 85%)',
        }}
        aria-hidden
      />

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
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Simplified world outline */}
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="var(--grid-dot)" />
          </pattern>
        </defs>

        <g transform={transform}>
          {/* World map silhouette - abstract continents */}
          <rect width={CANVAS_W} height={CANVAS_H} fill="url(#dots)" opacity={0.4} />
          <path
            d="M80,120 Q120,80 200,100 T350,90 Q420,85 480,110 T600,95 Q700,80 780,100 T920,115 L920,200 Q850,220 750,210 T550,225 Q400,240 280,220 T100,210 Z
               M60,260 Q150,250 250,270 T450,280 Q580,275 700,290 T900,285 L900,350 Q800,370 650,360 T400,375 Q250,385 120,370 Z
               M520,320 Q600,310 680,330 T820,325 Q860,340 880,380 T750,400 Q650,410 560,395 Z"
            fill="var(--land-fill)"
            stroke="var(--land-stroke)"
            strokeWidth={0.5}
            opacity={0.5}
          />

          {/* Connection lines between related nodes */}
          {nodes.map((node) =>
            node.relatedIds
              .filter((rid) => nodes.some((n) => n.id === rid))
              .map((rid) => {
                const related = nodes.find((n) => n.id === rid)
                if (!related) return null
                return (
                  <line
                    key={`${node.id}-${rid}`}
                    x1={(node.x / 100) * CANVAS_W}
                    y1={(node.y / 100) * CANVAS_H}
                    x2={(related.x / 100) * CANVAS_W}
                    y2={(related.y / 100) * CANVAS_H}
                    stroke="var(--connection-line)"
                    strokeWidth={0.5}
                    strokeDasharray="4 6"
                    opacity={0.4}
                  />
                )
              })
          )}

          {/* Equator / prime meridian */}
          <line x1={0} y1={CANVAS_H / 2} x2={CANVAS_W} y2={CANVAS_H / 2} stroke="var(--grid-line)" strokeWidth={0.5} opacity={0.3} />
          <line x1={CANVAS_W / 2} y1={0} x2={CANVAS_W / 2} y2={CANVAS_H} stroke="var(--grid-line)" strokeWidth={0.5} opacity={0.3} />

          {/* Nodes */}
          {nodes.map((node) => {
            const x = (node.x / 100) * CANVAS_W
            const y = (node.y / 100) * CANVAS_H
            const isSelected = selectedId === node.id
            const isHovered = hoveredId === node.id
            const isDimmed = hoveredId != null && !isHovered && !isSelected && selectedId != null

            return (
              <NodeMarker
                key={node.id}
                node={node}
                x={x}
                y={y}
                isSelected={isSelected}
                isHovered={isHovered}
                isDimmed={!!isDimmed}
                onSelect={handleSelect}
                onHover={onHover}
                reducedMotion={reducedMotion}
                tabIndex={0}
              />
            )
          })}
        </g>
      </svg>

      {/* Keyboard pan alternative buttons - visible on focus for a11y */}
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

export const SPATIAL_CANVAS_WIDTH = CANVAS_W
export const SPATIAL_CANVAS_HEIGHT = CANVAS_H