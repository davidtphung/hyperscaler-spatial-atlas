import type { SpatialNode, EnergyPortfolio, ComputeProfile, EnergySourceType } from '../types'
import { providerToCompany } from './commitments'

const ENERGY_COLORS: Record<EnergySourceType, string> = {
  renewable: '#34d399',
  nuclear: '#e879f9',
  gas: '#f0b429',
  geothermal: '#f97316',
  hydro: '#3dd6c6',
  grid: '#94a3b8',
  fuel_cells: '#7c8cff',
}

export const ENERGY_SOURCE_META: Record<
  EnergySourceType,
  { label: string; color: string }
> = {
  renewable: { label: 'Wind / solar PPA', color: ENERGY_COLORS.renewable },
  nuclear: { label: 'Nuclear', color: ENERGY_COLORS.nuclear },
  gas: { label: 'Natural gas', color: ENERGY_COLORS.gas },
  geothermal: { label: 'Geothermal', color: ENERGY_COLORS.geothermal },
  hydro: { label: 'Hydro', color: ENERGY_COLORS.hydro },
  grid: { label: 'Regional grid mix', color: ENERGY_COLORS.grid },
  fuel_cells: { label: 'Fuel cells', color: ENERGY_COLORS.fuel_cells },
}

const GRID_REGIONS: Record<string, string> = {
  'United States': 'US-MIX',
  Virginia: 'PJM',
  Oregon: 'BPA',
  Iowa: 'MISO',
  Ohio: 'PJM',
  Nevada: 'CAISO',
  Arizona: 'WECC',
  Texas: 'ERCOT',
  Ireland: 'EU-IE',
  Germany: 'EU-DE',
  Sweden: 'EU-SE',
  'United Kingdom': 'EU-UK',
  Japan: 'AP-JP',
  Singapore: 'AP-SG',
  India: 'AP-IN',
  Brazil: 'SA-BR',
  Bahrain: 'ME-BH',
  'South Africa': 'AF-ZA',
  'South Korea': 'AP-KR',
}

const NODE_ENERGY_OVERRIDES: Partial<Record<string, EnergyPortfolio['sources']>> = {
  'us-east-1': [
    { type: 'grid', sharePct: 42, label: 'PJM grid' },
    { type: 'renewable', sharePct: 28, label: 'Wind/solar PPA' },
    { type: 'nuclear', sharePct: 18, label: 'Susquehanna adjacent' },
    { type: 'gas', sharePct: 12, label: 'Peaker / backup' },
  ],
  'us-west-2': [
    { type: 'hydro', sharePct: 45, label: 'Columbia River hydro' },
    { type: 'renewable', sharePct: 35, label: 'Wind PPA' },
    { type: 'grid', sharePct: 20, label: 'BPA surplus' },
  ],
  'eu-north-1': [
    { type: 'renewable', sharePct: 55, label: 'Nordic wind' },
    { type: 'hydro', sharePct: 35, label: 'Hydro backup' },
    { type: 'grid', sharePct: 10, label: 'Nord Pool' },
  ],
  'meta-lulea': [
    { type: 'renewable', sharePct: 50, label: 'Nordic wind' },
    { type: 'hydro', sharePct: 40, label: 'Arctic hydro' },
    { type: 'grid', sharePct: 10, label: 'Residual grid' },
  ],
  'ai-us-west': [
    { type: 'gas', sharePct: 35, label: 'Desert gas peakers' },
    { type: 'grid', sharePct: 30, label: 'WECC grid' },
    { type: 'renewable', sharePct: 25, label: 'Solar PPA' },
    { type: 'nuclear', sharePct: 10, label: 'Regional nuclear' },
  ],
  'gcp-us-central': [
    { type: 'renewable', sharePct: 40, label: 'Wind PPA (Iowa)' },
    { type: 'grid', sharePct: 35, label: 'MISO grid' },
    { type: 'gas', sharePct: 15, label: 'Gas backup' },
    { type: 'fuel_cells', sharePct: 10, label: 'Bloom-class fuel cells' },
  ],
  'oracle-phoenix': [
    { type: 'gas', sharePct: 40, label: 'Southwest gas' },
    { type: 'grid', sharePct: 35, label: 'WECC grid' },
    { type: 'renewable', sharePct: 25, label: 'Solar PPA' },
  ],
  'ap-northeast-1': [
    { type: 'grid', sharePct: 50, label: 'Japan grid' },
    { type: 'renewable', sharePct: 25, label: 'Offshore wind PPA' },
    { type: 'gas', sharePct: 15, label: 'LNG backup' },
    { type: 'nuclear', sharePct: 10, label: 'Regional nuclear' },
  ],
  'edge-iad': [
    { type: 'grid', sharePct: 55, label: 'PJM grid' },
    { type: 'renewable', sharePct: 30, label: 'Virginia solar/wind' },
    { type: 'gas', sharePct: 15, label: 'Peaker' },
  ],
}

