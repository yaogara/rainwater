#!/usr/bin/env python3
"""
Plausible Analytics Client for Rainwater Directory
--------------------------------------------------
Reads API token from environment (PLAUSIBLE_API_KEY) or secure credentials file.
Queries self-hosted Plausible instance for:
- Aggregate metrics (visitors, pageviews, bounce rate, visit duration)
- Realtime visitors
- Top pages & entry pages
- Top referrers / sources
- Countries and devices
- Timeseries trends
"""

import os
import sys
import json
import urllib.request
import urllib.parse
from pathlib import Path

DEFAULT_SITE_ID = "rainwaterdirectory.com"
DEFAULT_BASE_URL = os.environ.get("PLAUSIBLE_BASE_URL", "https://stats.yaogara.com")

TOKEN_PATHS = [
    Path(os.environ.get("PLAUSIBLE_TOKEN_PATH", "")) if os.environ.get("PLAUSIBLE_TOKEN_PATH") else None,
    Path("/opt/data/credentials/plausible_token.key"),
    Path.home() / ".config/plausible/rainwater_token.key",
]
TOKEN_PATHS = [p for p in TOKEN_PATHS if p is not None]


def get_token() -> str:
    env_token = os.environ.get("PLAUSIBLE_API_KEY")
    if env_token:
        return env_token.strip()

    for p in TOKEN_PATHS:
        if p.exists():
            try:
                token = p.read_text().strip()
                if token:
                    return token
            except Exception:
                continue

    raise FileNotFoundError(
        "No Plausible API token found. Set PLAUSIBLE_API_KEY or place token in /opt/data/credentials/plausible_token.key"
    )


def api_request(endpoint: str, params: dict = None) -> dict:
    token = get_token()
    base_url = DEFAULT_BASE_URL.rstrip("/")
    query_str = f"?{urllib.parse.urlencode(params)}" if params else ""
    url = f"{base_url}/api/v1/stats{endpoint}{query_str}"

    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/json")
    req.add_header("User-Agent", "Mozilla/5.0 (compatible; HermesAgent/1.0; +https://rainwaterdirectory.com)")

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read().decode("utf-8")
            return json.loads(data)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        print(f"[PLAUSIBLE ERROR] HTTP {e.code}: {body}", file=sys.stderr)
        return {"error": f"HTTP {e.code}", "detail": body}
    except Exception as e:
        print(f"[PLAUSIBLE ERROR] Request failed: {e}", file=sys.stderr)
        return {"error": str(e)}


def get_realtime(site_id: str = DEFAULT_SITE_ID):
    res = api_request("/realtime/visitors", {"site_id": site_id})
    print(f"[Plausible] Realtime visitors for {site_id}: {res}")
    return res


def get_aggregate(site_id: str = DEFAULT_SITE_ID, period: str = "30d"):
    params = {
        "site_id": site_id,
        "period": period,
        "metrics": "visitors,pageviews,bounce_rate,visit_duration",
    }
    res = api_request("/aggregate", params)
    results = res.get("results", {})
    visitors = results.get("visitors", {}).get("value", 0)
    pageviews = results.get("pageviews", {}).get("value", 0)
    bounce_rate = results.get("bounce_rate", {}).get("value", 0)
    visit_duration = results.get("visit_duration", {}).get("value", 0)

    print(f"[Plausible] Aggregate metrics ({period}) for {site_id}:")
    print(f"  - Unique Visitors: {visitors}")
    print(f"  - Total Pageviews: {pageviews}")
    print(f"  - Bounce Rate:     {bounce_rate}%")
    print(f"  - Avg Duration:    {visit_duration}s")
    return results


def get_breakdown(property_name: str, site_id: str = DEFAULT_SITE_ID, period: str = "30d", limit: int = 10):
    params = {
        "site_id": site_id,
        "period": period,
        "property": property_name,
        "limit": limit,
    }
    res = api_request("/breakdown", params)
    results = res.get("results", [])
    print(f"[Plausible] Top {property_name} ({period}) for {site_id} ({len(results)} items):")
    for row in results[:limit]:
        item = row.get(property_name.split(":")[-1], row.get("name", "Unknown"))
        visitors = row.get("visitors", 0)
        pageviews = row.get("pageviews", 0)
        print(f"  - {str(item):<40} Visitors: {visitors:<5} Views: {pageviews}")
    return results


def get_timeseries(site_id: str = DEFAULT_SITE_ID, period: str = "30d"):
    params = {
        "site_id": site_id,
        "period": period,
        "metrics": "visitors,pageviews",
    }
    res = api_request("/timeseries", params)
    results = res.get("results", [])
    print(f"[Plausible] Timeseries ({period}) for {site_id} ({len(results)} days):")
    for r in results[-7:]:
        print(f"  - Date: {r.get('date')} Visitors: {r.get('visitors', 0):<5} Pageviews: {r.get('pageviews', 0)}")
    return results


if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "summary"
    period = sys.argv[2] if len(sys.argv) > 2 else "30d"

    if action == "realtime":
        get_realtime()
    elif action in ("summary", "aggregate"):
        get_aggregate(period=period)
    elif action == "top-pages":
        get_breakdown("event:page", period=period)
    elif action == "entry-pages":
        get_breakdown("visit:entry_page", period=period)
    elif action == "referrers":
        get_breakdown("visit:source", period=period)
    elif action == "countries":
        get_breakdown("visit:country", period=period)
    elif action == "devices":
        get_breakdown("visit:device", period=period)
    elif action == "trends":
        get_timeseries(period=period)
    else:
        print(f"Unknown action: {action}")
        print("Usage: plausible_client.py [summary|realtime|top-pages|entry-pages|referrers|countries|devices|trends] [period]")
        sys.exit(1)
