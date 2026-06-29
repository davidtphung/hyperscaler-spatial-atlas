export type NodeCategory = 'compute' | 'storage' | 'network' | 'ai' | 'edge'

export type NodeStatus = 'operational' | 'expanding' | 'planned' | 'maintenance'

export type MapViewMode = 'standard' | 'energy' | 'compute'

export type EnergySourceType =
  | 'renewable'
  | 'nuclear'
  | 'gas'
  | 'geothermal'
  | 'hydro'
  | 'grid'
  | 'fuel_cells'

export interface EnergySourceShare {
  type: EnergySourceType
  sharePct: number
  label: string
}

export interface EnergyPortfolio {
  sources: EnergySourceShare[]
  pue: number
  gridRegion?: string
}

export interface ComputeProfile {
  primaryWorkloads: string[]
  dataTypes: string[]
  accelerators: string[]
  dominantWorkload: string
}

export interface LivePowerSnapshot {
  timestamp: number
  itLoadMW: number
  facilityInputMW: number
  utilizationPct: number
  bySourceMW: Record<EnergySourceType, number>
  trend: number[]
  isLive: boolean
  sourceLabel: string
}

export interface NodeLocation {
  city: string
  stateOrRegion?: string
  country: string
  campus: string
}

export interface NodeInfrastructure {
  /** Peak IT load in megawatts */
  powerMW: number
  /** Total campus land footprint in acres */
  landAcres: number
  /** Active GPU / accelerator count */
  gpuCount: number
  /** Building count on campus */
  buildings: number
}

export interface SpatialNode {
  id: string
  name: string
  region: string
  provider: string
  category: NodeCategory
  status: NodeStatus
  lat: number
  lng: number
  location: NodeLocation
  infrastructure: NodeInfrastructure
  summary: string
  capacity: string
  latency: string
  carbonIntensity: string
  tags: string[]
  relatedIds: string[]
  launched: string
}

export interface ViewportState {
  x: number
  y: number
  scale: number
}

export interface FilterState {
  query: string
  categories: Set<NodeCategory>
  providers: Set<string>
  statuses: Set<NodeStatus>
}

export type AnalyticsEvent =
  | { type: 'node_select'; nodeId: string }
  | { type: 'node_hover'; nodeId: string }
  | { type: 'search'; query: string; resultCount: number }
  | { type: 'filter_change'; filter: string }
  | { type: 'zoom'; scale: number }
  | { type: 'pan'; x: number; y: number }
  | { type: 'reset_view' }
  | { type: 'quick_jump'; nodeId: string }