const NODE_COMPUTE_OVERRIDES: Partial<Record<string, Partial<ComputeProfile>>> = {
  'us-east-1': {
    primaryWorkloads: ['EC2 compute', 'RDS databases', 'GovCloud', 'S3 hot tier'],
    dataTypes: ['Enterprise VMs', 'Object storage', 'Audit logs', 'Encrypted volumes'],
    accelerators: ['Inferentia2', 'Graviton4'],
    dominantWorkload: 'General compute & gov workloads',
  },
  'ai-us-west': {
    primaryWorkloads: ['LLM training', 'H200 inference', 'Fine-tuning'],
    dataTypes: ['Model checkpoints', 'Token streams', 'Embedding caches', 'RLHF datasets'],
    accelerators: ['NVIDIA H200', 'H100 SXM'],
    dominantWorkload: 'GPU LLM training',
  },
  'gcp-us-central': {
    primaryWorkloads: ['Gemini inference', 'TPU training', 'BigQuery analytics'],
    dataTypes: ['Tensor datasets', 'Feature stores', 'Model artifacts', 'Log analytics'],
    accelerators: ['TPU v5e', 'T4 inference'],
    dominantWorkload: 'TPU / Gemini stack',
  },
  'ap-northeast-1': {
    primaryWorkloads: ['H100 training clusters', 'Financial inference', 'Earthquake-resilient DR'],
    dataTypes: ['GPU tensors', 'Market tick data', 'Model registries', 'Time-series'],
    accelerators: ['NVIDIA H100', 'Trainium'],
    dominantWorkload: 'AI training (APAC)',
  },
  'us-west-2': {
    primaryWorkloads: ['S3 object store', 'Glacier archival', 'Cross-region replication'],
    dataTypes: ['Cold objects', 'Backup images', 'Tape-class archives', 'Logs'],
    accelerators: ['Storage-optimized ASIC'],
    dominantWorkload: 'Object & cold storage',
  },
  'edge-iad': {
    primaryWorkloads: ['CDN edge cache', 'Real-time social graph', 'Video segments'],
    dataTypes: ['Media blobs', 'Graph edges', 'Live streams', 'Session state'],
    accelerators: ['Video transcode ASIC'],
    dominantWorkload: 'Edge CDN & realtime',
  },
  'eu-west-1': {
    primaryWorkloads: ['Transatlantic transit', 'GDPR compute', 'Peering hub'],
    dataTypes: ['Packet flows', 'DNS records', 'Encrypted payloads', 'Compliance logs'],
    accelerators: ['SmartNIC / DPU'],
    dominantWorkload: 'Network transit',
  },
}

function defaultCompute(node: SpatialNode): ComputeProfile {
  const map: Record<SpatialNode['category'], ComputeProfile> = {
    ai: {
      primaryWorkloads: ['Model training', 'Batch inference', 'Embedding services'],
      dataTypes: ['GPU tensors', 'Model weights', 'Training shards', 'Prompt caches'],
      accelerators: ['GPU cluster', 'Custom AI ASIC'],
      dominantWorkload: 'AI / ML compute',
    },
    compute: {
      primaryWorkloads: ['Virtual machines', 'Kubernetes', 'Managed databases'],
      dataTypes: ['VM disks', 'Container images', 'SQL rows', 'Application logs'],
      accelerators: ['General-purpose CPU', 'Graviton/ARM'],
      dominantWorkload: 'General cloud compute',
    },
    storage: {
      primaryWorkloads: ['Object storage', 'Block volumes', 'Archival tiers'],
      dataTypes: ['Objects', 'Snapshots', 'Backups', 'Immutable archives'],
      accelerators: ['Erasure-coded storage'],
      dominantWorkload: 'Storage services',
    },
    network: {
      primaryWorkloads: ['Backbone transit', 'DNS', 'Load balancing', 'Peering'],
      dataTypes: ['Packets', 'Routing tables', 'Flow logs', 'TLS sessions'],
      accelerators: ['DPU / SmartNIC'],
      dominantWorkload: 'Network fabric',
    },
    edge: {
      primaryWorkloads: ['CDN cache', 'MEC compute', '5G core offload'],
      dataTypes: ['Cached assets', 'API responses', 'Telemetry', 'Session tokens'],
      accelerators: ['Edge ASIC', 'Low-latency NIC'],
      dominantWorkload: 'Edge delivery',
    },
  }
  const base = map[node.category]
  const override = NODE_COMPUTE_OVERRIDES[node.id]
  return override ? { ...base, ...override } : base
}

