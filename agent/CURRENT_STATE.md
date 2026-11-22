# Current Project State — Rainwater Directory

**Last Updated**: November 22, 2026
**Production Domain**: [https://rainwaterdirectory.com/](https://rainwaterdirectory.com/)

## Production and measurement

- Prior live deployment `015fc9f` (Nov 12, RW-007 installation-intent routing on `/blog/how-to-choose-an-installer/`) is live on production. Subsequent local commits (`cc5b643`, `fb469dc`, `4bc2d91`, `1593a11`) remained unpushed until the Nov 22 deploy-key and Arizona incentive repair.
- Latest daily deterministic audit (`20261122T123047Z`, Nov 22, 2026): HTTP 200 on `/`, `/calculator/`, `/sitemap-index.xml`, and `/robots.txt`; 174 sitemap URLs; zero problems.
- Finalized GSC **byProperty** data for October 24–November 20, 2026: **6 impressions, 0 clicks, 0% CTR, average position 27.5**. The single query/page row (`"the rain store" "85716"` -> `/installers/arizona/tucson/`) accounts for 3 impressions at position 31.67. This sample remains sparse; do not extrapolate from partial row sums.
- Plausible latest 30-day summary (Nov 22 snapshot): **18 visitors, 53 pageviews, 56% bounce rate, 82s average visit duration**.
- Two Astro redirect routes are static HTTP 200 pages with meta refresh. They must not be reported as server-side 301 redirects.

## Data and publication safety

- Inventory: 168 contractor records across 126 city hubs and 31 states (0 claim-level source-verified contractor records).
- Existing contractor records lack claim-level sources. The UI labels them as source review pending, does not display unsupported ratings as verified, and does not emit `LocalBusiness` schema until entity evidence is verified.
- State legal summaries render only when a verified official-guidance record is attached; unsupported state pages and articles disclose that source review is pending.
- `data/sources/incentives.json` tracks 5 verified primary sources: Austin Water rebate, Texas TWDB guidance, SoCal Water$mart, Puerto Rico Ley 91-2024, and Tucson Water Rainwater Harvesting Rebate.
- On November 22, 2026, the Tucson Water rebate entry was verified against Tucson Water's reopened July 2026 One Water 2100 Plan rules (up to $1,999 total: up to $1,900 storage + up to $99 Treebate; canonical URL `/Departments/Tucson-Water/...`), and the expired Arizona Residential Water Augmentation System Credit (`A.R.S. § 43-1090.01`, expired after tax year 2025) was removed before release.
- Rainfall data contains 50 states and identifies the source period as 1971–2000. It is a statewide planning input, not a local measurement. The updater validates and writes atomically, preserving the last valid file on failure.
- Dated SEMrush originals are preserved under `data/seo/raw/`; `data/seo/opportunities.csv` is the working opportunity queue (RW-001 through RW-008 shipped). `npm run build` preserves untracked `docs/seo/` files across Astro output cleanup.

## Release and operator controls

- CI runs unit tests, contractor source validation, rainfall validation, the Astro build, and built-site verification before deployment. It saves pre-deploy and public verification receipts tied to the commit.
- Canonical Hermes operator repository is unified at `/opt/data/projects/rainwater` (cron `workdir` and wrapper scripts `/opt/data/scripts/rainwater-*.sh` point here; `/opt/data/state/rainwater/operator-repo` is synced cleanly).
- Non-interactive publication uses the registered Rainwater SSH deploy key in `/opt/data/state/rainwater/ssh/rainwater_deploy` (`core.sshCommand = ssh -F /opt/data/state/rainwater/ssh/config`, pushurl `git@github.com:yaogara/rainwater.git`).
- `scripts/source_monitor.py` uses a `curl` fallback for HTTP 403 WAF responses (e.g., `tucsonaz.gov`), retries transient errors once, tracks `consecutive_failures`, preserves `last_good`, and exits `2` on transient outages (vs `1` on permanent 404/410 or `--strict`). `scripts/hermes_contractor_audit.sh` treats exit `2` as a non-fatal warning so Wednesday audits complete without failing the job.
- `scripts/gsc_client.py` retries transient network/HTTP errors once and wraps `OSError`/`TimeoutError`/`http.client.HTTPException` into `GSCError`.
- Hermes container runs on `nvidia/nemotron-3-super-120b-a12b` with `nvidia/nemotron-3-ultra-550b-a55b` fallback, `ddgs` search backend restored automatically at container startup via `/etc/cont-init.d/99-rainwater-bootstrap` across Watchtower updates, `approvals.timeout: 300`, and heredoc execution allowlisted.
- Repository Python clients use `/opt/hermes/.venv/bin/python3`; Node 26 runs inside the Hermes container.

## Active work

- Measure post-release performance of shipped opportunities RW-001–RW-008 via daily GSC and Plausible snapshots before launching new speculative pages.
- Continue verifying primary claim-level evidence for existing contractor records (Texas: 50, California: 43, Arizona: 11) and monitoring `pr-ley91-2024-rainwater-harvesting` (`bvirtualogp.pr.gov` currently returning connection refused from Hetzner).

## Monetization decision gate

Review the first pilot only after two consecutive 28-day periods each reach at least 300 non-branded clicks and 30 relevant intent actions. Choose between consent-based installer introductions and disclosed equipment referrals using observed demand and available partners. Organic contractor ordering remains independent of payment.
