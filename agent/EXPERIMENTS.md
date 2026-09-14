# SEO Experiments Framework & Top 10 Prioritized Initiatives

This document defines the methodology for running iterative SEO experiments and outlines the first 10 high-leverage initiatives for `rainwaterdirectory.com`.

---

## Experiment Protocol

Every experiment must follow this lifecycle:
1. **Hypothesis**: Specific expected impact on organic traffic, CTR, or rankings.
2. **Control vs. Variant**: Define the page cohort or baseline measurement.
3. **Execution**: Implement changes adhering to `SEO_RULES.md`.
4. **Evaluation Window**: 14 to 28 days minimum to allow search re-crawling.
5. **Outcome & Rollout**: Document result in this file; scale if positive, revert if negative.

---

## Initial 10 Prioritized SEO Experiments

### Experiment 1: Dedicated `/installers` Hub Architecture
- **Hypothesis**: Creating a root `/installers` hub targeting contractor keywords will capture high-volume national terms (`rainwater harvesting contractors`, `rainwater system installers`) and provide an anchor destination for the secondary domain.
- **Status**: Implemented during initial migration.
- **Metric**: Impressions and clicks for generic contractor keywords.

### Experiment 2: State-Specific Intent Titles & Meta Descriptions
- **Hypothesis**: Replacing generic title templates (`[State] Rainwater Harvesting Installers`) with high-CTR, benefit-driven templates (`Top Rainwater Harvesting Installers in [State] (Rebates & Codes)`) will lift organic CTR by 20–35%.
- **Cohort**: Top 10 states by search volume (Texas, California, Florida, Arizona, Ohio, etc.).
- **Metric**: GSC average CTR.

### Experiment 3: Interactive Rain Catchment Calculator Asset
- **Hypothesis**: Building a lightweight clientside calculator (`/calculator` or `/tools/rain-harvesting-calculator`) allowing users to enter roof square footage and rainfall to estimate annual gallons captured will earn natural editorial links and rank for `rainwater harvesting calculator` (1,000+ monthly searches).
- **Metric**: Direct inbound links, social shares, rankings.

### Experiment 4: FAQ Schema Expansion on High-Volume State Guides
- **Hypothesis**: Expanding JSON-LD `FAQPage` schema on state pages to answer specific legal questions (`Is it legal to collect rainwater in Texas?`, `What rebates are available in Austin?`) will generate rich snippet SERP expansions and improve CTR.
- **Metric**: Rich result impressions in GSC search appearance tab.

### Experiment 5: City Page Local Context & Rainfall Normal Integration
- **Hypothesis**: Injecting exact local annual precipitation normals (inches) and estimated catchment yield into city headers will reduce bounce rates and differentiate programmatic city pages from competitors.
- **Metric**: Time on page, bounce rate, ranking position.

### Experiment 6: Internal Link Clustering (Pillar-to-Cluster Cross-Linking)
- **Hypothesis**: Linking directly from technical blog guides (e.g., `Complete Rainwater Collection System Guide`) to relevant state and city contractor directories will transfer internal PageRank and lift location page rankings.
- **Metric**: Location page crawl frequency and indexation speed.

### Experiment 7: Breadcrumb Navigation JSON-LD Enhancement
- **Hypothesis**: Refining full hierarchical breadcrumb schema on city pages (`Home > States > [State] > [City]`) will give Google clear categorical depth signals and produce clean breadcrumb trails in SERPs.
- **Status**: Deployed.
- **Metric**: SERP URL appearance and CTR.

### Experiment 8: Secondary Domain Forwarding Optimization
- **Hypothesis**: A future edge-level 301 from `rainwatercontractors.com` to `https://rainwaterdirectory.com/installers/`, with path preservation, could consolidate brand discovery. This is not currently implemented.
- **Metric**: Inbound referral traffic and search queries on contractor terms.

### Experiment 9: "Claim This Listing" Conversion Architecture
- **Hypothesis**: Adding clear, prominent listing claim CTAs on city and contractor cards will encourage genuine business owner submissions and crowdsourced data enrichment.
- **Metric**: Contractor submission volume via `hello@rainwaterdirectory.com`.

### Experiment 10: State Rebate & Financial Incentive Guides
- **Hypothesis**: Producing dedicated deep dives on major municipal rebate programs (e.g., Austin Water $0.50/gal cistern rebate, Tucson Water $2,000 rebate) will capture high-intent buyers preparing to purchase systems.
- **Metric**: Organic search traffic on rebate and incentive queries.

---

## Active In-Flight Experiments Log

### EXP-006: Planning Journey and Intent Measurement
- **Target**: `/calculator/`, city pages, installer links, and equipment-guide links.
- **Hypothesis**: Separating annual collection potential from demand-based storage, while connecting results to verified local guidance and practical next steps, will earn useful search traffic and reveal whether installer or equipment intent is stronger.
- **Start Date**: September 14, 2026.
- **Evaluation Window**: Two consecutive 28-day periods before monetization review.
- **Primary Metrics**: Non-branded GSC clicks, calculator completions, installer website/telephone clicks, and equipment-guide visits.
- **Guardrail**: Assumptions and units remain visible; no local rainfall value is invented; events contain page and region identifiers but no personal data.
- **Status**: Implemented; awaiting production baseline.

