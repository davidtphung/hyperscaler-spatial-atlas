import { InfoPageLayout } from '../components/layout/InfoPageLayout'
import { CONFIDENCE_LABELS, SOURCE_CATEGORIES } from '../data/sources'

const CONFIDENCE_STYLES: Record<string, string> = {
  direct: 'bg-emerald-500/15 text-emerald-300',
  inferred: 'bg-sky-500/15 text-sky-300',
  estimated: 'bg-amber-500/15 text-amber-300',
  modeled: 'bg-fuchsia-500/15 text-fuchsia-300',
}

export function DataSourcesPage() {
  return (
    <InfoPageLayout
      route="sources"
      title="Data sources"
      lede="Every layer in the atlas is tied to a public filing, agency report, company disclosure, repository dataset, or a labeled estimate or model."
    >
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-white/3 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
          Confidence labels
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {Object.entries(CONFIDENCE_LABELS).map(([key, label]) => (
            <li
              key={key}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${CONFIDENCE_STYLES[key]}`}
            >
              {label}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-tertiary)]">
          Direct sources are verbatim public disclosures. Inferred and estimated layers extrapolate
          from those sources. Modeled layers are simulations shown in the UI.
        </p>
      </div>

      <div className="space-y-10">
        {SOURCE_CATEGORIES.map((category) => (
          <section key={category.id} aria-labelledby={`cat-${category.id}`}>
            <h2
              id={`cat-${category.id}`}
              className="text-lg font-semibold text-[var(--text-primary)]"
            >
              {category.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {category.description}
            </p>

            <ul className="mt-4 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-white/3">
              {category.sources.map((source) => (
                <li key={source.id} className="px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[var(--text-primary)] underline decoration-[var(--border)] underline-offset-2 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
                        >
                          {source.title}
                        </a>
                      ) : (
                        <span className="font-medium text-[var(--text-primary)]">{source.title}</span>
                      )}
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{source.usedFor}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CONFIDENCE_STYLES[source.confidence]}`}
                    >
                      {CONFIDENCE_LABELS[source.confidence]}
                    </span>
                  </div>
                  <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[var(--text-tertiary)]">
                    <div>
                      <dt className="inline font-semibold uppercase tracking-wider">Type: </dt>
                      <dd className="inline">{source.type}</dd>
                    </div>
                    {source.accessed && (
                      <div>
                        <dt className="inline font-semibold uppercase tracking-wider">Accessed: </dt>
                        <dd className="inline font-mono">{source.accessed}</dd>
                      </div>
                    )}
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </InfoPageLayout>
  )
}