function defaultEnergy(node: SpatialNode): EnergyPortfolio {
  const region = node.location.stateOrRegion ?? node.location.country
  const gridRegion = GRID_REGIONS[region] ?? GRID_REGIONS[node.location.country] ?? 'GLOBAL'

  const override = NODE_ENERGY_OVERRIDES[node.id]
  if (override) {
    return {
      sources: override.map((s) => ({
        ...s,
        label: ENERGY_SOURCE_META[s.type].label,
      })),
      pue: node.category === 'ai' ? 1.12 : node.category === 'storage' ? 1.18 : 1.15,
      gridRegion,
    }
  }

  const company = providerToCompany(node.provider)
  let sources: EnergyPortfolio['sources']

  if (company === 'Google') {
    sources = [
      { type: 'renewable', sharePct: 48, label: ENERGY_SOURCE_META.renewable.label },
      { type: 'grid', sharePct: 32, label: ENERGY_SOURCE_META.grid.label },
      { type: 'geothermal', sharePct: 5, label: ENERGY_SOURCE_META.geothermal.label },
      { type: 'nuclear', sharePct: 8, label: ENERGY_SOURCE_META.nuclear.label },
      { type: 'gas', sharePct: 7, label: ENERGY_SOURCE_META.gas.label },
    ]
  } else if (company === 'Microsoft') {
    sources = [
      { type: 'renewable', sharePct: 40, label: ENERGY_SOURCE_META.renewable.label },
      { type: 'grid', sharePct: 35, label: ENERGY_SOURCE_META.grid.label },
      { type: 'nuclear', sharePct: 12, label: ENERGY_SOURCE_META.nuclear.label },
      { type: 'gas', sharePct: 10, label: ENERGY_SOURCE_META.gas.label },
      { type: 'fuel_cells', sharePct: 3, label: ENERGY_SOURCE_META.fuel_cells.label },
    ]
  } else if (company === 'Amazon') {
    sources = [
      { type: 'renewable', sharePct: 45, label: ENERGY_SOURCE_META.renewable.label },
      { type: 'grid', sharePct: 38, label: ENERGY_SOURCE_META.grid.label },
      { type: 'nuclear', sharePct: 10, label: ENERGY_SOURCE_META.nuclear.label },
      { type: 'gas', sharePct: 7, label: ENERGY_SOURCE_META.gas.label },
    ]
  } else {
    sources = [
      { type: 'grid', sharePct: 50, label: ENERGY_SOURCE_META.grid.label },
      { type: 'renewable', sharePct: 30, label: ENERGY_SOURCE_META.renewable.label },
      { type: 'gas', sharePct: 12, label: ENERGY_SOURCE_META.gas.label },
      { type: 'nuclear', sharePct: 8, label: ENERGY_SOURCE_META.nuclear.label },
    ]
  }

  return {
    sources,
    pue: node.category === 'ai' ? 1.1 : 1.2,
    gridRegion,
  }
}

export function getComputeProfile(node: SpatialNode): ComputeProfile {
  return defaultCompute(node)
}

export function getEnergyPortfolio(node: SpatialNode): EnergyPortfolio {
  return defaultEnergy(node)
}

export function getDominantEnergySource(node: SpatialNode): EnergySourceType {
  const portfolio = getEnergyPortfolio(node)
  return portfolio.sources.reduce((a, b) => (b.sharePct > a.sharePct ? b : a)).type
}