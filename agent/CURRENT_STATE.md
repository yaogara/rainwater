# Current Project State — Rainwater Directory

**Last Updated**: October 11, 2026
**Production Domain**: [https://rainwaterdirectory.com/](https://rainwaterdirectory.com/)

## Production and measurement

- On October 11, production homepage, calculator, robots, sitemap, Puerto Rico state/article pages, and Texas policy page returned HTTP 200. The deploy verifier passed 177 HTML/canonical pages, 126 installer hubs, and 31 state-policy pages.
- Finalized GSC **byProperty** data for September 12–October 9, 2026: **94 impressions, 1 click, CTR 0.010638297872340425, average position 39.287234042553195**. The page-only Illinois state row holds the click (1 impression, position 12), matching Plausible’s one Google visitor. The 39 query/page rows sum to 53 impressions and zero clicks; those partial sums are not property totals. Page-only legality guide: 10 impressions, position 19.4; Tucson: 13 across slash variants; Austin: 8 at 38.75. The Puerto Rico query has 6 impressions at 10.33. This sample is too sparse for ranking or expansion claims.
- In the September 20 rotating 20-URL sample, all 20 returned `Submitted and indexed`. This is a sample, not a sitewide indexed-page count.
- Plausible's latest 30-day summary returned 37 visitors, 53 pageviews, 57% bounce rate, and 11-second average visit duration. Referrers were 36 Direct / None and 1 Google; entry pages were `/` (36 visitors) and `/states/illinois/` (1). This is not evidence of material organic growth.
- Two Astro redirect routes are static HTTP 200 pages with meta refresh. They must not be reported as server-side 301 redirects.

## Data and publication safety

- Inventory: 168 contractor records across 126 city hubs and 31 states.
- Existing contractor records lack claim-level sources. The UI labels them as source review pending, does not display unsupported ratings as verified, and does not emit `LocalBusiness` schema until entity evidence is verified.
- State legal summaries render only when a verified official-guidance record is attached; unsupported state pages and articles disclose that source review is pending.
- New or updated records require a source URL, excerpt, verification date, and claim status. Repeated updates merge with existing data and preserve article copy.
- Rainfall data contains 50 states and identifies the source period as 1971–2000. It is a statewide planning input, not a local measurement. The updater validates and writes atomically, preserving the last valid file on failure.
- Dated SEMrush originals are preserved under `data/seo/raw/`; `data/seo/opportunities.csv` is the working opportunity queue. Historical demand is not current traffic evidence. `npm run build` preserves the untracked 6,506,081-byte `docs/seo/` Numbers research file across Astro output cleanup; its restored copy matches the preserved raw source hash.

## Release and operator controls

- CI runs unit tests, contractor source validation, rainfall validation, the Astro build, and built-site verification before deployment. It saves pre-deploy and public verification receipts tied to the commit.
- Deterministic audit scripts distinguish provider failures from valid zero-result responses and store dated JSON outside the repository.
- The audit correctly recorded a pre-deployment `/calculator/` 404, then succeeded after the public release. Failure evidence remains in the dated snapshot history.
- Hermes jobs share one owner-aware repository write lock and must record run IDs. The Wednesday source/contractor audit is deterministic no-agent work. On October 7 it exited after releasing the lock because `source_monitor.py` encountered a stale PRASA URL that returns HTTP 404; shell command substitution suppressed the monitor's captured diagnostic. The source catalog and wrapper have been corrected so failures remain visible.
- DDGS 9.16.0 and the GSC `cryptography` dependency are available in Hermes's active virtual environment. Repository Python clients must use `/opt/hermes/.venv/bin/python3`; the system Python caused the October 11 daily GSC audit to fail with `cryptography is required to authenticate`. The daily audit script now selects the active venv by default.
- The live Hermes operating cycle is configured as `every 5760m` (four days), next due October 15, 2026 at 13:17:00 UTC. Daily endpoint/indexation/analytics checks remain daily; monthly review and the Wednesday deterministic contractor audit remain scheduled. All four jobs now use the clean operator clone at `/opt/data/state/rainwater/operator-repo`; the dirty source checkout is preserved separately.
- The contractor/source audit passed manually on October 11 using the active venv, and released its owner-aware lock. The operating-cycle prompt now directs the agent to keep a verified commit local and report a publication blocker if non-interactive GitHub authentication is unavailable; do not claim that local commits are deployed.
- Hermes uses `nvidia/nemotron-3-super-120b-a12b` as its primary agent model and the same-account free `nvidia/nemotron-3-ultra-550b-a55b` route as the only fallback. Paid and cross-provider fallbacks remain disabled. Routine health, analytics, source diffs, and validation use scripts without model calls.
- The dependency upgrade now uses Astro 7.3.8, Sharp 0.35.5, and a patched selector parser; `npm audit` reports zero advisories. Astro content collections were migrated and the build retains 177 HTML files. CI uses Node 22.21.1; Hermes container Node 26 meets the project engine floor of 22.19.0. Public deployment proof remains separate from these local checks.

## Active work

- The calculator is shipped; measure usage and search demand before further expansion. EXP-006 remains a measurement task.
- Focus each four-day cycle on one existing useful URL supported by current GSC and primary sources. Texas and California counts are 50 and 43 contractor records, respectively, without claim-level verification.
- The every-four-day operating cycle should improve one existing useful asset using the opportunity queue and primary-source evidence; daily endpoint/indexation/analytics checks remain daily.
- Puerto Rico wording now follows the official Ley 91-2024 text: the act promotes rainwater harvesting and gives agencies implementation duties, but does not itself create a general residential permit exemption or rebate. It cautions against specified uses absent a suitable system and Department of Health evaluation.
- The main legality article now retains the Puerto Rico answer, corrects Utah’s two-container limit and Colorado’s separate well pathway, qualifies Texas statutes, and marks other jurisdictions for legal source review. The September 13 publication date is retained; the substantive revision is dated October 11.

## Monetization decision gate

Review the first pilot only after two consecutive 28-day periods each reach at least 300 non-branded clicks and 30 relevant intent actions. Choose between consent-based installer introductions and disclosed equipment referrals using observed demand and available partners. Organic contractor ordering remains independent of payment.
