# Hyperscaler Public-Data Research Memo

**Prepared:** June 28, 2026  
**Scope:** Microsoft, Amazon/AWS, Alphabet/Google Cloud, Meta, Oracle, Apple, and industry benchmarks  
**Era definitions:**
- **Pre-AI boom:** founding through calendar/FY 2022 (cloud-scale buildout; pre-ChatGPT capex regime)
- **AI boom:** 2023–present (generative AI capex surge, GPU clusters, nuclear PPAs)
- **Current state:** FY/CY 2025–2026 disclosures
- **Forward-looking:** 2028–2030 model scenarios (explicitly labeled estimates)

**Data package:** `research/data/*.csv` — all rows include source URL, source type, and confidence (`direct`, `inferred`, `estimated`).

---

## Executive summary

Hyperscaler infrastructure spending has undergone a **step-change since 2023**. SEC-reported property & equipment capex for Microsoft, Alphabet, and Meta roughly **doubled or tripled** between FY/CY 2023 and 2025. Oracle’s capex jumped from **$8.7B (FY2023)** to **$55.7B (FY2026)** amid AI cloud and Stargate-related buildout. Amazon’s infrastructure additions remain the largest absolute envelope, with **~$83B** cited for 2024 in earnings materials.

Electricity demand is rising in parallel. The **IEA** estimates global data-centre consumption reached **~415 TWh in 2024**, with a base-case path toward **~945 TWh by 2030**. **LBNL** puts US data-centre use at **176 TWh in 2023** (~4.4% of US electricity). The AI boom shifted procurement from “renewables-first” toward an **“all-of-the-above”** strategy: large **nuclear PPAs** (Microsoft/Constellation 835 MW; Meta/Vistra 2,609 MW; Amazon/Talen 960 MW), continued **renewable PPAs**, and growing reliance on **grid power and gas** where interconnect queues bind.

---

## 1. Master chronology (by company)

Full event-level data: `research/data/hyperscaler_master_chronology.csv` (60+ sourced milestones).

### Amazon / AWS
| Period | Highlights |
|--------|------------|
| Pre-AI | AWS launch (2006); global region buildout; Climate Pledge (2019); PPE additions peaked ~$72B (2021) then moderated (2022: $61B SEC) |
| AI boom | Trainium/Inferentia scale-up; Anthropic investment ($4B); 2024 capex ~$83B (earnings); Talen nuclear PPA (960 MW) |
| Current | 39 regions, 123 AZs; nuclear capacity pledge signatory (2025) |

### Microsoft / Azure
| Period | Highlights |
|--------|------------|
| Pre-AI | Azure GA (2010); OpenAI $1B (2019); carbon-negative 2030 pledge; capex $20–28B (FY2021–23) |
| AI boom | Copilot/Bing AI (Feb 2023); capex $44.5B (FY2024); Azure growth ~29% (FY24 Q4) |
| Current | Capex **$64.6B (FY2025 SEC)**; Constellation Three Mile Island restart PPA (**835 MW**) |

### Alphabet / Google Cloud
| Period | Highlights |
|--------|------------|
| Pre-AI | App Engine (2008); TPU (2016); capex ~$25–32B (2021–23) |
| AI boom | Gemini (Dec 2023); capex **$52.5B (2024)** → **$91.5B (2025 SEC)** |
| Current | Kairos SMR agreements; continued 24/7 carbon-free energy procurement |

### Meta
| Period | Highlights |
|--------|------------|
| Pre-AI | Open Compute (2011); metaverse capex peak **$31.4B (2022)** |
| AI boom | Capex re-accelerates: **$37.3B (2024)** → **$69.7B (2025 SEC)** |
| Current | **Vistra nuclear PPAs: 2,609 MW** (20-year); 1–4 GW nuclear RFP |

### Oracle
| Period | Highlights |
|--------|------------|
| Pre-AI | OCI Gen2 expansion (2016); modest capex ~$5–9B |
| AI boom | **Stargate** announced ($500B program, Jan 2025); capex **$21.2B (FY2025)** → **$55.7B (FY2026 SEC)** |

### Apple
| Period | Highlights |
|--------|------------|
| Pre-AI / AI | Lower disclosed capex vs cloud peers (~$9–11B); Apple Intelligence (2024); 2030 carbon-neutral supply chain goal |
| Note | Less public data-center footprint disclosure; energy impact mainly via supply chain and private infrastructure |

---

## 2. Cross-company comparison (pre-AI vs post-AI)

See `research/data/hyperscaler_comparison_matrix.csv`.

| Metric | Pre-AI reference | AI / current | Change |
|--------|------------------|--------------|--------|
| **Microsoft capex** | $28.1B (FY2023) | $64.6B (FY2025) | **+130%** |
| **Alphabet capex** | $32.3B (2023) | $91.5B (2025) | **+184%** |
| **Meta capex** | $27.1B (2023) | $69.7B (2025) | **+158%** |
| **Oracle capex** | $8.7B (FY2023) | $55.7B (FY2026) | **+540%** |
| **Cohort capex (est.)** | ~$149B (2022) | ~$355B (2025) | **~2.4×** |
| **Global DC electricity** | ~380 TWh (est. 2023) | 415 TWh (2024 IEA) | **+9% in 1 yr** |
| **Nuclear PPAs (disclosed)** | Rare pre-2023 | **>4 GW** combined MSFT/META/AMZN | Structural shift |

### Pre-AI vs post-AI — thematic summary