### EXP-001: Apex Domain Migration & Canonical Alignment
- **Target**: Entire site (170 URLs).
- **Hypothesis**: Transitioning from GitHub Pages project subpath to custom apex domain `https://rainwaterdirectory.com` with clean canonicals and sitemap will establish a crawlable root authority.
- **Start Date**: September 12, 2026.
- **Evaluation Window**: 30 days (through October 12, 2026).
- **Primary Metric**: Indexation count in GSC and initial crawl coverage.
- **Status**: Running.

### EXP-002: Pillar Content Rehabilitation — Installer Vetting & Cost Guide
- **Target URL**: `https://rainwaterdirectory.com/blog/how-to-choose-an-installer`
- **Hypothesis**: Upgrading the 9-line (~70 words) stub into an authoritative, 2,000+ word industry-standard contractor vetting guide with ARCSA AP credentials, a 10-question evaluation table, turnkey cost benchmarks, and structured internal links to `/installers/` and top state hubs will:
  1. Eliminate thin content risk on the blog.
  2. Rank for high-intent queries: `how to choose rainwater harvesting installer`, `rainwater harvesting contractors`, `questions to ask rainwater installer`.
  3. Increase internal click-throughs from educational readers to local installer directory pages.
- **Control**: 9-line unformatted stub with 0 internal links and 0 impressions.
- **Variant**: Comprehensive guide with semantic H2/H3s, 3 structured comparison tables, 10-point vetting framework, cost benchmarks, red flags, and 12 directory links.
- **Start Date**: September 13, 2026.
- **Evaluation Window**: 28 days (through October 11, 2026).
- **Primary Metrics**: GSC impressions, average position, clicks, and Plausible pageviews.
- **Status**: Active / Deployed.

### EXP-003: Evergreen State Legality Consolidation & 50-State Statutory Matrix
- **Target URL**: `https://rainwaterdirectory.com/blog/is-it-illegal-to-collect-rainwater-state-by-state`
- **Hypothesis**: Upgrading the outdated 2025 guide into an evergreen 2026 edition featuring a comprehensive 50-state statutory reference table, consolidating the duplicate stub through static redirect pages, and establishing contextual links into state directory hubs will:
  1. Capture high-volume national and state-level informational queries (`is rainwater harvesting illegal in [state]`, `rainwater collection laws by state 2026`).
  2. Eliminate keyword cannibalization between competing legal articles.
  3. Funnel organic legal search traffic directly into local installer directories.
- **Control**: Dated 2025 post with missing headers, raw URL strings, incomplete state bullets, and cannibalizing sibling stub.
- **Variant**: Comprehensive evergreen guide with full 50-state statutory table, static HTTP 200 meta-refresh pages for legacy stubs, Western state discussions, and state directory links.
- **Start Date**: September 13, 2026.
- **Evaluation Window**: 28 days (through October 11, 2026).
- **Primary Metrics**: GSC impressions, organic clicks, average ranking position, and internal click-throughs to state hubs.
- **Status**: Active / Deployed.

### EXP-004: Programmatic UX & E-E-A-T Enrichment — Interactive Yield Calculator, Statutory Callouts & Verified Specialist Expansion
- **Target URLs**: All 126 programmatic city hubs (`/installers/[state]/[city]`), 31 state hubs (`/states/[state]`), and installer cards.
- **Hypothesis**:
  1. Integrating an interactive, client-side Catchment Sizing & Annual Yield Calculator (powered by NOAA 30-year precipitation normals) differentiates programmatic city pages from generic directory spam and dramatically increases on-page engagement.
  2. Rendering dynamic state statutory notices with primary code citations (e.g. C.R.S. § 37-96.5-103, Tex. Tax Code § 151.355) establishes strong E-E-A-T authority and funnels users to the 50-state legal guide.
  3. Enriching contractor cards with physical street addresses, verified certification badges (ARCSA AP, ASSE, licensed plumbers), review counts, and 10-point contractor vetting links (`/blog/how-to-choose-an-installer`) elevates user trust and outbound click-through rates.
  4. Adding contractor records in underserved states expanded the directory to 168 records across 126 cities. Their source status is now explicitly pending until claim evidence is attached.
- **Control**: Thin city templates displaying unbadged company cards with no address, no review count, no local precipitation data, and placeholder FAQ schema.
- **Variant**: City and state templates with a planning calculator, legal callout, and contractor source-status labels. Unverified records do not emit LocalBusiness or aggregate-rating schema.
- **Start Date**: September 13, 2026.
- **Evaluation Window**: 28 days (through October 11, 2026).
- **Primary Metrics**: GSC impressions and clicks for `[city] rainwater installer` queries, bounce rate, average session duration in Plausible, and outbound contractor clicks.
- **Status**: Active / Deployed.

