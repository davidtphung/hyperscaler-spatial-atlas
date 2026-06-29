export type NodeCategory = 'compute' | 'storage' | 'network' | 'ai' | 'edge'

export type NodeStatus = 'operational' | 'expanding' | 'planned' | 'maintenance'

export interface SpatialNode {
  id: string
  name: string
  region: string
  provider: string
  category: NodeCategory
  status: NodeStatus
  lat: number
  lng: number
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