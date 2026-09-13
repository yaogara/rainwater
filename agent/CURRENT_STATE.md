# Current Project State — Rainwater Directory

**Last Updated**: September 12, 2026 (Hermes Autonomous Operator Initialization)  
**Production Domain**: [https://rainwaterdirectory.com/](https://rainwaterdirectory.com/)

---

## 1. Production Health
- **HTTP Status**: 200 OK
- **SSL / TLS**: Valid Let's Encrypt certificate issued for `rainwaterdirectory.com` (Exp: Dec 11, 2026).
- **Edge Routing**: No Cloudflare 525 errors; custom domain successfully bound on GitHub Pages.
- **Canonical URLs**: Verified pointing to `https://rainwaterdirectory.com/` across all 170 pages.
- **Sitemap & Robots**: `sitemap-index.xml` (HTTP 200) and `robots.txt` (HTTP 200) verified and submitted.
- **Path Hygiene**: Zero `/rainwater/` or `yaogara.github.io` path regressions.
- **Subdomain (`www`)**: 301 permanently redirecting to apex domain.

---

## 2. Analytics Availability
- **Google Search Console**:
  - Property: `sc-domain:rainwaterdirectory.com`
  - Service Account: `codex-629@gen-lang-client-0195647678.iam.gserviceaccount.com` (Permission: `siteFullUser`).
  - Status: API connected; initial sitemap submitted; 0 search queries recorded (domain freshly verified, data lag expected 24–48h).
- **Plausible Analytics**:
  - Endpoint: `https://stats.yaogara.com` (tracking via `https://stats.caminoalsol.com/js/pa-*.js`).
  - Status: Scoped API key active (`stats:read:*`); tracking confirmed live (initial visits recorded).

---

## 3. Current Traffic Trend
- **Organic Clicks (28d)**: 0 (Baseline initialization phase).
- **Organic Impressions (28d)**: 0.
- **Plausible Pageviews (30d)**: Baseline recording started.
- **Indexed Pages**: Pending initial Google indexing pass post-sitemap submission.

---

## 4. Active Experiments
- **EXP-001**: Clean apex domain cutover and canonical repair (measuring indexation rate of 170 URLs over first 30 days).

---

## 5. Main Blockers
- **GitHub Deploy Key Write Permission**: Dedicated ed25519 deploy key generated on server (`/opt/data/.ssh/rainwater_deploy.pub`); needs repository owner to enable "Allow write access" in GitHub repository settings to enable autonomous push.
- **Search Console Data Aging**: 24–48 hour delay before first search performance rows appear in GSC API.

---

## 6. Current Priority
1. Complete GitHub Deploy Key write activation.
2. Monitor initial search indexation across the 170 published URLs.
3. Prepare state guide content depth enhancements for top rainwater harvesting states (Texas, California, Florida).
