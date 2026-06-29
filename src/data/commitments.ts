export type CommitmentResource =
  | 'Renewable'
  | 'Gas'
  | 'Geothermal'
  | 'Fuel cells'
  | 'Nuclear'

export interface EnergyCommitment {
  id: string
  announcementDate: string
  company: string
  counterparty: string
  resourceType: CommitmentResource
  megawatts: number
  geography: string
  era: string
  sourceUrl: string
  notes: string
}

/** Public energy procurement commitments (MW). Source: research/data/hyperscaler_commitments.csv */
export const ENERGY_COMMITMENTS: EnergyCommitment[] = [
  {
    id: 'msft-brookfield-2024',
    announcementDate: '2024-05',
    company: 'Microsoft',
    counterparty: 'Brookfield',
    resourceType: 'Renewable',
    megawatts: 10500,
    geography: 'USA & Europe (global framework)',
    era: 'ai_boom',
    sourceUrl:
      'https://bep.brookfield.com/press-releases/bep/brookfield-and-microsoft-collaborating-deliver-over-105-gw-new-renewable-power',
    notes: '10.5 GW new renewable capacity framework, delivery 2026–2030',
  },
  {
    id: 'bloom-brookfield-2025',
    announcementDate: '2025-10',
    company: 'Brookfield',
    counterparty: 'Bloom Energy',
    resourceType: 'Fuel cells',
    megawatts: 1000,
    geography: 'USA',
    era: 'ai_boom',
    sourceUrl: 'https://www.bloomenergy.com/',
    notes: 'Fuel cell partnership; supports Brookfield clean-power portfolio',
  },
  {
    id: 'google-fervo-2026',
    announcementDate: '2026-02',
    company: 'Google',
    counterparty: 'Fervo Energy',
    resourceType: 'Geothermal',
    megawatts: 100,
    geography: 'Utah, USA',
    era: 'current',
    sourceUrl: 'https://blog.google/outreach-initiatives/sustainability/',
    notes: 'Enhanced geothermal for Google data center load',
  },
  {
    id: 'msft-chevron-2026',
    announcementDate: '2026-04',
    company: 'Microsoft',
    counterparty: 'Chevron',
    resourceType: 'Gas',
    megawatts: 2500,
    geography: 'West Texas, USA',
    era: 'current',
    sourceUrl:
      'https://fortune.com/2026/04/01/microsoft-chevron-exclusivity-powering-west-texas-data-center-complex/',
    notes: '20-year gas power agreement for West Texas AI campus',
  },
]

const PROVIDER_TO_COMPANY: Record<string, string> = {
  AWS: 'Amazon',
  Amazon: 'Amazon',
  Azure: 'Microsoft',
  Microsoft: 'Microsoft',
  GCP: 'Google',
  Google: 'Google',
  Alphabet: 'Google',
  Meta: 'Meta',
  Oracle: 'Oracle',
  Brookfield: 'Brookfield',
}

export function providerToCompany(provider: string): string {
  return PROVIDER_TO_COMPANY[provider] ?? provider
}

export function getCommitmentsByCompany(companyOrProvider: string): EnergyCommitment[] {
  const company = providerToCompany(companyOrProvider)
  return ENERGY_COMMITMENTS.filter(
    (c) => c.company.toLowerCase() === company.toLowerCase()
  )
}

export const COMMITMENT_MW_BY_TYPE = ENERGY_COMMITMENTS.reduce(
  (acc, c) => {
    acc[c.resourceType] = (acc[c.resourceType] ?? 0) + c.megawatts
    return acc
  },
  {} as Record<string, number>
)