import { COMMITMENT_RECORDS } from './commitmentsRegistry'
import { CLOUD_SPEND_COMMITMENTS } from './cloudSpendCommitments'
import type { CommitmentRecord } from '../types/commitments'
import type {
  CommitmentFamily,
  CommitmentStatus,
  TrackableCommitment,
} from '../types/trackableCommitment'

function resolveHyperscaler(company: string, parent?: string): TrackableCommitment['hyperscaler'] {
  const s = `${parent ?? ''} ${company}`.toLowerCase()
  if (s.includes('amazon') || s.includes('aws')) return 'Amazon'
  if (s.includes('microsoft') || s.includes('azure')) return 'Microsoft'
  if (s.includes('google') || s.includes('alphabet') || s.includes('gcp')) return 'Google'
  if (s.includes('meta') || s.includes('facebook')) return 'Meta'
  if (s.includes('oracle')) return 'Oracle'
  if (s.includes('apple')) return 'Apple'
  if (s.includes('brookfield') || s.includes('industry') || s.includes('hyperscaler') || s.includes('cohort'))
    return 'Multi'
  return 'Industry'
}

function familyFromLegacy(record: CommitmentRecord): CommitmentFamily {
  if (record.category === 'nuclear_ppas') return 'nuclear_ppa'
  if (record.category === 'renewable_ppas') return 'renewable_ppa'
  if (record.category === 'power_purchase_agreements') return 'power_ppa'
  if (record.category === 'data_center_capex') return 'data_center_capex'
  if (record.category === 'compute_commitments') return 'ai_compute'
  if (record.category === 'policy_commitments') return 'policy_pledge'
  if (record.category === 'cloud_commits') return 'corporate_milestone'
  if (record.category === 'forecasts_estimates') return 'corporate_milestone'
  return 'corporate_milestone'
}

function domainFromLegacy(record: CommitmentRecord): TrackableCommitment['domain'] {
  if (record.category === 'policy_commitments') return 'policy'
  if (
    record.category === 'nuclear_ppas' ||
    record.category === 'renewable_ppas' ||
    record.category === 'power_purchase_agreements'
  )
    return 'energy'
  if (record.category === 'data_center_capex' || record.category === 'compute_commitments')
    return 'infrastructure'
  return 'infrastructure'
}

function statusFromLegacy(record: CommitmentRecord): CommitmentStatus {
  if (record.era === 'forecast') return 'speculative'
  if (record.confidenceLevel === 'speculative') return 'speculative'
  if (record.era === 'current') return 'active'
  if (record.era === 'post_ai_acceleration') return 'active'
  return 'completed'
}

export function legacyToTrackable(record: CommitmentRecord): TrackableCommitment {
  return {
    id: record.id,
    company: record.company,
    hyperscaler: resolveHyperscaler(record.company, record.parentCompany),
    commitmentFamily: familyFromLegacy(record),
    commitmentName: record.commitmentType,
    commitmentType: record.commitmentType,
    domain: domainFromLegacy(record),
    sourceTitle: record.sourceTitle,
    sourceUrl: record.sourceUrl,
    sourceType: record.sourceType,
    announcementDate: record.date,
    committedValue: record.value,
    committedValueMax: record.valueMax,
    committedUnit: record.unit,
    geography: record.geography,
    serviceScope: record.facilityOrProject,
    category: record.category,
    subcategory: record.subcategory,
    era: record.era,
    status: statusFromLegacy(record),
    confidenceLevel: record.confidenceLevel,
    notes: record.notes,
    sourceExcerpt: record.quoteOrExcerpt,
    relatedRecords: record.relatedSources,
    lat: record.lat,
    lng: record.lng,
  }
}

export const ALL_COMMITMENTS: TrackableCommitment[] = [
  ...COMMITMENT_RECORDS.map(legacyToTrackable),
  ...CLOUD_SPEND_COMMITMENTS,
]

export const CLOUD_FAMILIES: CommitmentFamily[] = [
  'macc',
  'azure_savings_plans',
  'aws_savings_plans',
  'aws_reserved_instances',
  'aws_enterprise_deals',
  'gcp_committed_spend',
  'cloud_marketplace',
]

export function getCommitmentById(id: string): TrackableCommitment | undefined {
  return ALL_COMMITMENTS.find((c) => c.id === id)
}

export function getCloudSpendByHyperscaler(hyperscaler: TrackableCommitment['hyperscaler']) {
  return ALL_COMMITMENTS.filter(
    (c) => c.domain === 'cloud_spend' && c.hyperscaler === hyperscaler
  )
}