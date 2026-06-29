import { useCallback, useRef, useState } from 'react'
import type { ViewportState } from '../types'
import {
  clampScale,
  DEFAULT_VIEWPORT,
  fitAllNodes,
  focusOnNode,
} from '../utils/spatial'
import type { SpatialNode } from '../types'
import { trackEvent } from '../utils/analytics'

interface UseSpatialNavigationOptions {
  canvasWidth: number
  canvasHeight: number
  nodes: SpatialNode[]
}

export function useSpatialNavigation({
  canvasWidth,
  canvasHeight,
  nodes,
}: UseSpatialNavigationOptions) {
  const [viewport, setViewport] = useState<ViewportState>(DEFAULT_VIEWPORT)
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)

  const panBy = useCallback((dx: number, dy: number) => {
    setViewport((v) => {
      const next = { ...v, x: v.x + dx, y: v.y + dy }
      trackEvent({ type: 'pan', x: next.x, y: next.y })
      return next
    })
  }, [])

  const zoomBy = useCallback((delta: number, originX?: number, originY?: number) => {
    setViewport((v) => {
      const newScale = clampScale(v.scale * (1 + delta))
      if (originX == null || originY == null) {
        trackEvent({ type: 'zoom', scale: newScale })
        return { ...v, scale: newScale }
      }
      const scaleRatio = newScale / v.scale
      const next = {
        scale: newScale,
        x: originX - (originX - v.x) * scaleRatio,
        y: originY - (originY - v.y) * scaleRatio,
      }
      trackEvent({ type: 'zoom', scale: newScale })
      return next
    })
  }, [])

  const resetView = useCallback(() => {
    const next = fitAllNodes(nodes, canvasWidth, canvasHeight)
    setViewport(next)
    trackEvent({ type: 'reset_view' })
  }, [nodes, canvasWidth, canvasHeight])

  const focusNode = useCallback(
    (node: SpatialNode) => {
      setViewport(focusOnNode(node, canvasWidth, canvasHeight))
    },
    [canvasWidth, canvasHeight]
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: viewport.x,
        origY: viewport.y,
      }
    },
    [viewport.x, viewport.y]
  )

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setViewport((v) => ({
      ...v,
      x: dragRef.current!.origX + dx,
      y: dragRef.current!.origY + dy,
    }))
  }, [])

  const onPointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const originX = e.clientX - rect.left
      const originY = e.clientY - rect.top
      const delta = e.deltaY > 0 ? -0.08 : 0.08
      zoomBy(delta, originX, originY)
    },
    [zoomBy]
  )

  return {
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
  }
}