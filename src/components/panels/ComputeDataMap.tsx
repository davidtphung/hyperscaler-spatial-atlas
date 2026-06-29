import type { SpatialNode } from '../../types'
import { getComputeProfile } from '../../data/nodeProfiles'
import { CATEGORY_META } from '../../data/categories'

interface ComputeDataMapProps {
  node: SpatialNode
}

const DATA_TYPE_COLORS = [
  '#7c8cff',
  '#3dd6c6',
  '#f0b429',
  '#e879f9',
  '#34d399',
  '#f97316',
]

export function ComputeDataMap({ node }: ComputeDataMapProps) {
  const profile = getComputeProfile(node)
  const category = CATEGORY_META[node.category]

  return (
    <section aria-labelledby="compute-data-heading" className="mt-6">
      <h3
        id="compute-data-heading"
        className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]"
      >
        Compute & data profile
      </h3>
      <p className="mt-1 text-xs text-[var(--text-tertiary)]">
        Dominant workload: {profile.dominantWorkload}
      </p>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-white/3 p-4">
        {/* Workloads lane */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Primary workloads
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {profile.primaryWorkloads.map((w) => (
              <li
                key={w}
                className="rounded-lg border px-2.5 py-1 text-xs font-medium"
                style={{
                  borderColor: `${category.color}55`,
                  backgroundColor: `${category.color}18`,
                  color: category.color,
                }}
              >
                {w}
              </li>
            ))}
          </ul>
        </div>

        {/* Data types lane */}
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Data types in flight
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {profile.dataTypes.map((d, i) => (
              <li
                key={d}
                className="rounded-lg border border-[var(--border)] bg-white/4 px-2.5 py-1 text-xs text-[var(--text-secondary)]"
                style={{ borderLeftWidth: 3, borderLeftColor: DATA_TYPE_COLORS[i % DATA_TYPE_COLORS.length] }}
              >
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Accelerators */}
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Accelerators
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {profile.accelerators.map((a) => (
              <li
                key={a}
                className="rounded-lg bg-[var(--accent)]/10 px-2.5 py-1 font-mono text-xs text-[var(--accent)]"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}