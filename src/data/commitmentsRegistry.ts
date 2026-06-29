import researchData from './generated/researchData.json'
import type {
  CapexDataPoint,
  CommitmentCategory,
  CommitmentEra,
  CommitmentRecord,
  ComparisonMetric,
  ConfidenceLevel,
  ForecastScenario,
  SourceType,
} from '../types/commitments'

type ChronologyRow = {
  company: string
  date: string
  era: string
  event_or_metric: string
  category: string
  value: string
  unit: string
  geography: string
  source_url: string
  source_type: string
  confidence: string
}

const CATEGORY_MAP: Record<string, CommitmentCategory> = {
  corporate_founding: 'corporate_milestones',
  cloud_infrastructure_buildout: 'cloud_commits',
  data_center_expansion: 'data_center_capex',
  capex_trend: 'data_center_capex',
  ai_ml_infrastructure: 'compute_commitments',
  nuclear_renewables_ppa: 'nuclear_ppas',
  power_energy_commitments: 'power_purchase_agreements',
  public_policy_regulatory: 'policy_commitments',
}

const ERA_MAP: Record<string, CommitmentEra> = {
  pre_ai_boom: 'pre_ai_boom',
  ai_boom: 'post_ai_acceleration',
  current: 'current',
  forward_looking: 'forecast',
}

const SOURCE_TYPE_MAP: Record<string, SourceType> = {
  sec_filing_10k: 'sec_filing',
  earnings_release: 'earnings_release',
  press_release: 'press_release',
  company_website: 'company_website',
  company_blog: 'company_blog',
  company_commitment: 'company_website',
  government_lab_lbnl: 'government_report',
  iea_report: 'government_report',
  industry_news: 'industry_news',
  industry_initiative: 'research_report',
}

const GEO_COORDS: Record<string, { lat: number; lng: number }> = {
  'Pennsylvania USA': { lat: 40.9, lng: -77.5 },
  'Ohio/Pennsylvania USA': { lat: 41.0, lng: -80.5 },
  'Utah USA': { lat: 40.2, lng: -111.5 },
  'West Texas USA': { lat: 31.5, lng: -102.5 },
  'USA and Europe (framework global)': { lat: 38.9, lng: -77.5 },
  USA: { lat: 39.8, lng: -98.5 },
  Global: { lat: 20, lng: 0 },
}

function normalizeCompany(company: string): { company: string; parentCompany?: string } {
  if (company.includes('/')) {
    const [parent, unit] = company.split('/')
    return { company: unit.trim(), parentCompany: parent.trim() }
  }
  return { company: company.trim() }
}

function parseValue(raw: string): { value?: number; valueMax?: number } {
  if (!raw) return {}
  if (raw.includes('-')) {
    const [a, b] = raw.split('-').map(Number)
    if (!Number.isNaN(a) && !Number.isNaN(b)) return { value: a, valueMax: b }
  }
  const n = Number(raw)
  return Number.isNaN(n) ? {} : { value: n }
}

function mapConfidence(c: string): ConfidenceLevel {
  if (c === 'direct') return 'direct'
  if (c === 'inferred') return 'inferred'
  if (c === 'estimated') return 'estimated'
  return 'speculative'
}

