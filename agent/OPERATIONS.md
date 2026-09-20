# Autonomous Operations & Release Runbook

## Release gate

Before any push, acquire the repository write lock with a unique run ID:

```bash
python3 scripts/repo_lock.py acquire --run-id "$RUN_ID"
```

Then run:

```bash
npm test
python3 scripts/contractor_tool.py validate
node scripts/updateRainfall.js
npm run build
python3 scripts/verify_release.py > release-receipt.json
```

Commit and push only after every command passes. After GitHub Pages deploys, run `python3 scripts/verify_release.py --production` and save the receipt. A model response cannot substitute for these checks. Release the lock with the same run ID even when work fails.

## Scheduled responsibilities

- **Daily, 12:30 UTC:** run `scripts/hermes_daily_audit.sh` as a no-agent job. It writes dated HTTP, sitemap, GSC, sampled indexation, and Plausible evidence. It reports only baselines, meaningful changes, or failures.
- **Monday, 13:00 UTC:** select one opportunity supported by the persistent queue, current GSC evidence when available, and required sources. Prefer improving an existing useful page. Use the release gate.
- **Wednesday, 15:00 UTC:** run `scripts/hermes_contractor_audit.sh` as a no-agent job. It acquires the shared repository lock, records official-source diffs, audits existing listings, and always releases the lock. Review changed sources before any editorial work; add a contractor only when primary evidence and relevant demand justify it.
- **Monthly, day 1 at 13:00 UTC:** evaluate experiments, 28-day metrics, intent events, provider usage, source freshness, and monetization readiness. Run `scripts/hermes_usage_report.py`.

All writing jobs use the same lock and write their run ID to the changelog. Local delivery remains the default. A weekly decision summary should state evidence, the change, the receipt, outcome status, cost, and any failure.

## Hermes host bootstrap

Install the keyless discovery dependency into Hermes's active virtual environment after an image replacement:

```bash
uv pip install --python /opt/hermes/.venv/bin/python3 --requirement requirements-hermes.txt
```

Set `web.search_backend` to `ddgs`. Use `nvidia/nemotron-3-super-120b-a12b` as the primary model and `nvidia/nemotron-3-ultra-550b-a55b` as the only `fallback_providers` entry; do not add paid or cross-provider fallbacks without separate authorization. After deliberately changing the global model, run `hermes cron resnap --all` so unpinned agent jobs adopt it. Run `hermes doctor` plus one read-only terminal and search benchmark. Direct known-source monitoring does not depend on search.

## Evidence rules

- Never treat an empty API response as an API failure, or a failure as a zero.
- Never label an entity, credential, review, incentive, climate value, or regulatory claim verified without its claim-level source record.
- Preserve the last valid rainfall dataset when an update fails.
- Preserve existing contractor fields and article text during updates; names are case-insensitive duplicate keys within a city.
- Treat SEMrush volume and difficulty as dated research inputs. Do not infer current demand or revenue from them.
- Draft outreach may be prepared from a small, relevant monthly prospect list. Sending requires separate authorization.

## Redirect limitation

Astro’s static output creates HTML meta-refresh pages for configured redirects on GitHub Pages. Record them accurately as HTTP 200 redirect pages. A true HTTP 301 requires an edge or hosting change and is outside autonomous DNS/infrastructure scope.
