# Rainwater SEO opportunities

`data/seo/opportunities.csv` is the single executable queue. This page explains how to select its next item; update the CSV status, evidence, and outcome after each four-day cycle.

## Measured baseline, September 12–October 9, 2026

- Finalized GSC **byProperty** totals: **94 impressions, 1 click, 1.0638% CTR, average position 39.2872**. The one click appears on the page-only `/states/illinois/` row (one impression, position 12), consistent with Plausible's one Google visitor.
- Query/page detail contains **39 rows, 53 summed row impressions, and zero clicks**. These partial rows are useful for discovering specific queries, but their sums are not property totals.
- Page-only detail: legality guide 10 impressions at position 19.4; Tucson 13 impressions across slash variants; Austin 8 at position 38.75. The Puerto Rico query has 6 impressions at position 10.33. These are sparse observations, not stable rankings or grounds for mass expansion.
- Plausible's rolling 30-day summary: 37 visitors, 53 views, one Google visitor.
- Current inventory: **168 contractor records, 126 city hubs, 31 represented states**. Texas has 50 records in 28 hubs; California has 43 in 32 hubs. No claim-level contractor verification has been completed.

## Four-day selection and release

1. Refresh finalized property totals and query/page detail separately, plus Plausible and official-source changes. Record the exact date windows and provider errors.
2. Choose at most one existing useful URL with a source-backed improvement. A six-impression query is an editorial clue, not a growth forecast. Prefer correctness, canonical consistency, and demonstrable utility over speculative new pages.
3. Verify each factual claim against primary sources. Keep unsupported legal, rebate, and contractor claims in source-review status until verified.
4. Run the release gate in `agent/OPERATIONS.md`, record a receipt and the CSV outcome, then distinguish local commit, remote push, CI, and public proof.

RW-001's calculator is already shipped. RW-008's legality-guide corrections are implemented and await post-release measurement. RW-002–RW-007 remain candidates subject to fresh demand and source checks. Do not treat dated SEMrush volumes as current traffic.
