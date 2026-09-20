# Current Project State — Rainwater Directory

**Last Updated**: September 20, 2026
**Production Domain**: [https://rainwaterdirectory.com/](https://rainwaterdirectory.com/)

## Production and measurement

- Production, sitemap, and robots endpoints returned HTTP 200 in the September 2026 review.
- GSC now returns early query/page evidence: 18 rows in the September 20 live 28-day query, with no clicks yet. The strongest strike-zone signal is `is it illegal to collect rainwater in puerto rico` at position 10.5 from two impressions; all other observed queries remain sparse.
- In the September 20 rotating 20-URL sample, all 20 returned `Submitted and indexed`. This is a sample, not a sitewide indexed-page count.
- Plausible recorded 17 visitors and 24 pageviews over the latest 30-day period; traffic was entirely direct/none in the current breakdown, so it is not evidence of organic growth yet.
- Two Astro redirect routes are static HTTP 200 pages with meta refresh. They must not be reported as server-side 301 redirects.

## Data and publication safety

- Inventory: 168 contractor records across 126 city hubs and 31 states.
- Existing contractor records lack claim-level sources. The UI labels them as source review pending, does not display unsupported ratings as verified, and does not emit `LocalBusiness` schema until entity evidence is verified.
- State legal summaries render only when a verified official-guidance record is attached; unsupported state pages and articles disclose that source review is pending.
- New or updated records require a source URL, excerpt, verification date, and claim status. Repeated updates merge with existing data and preserve article copy.
- Rainfall data contains 50 states and identifies the source period as 1971–2000. It is a statewide planning input, not a local measurement. The updater validates and writes atomically, preserving the last valid file on failure.
- Dated SEMrush originals are preserved under `data/seo/raw/`; `data/seo/opportunities.csv` is the working opportunity queue. Historical demand is not current traffic evidence.

## Release and operator controls

- CI runs unit tests, contractor source validation, rainfall validation, the Astro build, and built-site verification before deployment. It saves pre-deploy and public verification receipts tied to the commit.
- Deterministic audit scripts distinguish provider failures from valid zero-result responses and store dated JSON outside the repository.
- The audit correctly recorded a pre-deployment `/calculator/` 404, then succeeded after the public release. Failure evidence remains in the dated snapshot history.
- Hermes jobs share one owner-aware repository write lock and must record run IDs. The Wednesday source/contractor audit is deterministic no-agent work so model failures cannot strand the lock.
- DDGS 9.16.0 is installed in Hermes's active virtual environment. Repository Python clients must use `/opt/hermes/.venv/bin/python3`; the container's system Python lacks the GSC authentication dependency.
- Hermes uses `nvidia/nemotron-3-super-120b-a12b` as its primary agent model and the same-account free `nvidia/nemotron-3-ultra-550b-a55b` route as the only fallback. Paid and cross-provider fallbacks remain disabled. Routine health, analytics, source diffs, and validation use scripts without model calls.

## Active work

- EXP-006: dedicated planning calculator and commercial-intent measurement.
- Initial regional focus: Texas, California, and Austin official guidance/incentives.
- Weekly work should improve one existing useful asset using the opportunity queue and primary-source evidence.

## Monetization decision gate

Review the first pilot only after two consecutive 28-day periods each reach at least 300 non-branded clicks and 30 relevant intent actions. Choose between consent-based installer introductions and disclosed equipment referrals using observed demand and available partners. Organic contractor ordering remains independent of payment.
