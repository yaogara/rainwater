# Autonomous Operations & Technical Runbook

This runbook outlines day-to-day routines, release checklists, data ingestion workflows, and audit cadences.

---

## 1. Release & Deployment Checklist

Before pushing changes to the repository:

- [ ] **Run Unit Tests**: `npm test` must pass with zero failures.
- [ ] **Execute Clean Build**: `npm run build` must complete without errors.
- [ ] **Verify Base Path**: Ensure no `/rainwater/` prefix appears in built files (`docs/`).
- [ ] **Verify Canonical Tags**: Ensure every generated HTML file has `<link rel="canonical" href="https://rainwaterdirectory.com/...">`.
- [ ] **Verify Sitemap**: `docs/sitemap-index.xml` and `docs/sitemap-0.xml` must only contain URLs starting with `https://rainwaterdirectory.com/`.
- [ ] **Verify robots.txt**: `docs/robots.txt` must point to `https://rainwaterdirectory.com/sitemap-index.xml`.
- [ ] **Verify CNAME**: `docs/CNAME` must contain `rainwaterdirectory.com`.
- [ ] **Commit & Deploy**: Push to `main` branch. GitHub Actions `.github/workflows/static.yml` handles deployment to GitHub Pages.

---

## 2. Weekly Autonomous Audit Cycle

Every Monday at 08:00 UTC:

1. **Search Console Analytics Pull**:
   - Run `/Users/carlturpin/.config/gcloud/virtenv/bin/python3 scripts/gsc_client.py analytics`
   - Record total clicks, impressions, average CTR, and average position.
   - Filter queries ranking in positions 4.0 through 20.0 with >50 weekly impressions (the "Strike Zone").

2. **Indexation Health Check**:
   - Verify submitted vs. indexed URL counts in GSC.
   - Check for 404s, redirect loops, or mobile usability warnings.

3. **Traffic & Engagement Check**:
   - Review Plausible metrics (unique visitors, bounce rate, top referrers, top entry pages).

4. **Strike-Zone Optimization**:
   - Select 2–3 existing pages from the Strike Zone list.
   - Enhance title tags, meta descriptions, internal links, or FAQ structured data to improve ranking position into the top 3.

---

## 3. Monthly Data Hygiene & Integrity Check

1. **NOAA Rainfall Updates**:
   - Annual cron updates `src/data/rainfall.json` from NOAA 1991–2020 normals.
   - Validate that state landing pages render positive rainfall figures.

2. **Listing Verification**:
   - Spot-check contractor websites for dead links (HTTP 404/500/domain expiration).
   - Suppress closed businesses or update outdated contact info.

3. **Thin Content Audit**:
   - Audit location pages with fewer than 1 verified contractor. Ensure fallback content provides regional utility or consider clustering.
