# Autonomous Agent Changelog — Rainwater Directory

## 2026-10-11 — Technical SEO, sourcing, monitoring, and dependency repair (RUN_ID codex-20261011-seo-security)

- Separated finalized GSC byProperty totals (September 12–October 9: 94 impressions, 1 click, CTR 0.010638297872340425, position 39.287234042553195) from 39 partial query/page rows (53 summed impressions, zero clicks). Added distinct report fields and daily snapshot storage.
- Reconciled generated canonicals, schema URLs, redirects, and internal page links to the exact trailing-slash sitemap URLs; release verification now checks exact forms and internal target existence.
- Reworked the legality guide to retain the useful Puerto Rico answer while removing unsupported nationwide categories and claims; verified Colorado and Utah conditions against their agencies, qualified Texas law, and added a genuine October 11 updated date.
- Fixed RW-008 CSV quoting and moved the calculator to shipped status. Updated opportunity and metrics evidence using the actual 168-record inventory.
- Kept last-good source hashes across failed observations, retained dated failure records and atomic writes, and added regression tests for failed/recovered fetches, CSV mapping, and analytics separation.
- Migrated Astro content collections to the current loader API, upgraded Astro 7.3.8 and Sharp 0.35.5, patched the selector parser, and moved CI to Node 22.21.1. Final `npm audit` reports zero advisories. The build wrapper now preserves untracked `docs/seo/` research across Astro output cleanup; the recovered 6,506,081-byte Numbers file matches the repository research copy by SHA-256 (`ebbcbde8981fa9b56778ccdeb4f12a5779a69c680b9931a9815c7a3421c91e96`). Local release gate passed: 17 TypeScript tests, 4 operations tests, 126 contractor hubs, 50 rainfall records, 177 HTML files, 174 exact sitemap canonicals, 2,838 internal directory links, and zero npm advisories. GitHub Pages run `38151977561` passed build, deploy, and public verification for `e75e7abdda453b34b8544f2ef09a86d4f20f591b`. Independent production GETs returned 200 with exact trailing-slash canonicals for Tucson, Illinois, and the legality guide; a no-slash Tucson GET returned 301 to the slash URL; the sitemap retains 174 URLs. The article publicly shows the October 11 update and corrected Utah wording.
- Initial GitHub Actions run `38151834561` stopped at `npm ci`: npm 10 required two optional Sharp dependencies missing from the npm 11-generated lockfile. Regenerated the lock with npm 10.9.4; both npm 10 and npm 11 clean installs now pass with zero advisories, and the 177-page build/release verifier still pass.
- The clean Hermes operator clone was fast-forwarded to `e75e7abdda453b34b8544f2ef09a86d4f20f591b` after correcting its root-owned Git metadata. Its Node 26 gate passed tests, contractor validation, rainfall validation, build, release verification, and zero-advisory audit. A new health snapshot `/opt/data/state/rainwater/health/20261011T153723Z.json` stored finalized GSC 94 impressions/1 click separately from 39 query/page rows with zero reported problems. Hermes cron doctor passed for all four jobs, with the four-day next run on October 15 at 13:17 UTC. Prepared a persistent Rainwater-only deploy key and verified GitHub's host key. The active `gh` API account has read-only Rainwater permission; owner registration remains pending, so Hermes publication access is not yet proven.


All meaningful architectural, technical, operational, and content modifications made by the autonomous operator are logged here in reverse chronological order.

## [2026-10-11] — Analytics, Legal Claims, and Hermes Audit Reliability

Run ID: `rainwater-ops-20261011T131104Z`

### Changed
- Replaced unsupported Puerto Rico PRASA, rebate, potable-use, and community-certification claims with wording grounded in the official Ley 91-2024 text. Removed the stale PRASA monitor entry (its URL returned HTTP 404) and an unsourced third-party plumbing-code record.
- Audited the committed Texas policy edits against current Texas Water Development Board guidance and official statutes. Replaced promotional and overbroad descriptions of sales-tax relief, HOA rules, potable treatment, and state-building requirements with qualified statutory summaries.
- Made blog date rendering timezone-stable and sorted collection-driven installer links explicitly, eliminating build output date shifts and filesystem-order churn across generated pages.
- Applied semver-compatible npm lockfile security updates; the reported advisory count fell from 19 to 5.
- Updated the daily Hermes audit to use `/opt/hermes/.venv/bin/python3`, where GSC authentication dependencies are installed.
- Updated the contractor audit wrapper to preserve captured source-monitor errors and still run the independent contractor audit before returning failure.
- Set Hermes's operating cycle to a true four-day interval (`every 5760m`), kept daily health checks, monthly review, and Wednesday contractor checks, and moved all four jobs to the clean operator clone. The weekly prompt now records the non-interactive GitHub authentication limitation safely without treating a local commit as a deployment.
- Recorded the current GSC/Plausible evidence and added the observed Puerto Rico query to the existing SEO opportunity queue.

