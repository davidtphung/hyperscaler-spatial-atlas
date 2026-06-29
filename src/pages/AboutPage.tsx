import { InfoPageLayout } from '../components/layout/InfoPageLayout'
import { routeHref } from '../utils/routes'

export function AboutPage() {
  return (
    <InfoPageLayout
      route="about"
      title="About"
      lede="An interactive atlas of hyperscaler cloud regions, energy portfolios, and compute profiles built from public disclosures and labeled estimates."
    >
      <div className="prose-atlas space-y-8 text-[var(--text-secondary)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">What this is</h2>
          <p className="mt-3 leading-relaxed">
            Hyperscaler Atlas maps major cloud regions, AI campuses, storage hubs, and edge nodes on a
            geographic world map. Select any site to inspect location, infrastructure scale, energy
            source mix, compute workloads, and a modeled live power feed.
          </p>
          <p className="mt-3 leading-relaxed">
            The map is a research and exploration tool. It combines sourced public data with clearly
            labeled demo and modeled layers so you can compare scale, procurement patterns, and workload
            types across providers.
          </p>
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