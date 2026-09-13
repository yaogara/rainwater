# Rainwater Directory — Initial SEO & Technical Baseline Report

**Audit & Migration Date**: September 12, 2026  
**Canonical Production URL**: [https://rainwaterdirectory.com/](https://rainwaterdirectory.com/)  
**Legacy Host**: `https://yaogara.github.io/rainwater/`  
**Secondary Domain**: `rainwatercontractors.com`  

---

## 1. Directory Inventory & Page Counts

| Inventory Metric | Count | Details |
|---|---|---|
| **Total Indexable HTML Pages Built** | **170** | Full static HTML export in `./docs` |
| **Homepage** | 1 | `https://rainwaterdirectory.com/` |
| **Directory Hubs** | 2 | `/states/`, `/installers/` |
| **State Guides** | 31 | Authored & generated state overviews |
| **City Installer Pages** | 122 | Programmatic local contractor directories |
| **Blog Index & Articles** | 13 | 1 index (`/blog/`) + 12 technical guides |
| **Utility Pages** | 1 | 404 error page (`/404.html`) |
| **Total Contractor Records** | **162** | Aggregated across 122 cities and 31 states |
| **States Represented** | **31 / 50** | 62% national coverage |

---

## 2. Technical Issues Discovered During Audit

1. **Host & Path Fragmentation**:
   - The Astro project was configured with `site: "https://yaogara.github.io/rainwater"` and `base: "/rainwater/"`.
   - CI/CD workflow `.github/workflows/static.yml` forced `PUBLIC_BASE_PATH=/rainwater`.
2. **Missing Canonical URL Tags**:
   - `BaseLayout.astro` **did not have a `<link rel="canonical">` tag**.
   - Canonical URLs were only emitted inside JSON-LD structured data and breadcrumb arrays, which pointed to the legacy GitHub Pages URL or obsolete fallback `https://rainwater.directory`.
3. **Missing Social Metadata**:
   - No OpenGraph tags (`og:title`, `og:description`, `og:url`, `og:type`) or Twitter card tags were rendered.
4. **Sitemap and Robots Outdated**:
   - `@astrojs/sitemap` generated `sitemap-index.xml` and `sitemap-0.xml` prefixed with `https://yaogara.github.io/rainwater/`.
   - `robots.txt` directed search bots to the legacy sitemap URL.
5. **Contractor Architecture Gap**:
   - There was no `/installers/` root index route; visitors navigating to `/installers/` encountered a 404 error.
6. **Cloudflare Error 525 (SSL Handshake Failed)**:
   - `rainwaterdirectory.com` was pointed to GitHub Pages in Cloudflare DNS, but GitHub Pages lacked custom domain registration (`cname: null`) and served a `*.github.io` certificate, causing Cloudflare's SSL handshake to fail.

---

## 3. Technical Issues Fixed

- [x] **Permanent Canonical Production URL**: Updated `astro.config.mjs` to `site: "https://rainwaterdirectory.com"` and `base: "/"`.
- [x] **Clean CI/CD Pipeline**: Removed `PUBLIC_BASE_PATH=/rainwater` from `.github/workflows/static.yml`.
- [x] **Custom Domain Binding**: Added `public/CNAME` containing `rainwaterdirectory.com` (persisted to `docs/CNAME` on build).
- [x] **Dynamic Canonical Tags**: Added `<link rel="canonical" href={resolvedCanonical} />` to `<head>` across all pages.
- [x] **Open Graph & Twitter Metadata**: Added full `og:*` and `twitter:*` tags to `BaseLayout.astro`.
- [x] **Plausible Analytics**: Added production-only tracking script configured for `rainwaterdirectory.com` pointing to `https://stats.caminoalsol.com/js/script.js`.
- [x] **Production Sitemap**: Regenerated `sitemap-index.xml` and `sitemap-0.xml` with 170 clean `https://rainwaterdirectory.com/...` URLs.
- [x] **Production robots.txt**: Verified sitemap directive points to `https://rainwaterdirectory.com/sitemap-index.xml`.
- [x] **Contractor Hub Created**: Built `/installers` landing directory with live search, state aggregation, and pro counts.
- [x] **Zero Obsolete Path References**: Verified 0 occurrences of `/rainwater/` or `yaogara.github.io` in the production build.

---

## 4. Analytics & Search Infrastructure State

### Google Search Console
- **Status**: Ready for delegation.
- **Service Account**: `codex-629@gen-lang-client-0195647678.iam.gserviceaccount.com` (Search Console API enabled).
- **Automation Client**: Created `scripts/gsc_client.py` for automated sitemap submission and search analytics extraction.
- **Action Required**: Add the service account as an Owner/Full user to the `rainwaterdirectory.com` property in Google Search Console.

### Plausible Analytics
- **Status**: Installed in `src/layouts/BaseLayout.astro`.
- **Domain**: `rainwaterdirectory.com`
- **Script Endpoint**: `https://stats.caminoalsol.com/js/script.js`
- **Trigger**: Active exclusively in production (`import.meta.env.PROD`).

---

## 5. Domain & Redirection Strategy

### Primary Host Strategy
- **Enforced Host**: `https://rainwaterdirectory.com/` (apex domain, HTTPS).
- **Subdomain (`www`)**: Redirect permanently via Cloudflare Page Rule / Redirect Rule:
  - Match: `www.rainwaterdirectory.com/*`
  - Target: `https://rainwaterdirectory.com/$1` (301 Permanent Redirect).

### Legacy GitHub Pages (`yaogara.github.io/rainwater/`)
- Once GitHub Pages associates `rainwaterdirectory.com` as the custom domain for `yaogara/rainwater`, GitHub Pages automatically issues 301 HTTP redirects from `yaogara.github.io/rainwater/*` to `https://rainwaterdirectory.com/*`.
- All page canonical tags now declare `https://rainwaterdirectory.com/`, eliminating duplicate indexation risks.

### Secondary Domain (`rainwatercontractors.com`)
- **Current State**: Parked at registrar nameservers (`ns1.lander.d.parity.domains`).
- **Target Architecture**:
  - Add `rainwatercontractors.com` to Cloudflare.
  - Create DNS CNAME or dummy A record (e.g. `192.0.2.1` proxied).
  - Create Cloudflare Redirect Rule:
    - `rainwatercontractors.com/*` &rarr; `https://rainwaterdirectory.com/installers/` (301 Permanent Redirect with path forwarding where applicable).

---

## 6. Strategic Assessment

### Strongest SEO Assets
1. **Pillar Content Library (12 Guides)**:
   - High-depth technical articles: `complete-rainwater-collection-system-guide`, `ultimate-guide-whole-house-water-filtration`, `top-10-water-storage-tanks-100-to-5000-gallons`, `is-it-illegal-to-collect-rainwater-state-by-state-2025`.
2. **Dense Regional Markets**:
   - Texas: 28 cities, 45+ contractors (Austin, Houston, San Antonio, Hill Country).
   - California: 32 cities, 43 contractors (Bay Area, Central Coast, Southern California).
   - Arizona: 5 cities, 11 contractors.
3. **Structured Data Implementation**:
   - Comprehensive JSON-LD breadcrumbs, LocalBusiness schema for contractors, FAQPage schema, and BlogPosting schema.

### Weakest Areas & Thin-Page Risks
1. **Single-Contractor Metro Pages**:
   - Several city pages currently contain only 1 contractor. While legitimate, these pages risk being classified as thin if not augmented with local rainfall metrics and municipal code details.
2. **Author-Derived State Guides**:
   - Only 3 states currently have dedicated markdown content in `src/content/states/` (California, New York, Texas); the remaining 28 states rely on fallback template copy.

### Top 3 Immediate Traffic Opportunities
1. **Targeting High-Volume State Contractor Queries**:
   - Keywords: `rainwater harvesting system installation [state]`, `rainwater collection installers texas`, `rainwater harvesting california`.
2. **Interactive Catchment Sizing Calculator**:
   - A dedicated calculator tool targeting `rainwater harvesting calculator` (1,000+ monthly searches) that links directly to state contractor hubs.
3. **Optimizing State Legal & Rebate Snippets**:
   - Answering specific search queries around `is rainwater harvesting illegal in [state]` to capture Google AI Overviews and featured snippets.
