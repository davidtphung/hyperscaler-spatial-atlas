import type { NodeCategory, NodeStatus } from '../types'

export const CATEGORY_META: Record<
  NodeCategory,
  { label: string; color: string; description: string }
> = {
  compute: {
    label: 'Compute',
    color: '#3dd6c6',
    description: 'General-purpose and high-density compute regions',
  },
  storage: {
    label: 'Storage',
    color: '#7c8cff',
    description: 'Object, block, and archival storage clusters',
  },
  network: {
    label: 'Network',
    color: '#f0b429',
    description: 'Backbone hubs and inter-region transit points',
  },
  ai: {
    label: 'AI / ML',
    color: '#e879f9',
    description: 'GPU and accelerator training inference zones',
  },
  edge: {
    label: 'Edge',
    color: '#34d399',
    description: 'Low-latency edge and CDN presence nodes',
  },
}

export const STATUS_META: Record<
  NodeStatus,
  { label: string; color: string; pattern: 'solid' | 'pulse' | 'dashed' }
> = {
  operational: { label: 'Operational', color: '#34d399', pattern: 'solid' },
  expanding: { label: 'Expanding', color: '#3dd6c6', pattern: 'pulse' },
  planned: { label: 'Planned', color: '#94a3b8', pattern: 'dashed' },
  maintenance: { label: 'Maintenance', color: '#f0b429', pattern: 'pulse' },
}

export const PROVIDERS = ['AWS', 'Azure', 'GCP', 'Oracle', 'Meta', 'CoreWeave'] as const