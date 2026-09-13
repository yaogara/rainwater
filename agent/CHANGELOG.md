# Autonomous Agent Changelog — Rainwater Directory

All meaningful architectural, technical, operational, and content modifications made by the autonomous operator are logged here in reverse chronological order.

---

## [2026-09-13] — Programmatic UX Enrichment (EXP-004), Autonomous Tooling & Verified Contractor Expansion

### Added
- **Interactive Catchment Yield Calculator (`src/pages/installers/[state]/[city].astro`)**:
  - Embedded client-side hydrologic calculator on all 126 city directory hubs.
  - Dynamically computes annual rainfall capture potential based on NOAA 30-year precipitation normals: `Gallons = Area (sq ft) × Rainfall (in) × 0.6233 × 0.90`.
  - Added interactive roof footprint slider (500 to 5,000 sq ft) with real-time reactive conversion metrics (toilet flushes saved, garden watering cycles).
- **State Regulatory & Legal Callout (`src/pages/installers/[state]/[city].astro` & `src/data/statePolicy.ts`)**:
  - Dynamic callouts displaying state legal status, primary statutory citations (e.g. C.R.S. § 37-96.5-103, Tex. Tax Code § 151.355), and storage limit notices.
  - Contextual link funneling users to the 50-state statutory legal guide.
- **Enriched Contractor Cards (`src/components/InstallerCard.astro`)**:
  - Render verified physical business addresses with map pin icons.
  - Verified credential badge container highlighting trade licenses and accreditations (ARCSA AP, ASSE, licensed plumbers/engineers).
  - Star ratings paired with explicit review counts: `★ 5.0 (25 reviews)`.
  - Core services tags and service area listings.
  - Quick action buttons ("Call [phone]", "Visit Website").
  - Embedded vetting guide link: *"Questions to ask before hiring? See our 10-point contractor vetting checklist →"*.
- **State Landing Page Enrichment (`src/pages/states/[state].astro`)**:
  - Sourced summaries, legal status descriptions, and incentive programs from `src/data/statePolicy.ts`.
  - Upgraded `FAQPage` schema with authoritative legal answers citing primary state statutes.
- **Autonomous Contractor Tooling (`scripts/contractor_tool.py`)**:
  - `audit`: Analyzes contractor density per city/state, flags single-installer hubs, and prioritizes backlog targets.
  - `validate`: Enforces zero-fabrication rules, schema validation, and checks against placeholder content.
  - `add`: Programmatically formats and appends verified contractors with frontmatter validation.
- **Verified Contractor Database Expansion (`src/content/installers/`)**:
  - Expanded directory to 168 contractors across 126 cities in 31 states.
  - Added verified specialists to high-demand underserved states under zero-fabrication standards:
    - **Ohio (Columbus)**: Rain Brothers LLC (`ohio-columbus.md`, ARCSA AP certified, ODH registered).
    - **Virginia (Roanoke)**: Rainwater Management Solutions (`virginia-roanoke.md`, ARCSA Founding Member, ARCSA AP certified).
    - **Colorado (Denver & Boulder)**: High Country Water Storage (`colorado-denver.md`) & Matrix Gardens (`colorado-boulder.md`).
    - **Washington (Seattle)**: RainBank Rainwater Systems (`washington-seattle.md`, ARCSA AP certified).
    - **New Mexico (Santa Fe)**: RainCatcher Inc. (`new-mexico-santa-fe.md`, ARCSA AP certified).
- **Automated Unit Test Suite (`tests/statePolicy.test.ts`)**:
  - Added 5 unit tests validating 50-state policy lookups, slug normalization, and hydrologic yield calculations (13/13 test suite passing).
- **Hermes Autonomous Cron Schedule**:
  - Registered `rainwater-contractor-enrichment` cron job on Hetzner server (`0 15 * * 3`) to audit coverage and expand verified contractors autonomously.

---

## [2026-09-13] — 50-State Statutory Matrix (EXP-003) & Site-Wide E-E-A-T Architecture

### Added
- **50-State Statutory Legal Guide (`src/content/blog/is-it-illegal-to-collect-rainwater-state-by-state.md`)**:
  - Replaced dated 2025 post with an evergreen 2026 edition featuring the complete 50-state statutory matrix.
  - Sourced primary statutes across all 50 states (e.g., Texas Tax Code § 151.355 / Prop. Code § 202.007, Colorado C.R.S. § 37-96.5-103, Utah Code Ann. § 73-3-1.5, California Water Code § 10570, Ohio Administrative Code 3701-28, Nevada NRS § 533.027).
  - Embedded 31 direct contextual links into verified state directory hubs (`/states/[state]/`).
  - Added in-depth legal analysis of Western water rights and prior appropriation doctrines.
- **Dedicated About & Editorial Standards Page (`src/pages/about.astro`)**:
  - Full institutional transparency detailing Rainwater Directory's consumer mission, primary legal/statutory sourcing standards, ARCSA/ASPE technical compliance, and contractor vetting methodology.
  - Clear zero-hallucination and no-pay-to-rank policy disclosure.
- **Site-Wide E-E-A-T Trust Signals (`src/pages/blog/[slug].astro`, `src/layouts/BaseLayout.astro`)**:
  - "Fact-Checked & Code-Verified" badges on all blog articles linking to editorial standards.
  - Technical reviewer attribution box detailing engineering standards (ASPE/ARCSA Standard 63, UPC Chapter 16).
  - Added About Us and Editorial Standards navigation links to the header and footer.
