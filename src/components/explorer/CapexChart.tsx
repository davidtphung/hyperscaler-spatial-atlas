import { CAPEX_SERIES } from '../../data/commitmentsRegistry'

const COMPANY_COLORS: Record<string, string> = {
  Amazon: '#f0b429',
  Microsoft: '#3dd6c6',
  Alphabet: '#7c8cff',
  Meta: '#e879f9',
  Oracle: '#f97316',
}

export function CapexChart() {
  const companies = [...new Set(CAPEX_SERIES.map((c) => c.company))]
  const maxYear = Math.max(...CAPEX_SERIES.map((c) => c.fiscalYear))
  const minYear = Math.min(...CAPEX_SERIES.map((c) => c.fiscalYear))
  const maxCapex = Math.max(...CAPEX_SERIES.map((c) => c.capexUsdB))

  const width = 600
  const height = 200
  const pad = { t: 12, r: 12, b: 28, l: 40 }
  const chartW = width - pad.l - pad.r
  const chartH = height - pad.t - pad.b

  return (
    <figure aria-labelledby="capex-chart-title">
      <figcaption id="capex-chart-title" className="sr-only">
        Hyperscaler capex by company over fiscal years, sourced from SEC filings
      </figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img">
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = pad.t + chartH * (1 - pct / 100)
          return (
            <line
              key={pct}
              x1={pad.l}
              y1={y}
              x2={width - pad.r}
              y2={y}
              stroke="var(--grid-line)"
              strokeWidth={1}
            />
          )
        })}

        {companies.map((company) => {
          const points = CAPEX_SERIES.filter((c) => c.company === company).sort(
            (a, b) => a.fiscalYear - b.fiscalYear
          )
          const path = points
            .map((p, i) => {
              const x = pad.l + ((p.fiscalYear - minYear) / (maxYear - minYear)) * chartW
              const y = pad.t + chartH * (1 - p.capexUsdB / maxCapex)
              return `${i === 0 ? 'M' : 'L'}${x},${y}`
            })
            .join(' ')

          return (
            <g key={company}>
              <path
                d={path}
                fill="none"
                stroke={COMPANY_COLORS[company] ?? '#94a3b8'}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              {points.map((p) => {
                const x = pad.l + ((p.fiscalYear - minYear) / (maxYear - minYear)) * chartW
                const y = pad.t + chartH * (1 - p.capexUsdB / maxCapex)
                return (
                  <circle
                    key={p.fiscalYear}
                    cx={x}
                    cy={y}
                    r={3}
                    fill={COMPANY_COLORS[company] ?? '#94a3b8'}
                  >
                    <title>{`${company} FY${p.fiscalYear}: $${p.capexUsdB}B`}</title>
                  </circle>
                )
              })}
            </g>
          )
        })}

        {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((year) => {
          const x = pad.l + ((year - minYear) / (maxYear - minYear)) * chartW
          return (
            <text
              key={year}
              x={x}
              y={height - 6}
              textAnchor="middle"
              fill="var(--text-tertiary)"
              fontSize={10}
              fontFamily="ui-monospace, monospace"
            >
              {year}
            </text>
          )
        })}
      </svg>

      <ul className="mt-3 flex flex-wrap gap-3">
        {companies.map((c) => (
          <li key={c} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COMPANY_COLORS[c] }} aria-hidden />
            {c}
          </li>
        ))}
      </ul>
    </figure>
  )
}