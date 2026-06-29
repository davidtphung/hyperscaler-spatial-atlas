import { useEffect, useMemo, useState } from 'react'
import type { SpatialNode, LivePowerSnapshot, EnergySourceType } from '../types'
import { getEnergyPortfolio } from '../data/nodeProfiles'

const TREND_LEN = 24

function hashSeed(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i)
  return Math.abs(h)
}

function utilizationCurve(node: SpatialNode, t: number): number {
  const hour = new Date(t).getUTCHours()
  const dayWave = 0.5 + 0.5 * Math.sin(((hour - 6) / 24) * Math.PI * 2)
  const seed = hashSeed(node.id) % 1000
  const noise = Math.sin(t / 8000 + seed) * 0.04 + Math.sin(t / 2300 + seed * 2) * 0.02

  const categoryBase: Record<SpatialNode['category'], number> = {
    ai: 0.78,
    compute: 0.62,
    storage: 0.45,
    network: 0.55,
    edge: 0.7,
  }

  const statusMod: Record<SpatialNode['status'], number> = {
    operational: 1,
    expanding: 0.85,
    maintenance: 0.55,
    planned: 0.05,
  }

  const base = categoryBase[node.category] * statusMod[node.status]
  return Math.min(0.98, Math.max(0.05, base * (0.85 + dayWave * 0.15) + noise))
}

function computeSnapshot(node: SpatialNode, t: number, prevTrend: number[]): LivePowerSnapshot {
  const portfolio = getEnergyPortfolio(node)
  const util = utilizationCurve(node, t)
  const itLoadMW = node.infrastructure.powerMW * util
  const facilityInputMW = itLoadMW * portfolio.pue

  const bySourceMW = {} as Record<EnergySourceType, number>
  for (const s of portfolio.sources) {
    bySourceMW[s.type] = (facilityInputMW * s.sharePct) / 100
  }

  const trend = [...prevTrend.slice(-(TREND_LEN - 1)), Math.round(itLoadMW)]

  return {
    timestamp: t,
    itLoadMW,
    facilityInputMW,
    utilizationPct: Math.round(util * 100),
    bySourceMW,
    trend,
    isLive: true,
    sourceLabel: `Modeled live feed · ${portfolio.gridRegion ?? 'GLOBAL'} grid region`,
  }
}

export function useLivePower(node: SpatialNode | null, enabled = true): LivePowerSnapshot | null {
  const [snap, setSnap] = useState<LivePowerSnapshot | null>(null)

  const nodeId = node?.id

  useEffect(() => {
    if (!node || !enabled) {
      setSnap(null)
      return
    }

    let trend: number[] = []
    const tick = () => {
      const t = Date.now()
      setSnap((prev) => {
        trend = prev?.trend ?? trend
        return computeSnapshot(node, t, trend)
      })
    }

    tick()
    const id = setInterval(tick, 2000)
    return () => clearInterval(id)
  }, [nodeId, enabled, node])

  return snap
}

export function useNodesLivePower(
  nodes: SpatialNode[],
  enabled = true
): Record<string, LivePowerSnapshot> {
  const [byId, setById] = useState<Record<string, LivePowerSnapshot>>({})

  const nodeKey = useMemo(() => nodes.map((n) => n.id).join(','), [nodes])

  useEffect(() => {
    if (!enabled || nodes.length === 0) {
      setById({})
      return
    }

    const trends: Record<string, number[]> = {}

    const tick = () => {
      const t = Date.now()
      const next: Record<string, LivePowerSnapshot> = {}
      for (const node of nodes) {
        next[node.id] = computeSnapshot(node, t, trends[node.id] ?? [])
        trends[node.id] = next[node.id].trend
      }
      setById(next)
    }

    tick()
    const id = setInterval(tick, 2000)
    return () => clearInterval(id)
  }, [nodeKey, enabled, nodes])

  return byId
}

export function useFleetLivePower(nodes: SpatialNode[], enabled = true): LivePowerSnapshot | null {
  const [snap, setSnap] = useState<LivePowerSnapshot | null>(null)

  useEffect(() => {
    if (!enabled || nodes.length === 0) {
      setSnap(null)
      return
    }

    const tick = () => {
      const t = Date.now()
      let itTotal = 0
      let facilityTotal = 0
      const bySource = {} as Record<EnergySourceType, number>
      const trends: number[] = []

      for (const node of nodes) {
        const s = computeSnapshot(node, t, [])
        itTotal += s.itLoadMW
        facilityTotal += s.facilityInputMW
        trends.push(s.itLoadMW)
        for (const [k, v] of Object.entries(s.bySourceMW)) {
          const key = k as EnergySourceType
          bySource[key] = (bySource[key] ?? 0) + v
        }
      }

      setSnap((prev) => ({
        timestamp: t,
        itLoadMW: itTotal,
        facilityInputMW: facilityTotal,
        utilizationPct: Math.round(
          (itTotal / nodes.reduce((a, n) => a + n.infrastructure.powerMW, 0)) * 100
        ),
        bySourceMW: bySource,
        trend: [...(prev?.trend ?? []).slice(-(TREND_LEN - 1)), Math.round(itTotal)],
        isLive: true,
        sourceLabel: 'Fleet aggregate · modeled live',
      }))
    }

    tick()
    const id = setInterval(tick, 2000)
    return () => clearInterval(id)
  }, [nodes, enabled])

  return snap
}