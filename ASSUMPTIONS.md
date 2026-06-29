# Assumptions and Limitations

## Cloud spend sample data

MACC, Azure Savings Plan, AWS Savings Plan, RI, and GCP CUD records labeled `(sample)` are **illustrative enterprise examples**. They demonstrate the tracking schema (term, utilization, scope) using structures documented in Microsoft and AWS public guidance. They are not disclosed customer contract values.

**Direct confidence** applies to program definitions and reporting mechanics from official documentation URLs.

**Estimated / inferred confidence** applies to utilization percentages and dollar values unless sourced from a specific public filing.

## Energy and infrastructure records

Chronology events from `research/data/hyperscaler_master_chronology.csv` are mapped to the unified schema. SEC capex figures are direct. MW-class energy deals follow press releases. Energy mix percentages on the map remain modeled.

## Utilization and drawdown

Utilization is shown only where the schema includes `utilizationPct`. Real deployments should replace samples with:

- Azure Cost Management savings plan workbook
- AWS Cost Explorer Savings Plans coverage
- Partner Center MACC balance reports

## Marketplace inclusion

MACC marketplace eligibility varies by enterprise agreement. The sample `macc-marketplace-2024` record flags this as inferred.

## Forecasts

Scenario projections in `#/forecasts` are labeled **estimated**. They do not represent hyperscaler operator forecasts.

## Extension path

1. Connect billing exports or partner APIs for live utilization
2. Add rows to `src/data/cloudSpendCommitments.ts` or a customer CSV import
3. Run `npm run data:build` after research CSV updates