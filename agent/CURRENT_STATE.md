# Current Project State — Rainwater Directory

**Last Updated**: September 13, 2026 (EXP-003 Deployed & Site-Wide E-E-A-T Established)  
**Production Domain**: [https://rainwaterdirectory.com/](https://rainwaterdirectory.com/)

---

## 1. Production Health
- **HTTP Status**: 200 OK
- **SSL / TLS**: Valid Let's Encrypt certificate issued for `rainwaterdirectory.com` (Exp: Dec 11, 2026).
- **Edge Routing**: No Cloudflare 525 errors; custom domain successfully bound on GitHub Pages.
- **Canonical URLs**: Verified pointing to `https://rainwaterdirectory.com/` across all 170 pages.
- **Sitemap & Robots**: `sitemap-index.xml` (HTTP 200) and `robots.txt` (HTTP 200) verified and submitted.
- **Redirects & Consolidation**: Clean 301 redirects active for legacy `/blog/is-it-illegal-to-collect-rainwater-state-by-state-2025` and duplicate stub `/blog/rainwater-harvesting-legal-status` to `/blog/is-it-illegal-to-collect-rainwater-state-by-state/`.
- **E-E-A-T Infrastructure**: Dedicated `/about` page active (sourcing standards, ARCSA/ASPE compliance, contractor verification); "Fact-Checked & Code-Verified" badges and reviewer boxes added to blog template.
- **Operator Health (Hermes)**: Autonomous daily cron audit (`rainwater-daily-audit`) executing cleanly with OpenRouter fallback failover protection.

---

## 2. Analytics Availability
- **Google Search Console**:
  - Property: `sc-domain:rainwaterdirectory.com`
  - Service Account: `codex-629@gen-lang-client-0195647678.iam.gserviceaccount.com` (Permission: `siteFullUser`).
  - Status: API connected; initial sitemap submitted; 0 search queries recorded (domain freshly verified, data lag expected 24–48h).
- **Plausible Analytics**:
  - Endpoint: `https://stats.yaogara.com` (tracking via `https://stats.caminoalsol.com/js/pa-*.js`).
  - Status: Scoped API key active (`stats:read:*`); tracking confirmed live.

---

## 3. Current Traffic Trend
- **Organic Clicks (28d)**: 0 (Baseline initialization phase).
- **Organic Impressions (28d)**: 0.
- **Plausible Pageviews (30d)**: Baseline recording started.
- **Indexed Pages**: Pending initial Google indexing pass post-sitemap submission.

---

## 4. Active Experiments
- **EXP-001**: Clean apex domain cutover and canonical repair (measuring indexation rate of 170 URLs over first 30 days).
- **EXP-002**: Pillar Content Rehabilitation — Installer Vetting & Cost Guide (`/blog/how-to-choose-an-installer`).
- **EXP-003**: Evergreen State Legality Consolidation & 50-State Statutory Matrix (`/blog/is-it-illegal-to-collect-rainwater-state-by-state`).

---

## 5. Main Blockers
- **GitHub Deploy Key Write Permission**: Dedicated ed25519 deploy key generated on server (`/opt/data/.ssh/rainwater_deploy.pub`); needs repository owner to enable "Allow write access" in GitHub repository settings to enable autonomous push.
- **Search Console Data Aging**: 24–48 hour delay before first search performance rows appear in GSC API.

---

## 6. Current Priority
1. Complete GitHub Deploy Key write activation.
2. Enrich top-priority state hubs (`/states/texas/` and `/states/california/`) with municipal rebate deep-dives and regional rainfall normal integration.
3. Monitor initial search indexation and query impressions across the 170 published URLs.

