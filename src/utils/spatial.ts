import type { SpatialNode, ViewportState } from '../types'

export const MIN_SCALE = 0.4
export const MAX_SCALE = 4
export const DEFAULT_VIEWPORT: ViewportState = { x: 0, y: 0, scale: 1 }

export function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

export function nodeToScreen(
  node: SpatialNode,
  viewport: ViewportState,
  canvasWidth: number,
  canvasHeight: number
): { sx: number; sy: number } {
  const worldX = (node.x / 100) * canvasWidth
  const worldY = (node.y / 100) * canvasHeight
  return {
    sx: worldX * viewport.scale + viewport.x,
    sy: worldY * viewport.scale + viewport.y,
  }
}

export function focusOnNode(
  node: SpatialNode,
  canvasWidth: number,
  canvasHeight: number,
  targetScale = 1.8
): ViewportState {
  const scale = clampScale(targetScale)
  const worldX = (node.x / 100) * canvasWidth
  const worldY = (node.y / 100) * canvasHeight
  return {
    scale,
    x: canvasWidth / 2 - worldX * scale,
    y: canvasHeight / 2 - worldY * scale,
  }
}

export function fitAllNodes(
  nodes: SpatialNode[],
  canvasWidth: number,
  canvasHeight: number,
  padding = 48
): ViewportState {
  if (nodes.length === 0) return DEFAULT_VIEWPORT

  const xs = nodes.map((n) => (n.x / 100) * canvasWidth)
  const ys = nodes.map((n) => (n.y / 100) * canvasHeight)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const contentW = maxX - minX + padding * 2
  const contentH = maxY - minY + padding * 2
  const scale = clampScale(
    Math.min(canvasWidth / contentW, canvasHeight / contentH, 1.5)
  )

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  return {
    scale,
    x: canvasWidth / 2 - centerX * scale,
    y: canvasHeight / 2 - centerY * scale,
  }
}