# Current Project State — Rainwater Directory
**Last Updated**: November 24, 2026
**Production Domain**: [https://rainwaterdirectory.com/](https://rainwaterdirectory.com/)

## Production and measurement

- Latest deployment `8188ac4` (Nov 24, RW-009/RW-010 contractor verification: 11 contractors verified across Austin TX and Tucson AZ) is live on production. All release gates passed; public verification confirms HTTP 200 on `/`, `/calculator/`, `/sitemap-index.xml`, and `/robots.txt`.
- Finalized GSC **byProperty** data for October 26–November 22, 2026: **6 impressions, 0 clicks, 0% CTR, average position 27.5**. The single query/page row (`"the rain store" "85716"` -> `/installers/arizona/tucson/`) accounts for 3 impressions at position 31.67. This sample remains sparse; do not extrapolate from partial row sums.
- Plausible latest 30-day summary (Nov 24 snapshot): **16 visitors, 51 pageviews, 50% bounce rate, 92s average visit duration**.
- Eight Astro redirect routes (2 legacy blog redirects + 6 cleaned-up malformed city redirects) are static HTTP 200 pages with meta refresh and `noindex` canonicals. They must not be reported as server-side 301 redirects.

## Data and publication safety

- Inventory: **164 contractor records across 122 city hubs and 31 states** (11 claim-level source-verified contractor records: 4 in Austin TX, 7 in Tucson AZ; 153 remaining with source-review-pending status). The UI labels unverified records as source review pending, does not display unsupported ratings as verified, and does not emit `LocalBusiness` schema until entity evidence is verified. Use `scripts/contractor_tool.py verify` to clear records systematically.
- Blog articles: **11 / 11** guides carry verified primary-source backing (`sourceStatus: "verified"` in frontmatter), replacing the previous hardcoded `"Source review in progress"` banner; all 7 previously thin articles (~227–417 words) and `/calculator/` were upgraded on November 22, 2026.
- State legal summaries render only when a verified official-guidance record is attached; unsupported state pages disclose that source review is pending.
- `data/sources/incentives.json` tracks 5 verified primary sources: Austin Water rebate, Texas TWDB guidance, SoCal Water$mart, Puerto Rico Ley 91-2024, and Tucson Water Rainwater Harvesting Rebate.
- Rainfall data contains 50 states and identifies the source period as 1971–2000. It is a statewide planning input, not a local measurement. The updater validates and writes atomically, preserving the last valid file on failure.
- Dated SEMrush originals are preserved under `data/seo/raw/`; `data/seo/opportunities.csv` holds shipped `RW-001`–`RW-010` and prioritized verification/authority queue `RW-011`–`RW-020`. Draft contractor/utility outreach templates live in `agent/OUTREACH_KIT_DRAFT.md` (not authorized for sending). `npm run build` preserves untracked `docs/seo/` files across Astro output cleanup.

## Release and operator controls

- CI runs unit tests, contractor source validation, rainfall validation, the Astro build, and built-site verification before deployment. It saves pre-deploy and public verification receipts tied to the commit.
- Canonical Hermes operator repository is unified at `/opt/data/projects/rainwater` (cron `workdir` and wrapper scripts `/opt/data/scripts/rainwater-*.sh` point here; `/opt/data/state/rainwater/operator-repo` is synced cleanly).
- Non-interactive publication uses the registered Rainwater SSH deploy key in `/opt/data/state/rainwater/ssh/rainwater_deploy` (`core.sshCommand = ssh -F /opt/data/state/rainwater/ssh/config`, pushurl `git@github.com:yaogara/rainwater.git`).
- `scripts/source_monitor.py` uses a `curl` fallback for HTTP 403 WAF responses (e.g., `tucsonaz.gov`), retries transient errors once, tracks `consecutive_failures`, preserves `last_good`, and exits `2` on transient outages (vs `1` on permanent 404/410 or `--strict`). `scripts/hermes_contractor_audit.sh` treats exit `2` as a non-fatal warning so Wednesday audits complete without failing the job.
- `scripts/gsc_client.py` retries transient network/HTTP errors once and wraps `OSError`/`TimeoutError`/`http.client.HTTPException` into `GSCError`.
- Hermes container runs on `nvidia/nemotron-3-super-120b-a12b` with `nvidia/nemotron-3-ultra-550b-a55b` fallback, `ddgs` search backend restored automatically at container startup via `/etc/cont-init.d/99-rainwater-bootstrap` across Watchtower updates, `approvals.timeout: 300`, and heredoc execution allowlisted.
- Repository Python clients use `/opt/hermes/.venv/bin/python3`; Node 26 runs inside the Hermes container.

## Active work

- Execute `RW-011`–`RW-020` in `data/seo/opportunities.csv` across Hermes cycles to clear `\"Source review pending\"` contractor records (`Texas: 50`, `California: 41`, `Arizona: 11`) and state legal notices via primary sources.
- Measure post-release performance of upgraded blog guides (`11/11` verified), `/calculator/`, and state pages via daily GSC and Plausible snapshots, and monitor `pr-ley91-2024-rainwater-harvesting` (`bvirtualogp.pr.gov` currently returning connection refused from Hetzner).

## Monetization decision gate

Review the first pilot only after two consecutive 28-day periods each reach at least 300 non-branded clicks and 30 relevant intent actions. Choose between consent-based installer introductions and disclosed equipment referrals using observed demand and available partners. Organic contractor ordering remains independent of payment.