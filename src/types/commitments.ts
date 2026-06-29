export type CommitmentEra =
  | 'pre_ai_boom'
  | 'ai_boom_onset'
  | 'post_ai_acceleration'
  | 'current'
  | 'forecast'

export type CommitmentCategory =
  | 'cloud_commits'
  | 'compute_commitments'
  | 'data_center_capex'
  | 'power_purchase_agreements'
  | 'nuclear_ppas'
  | 'renewable_ppas'
  | 'grid_infrastructure'
  | 'policy_commitments'
  | 'water_cooling'
  | 'forecasts_estimates'
  | 'corporate_milestones'

export type ConfidenceLevel = 'direct' | 'inferred' | 'estimated' | 'speculative'

export type SourceType =
  | 'sec_filing'
  | 'earnings_release'
  | 'press_release'
  | 'company_website'
  | 'company_blog'
  | 'government_report'
  | 'industry_news'
  | 'research_report'
  | 'policy_document'
  | 'tracker_database'

export interface CommitmentRecord {
  id: string
  company: string
  parentCompany?: string
  sourceTitle: string
  sourceUrl: string
  sourceType: SourceType
  date: string
  commitmentType: string
  category: CommitmentCategory
  subcategory?: string
  value?: number
  valueMax?: number
  unit?: string
  geography: string
  facilityOrProject?: string
  era: CommitmentEra
  confidenceLevel: ConfidenceLevel
  notes?: string
  quoteOrExcerpt?: string
  relatedSources?: string[]
  lat?: number
  lng?: number
}

export interface ForecastScenario {
  id: string
  scenario: string
  year: number
  globalDcElectricityTwh: number
  hyperscalerCapexUsdB: number
  nuclearSharePct: number
  renewablePpaSharePct: number
  avgPue: number
  gridConstraintIndex: string
  keyAssumption: string
}

export interface ComparisonMetric {
  company: string
  era: string
  metric: string
  value: number
  year?: string
  source: string
  confidence: ConfidenceLevel
}

export interface CapexDataPoint {
  company: string
  fiscalYear: number
  capexUsdB: number
  era: string
}

export interface CommitmentFilters {
  query: string
  companies: Set<string>
  categories: Set<CommitmentCategory>
  eras: Set<CommitmentEra>
  geographies: Set<string>
  confidenceLevels: Set<ConfidenceLevel>
  sourceTypes: Set<SourceType>
}

export const ERA_LABELS: Record<CommitmentEra, string> = {
  pre_ai_boom: 'Pre-AI boom',
  ai_boom_onset: 'AI boom onset',
  post_ai_acceleration: 'Post-AI acceleration',
  current: 'Current commitments',
  forecast: 'Forecast',
}

export const CATEGORY_LABELS: Record<CommitmentCategory, string> = {
  cloud_commits: 'Cloud commits',
  compute_commitments: 'Compute commitments',
  data_center_capex: 'Data center capex',
  power_purchase_agreements: 'Power purchase agreements',
  nuclear_ppas: 'Nuclear PPAs',
  renewable_ppas: 'Renewable PPAs',
  grid_infrastructure: 'Grid infrastructure',
  policy_commitments: 'Policy commitments',
  water_cooling: 'Water and cooling',
  forecasts_estimates: 'Forecasts and estimates',
  corporate_milestones: 'Corporate milestones',
}

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  direct: 'Direct',
  inferred: 'Inferred',
  estimated: 'Estimated',
  speculative: 'Speculative',
}