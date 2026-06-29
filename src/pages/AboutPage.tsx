import { InfoPageLayout } from '../components/layout/InfoPageLayout'
import { routeHref } from '../utils/routes'

export function AboutPage() {
  return (
    <InfoPageLayout
      route="about"
      title="About"
      lede="A public-data explorer for hyperscaler commitments across cloud compute, AI infrastructure, power procurement, capex, and forward-looking energy demand."
    >
      <div className="prose-atlas space-y-8 text-[var(--text-secondary)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">What this is</h2>
          <p className="mt-3 leading-relaxed">
            Hyperscaler Commitments Explorer finds, combines, and categorizes public hyperscaler
            commitments from SEC filings, press releases, agency reports, and research trackers. Browse
            the overview dashboard, interactive timeline, company comparison, forecast scenarios, and
            spatial map in one product.
          </p>
          <p className="mt-3 leading-relaxed">
            Every record carries source URL, source type, and confidence level (direct, inferred,
            estimated, or speculative). Click any timeline event to open a citation drawer with excerpts
            and primary source links.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Main views</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
            <li><strong className="text-[var(--text-primary)]">Overview</strong> totals, era breakdown, capex chart</li>
            <li><strong className="text-[var(--text-primary)]">Timeline</strong> commitments by year with filters</li>
            <li><strong className="text-[var(--text-primary)]">Map</strong> geographic infrastructure explorer</li>
            <li><strong className="text-[var(--text-primary)]">Compare</strong> pre-AI vs AI-era company metrics</li>
            <li><strong className="text-[var(--text-primary)]">Forecasts</strong> 2028-2030 scenario modeling</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Map views</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
            <li>
              <strong className="text-[var(--text-primary)]">Standard</strong> colors nodes by
              infrastructure category and operational status.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Energy</strong> colors nodes by dominant
              power source and shows modeled IT load on hover.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Compute</strong> highlights dominant
              workloads and data types per site.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">What is not live telemetry</h2>
          <p className="mt-3 leading-relaxed">
            Per-site power (MW), land, GPU counts, energy portfolio percentages, and the sparkline power
            monitor are illustrative. The live feed is a simulation based on rated capacity, utilization
            curves, and PUE. It does not connect to grid operators or hyperscaler operations centers.
          </p>
          <p className="mt-3 leading-relaxed">
            See the{' '}
            <a
              href={routeHref('sources')}
              className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
            >
              data sources
            </a>{' '}
            page for a full breakdown of direct filings, agency reports, and modeled layers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Research package</h2>
          <p className="mt-3 leading-relaxed">
            The repository includes a research memo and CSV datasets covering hyperscaler chronology,
            capex comparisons, energy commitments, forecast scenarios, and bibliography entries. These
            files support the energy commitments panel and long-form analysis behind the atlas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Built by</h2>
          <p className="mt-3 leading-relaxed">
            Created by{' '}
            <a
              href="https://x.com/davidtphung"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
            >
              David T Phung
            </a>
            . Stack: React, TypeScript, Vite, Tailwind CSS, d3-geo, and Natural Earth map data.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  )
}