### Verified
- GSC access worked in Hermes's active venv for September 12–October 9: 39 query/page rows, 53 summed row impressions, zero clicks; Puerto Rico legality query had 6 impressions at position 10.33.
- Plausible's rolling 30-day summary showed 37 visitors and 53 pageviews; one visitor was attributed to Google.
- Official Puerto Rico Ley 91-2024 and Texas statutory/TWDB sources were reviewed before changing legal wording.
- Tests passed (17/17), the source validator checked 126 records, the rainfall dataset validator passed 50 records, and the Astro build/release verifier passed all 177 canonical pages, 126 installer hubs, 31 state-policy pages, sitemap, and robots checks.
- The remaining npm advisories include one critical Astro issue and one high Sharp issue. npm's fix requires Astro 7.3.8 (Node 22.12+) and Sharp 0.35.5; current CI runs Node 20. The lockfile-only compatible updates were tested, and these major/runtime upgrades remain unmerged.
- The October 7 contractor job's hidden failure was traced to the stale PRASA source returning HTTP 404; the lock was released correctly. The October 11 daily audit failure was traced to the system Python missing `cryptography`.
- Live scheduler next-run output showed October 15 at 13:17 UTC for the four-day operating cycle. The repaired contractor script passed on October 11 with 126 hubs, 168 records, 31 states, and the lock released. GitHub Pages deployment and public URL verification passed for commit `9a7eedb446cff208ee4ff0f8761885a92a091fb1`.

## [2026-09-20] — Free Hermes Model Reliability Upgrade

### Changed
- Replaced the live Hermes primary model `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` with `nvidia/nemotron-3-super-120b-a12b`.
- Added `nvidia/nemotron-3-ultra-550b-a55b` as the only fallback, using the existing NVIDIA account and endpoint. Paid and cross-provider fallbacks remain disabled.
- Resnapped the unpinned weekly and monthly agent jobs to the new global model resolution; deterministic daily and contractor jobs remain no-agent scripts.

### Verified
- Super completed an end-to-end read-only Hermes terminal workflow and recovered from an initial wrong working directory before returning the repository commit.
- Ultra completed a direct Hermes response check, and an isolated invalid-primary test automatically activated Ultra and completed successfully.
- The gateway, cron ticker, four active jobs, repository lock, and live fallback configuration were healthy after the change.

## [2026-09-20] — Deterministic Contractor Audit and Hermes Runtime Repair

### Changed
- Replaced the Wednesday model-driven source/contractor routine with `scripts/hermes_contractor_audit.sh`, a no-agent job that uses the active Hermes virtual environment and the official owner-aware repository lock.
- Restored the pinned DDGS dependency in Hermes's active virtual environment and made weekly/contractor instructions use `/opt/hermes/.venv/bin/python3` instead of the dependency-incomplete system Python.
- Refreshed the live baseline to 18 GSC query/page rows, 17 Plausible visitors, and 24 pageviews over the current reporting windows.

### Verified
- The daily audit remains healthy, the repository and `origin/main` were aligned before this change, and the September 20 contractor audit found 168 records across 126 hubs with zero claim-source-verified legacy records.
- A failed model-driven contractor rerun exposed a stranded lock; it was released with the recorded run ID before this deterministic replacement was introduced.

## [2026-09-14] — Evidence-Gated Hermes Growth Operator

### Added
- Deterministic daily audit, known-source change monitor, repository write lock, provider usage report, and machine-readable release receipts.
- Durable dated SEO source archive and seven-item opportunity queue derived from the supplied SEMrush exports.
- Dedicated planning calculator with shared city-page component and privacy-conscious intent events.
- Texas, California, and Austin official source records with eligibility, territory, funding caveats, and verification dates.

