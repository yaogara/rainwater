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
- **Hypothesis**: 301 redirecting `rainwatercontractors.com` to `https://rainwaterdirectory.com/installers/` with path preservation will pass initial domain signals and consolidate brand discovery.
- **Metric**: Inbound referral traffic and search queries on contractor terms.

### Experiment 9: "Claim This Listing" Conversion Architecture
- **Hypothesis**: Adding clear, prominent listing claim CTAs on city and contractor cards will encourage genuine business owner submissions and crowdsourced data enrichment.
- **Metric**: Contractor submission volume via `hello@rainwaterdirectory.com`.

### Experiment 10: State Rebate & Financial Incentive Guides
- **Hypothesis**: Producing dedicated deep dives on major municipal rebate programs (e.g., Austin Water $0.50/gal cistern rebate, Tucson Water $2,000 rebate) will capture high-intent buyers preparing to purchase systems.
- **Metric**: Organic search traffic on rebate and incentive queries.
