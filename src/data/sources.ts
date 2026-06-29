export type SourceConfidence = 'direct' | 'inferred' | 'estimated' | 'modeled'

export interface DataSource {
  id: string
  title: string
  url?: string
  type: string
  confidence: SourceConfidence
  usedFor: string
  accessed?: string
}

export interface SourceCategory {
  id: string
  title: string
  description: string
  sources: DataSource[]
}

export const SOURCE_CATEGORIES: SourceCategory[] = [
  {
    id: 'sec',
    title: 'SEC filings and financial disclosures',
    description:
      'Capex, property and equipment additions, and investor metrics pulled from SEC XBRL company facts and earnings releases.',
    sources: [
      {
        id: 'sec-msft',
        title: 'Microsoft Corp SEC XBRL Company Facts',
        url: 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000789019.json',
        type: 'SEC filing',
        confidence: 'direct',
        usedFor: 'Microsoft / Azure capex chronology',
        accessed: '2026-06-28',
      },
      {
        id: 'sec-amzn',
        title: 'Amazon.com Inc SEC XBRL Company Facts',
        url: 'https://data.sec.gov/api/xbrl/companyfacts/CIK0001018724.json',
        type: 'SEC filing',
        confidence: 'direct',
        usedFor: 'Amazon / AWS capex and infrastructure spend',
        accessed: '2026-06-28',
      },
      {
        id: 'sec-googl',
        title: 'Alphabet Inc SEC XBRL Company Facts',
        url: 'https://data.sec.gov/api/xbrl/companyfacts/CIK0001652044.json',
        type: 'SEC filing',
        confidence: 'direct',
        usedFor: 'Google Cloud / Alphabet capex',
        accessed: '2026-06-28',
      },
      {
        id: 'sec-meta',
        title: 'Meta Platforms SEC XBRL Company Facts',
        url: 'https://data.sec.gov/api/xbrl/companyfacts/CIK0001326801.json',
        type: 'SEC filing',
        confidence: 'direct',
        usedFor: 'Meta capex and infrastructure buildout',
        accessed: '2026-06-28',
      },
      {
        id: 'sec-orcl',
        title: 'Oracle Corp SEC XBRL Company Facts',
        url: 'https://data.sec.gov/api/xbrl/companyfacts/CIK0001341439.json',
        type: 'SEC filing',
        confidence: 'direct',
        usedFor: 'Oracle OCI capex surge',
        accessed: '2026-06-28',
      },
    ],
  },
  {
    id: 'agency',
    title: 'Government and agency reports',
    description: 'Independent electricity demand and data center energy benchmarks.',
    sources: [
      {
        id: 'iea-2025',
        title: 'IEA Energy and AI Report',
        url: 'https://www.iea.org/reports/energy-and-ai',
        type: 'Agency report',
        confidence: 'direct',
        usedFor: 'Global data center electricity demand forecasts',
        accessed: '2026-06-28',
      },
      {
        id: 'lbnl-2024',
        title: 'United States Data Centers Energy Usage (LBNL)',
        url: 'https://eta.lbl.gov/publications/united-states-data-centers-energy',
        type: 'Government lab',
        confidence: 'direct',
        usedFor: 'US data center electricity share and TWh estimates',
        accessed: '2026-06-28',
      },
    ],
  },
  {
    id: 'energy-deals',
    title: 'Public energy procurement commitments',
    description:
      'Megawatt-scale deals surfaced in press releases and news coverage. Shown in the Energy commitments panel and research CSV.',
    sources: [
      {
        id: 'msft-brookfield',
        title: 'Brookfield and Microsoft 10.5 GW renewable framework',
        url: 'https://bep.brookfield.com/press-releases/bep/brookfield-and-microsoft-collaborating-deliver-over-105-gw-new-renewable-power',
        type: 'Press release',
        confidence: 'direct',
        usedFor: 'Microsoft renewable PPA commitment (10,500 MW)',
        accessed: '2026-06-28',
      },
      {
        id: 'bloom-brookfield',
        title: 'Bloom Energy fuel cell partnership',
        url: 'https://www.bloomenergy.com/',
        type: 'Company website',
        confidence: 'direct',
        usedFor: 'Fuel cell commitment (1,000 MW)',
        accessed: '2026-06-28',
      },
      {
        id: 'google-fervo',
        title: 'Google sustainability and geothermal initiatives',
        url: 'https://blog.google/outreach-initiatives/sustainability/',
        type: 'Company blog',
        confidence: 'direct',
        usedFor: 'Google / Fervo geothermal deal (100 MW)',
        accessed: '2026-06-28',
      },
      {
        id: 'msft-chevron',
        title: 'Microsoft and Chevron West Texas power deal (Fortune)',
        url: 'https://fortune.com/2026/04/01/microsoft-chevron-exclusivity-powering-west-texas-data-center-complex/',
        type: 'Industry news',
        confidence: 'direct',
        usedFor: 'Microsoft gas power agreement (2,500 MW)',
        accessed: '2026-06-28',
      },
      {
        id: 'vistra-meta',
        title: 'Vistra and Meta nuclear PPAs',
        url: 'https://investor.vistracorp.com/2026-01-09-Vistra-and-Meta-Announce-Agreements-to-Support-Nuclear-Plants-in-PJM-and-Add-New-Nuclear-Generation-to-the-Grid',
        type: 'Press release',
        confidence: 'direct',
        usedFor: 'Research chronology and nuclear procurement context',
        accessed: '2026-06-28',
      },
      {
        id: 'talen-aws',
        title: 'Talen Energy Amazon nuclear expansion',
        url: 'https://ir.talenenergy.com/news-releases/news-release-details/talen-energy-expands-nuclear-energy-relationship-amazon',
        type: 'Press release',
        confidence: 'direct',
        usedFor: 'Research chronology and nuclear procurement context',
        accessed: '2026-06-28',
      },
    ],
  },
  {
    id: 'company',
    title: 'Company infrastructure disclosures',
    description: 'Region counts, global footprint pages, and product launch timelines.',
    sources: [
      {
        id: 'aws-infra',
        title: 'AWS Global Infrastructure',
        url: 'https://aws.amazon.com/about-aws/global-infrastructure/',
        type: 'Company website',
        confidence: 'direct',
        usedFor: 'Region names, availability zones, and map node placement',
        accessed: '2026-06-28',
      },
      {
        id: 'msft-earnings',
        title: 'Microsoft FY24 Q4 Earnings Release',
        url: 'https://www.microsoft.com/en-us/investor/earnings/FY-2024-Q4/press-release-webcast',
        type: 'Earnings release',
        confidence: 'direct',
        usedFor: 'Azure growth and capex narrative in research memo',
        accessed: '2026-06-28',
      },
      {
        id: 'openai-stargate',
        title: 'Announcing the Stargate Project',
        url: 'https://openai.com/index/announcing-the-stargate-project/',
        type: 'Press release',
        confidence: 'direct',
        usedFor: 'Oracle / Stargate infrastructure context',
        accessed: '2026-06-28',
      },
    ],
  },
  {
    id: 'map',
    title: 'Map and geography',
    description: 'Base map layers and coordinate projection for the spatial canvas.',
    sources: [
      {
        id: 'natural-earth',
        title: 'Natural Earth 110m cultural vectors',
        url: 'https://www.naturalearthdata.com/',
        type: 'Open dataset',
        confidence: 'direct',
        usedFor: 'Country boundaries on the world map',
        accessed: '2026-06-28',
      },
      {
        id: 'world-atlas',
        title: 'world-atlas (TopoJSON)',
        url: 'https://github.com/topojson/world-atlas',
        type: 'Open dataset',
        confidence: 'direct',
        usedFor: 'TopoJSON packaging of Natural Earth geometries',
        accessed: '2026-06-28',
      },
    ],
  },
  {
    id: 'atlas-demo',
    title: 'Atlas demo and modeled layers',
    description:
      'Values labeled in the UI as estimated or modeled. They illustrate scale and relationships but are not live operator telemetry.',
    sources: [
      {
        id: 'site-infra',
        title: 'Per-site infrastructure estimates',
        type: 'Atlas dataset',
        confidence: 'estimated',
        usedFor: 'Power (MW), land (acres), GPU counts, and building totals on each map node',
        accessed: '2026-06-28',
      },
      {
        id: 'energy-portfolio',
        title: 'Energy source portfolio model',
        type: 'Atlas model',
        confidence: 'inferred',
        usedFor: 'Per-site renewable, grid, gas, nuclear, and hydro mix shares',
        accessed: '2026-06-28',
      },
      {
        id: 'compute-profile',
        title: 'Compute and data type profiles',
        type: 'Atlas model',
        confidence: 'inferred',
        usedFor: 'Workloads, data types, and accelerator labels in Compute view',
        accessed: '2026-06-28',
      },
      {
        id: 'live-power',
        title: 'Modeled live power feed',
        type: 'Simulation',
        confidence: 'modeled',
        usedFor: 'IT load, facility input, utilization, and sparkline trends (2s refresh)',
        accessed: '2026-06-28',
      },
    ],
  },
  {
    id: 'research-csv',
    title: 'Research CSV package',
    description: 'Structured tables bundled in the repository under research/data/.',
    sources: [
      {
        id: 'chronology',
        title: 'hyperscaler_master_chronology.csv',
        type: 'Repository file',
        confidence: 'direct',
        usedFor: 'Sourced milestone timeline by company',
        accessed: '2026-06-28',
      },
      {
        id: 'commitments-csv',
        title: 'hyperscaler_commitments.csv',
        type: 'Repository file',
        confidence: 'direct',
        usedFor: 'Energy commitment MW deals in the map panel',
        accessed: '2026-06-28',
      },
      {
        id: 'bibliography',
        title: 'hyperscaler_bibliography.csv',
        type: 'Repository file',
        confidence: 'direct',
        usedFor: 'Canonical bibliography for this sources page',
        accessed: '2026-06-28',
      },
      {
        id: 'forecasts',
        title: 'hyperscaler_forecast_scenarios.csv',
        type: 'Repository file',
        confidence: 'estimated',
        usedFor: 'Forward-looking 2028-2030 scenario modeling',
        accessed: '2026-06-28',
      },
    ],
  },
]

export const CONFIDENCE_LABELS: Record<SourceConfidence, string> = {
  direct: 'Direct',
  inferred: 'Inferred',
  estimated: 'Estimated',
  modeled: 'Modeled',
}