import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { CATEGORY_META, STATUS_META } from '../../data/categories'
import type { SpatialNode } from '../../types'
import { Badge } from '../ui/Badge'
import { CloseIcon, ArrowIcon, ShareIcon } from '../icons'
import { IconButton } from '../ui/IconButton'
import { InfrastructureCharts } from './InfrastructureCharts'
import { FleetComparisonChart } from './FleetComparisonChart'
import { ComputeDataMap } from './ComputeDataMap'
import { EnergyPortfolioChart } from './EnergyPortfolioChart'
import { LivePowerMonitor } from './LivePowerMonitor'
import { formatCoordinates, formatLocationAddress } from '../../utils/metrics'
import { ProviderCommitments } from './ProviderCommitments'
import { useLivePower } from '../../hooks/useLivePower'

interface DetailPanelProps {
  node: SpatialNode | null
  relatedNodes: SpatialNode[]
  onClose: () => void
  onSelectRelated: (node: SpatialNode) => void
  isMobile?: boolean
  className?: string
}

export function DetailPanel({
  node,
  relatedNodes,
  onClose,
  onSelectRelated,
  isMobile,
  className,
}: DetailPanelProps) {
  const panelRef = useRef<HTMLElement>(null)
  const livePower = useLivePower(node)

  useEffect(() => {
    if (node && panelRef.current) {
      panelRef.current.focus()
    }
  }, [node?.id])

  if (!node) {
    return (
      <aside
        className={clsx(
          'flex flex-col items-center justify-center border-[var(--border)] bg-[var(--surface)]/60 p-8 text-center backdrop-blur-md',
          isMobile ? 'rounded-t-3xl' : 'border-l',
          className
        )}
        aria-label="Region details"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)]">
          <span className="text-3xl opacity-30" aria-hidden>◎</span>
        </div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Select a region</h2>
        <p className="mt-2 max-w-xs text-sm text-[var(--text-secondary)]">
          Click or tap a node on the map to view power, land, GPU counts, and location data.
        </p>
      </aside>
    )
  }

  const category = CATEGORY_META[node.category]
  const status = STATUS_META[node.status]

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?node=${node.id}`
    if (navigator.share) {
      await navigator.share({ title: node.name, text: node.summary, url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      className={clsx(
        'flex flex-col overflow-hidden border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-xl',
        isMobile ? 'max-h-[80vh] rounded-t-3xl' : 'border-l',
        className
      )}
      aria-label={`Details for ${node.name}`}
      role="complementary"
    >
      {isMobile && (
        <div className="flex justify-center pt-3 pb-1" aria-hidden>
          <div className="h-1 w-10 rounded-full bg-[var(--border)]" />
        </div>
      )}

      <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge color={category.color}>{category.label}</Badge>
            <Badge color={status.color} variant="solid">
              {status.label}
            </Badge>
            <Badge>{node.provider}</Badge>
          </div>
          <h2 className="text-xl font-semibold leading-tight text-[var(--text-primary)]">
            {node.name}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{node.region}</p>
        </div>
        <IconButton label="Close detail panel" onClick={onClose} size="sm">
          <CloseIcon />
        </IconButton>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Location block */}
        <section aria-labelledby="location-heading">
          <h3
            id="location-heading"
            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]"
          >
            Location
          </h3>
          <dl className="mt-2 space-y-2 rounded-xl border border-[var(--border)] bg-white/3 p-3">
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Campus</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">{node.location.campus}</dd>
            </div>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Address</dt>
              <dd className="mt-0.5 text-sm text-[var(--text-secondary)]">{formatLocationAddress(node.location)}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Coordinates</dt>
                <dd className="mt-0.5 font-mono text-xs text-[var(--text-primary)]">
                  {formatCoordinates(node.lat, node.lng)}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Land</dt>
                <dd className="mt-0.5 font-mono text-xs text-[var(--text-primary)]">
                  {node.infrastructure.landAcres.toLocaleString()} acres
                </dd>
              </div>
            </div>
          </dl>
        </section>

        <LivePowerMonitor snapshot={livePower} capacityMW={node.infrastructure.powerMW} />
        <EnergyPortfolioChart node={node} live={livePower} />
        <ComputeDataMap node={node} />
        <ProviderCommitments provider={node.provider} />
        <InfrastructureCharts node={node} />
        <FleetComparisonChart node={node} />

        <p className="mt-6 text-base leading-relaxed text-[var(--text-secondary)]">{node.summary}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4">
          {[
            { label: 'Capacity', value: node.capacity },
            { label: 'Latency', value: node.latency },
            { label: 'Carbon', value: node.carbonIntensity },
            { label: 'Launched', value: node.launched },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                {item.label}
              </dt>
              <dd className="mt-1 font-mono text-sm text-[var(--text-primary)]">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
            Tags
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {node.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>

        {relatedNodes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
              Related regions
            </h3>
            <ul className="mt-2 space-y-1">
              {relatedNodes.map((related) => (
                <li key={related.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRelated(related)}
                    className="flex w-full min-h-[44px] items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    <span>
                      <span className="font-medium text-[var(--text-primary)]">{related.name}</span>
                      <span className="ml-2 text-xs text-[var(--text-tertiary)]">{related.provider}</span>
                    </span>
                    <ArrowIcon className="text-[var(--text-tertiary)]" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer className="flex gap-2 border-t border-[var(--border)] px-5 py-4">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <ShareIcon className="h-4 w-4" />
          Share link
        </button>
      </footer>
    </aside>
  )
}