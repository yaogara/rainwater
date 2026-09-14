#!/usr/bin/env python3
"""Aggregate all model usage for Rainwater sessions, including auxiliary calls."""

import argparse
import json
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--database", type=Path, default=Path("/opt/data/state.db"))
    parser.add_argument("--days", type=int, default=30)
    args = parser.parse_args()
    since = (datetime.now(timezone.utc) - timedelta(days=args.days)).timestamp()
    connection = sqlite3.connect(args.database)
    connection.row_factory = sqlite3.Row
    rows = connection.execute("""
      SELECT u.model, u.billing_provider, u.billing_mode,
             SUM(u.api_call_count) AS api_calls,
             SUM(u.input_tokens) AS input_tokens,
             SUM(u.output_tokens) AS output_tokens,
             SUM(u.reasoning_tokens) AS reasoning_tokens,
             SUM(COALESCE(u.estimated_cost_usd, 0)) AS estimated_cost_usd,
             SUM(COALESCE(u.actual_cost_usd, 0)) AS actual_cost_usd
      FROM session_model_usage u
      JOIN sessions s ON s.id = u.session_id
      WHERE u.last_seen >= ? AND (s.cwd LIKE '%/rainwater' OR s.git_repo_root LIKE '%/rainwater')
      GROUP BY u.model, u.billing_provider, u.billing_mode
      ORDER BY actual_cost_usd DESC, estimated_cost_usd DESC, api_calls DESC
    """, (since,)).fetchall()
    tools = connection.execute("""
      SELECT m.tool_name, COUNT(*) AS calls
      FROM messages m
      JOIN sessions s ON s.id = m.session_id
      WHERE m.timestamp >= ? AND m.tool_name IS NOT NULL
        AND (s.cwd LIKE '%/rainwater' OR s.git_repo_root LIKE '%/rainwater')
      GROUP BY m.tool_name
      ORDER BY calls DESC, m.tool_name
    """, (since,)).fetchall()
    result = {"schema_version": 1, "period_days": args.days, "models": [dict(row) for row in rows],
              "tools": [dict(row) for row in tools],
              "note": "Model api_calls include auxiliary model calls recorded by Hermes. Tool counts include search and extraction calls; unknown third-party pricing remains unpriced rather than estimated."}
    result["totals"] = {
        key: sum(float(row[key] or 0) for row in rows)
        for key in ("api_calls", "input_tokens", "output_tokens", "reasoning_tokens", "estimated_cost_usd", "actual_cost_usd")
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__": raise SystemExit(main())
