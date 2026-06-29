# Implementation Notes

## Architecture

- **Stack:** React 19, TypeScript, Vite 7, Tailwind CSS v4
- **Routing:** Hash-based (`#/dashboard`, `#/timeline`, `#/map`, etc.) for GitHub Pages compatibility
- **Data pipeline:** `research/data/*.csv` → `src/data/generated/researchData.json` → `commitmentsRegistry.ts`

Regenerate JSON after CSV edits:

```bash
node scripts/generate-research-json.mjs
```

## Schema

Normalized commitment records live in `src/types/commitments.ts`:

- `CommitmentRecord` with company, source provenance, era, category, value/unit, geography, confidence
- `ForecastScenario`, `ComparisonMetric`, `CapexDataPoint` for analytics views

## Pages

| Route | Purpose |
|-------|---------|
| `/dashboard` | KPI cards, era breakdown, capex chart |
| `/timeline` | Filterable scroll timeline + source drawer |
| `/map` | Spatial infrastructure explorer (existing atlas) |
| `/compare` | Era-tabbed company metrics + capex bars |
| `/forecasts` | Scenario toggles (conservative, base, aggressive, grid constrained) |
| `/sources` | Categorized bibliography |
| `/about` | Methodology |

## Adding sources

1. Add rows to `research/data/hyperscaler_master_chronology.csv` or anchor entries in `ANCHOR_COMMITMENTS` inside `commitmentsRegistry.ts`
2. Regenerate JSON
3. New records appear in timeline, dashboard, and exports automatically

## Export

`ExportMenu` supports CSV and JSON download of the filtered dataset plus shareable timeline URLs.

## Accessibility

- Semantic landmarks, dialog drawers with Escape close, keyboard-focusable controls
- Chart `aria-label` / `role="meter"` on comparison bars
- `prefers-reduced-motion` respected globally in `index.css`