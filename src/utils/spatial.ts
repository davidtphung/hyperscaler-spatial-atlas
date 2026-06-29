import type { SpatialNode, ViewportState } from '../types'
import { getNodeMapPosition, MAP_HEIGHT, MAP_WIDTH } from './geo'

export const MIN_SCALE = 0.5
export const MAX_SCALE = 5
export const DEFAULT_VIEWPORT: ViewportState = { x: 0, y: 0, scale: 1 }

export function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

function nodeToCanvas(node: SpatialNode): [number, number] {
  return getNodeMapPosition(node)
}

export function nodeToScreen(
  node: SpatialNode,
  viewport: ViewportState,
  canvasWidth: number,
  canvasHeight: number
): { sx: number; sy: number } {
  const [worldX, worldY] = nodeToCanvas(node)
  const scaleX = canvasWidth / MAP_WIDTH
  const scaleY = canvasHeight / MAP_HEIGHT
  const x = worldX * scaleX
  const y = worldY * scaleY
  return {
    sx: x * viewport.scale + viewport.x,
    sy: y * viewport.scale + viewport.y,
  }
}

export function focusOnNode(
  node: SpatialNode,
  canvasWidth: number,
  canvasHeight: number,
  targetScale = 2.2
): ViewportState {
  const scale = clampScale(targetScale)
  const [worldX, worldY] = nodeToCanvas(node)
  const scaleX = canvasWidth / MAP_WIDTH
  const scaleY = canvasHeight / MAP_HEIGHT
  const x = worldX * scaleX
  const y = worldY * scaleY
  return {
    scale,
    x: canvasWidth / 2 - x * scale,
    y: canvasHeight / 2 - y * scale,
  }
}

export function fitAllNodes(
  nodes: SpatialNode[],
  canvasWidth: number,
  canvasHeight: number,
  padding = 48
): ViewportState {
  if (nodes.length === 0) return DEFAULT_VIEWPORT

  const scaleX = canvasWidth / MAP_WIDTH
  const scaleY = canvasHeight / MAP_HEIGHT
  const positions = nodes.map((n) => {
    const [wx, wy] = nodeToCanvas(n)
    return [wx * scaleX, wy * scaleY] as [number, number]
  })

  const xs = positions.map(([x]) => x)
  const ys = positions.map(([, y]) => y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const contentW = maxX - minX + padding * 2
  const contentH = maxY - minY + padding * 2
  const scale = clampScale(
    Math.min(canvasWidth / contentW, canvasHeight / contentH, 1.2)
  )

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  return {
    scale,
    x: canvasWidth / 2 - centerX * scale,
    y: canvasHeight / 2 - centerY * scale,
  }
}

/** Fit the entire world map in the viewport. */
export function fitWorldMap(canvasWidth: number, canvasHeight: number): ViewportState {
  const scale = clampScale(
    Math.min(canvasWidth / MAP_WIDTH, canvasHeight / MAP_HEIGHT) * 0.95
  )
  const mapDisplayW = MAP_WIDTH * scale
  const mapDisplayH = MAP_HEIGHT * scale
  return {
    scale,
    x: (canvasWidth - mapDisplayW) / 2,
    y: (canvasHeight - mapDisplayH) / 2,
  }
}