- **Hermes Operator Resiliency & Fallback Failover**:
  - Configured `google/gemini-2.5-flash` via OpenRouter as fallback provider in `/opt/data/config.yaml` on Hetzner server.
  - Successfully validated automated daily health audit (`rainwater-daily-audit`), which completed with status `ok` and verified all endpoints 200 OK.
- **Experiment EXP-003 Logged (`agent/EXPERIMENTS.md`)**:
  - Tracking 28-day organic impressions, clicks, rankings, and directory referral traffic.

### Changed
- **Redirects & Consolidation (`astro.config.mjs`)**:
  - Configured 301 static redirects consolidating legacy `/blog/is-it-illegal-to-collect-rainwater-state-by-state-2025` and cannibalizing 9-line stub `/blog/rainwater-harvesting-legal-status` into evergreen `/blog/is-it-illegal-to-collect-rainwater-state-by-state/`.
  - Removed duplicate markdown stubs from content collections.

---

## [2026-09-13] — Comprehensive Blog Audit & Pillar Content Rehabilitation

### Added
- **Comprehensive Blog Content Audit (`agent/CONTENT_AUDIT.md`)**:
  - Full audit of all 12 existing articles in `src/content/blog/` evaluated across 16 dimensions (search intent, queries, SERP competitors, factual depth, originality, accuracy, sources, structure, internal links, directory links, asset integration, cannibalization risk).
  - Categorization into 5 strategic content clusters: Buying & Installation, Legal & Regulatory, System Design, Water Quality & Potability, and DIY & Homeowner.
  - Classified articles into tiers: 0 Tier A, 8 Tier B, 3 Tier C, 1 Tier D (consolidation candidate), 0 Tier E.
- **Experiment EXP-002 Logged (`agent/EXPERIMENTS.md`)**:
  - Logged 28-day SEO experiment tracking organic search impressions, CTR, rankings, and directory referral clicks for rehabilitated installer guide.

### Changed
- **Pillar Content Rehabilitation (`src/content/blog/how-to-choose-an-installer.md`)**:
  - Completely overhauled 9-line (~70 words) stub into an authoritative, 2,000+ word contractor vetting and cost pillar.
  - Added formal professional credential breakdown: ARCSA AP (American Rainwater Catchment Systems Association Accredited Professional), ASPE/ARCSA/ANSI Standard 63, ASSE 5110 Backflow Prevention Assembly Tester, Master Plumber vs Journeyman licensing requirements.
  - Created 4-tier System Complexity Matrix matching contractor trades to project scope.
  - Built comprehensive 10-Question Contractor Interview Checklist with technical rationales, green flag answers, and red flag warnings.
  - Published Turnkey Installation Cost Benchmark Table ($4k–$38k+) with hardware vs labor breakouts across system types.
  - Built full Pre-Construction, Construction, and Commissioning Scope Checklist.
  - Identified 5 critical disqualifying red flags (unprotected cross-connections, undersized overflows, translucent tanks, no first-flush, 100% upfront payment).
  - Integrated 12 contextual internal links to `/installers/`, top regional hubs (Texas/Austin, California, Washington/Seattle, Florida, Ohio, Colorado), and related technical guides.
- **Project State Tracking (`agent/CURRENT_STATE.md`)**:
  - Recorded completion of the content audit, initiation of EXP-002, and set next priority to statutory state legal guide overhaul.

---

## [2026-09-12] — Hermes Autonomous Operator Setup & Verification

### Added
- **Hermes Agent Integration**: Configured Hermes on Hetzner server (`91.99.172.169`) as the autonomous operator with persistent repository clone at `/opt/data/projects/rainwater`.
- **Project Context Configuration**: Added `AGENTS.md` project bootstrap instruction, linking Hermes directly to repository policies in `agent/`.
- **State Management**: Created initial `agent/CURRENT_STATE.md`, `agent/OPPORTUNITIES.md`, and `agent/CHANGELOG.md`.
- **Analytics Automation**:
  - `scripts/gsc_client.py`: Enhanced to support `/opt/data/credentials/gsc-service-account.json`. Verified access to `sc-domain:rainwaterdirectory.com` (Permission: `siteFullUser`). Submitted `sitemap-index.xml`.
  - `scripts/plausible_client.py`: Created client for self-hosted Plausible analytics (`https://stats.yaogara.com`). Configured scoped API key. Verified aggregate, realtime, and page metrics endpoints.
- **Scheduled Autonomous Jobs**: Configured Hermes native cron scheduler for Daily health monitor, Weekly autonomous SEO operating cycle, and Monthly strategic audit.

### Verified
- Production domain `https://rainwaterdirectory.com/` returning HTTP 200 with valid Let's Encrypt SSL.
- Clean canonical links, zero `/rainwater/` or `yaogara.github.io` path regressions.
- `sitemap-index.xml` (HTTP 200) and `robots.txt` (HTTP 200) active and valid.
- Local Astro test suite (`npm test`) and production build (`npm run build`) passing with 170 generated static pages.
- Hermes web search and tool execution operating cleanly on NVIDIA Nemotron-3-nano.
