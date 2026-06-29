import { useCallback, useEffect, useRef, useState } from 'react'
import { SPATIAL_NODES } from './data/nodes'
import { useFilters } from './hooks/useFilters'
import { useIsMobile } from './hooks/useMediaQuery'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSpatialNavigation } from './hooks/useSpatialNavigation'
import { SpatialCanvas } from './components/canvas/SpatialCanvas'
import { Header } from './components/layout/Header'
import { DetailPanel } from './components/panels/DetailPanel'
import { ZoomControls } from './components/controls/ZoomControls'
import { Legend } from './components/controls/Legend'
import { QuickJump } from './components/controls/QuickJump'
import { BuilderCredit } from './components/layout/BuilderCredit'
import { EnergyCommitmentsPanel } from './components/panels/EnergyCommitmentsPanel'
import { EmptyState, LoadingState } from './components/ui/States'
import type { SpatialNode } from './types'
import { trackEvent } from './utils/analytics'
import { announce } from './utils/a11y'
import { fitWorldMap } from './utils/spatial'

function App() {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const searchRef = useRef<HTMLInputElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    query,
    setQuery,
    categories,
    filteredNodes,
    toggleCategory,
    allCategories: _allCategories,
  } = useFilters(SPATIAL_NODES)

  const {
    viewport,
    setViewport,
    panBy,
    zoomBy,
    resetView,
    focusNode,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
  } = useSpatialNavigation({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    nodes: filteredNodes,
  })

  const selectedNode = selectedId ? SPATIAL_NODES.find((n) => n.id === selectedId) ?? null : null
  const relatedNodes = selectedNode
    ? selectedNode.relatedIds
        .map((id) => SPATIAL_NODES.find((n) => n.id === id))
        .filter((n): n is SpatialNode => n != null)
    : []

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false)
      setViewport(fitWorldMap(canvasSize.width, canvasSize.height))
    }, 400)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Resize observer for canvas container
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setCanvasSize({ width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Deep link support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nodeId = params.get('node')
    if (nodeId) {
      const node = SPATIAL_NODES.find((n) => n.id === nodeId)
      if (node) {
        setSelectedId(nodeId)
        focusNode(node)
      }
    }
  }, [focusNode])

  const handleSelect = useCallback(
    (node: SpatialNode) => {
      setSelectedId(node.id)
      focusNode(node)
      trackEvent({ type: 'node_select', nodeId: node.id })
      const url = new URL(window.location.href)
      url.searchParams.set('node', node.id)
      window.history.replaceState({}, '', url)
    },
    [focusNode]
  )

  const handleClose = useCallback(() => {
    setSelectedId(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('node')
    window.history.replaceState({}, '', url)
    announce('Detail panel closed')
  }, [])

  const handleQuickJump = useCallback(
    (nodeId: string) => {
      const node = SPATIAL_NODES.find((n) => n.id === nodeId)
      if (node) {
        handleSelect(node)
        trackEvent({ type: 'quick_jump', nodeId })
      }
    },
    [handleSelect]
  )

  const handleHover = useCallback((node: SpatialNode | null) => {
    setHoveredId(node?.id ?? null)
    if (node) trackEvent({ type: 'node_hover', nodeId: node.id })
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

      if (e.key === '/' && !isInput) {
        e.preventDefault()
        searchRef.current?.focus()
        announce('Search focused')
        return
      }

      if (e.key === 'Escape') {
        if (selectedId) handleClose()
        else searchRef.current?.blur()
        return
      }

      if (isInput) return

      const panStep = e.shiftKey ? 80 : 40
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          panBy(0, panStep)
          break
        case 'ArrowDown':
          e.preventDefault()
          panBy(0, -panStep)
          break
        case 'ArrowLeft':
          e.preventDefault()
          panBy(panStep, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          panBy(-panStep, 0)
          break
        case '+':
        case '=':
          e.preventDefault()
          zoomBy(0.15, canvasSize.width / 2, canvasSize.height / 2)
          break
        case '-':
          e.preventDefault()
          zoomBy(-0.15, canvasSize.width / 2, canvasSize.height / 2)
          break
        case '0':
          e.preventDefault()
          resetView()
          announce('View reset to fit all regions')
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [panBy, zoomBy, resetView, selectedId, handleClose, canvasSize])

  // Pan button handlers for a11y
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const handler = (e: Event) => {
      const btn = (e.target as HTMLElement).closest('[data-pan]')
      if (!btn) return
      const dir = btn.getAttribute('data-pan')
      const step = 60
      if (dir === 'up') panBy(0, step)
      else if (dir === 'down') panBy(0, -step)
      else if (dir === 'left') panBy(step, 0)
      else if (dir === 'right') panBy(-step, 0)
    }
    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [panBy])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--canvas-bg)]">
        <LoadingState />
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div id="sr-announcer" className="sr-only" aria-live="polite" aria-atomic="true" />

      <Header
        searchQuery={query}
        onSearchChange={setQuery}
        searchRef={searchRef}
        resultCount={filteredNodes.length}
        activeCategories={categories}
        onToggleCategory={toggleCategory}
        totalNodes={SPATIAL_NODES.length}
        visibleNodes={filteredNodes.length}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((v) => !v)}
      />

      <div className="relative flex min-h-0 flex-1">
        {/* Main canvas area */}
        <div ref={mainRef} className="relative min-w-0 flex-1">
          {filteredNodes.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <EmptyState query={query} />
            </div>
          ) : (
            <SpatialCanvas
              nodes={filteredNodes}
              viewport={viewport}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={handleSelect}
              onHover={handleHover}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onWheel={onWheel}
              reducedMotion={reducedMotion}
              isEmpty={filteredNodes.length === 0}
            />
          )}

          {/* Floating controls */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 md:p-4">
            <div className="pointer-events-auto hidden max-w-xs flex-col gap-2 lg:flex">
              <QuickJump onJump={handleQuickJump} />
              <EnergyCommitmentsPanel />
            </div>

            <div className="flex items-end justify-between gap-3">
              <div className="pointer-events-auto flex flex-col gap-2">
                <div className="hidden md:block">
                  <Legend />
                </div>
                <BuilderCredit />
              </div>
              <div className="pointer-events-auto ml-auto">
                <ZoomControls
                  onZoomIn={() => zoomBy(0.15, canvasSize.width / 2, canvasSize.height / 2)}
                  onZoomOut={() => zoomBy(-0.15, canvasSize.width / 2, canvasSize.height / 2)}
                  onReset={resetView}
                  scale={viewport.scale}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop detail panel */}
        {!isMobile && (
          <DetailPanel
            node={selectedNode}
            relatedNodes={relatedNodes}
            onClose={handleClose}
            onSelectRelated={handleSelect}
            className="w-full max-w-lg shrink-0"
          />
        )}
      </div>

      {/* Mobile bottom sheet */}
      {isMobile && selectedNode && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden
          />
          <div className="fixed inset-x-0 bottom-0 z-40">
            <DetailPanel
              node={selectedNode}
              relatedNodes={relatedNodes}
              onClose={handleClose}
              onSelectRelated={handleSelect}
              isMobile
            />
          </div>
        </>
      )}

      {/* Keyboard shortcuts help - visually hidden but available to SR */}
      <div className="sr-only" role="region" aria-label="Keyboard shortcuts">
        <p>Press slash to focus search. Arrow keys to pan. Plus and minus to zoom. Zero to reset view. Escape to close panel.</p>
      </div>
    </div>
  )
}

export default App