| Dimension | Pre-AI boom | Post-AI boom |
|-----------|-------------|--------------|
| **Capex driver** | Cloud regions, storage, enterprise SaaS | GPU/TPU clusters, inference at scale, custom silicon |
| **Data center scale** | Steady regional expansion | “Gigawatt campuses,” liquid cooling, higher rack density |
| **Power strategy** | Renewable PPAs, efficiency (PUE) | Nuclear restarts/uprates, SMR bets, colocation at plants |
| **Sustainability posture** | 100% renewable matching | 24/7 carbon-free + firm low-carbon baseload |
| **Grid relationship** | Large customer | **Grid-shaping** (PPAs that extend plant life, uprates) |

---

## 3. What changed after the AI boom

1. **Capex intensity discontinuous jump (2023–2025)** — not a smooth trend; SEC filings show step-change aligned with ChatGPT-era demand (see capex chart CSV).
2. **Workload physics** — shift from general compute to **GPU-dense training/inference** → higher kW/rack, liquid cooling, water stress in hot regions.
3. **Energy procurement = competitive moat** — multi-GW nuclear deals signal **firm power** matters as much as silicon.
4. **Oracle re-enters hyperscale tier** — Stargate and OCI capex make Oracle a **top-5 infrastructure spender** by FY2026.
5. **Policy visibility** — hyperscalers at CERAWeek nuclear pledge, state governors endorsing plant uprates; data centers become **industrial policy**.
6. **Interconnection as bottleneck** — grid-constrained scenario: build shifts to sites with existing nuclear/gas and spare transmission.

---

## 4. Forecast scenarios (2028–2030)

See `research/data/hyperscaler_forecast_scenarios.csv`. All forward figures are **model-based** unless cited to IEA.

| Scenario | 2030 global DC TWh | Hyperscaler capex | Nuclear share | Key risk |
|----------|-------------------|-------------------|---------------|----------|
| **Conservative** | 720 | ~$280B/yr | 12% | AI demand plateaus |
| **Base case** | 945 (IEA-aligned) | ~$380B/yr | 18% | Transmission lag |
| **Aggressive** | 1,200 | ~$520B/yr | 22% | Supply chain / water |
| **Grid-constrained** | 800 | ~$300B/yr | 25% | Interconnect queues |

**Assumptions (base case):**
- AI inference grows faster than training after 2027
- Chip efficiency improves ~15–20% per generation (offsets部分 demand)
- PUE improves from ~1.20 toward **1.15** industry average
- Nuclear/SMR deployments slow before 2028; **uprates + restarts** dominate near-term

---

## 5. Most likely energy future (2026–2035)

### Electricity demand
- **Base:** Global data-centre demand **~600 TWh by 2028**, **~945 TWh by 2030** (IEA trajectory).
- US share likely rises from **~4–5%** toward **~8–10%** of national generation by 2030 in aggressive cases.

### PUE trends
- Air-cooled legacy: 1.25–1.4  
- Modern hyperscale: **1.1–1.2**  
- AI-dense liquid-cooled: **1.05–1.15** (facility level; chip thermal density still raises site MW)

### Nuclear & geothermal
- **Near-term winner: existing nuclear** (PPAs, uprates, restarts) — already contracted >4 GW.
- **SMRs:** Google/Kairos and others — meaningful before **2030** only in optimistic timelines.
- **Geothermal:** pilot interest (e.g. Google Fervo partnerships) — niche through 2030.

### Renewables & PPAs
- Remain largest **reported** procurement bucket, but **firmness gap** pushes nuclear/gas for 24/7 AI loads.

### Gas as bridge
- Rising in grid-constrained US regions where renewables + storage cannot interconnect fast enough.

### Storage / flexibility
- Battery storage at campus level for ride-through; grid-scale storage critical for renewable matching.

### Transmission bottlenecks
- **Primary constraint** in PJM, parts of US South, and emerging markets; drives siting near existing plants.

### Water & cooling
- Liquid cooling adoption increases **water quality** and **heat rejection** scrutiny; arid regions face permitting risk.

---

## 6. Charts & visual data

Chart-ready CSVs (import to Excel/Tableau):
- `hyperscaler_chart_capex.csv` — capex by company × year
- `hyperscaler_chart_power_demand.csv` — US/global TWh
- `hyperscaler_chart_energy_mix.csv` — estimated procurement mix by company (labeled **estimated**)

---

## 7. Uncertainty & limitations

- **Amazon 2023–2025 capex:** SEC tag `PropertyPlantAndEquipmentAdditions` ends 2022 in XBRL; 2024 figure from **earnings release**, not identical line item.
- **Company-level MW:** Rarely disclosed; site-level estimates in interactive atlas are **demo data**, not this research set.
- **Energy mix chart:** Model allocation from public PPAs — not company-reported percentages.
- **Oracle FY2026:** SEC data accessed June 2026; treat as latest filing available in dataset pull.
- **IEA / LBNL:** Agency methodologies differ; do not sum US and global rows without adjustment.

---

## 8. Bibliography

Full source list: `research/data/hyperscaler_bibliography.csv` (15 primary entries + SEC EDGAR APIs).

**Primary anchors:**
- SEC XBRL Company Facts API (MSFT, AMZN, GOOGL, META, ORCL, AAPL)
- IEA, *Energy and AI* (2025)
- LBNL, *United States Data Centers Energy Usage* (2024)
- Vistra/Meta, Talen/Amazon, Constellation/Microsoft press and trade coverage

---

*This memo is suitable for strategy decks and investor briefings. Reproduce figures only with citation to underlying CSV row and source URL.*