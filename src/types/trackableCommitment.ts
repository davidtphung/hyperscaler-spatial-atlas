import type { CommitmentCategory, CommitmentEra, ConfidenceLevel, SourceType } from './commitments'

export type CommitmentDomain = 'cloud_spend' | 'energy' | 'policy' | 'infrastructure'

export type CommitmentFamily =
  | 'macc'
  | 'azure_savings_plans'
  | 'aws_savings_plans'
  | 'aws_reserved_instances'
  | 'aws_enterprise_deals'
  | 'gcp_committed_spend'
  | 'cloud_marketplace'
  | 'power_ppa'
  | 'nuclear_ppa'
  | 'renewable_ppa'
  | 'grid_transmission'
  | 'data_center_capex'
  | 'ai_compute'
  | 'policy_pledge'
  | 'corporate_milestone'

export type CommitmentStatus =
  | 'announced'
  | 'active'
  | 'utilizing'
  | 'renewal_window'
  | 'expired'
  | 'completed'
  | 'planned'
  | 'speculative'

export interface TrackableCommitment {
  id: string
  company: string
  hyperscaler: 'Microsoft' | 'Amazon' | 'Google' | 'Meta' | 'Oracle' | 'Apple' | 'Multi' | 'Industry'
  commitmentFamily: CommitmentFamily
  commitmentName: string
  commitmentType: string
  domain: CommitmentDomain
  sourceTitle: string
  sourceUrl: string
  sourceType: SourceType
  announcementDate: string
  startDate?: string
  endDate?: string
  termLength?: string
  committedValue?: number
  committedValueMax?: number
  committedUnit?: string
  actualValue?: number
  actualUnit?: string
  utilizationPct?: number
  remainingValue?: number
  geography: string
  serviceScope?: string
  productScope?: string
  category: CommitmentCategory
  subcategory?: string
  era: CommitmentEra
  status: CommitmentStatus
  confidenceLevel: ConfidenceLevel
  notes?: string
  sourceExcerpt?: string
  relatedRecords?: string[]
  forecastSignal?: string
  lat?: number
  lng?: number
}

export const DOMAIN_LABELS: Record<CommitmentDomain, string> = {
  cloud_spend: 'Cloud spend',
  energy: 'Energy',
  policy: 'Policy',
  infrastructure: 'Infrastructure',
}

export const DOMAIN_COLORS: Record<CommitmentDomain, string> = {
  cloud_spend: '#7c8cff',
  energy: '#34d399',
  policy: '#f0b429',
  infrastructure: '#3dd6c6',
}

export const FAMILY_LABELS: Record<CommitmentFamily, string> = {
  macc: 'MACC',
  azure_savings_plans: 'Azure Savings Plans',
  aws_savings_plans: 'AWS Savings Plans',
  aws_reserved_instances: 'AWS Reserved Instances',
  aws_enterprise_deals: 'AWS Enterprise Deals',
  gcp_committed_spend: 'GCP Committed Spend',
  cloud_marketplace: 'Cloud Marketplace',
  power_ppa: 'Power PPA',
  nuclear_ppa: 'Nuclear PPA',
  renewable_ppa: 'Renewable PPA',
  grid_transmission: 'Grid / Transmission',
  data_center_capex: 'Data Center Capex',
  ai_compute: 'AI Compute',
  policy_pledge: 'Policy Pledge',
  corporate_milestone: 'Corporate Milestone',
}

export const STATUS_LABELS: Record<CommitmentStatus, string> = {
  announced: 'Announced',
  active: 'Active',
  utilizing: 'Utilizing',
  renewal_window: 'Renewal window',
  expired: 'Expired',
  completed: 'Completed',
  planned: 'Planned',
  speculative: 'Speculative',
}

export const STATUS_COLORS: Record<CommitmentStatus, string> = {
  announced: '#94a3b8',
  active: '#3dd6c6',
  utilizing: '#34d399',
  renewal_window: '#f0b429',
  expired: '#64748b',
  completed: '#7c8cff',
  planned: '#e879f9',
  speculative: '#f97316',
}