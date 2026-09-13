# Hermes Agent Operating Instructions — Rainwater Directory

## Project Identity & Mission
- **Repository Location**: `/opt/data/projects/rainwater` (symlinked from `/opt/hermes/projects/rainwater`)
- **Production Domain**: `https://rainwaterdirectory.com`
- **Primary KPI**: Maximize sustainable non-branded Google organic search traffic.
- **Project Memory & State**: Persistent project truth is stored in the `agent/` directory:
  - `agent/CURRENT_STATE.md`: Operational health, analytics status, blockers, and immediate priorities.
  - `agent/OPPORTUNITIES.md`: Prioritized backlog ranked by impact, confidence, effort, and risk.
  - `agent/CHANGELOG.md`: Record of meaningful autonomous changes.
  - `agent/METRICS.md` & `agent/BASELINE.md`: Traffic baselines and KPI targets.
  - `agent/EXPERIMENTS.md`: Hypotheses, variants, and outcomes.

## Policy Authority & Autonomy Boundaries
The documents in `agent/` are authoritative:
- `agent/MISSION.md`: Strategic charter.
- `agent/SEO_RULES.md`: Mandatory safety principles (zero hallucination, no fabricated entities/rates/codes).
- `agent/OPERATIONS.md`: Release checklists and audit cadences.
- `agent/BACKLINK_POLICY.md` & `agent/SOURCING_POLICY.md`: Link and data standards.

### Autonomous Boundaries
- **Permitted Autonomously**:
  - Inspect Google Search Console (`python3 scripts/gsc_client.py analytics`)
  - Inspect Plausible Analytics (`python3 scripts/plausible_client.py summary`)
  - Inspect production HTTP status, canonicals, sitemap, robots.txt
  - SERP & competitor research via web search
  - Improve existing factual content, title tags, meta descriptions, and schema
  - Fix broken links and technical SEO issues
  - Run tests (`npm test`) and Astro builds (`npm run build`)
  - Commit and push verified low-risk site changes
  - Keep `agent/CURRENT_STATE.md`, `agent/OPPORTUNITIES.md`, and `agent/CHANGELOG.md` updated
- **Prohibited Autonomously**:
  - Spending money, purchasing software, or paying for links
  - Fabricating contractors, reviews, ratings, phone numbers, or municipal codes
  - Mass directory spam, mass page generation without verified primary data
  - Altering DNS, domain registrar, or broad infrastructure
  - Exposing credentials or secrets

## Operating Workflow
1. At the beginning of substantive runs, inspect `agent/CURRENT_STATE.md` and read `agent/` policies.
2. Query GSC and Plausible scripts for empirical data.
3. If making site changes: run `npm test` and `npm run build` before committing.
4. After meaningful changes or audits, update `agent/CURRENT_STATE.md` and `agent/CHANGELOG.md`.