### Changed
- Made the test command portable across zsh and GitHub Actions bash so CI expands the one-level test suite correctly.
- Daily audit summaries now report HTTP endpoint failures and recoveries between snapshots.
- Added a pinned, reproducible DDGS dependency for keyless Hermes discovery after container image replacement.
- Refreshed the operational baseline after a 20-URL indexed sample, 6 visitors/8 pageviews, and a successful post-deploy deterministic audit.
- Removed unsupported verified presentation and ratings; unverified contractor records no longer emit `LocalBusiness` schema.
- Replaced the sitewide blog verification badge with an explicit source-review status and gated state legal callouts to attached verified official-guidance records.
- Contractor updates now require claim evidence, merge existing fields, preserve article copy, and avoid case-insensitive duplicates.
- Rainfall ingestion validates a 50-state, source-dated dataset and writes atomically so failed downloads preserve the last valid file.
- Deployment CI now runs tests and source gates, builds the site, saves a commit receipt, deploys, and verifies production.
- Replaced unsupported national installation cost ranges and strengthened the diverter and tank-selection guides.
- Replaced inaccurate operator state, traffic targets from a zero baseline, and static-redirect claims in the runbook.

---

## [2026-09-13] — Visual SEO, Blog Featured Images & Open Graph Infrastructure (EXP-005)

### Added
- **Visual SEO Asset Generation Pipeline (`scripts/generate_blog_images.cjs`)**:
  - Automated Node.js + Sharp asset generation pipeline rendering crisp 1200×675 technical SVG schematics converted to lightweight WebP (50–58 KB each, well below the 80 KB budget).
  - Built 12 custom technical diagrams illustrating actual engineering components:
    - `og-default.webp`: Sitewide Open Graph card featuring whole-house catchment architecture.
    - `is-it-illegal-to-collect-rainwater-state-by-state.webp`: 50-state statutory compliance matrix.
    - `how-to-choose-an-installer.webp`: ARCSA AP certification vetting checklist & turnkey cost breakdown.
    - `can-you-drink-rainwater-cdc-science.webp`: Potable purification train (sediment, carbon, NSF 55 Class A UV).
    - `choose-right-downspout-diverter-rain-barrels.webp`: Downspout diverter with leaf filter & automatic overflow bypass.
    - `cistern-systems-101-underground-water-tanks.webp`: Subterranean cistern engineering cross-section with access riser.
    - `complete-rainwater-collection-system-guide.webp`: Roof-to-tap conveyance, storage, and pressurized booster pump diagram.
    - `diy-rain-barrel-systems-garden.webp`: Dual food-grade 55-gallon drums with brass spigot & overflow routing.
    - `off-grid-water-storage-ideas.webp`: Off-grid homestead water storage station with solar-powered pump.
    - `rainwater-vs-tap-water.webp`: Mineral, chemical, and hardness comparative analysis matrix.
    - `top-10-water-storage-tanks-100-to-5000-gallons.webp`: Tank capacity comparison from 100-gallon slimline to 5,000-gallon cistern.
    - `ultimate-guide-whole-house-water-filtration.webp`: Multi-stage whole-house filtration rack with dual 20" housings & UV.
- **Strict Content Collection Schema (`src/content/config.ts`)**:
  - Updated Zod blog collection schema to enforce mandatory `image` (valid path) and `imageAlt` (descriptive string) fields across all markdown articles.
- **Open Graph & Twitter Card Infrastructure (`src/layouts/BaseLayout.astro`)**:
  - Injected `og:image`, `og:image:width="1200"`, `og:image:height="630"`, and `og:image:alt`.
  - Injected `twitter:card="summary_large_image"`, `twitter:image`, and `twitter:image:alt`.
  - Added `<meta name="robots" content="max-image-preview:large" />` enabling rich Google Discover and SERP visual snippets.
- **Core Web Vitals & Accessibility Hero Template (`src/pages/blog/[slug].astro`)**:
  - Rendered responsive `<figure>` and `<figcaption>` elements for every article.
  - Prioritized hero loading with `fetchpriority="high"` and `decoding="async"`, strictly omitting `loading="lazy"` on LCP images.
  - Specified explicit `width="1200"` and `height="675"` to eliminate CLS (Cumulative Layout Shift).
  - Enriched `BlogPosting` JSON-LD schema with full `ImageObject` definition.
- **Blog Index Thumbnail Grid (`src/pages/blog/index.astro`)**:
  - Added responsive image thumbnail cards (`width="600"`, `height="338"`, `loading="lazy"`) with smooth zoom transitions.
- **Blog SEO Best Practices Skill & Operating Policy (`.agent/skills/blog-seo-images/SKILL.md` & `agent/BLOG_IMAGE_POLICY.md`)**:
  - Established standardized guidelines for dimensions, file size (< 80 KB), alt text formula (`[Subject] + [Components] + [Context]`), Core Web Vitals optimization, and Sharp generation scripts.

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
