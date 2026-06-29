import type { SpatialNode } from '../types'

export function formatPower(mw: number): string {
  if (mw >= 1000) return `${(mw / 1000).toFixed(1)} GW`
  if (mw === 0) return 'n/a'
  return `${mw.toLocaleString()} MW`
}

export function formatWatts(mw: number): string {
  if (mw === 0) return 'n/a'
  const watts = mw * 1_000_000
  if (watts >= 1_000_000_000) return `${(watts / 1_000_000_000).toFixed(2)}B W`
  if (watts >= 1_000_000) return `${(watts / 1_000_000).toFixed(0)}M W`
  return `${watts.toLocaleString()} W`
}

export function formatAcres(acres: number): string {
  if (acres === 0) return 'n/a'
  return `${acres.toLocaleString()} ac`
}

export function formatGpus(count: number): string {
  if (count === 0) return 'n/a'
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k GPUs`
  return `${count.toLocaleString()} GPUs`
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`
}

export function formatLocationAddress(loc: SpatialNode['location']): string {
  const parts = [loc.campus, loc.city]
  if (loc.stateOrRegion) parts.push(loc.stateOrRegion)
  parts.push(loc.country)
  return parts.join(', ')
}

export interface FleetBenchmarks {
  maxPowerMW: number
  maxLandAcres: number
  maxGpuCount: number
  totalPowerMW: number
  totalLandAcres: number
  totalGpus: number
}

export function getFleetBenchmarks(nodes: SpatialNode[]): FleetBenchmarks {
  const powers = nodes.map((n) => n.infrastructure.powerMW)
  const acres = nodes.map((n) => n.infrastructure.landAcres)
  const gpus = nodes.map((n) => n.infrastructure.gpuCount)
  return {
    maxPowerMW: Math.max(...powers, 1),
    maxLandAcres: Math.max(...acres, 1),
    maxGpuCount: Math.max(...gpus, 1),
    totalPowerMW: powers.reduce((a, b) => a + b, 0),
    totalLandAcres: acres.reduce((a, b) => a + b, 0),
    totalGpus: gpus.reduce((a, b) => a + b, 0),
  }
}

export function pctOfMax(value: number, max: number): number {
  if (max <= 0 || value <= 0) return 0
  return Math.min(100, Math.round((value / max) * 100))
}