function chronologyToRecord(row: ChronologyRow, index: number): CommitmentRecord {
  const { company, parentCompany } = normalizeCompany(row.company)
  const cat = CATEGORY_MAP[row.category] ?? 'corporate_milestones'
  const subcategory =
    row.category === 'nuclear_renewables_ppa' && row.unit === 'MW'
      ? row.event_or_metric.toLowerCase().includes('renewable') ||
        row.event_or_metric.toLowerCase().includes('brookfield')
        ? 'renewable_ppas'
        : row.event_or_metric.toLowerCase().includes('geothermal')
          ? 'renewable_ppas'
          : 'nuclear_ppas'
      : row.category

  const coords = GEO_COORDS[row.geography]

  return {
    id: `chrono-${index}`,
    company,
    parentCompany,
    sourceTitle: row.event_or_metric,
    sourceUrl: row.source_url,
    sourceType: SOURCE_TYPE_MAP[row.source_type] ?? 'industry_news',
    date: row.date,
    commitmentType: row.event_or_metric,
    category:
      subcategory === 'renewable_ppas' ? 'renewable_ppas' : cat,
    subcategory: row.category,
    ...parseValue(row.value),
    unit: row.unit || undefined,
    geography: row.geography || 'Global',
    facilityOrProject: row.event_or_metric,
    era: ERA_MAP[row.era] ?? 'current',
    confidenceLevel: mapConfidence(row.confidence),
    notes: row.value ? `${row.value} ${row.unit}`.trim() : undefined,
    lat: coords?.lat,
    lng: coords?.lng,
  }
}

const ANCHOR_COMMITMENTS: CommitmentRecord[] = [
  {
    id: 'anchor-white-house-pledge',
    company: 'Hyperscaler cohort',
    parentCompany: 'Amazon, Google, Meta, Microsoft',
    sourceTitle: 'White House Ratepayer Protection Pledge',
    sourceUrl: 'https://www.whitehouse.gov/',
    sourceType: 'policy_document',
    date: '2025-00-00',
    commitmentType: 'Ratepayer protection and grid responsibility pledge',
    category: 'policy_commitments',
    subcategory: 'ratepayer_protection',
    geography: 'USA',
    era: 'current',
    confidenceLevel: 'direct',
    quoteOrExcerpt:
      'Public pledge framework for hyperscalers to address ratepayer and grid impacts of data center load growth.',
    relatedSources: ['anchor-ceraweek-nuclear'],
  },
  {
    id: 'anchor-ceraweek-nuclear',
    company: 'Hyperscaler cohort',
    parentCompany: 'Amazon, Google, Meta',
    sourceTitle: 'CERAWeek pledge to support tripling global nuclear capacity',
    sourceUrl:
      'https://www.esgdive.com/news/amazon-google-meta-join-pledge-to-triple-global-nuclear-capacity-ceraweek/742470/',
    sourceType: 'industry_news',
    date: '2025-00-00',
    commitmentType: 'Nuclear capacity expansion pledge',
    category: 'policy_commitments',
    geography: 'Global',
    era: 'post_ai_acceleration',
    confidenceLevel: 'direct',
    relatedSources: ['anchor-white-house-pledge'],
  },
  {
    id: 'anchor-carnegie-research',
    company: 'Industry',
    sourceTitle: 'Carnegie Endowment hyperscaler commitments research',
    sourceUrl: 'https://carnegieendowment.org/',
    sourceType: 'research_report',
    date: '2025-00-00',
    commitmentType: 'Structured review of hyperscaler energy and infrastructure commitments',
    category: 'forecasts_estimates',
    geography: 'Global',
    era: 'current',
    confidenceLevel: 'inferred',
    notes: 'Research anchor for categorizing firm vs speculative public commitments.',
  },
  {
    id: 'anchor-google-broadcom',
    company: 'Google',
    parentCompany: 'Alphabet',
    sourceTitle: 'Google and Broadcom custom AI compute scale-up',
    sourceUrl: 'https://cloud.google.com/',
    sourceType: 'press_release',
    date: '2024-00-00',
    commitmentType: 'Custom TPU and networking silicon for AI infrastructure',
    category: 'compute_commitments',
    geography: 'Global',
    era: 'post_ai_acceleration',
    confidenceLevel: 'inferred',
    notes: 'Compute procurement commitment referenced in public AI infrastructure announcements.',
  },
  {
    id: 'anchor-google-kairos',
    company: 'Google',
    parentCompany: 'Alphabet',
    sourceTitle: 'Google Kairos Power SMR agreement',
    sourceUrl: 'https://blog.google/inside-google/infrastructure/',
    sourceType: 'company_blog',
    date: '2024-00-00',
    commitmentType: 'Small modular reactor energy for data centers',
    category: 'nuclear_ppas',
    geography: 'USA',
    era: 'post_ai_acceleration',
    confidenceLevel: 'direct',
    lat: 35.5,
    lng: -97.5,
  },
  {
    id: 'anchor-nuclear-tracker',
    company: 'Industry',
    sourceTitle: 'Hyperscaler nuclear PPA tracker (public database)',
    sourceUrl: 'https://www.world-nuclear-news.org/',
    sourceType: 'tracker_database',
    date: '2026-00-00',
    commitmentType: 'Aggregated nuclear PPA disclosures across hyperscalers',
    category: 'nuclear_ppas',
    value: 4404,
    unit: 'MW',
    geography: 'USA',
    era: 'current',
    confidenceLevel: 'direct',
    notes: 'Sum of major disclosed nuclear PPAs: Microsoft 835 MW, Amazon 960 MW, Meta 2,609 MW.',
    relatedSources: ['chrono-23', 'chrono-12', 'chrono-43'],
  },
  {
    id: 'anchor-ai-infra-tracker',
    company: 'Industry',
    sourceTitle: 'AI infrastructure investment tracker',
    sourceUrl: 'https://openai.com/index/announcing-the-stargate-project/',
    sourceType: 'tracker_database',
    date: '2025-01-21',
    commitmentType: 'Stargate $500B AI infrastructure program',
    category: 'compute_commitments',
    value: 500,
    unit: 'USD_billion_program',
    geography: 'USA',
    facilityOrProject: 'Stargate',
    era: 'post_ai_acceleration',
    confidenceLevel: 'speculative',
    quoteOrExcerpt: 'Multi-year AI infrastructure buildout announced with OpenAI, SoftBank, and Oracle.',
    lat: 33.4,
    lng: -112.1,
  },
]

