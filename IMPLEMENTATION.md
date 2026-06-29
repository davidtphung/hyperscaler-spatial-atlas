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

**Trackable commitment model** (`src/types/trackableCommitment.ts`):

- Full fields: term dates, utilization, remaining value, service/product scope, status, forecast signals
- `commitmentFamily`: MACC, Azure Savings Plans, AWS SP/RI/EDP, GCP CUD, nuclear PPA, etc.
- `domain`: cloud_spend | energy | policy | infrastructure

Unified dataset: `ALL_COMMITMENTS` in `src/data/unifiedRegistry.ts` merges chronology + `cloudSpendCommitments.ts`.

Legacy `CommitmentRecord` remains for backward compatibility via `legacyToTrackable()`.

## Pages

| Route | Purpose |
|-------|---------|
| `/dashboard` | KPI cards, era breakdown, utilization, capex chart |
| `/cloud` | MACC, Azure/AWS savings plans, utilization table |
| `/timeline` | Unified cloud + energy timeline + evidence drawer |
| `/review` | Analyst audit table with review mode columns |
| `/map` | Spatial infrastructure explorer |
| `/compare` | Era-tabbed company metrics + capex bars |
| `/forecasts` | Scenario toggles |
| `/sources` | Categorized bibliography |
| `/about` | Methodology |

See `ASSUMPTIONS.md` for data limitations.

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