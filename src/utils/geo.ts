import { geoEquirectangular, geoPath } from 'd3-geo'
import type { SpatialNode } from '../types'

export const MAP_WIDTH = 1000
export const MAP_HEIGHT = 500

const projection = geoEquirectangular()
  .scale(MAP_WIDTH / (2 * Math.PI))
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2])
  .precision(0.1)

export const mapPath = geoPath(projection)

/** Project WGS84 coordinates onto the equirectangular map canvas. */
export function projectLatLng(lat: number, lng: number): [number, number] {
  const point = projection([lng, lat])
  return point ?? [0, 0]
}

export function getNodeMapPosition(node: SpatialNode): [number, number] {
  return projectLatLng(node.lat, node.lng)
}

export function getGraticuleLines(): { type: 'lat' | 'lng'; value: number; path: string }[] {
  const lines: { type: 'lat' | 'lng'; value: number; path: string }[] = []

  for (let lat = -60; lat <= 60; lat += 30) {
    const pts: [number, number][] = []
    for (let lng = -180; lng <= 180; lng += 5) {
      pts.push(projectLatLng(lat, lng))
    }
    lines.push({
      type: 'lat',
      value: lat,
      path: `M${pts.map(([x, y]) => `${x},${y}`).join('L')}`,
    })
  }

  for (let lng = -150; lng <= 150; lng += 30) {
    const pts: [number, number][] = []
    for (let lat = -80; lat <= 80; lat += 5) {
      pts.push(projectLatLng(lat, lng))
    }
    lines.push({
      type: 'lng',
      value: lng,
      path: `M${pts.map(([x, y]) => `${x},${y}`).join('L')}`,
    })
  }

  return lines
}