const chronology = (researchData as { hyperscaler_master_chronology: ChronologyRow[] })
  .hyperscaler_master_chronology

export const COMMITMENT_RECORDS: CommitmentRecord[] = [
  ...chronology.map(chronologyToRecord),
  ...ANCHOR_COMMITMENTS,
]

export const FORECAST_SCENARIOS: ForecastScenario[] = (
  researchData as {
    hyperscaler_forecast_scenarios: Array<Record<string, string>>
  }
).hyperscaler_forecast_scenarios.map((row, i) => ({
  id: `forecast-${i}`,
  scenario: row.scenario,
  year: Number(row.year),
  globalDcElectricityTwh: Number(row.global_dc_electricity_twh),
  hyperscalerCapexUsdB: Number(row.hyperscaler_capex_usd_b),
  nuclearSharePct: Number(row.nuclear_share_hyperscaler_power_pct),
  renewablePpaSharePct: Number(row.renewable_ppa_share_pct),
  avgPue: Number(row.avg_pue),
  gridConstraintIndex: row.grid_constraint_index,
  keyAssumption: row.key_assumption,
}))

export const COMPARISON_METRICS: ComparisonMetric[] = (
  researchData as { hyperscaler_comparison_matrix: Array<Record<string, string>> }
).hyperscaler_comparison_matrix.map((row) => ({
  company: row.company,
  era: row.era,
  metric: row.metric,
  value: Number(row.value),
  year: row.year || undefined,
  source: row.source,
  confidence: mapConfidence(row.confidence),
}))

export const CAPEX_SERIES: CapexDataPoint[] = (
  researchData as { hyperscaler_chart_capex: Array<Record<string, string>> }
).hyperscaler_chart_capex.map((row) => ({
  company: row.company,
  fiscalYear: Number(row.fiscal_year),
  capexUsdB: Number(row.capex_usd_b),
  era: row.era,
}))

export const COMPANIES = [...new Set(COMMITMENT_RECORDS.map((r) => r.company))].sort()

export function getRecordById(id: string): CommitmentRecord | undefined {
  return COMMITMENT_RECORDS.find((r) => r.id === id)
}