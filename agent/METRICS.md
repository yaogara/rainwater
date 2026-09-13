# Metrics & Performance Measurement Framework

This framework establishes the key performance indicators (KPIs) monitored by the autonomous agent to gauge organic growth, index health, and domain value.

---

## 1. Primary Organic KPIs (Google Search Console)

| Metric | Target | Measurement Cadence | Source |
|---|---|---|---|
| **Non-Branded Organic Clicks** | +15% MoM | Weekly | GSC Search Analytics |
| **Total Search Impressions** | +25% MoM | Weekly | GSC Search Analytics |
| **Average Search Position** | < 15.0 overall | Weekly | GSC Search Analytics |
| **Strike-Zone Queries (Pos 4–20)** | Track top 50 | Weekly | GSC Search Analytics |
| **Indexed Pages Ratio** | > 90% of submitted URLs | Monthly | GSC Coverage / Sitemaps |

---

## 2. On-Site & Engagement KPIs (Plausible Analytics)

| Metric | Purpose | Source |
|---|---|---|
| **Unique Monthly Visitors** | Gross reach metric | Plausible |
| **Pageviews per Visit** | Directory depth & contractor browsing | Plausible |
| **Top Entry Pages** | High-intent landing pages | Plausible |
| **Outbound Contractor Clicks** | High-intent lead generation indicator | Plausible Custom Events |
| **Top Geographic Regions** | Validates regional cluster demand | Plausible Countries / Regions |

---

## 3. Index & Technical Health KPIs

- **Clean Hostname Ratio**: 100% of traffic served on `https://rainwaterdirectory.com`.
- **Zero 5xx/4xx Regressions**: Automated checks catch broken links prior to deployment.
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint) < 2.5s
  - INP (Interaction to Next Paint) < 200ms
  - CLS (Cumulative Layout Shift) < 0.1
