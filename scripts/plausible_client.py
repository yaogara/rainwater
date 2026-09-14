#!/usr/bin/env python3
"""Failure-explicit Plausible client for Rainwater Directory."""

import argparse, json, os, sys, urllib.error, urllib.parse, urllib.request
from pathlib import Path

DEFAULT_SITE_ID = "rainwaterdirectory.com"
DEFAULT_BASE_URL = os.environ.get("PLAUSIBLE_BASE_URL", "https://stats.yaogara.com")
TOKEN_PATHS = [
    Path(os.environ["PLAUSIBLE_TOKEN_PATH"]) if os.environ.get("PLAUSIBLE_TOKEN_PATH") else None,
    Path("/opt/data/credentials/plausible_token.key"), Path.home() / ".config/plausible/rainwater_token.key",
]
TOKEN_PATHS = [path for path in TOKEN_PATHS if path is not None]


class PlausibleError(RuntimeError): pass


def get_token() -> str:
    if os.environ.get("PLAUSIBLE_API_KEY"): return os.environ["PLAUSIBLE_API_KEY"].strip()
    for path in TOKEN_PATHS:
        if path.exists() and path.read_text().strip(): return path.read_text().strip()
    raise PlausibleError("No Plausible API token found")


def api_request(endpoint: str, params: dict | None = None) -> dict:
    query = f"?{urllib.parse.urlencode(params)}" if params else ""
    request = urllib.request.Request(f"{DEFAULT_BASE_URL.rstrip('/')}/api/v1/stats{endpoint}{query}", headers={
        "Authorization": f"Bearer {get_token()}", "Accept": "application/json", "User-Agent": "RainwaterDirectoryOps/2.0"})
    try:
        with urllib.request.urlopen(request, timeout=20) as response: return json.loads(response.read())
    except urllib.error.HTTPError as exc:
        raise PlausibleError(f"HTTP {exc.code}: {exc.read().decode('utf-8', errors='replace')[:500]}") from exc
    except (urllib.error.URLError, json.JSONDecodeError) as exc: raise PlausibleError(f"Request failed: {exc}") from exc


def get_aggregate(site_id: str = DEFAULT_SITE_ID, period: str = "30d"):
    result = api_request("/aggregate", {"site_id": site_id, "period": period, "metrics": "visitors,pageviews,bounce_rate,visit_duration"}).get("results", {})
    return {name: payload.get("value") for name, payload in result.items()}


def get_breakdown(property_name: str, site_id: str = DEFAULT_SITE_ID, period: str = "30d", limit: int = 20):
    return api_request("/breakdown", {"site_id": site_id, "period": period, "property": property_name, "limit": limit}).get("results", [])


def get_timeseries(site_id: str = DEFAULT_SITE_ID, period: str = "30d"):
    return api_request("/timeseries", {"site_id": site_id, "period": period, "metrics": "visitors,pageviews"}).get("results", [])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("action", nargs="?", default="summary", choices=["summary", "aggregate", "top-pages", "entry-pages", "referrers", "countries", "devices", "trends"])
    parser.add_argument("period", nargs="?", default="30d"); parser.add_argument("--json", action="store_true"); args = parser.parse_args()
    try:
        if args.action in ("summary", "aggregate"): result = get_aggregate(period=args.period)
        elif args.action == "trends": result = get_timeseries(period=args.period)
        else:
            properties = {"top-pages": "event:page", "entry-pages": "visit:entry_page", "referrers": "visit:source", "countries": "visit:country", "devices": "visit:device"}
            result = get_breakdown(properties[args.action], period=args.period)
        print(json.dumps({"ok": True, "data": result}, indent=2) if args.json else json.dumps(result, indent=2)); return 0
    except PlausibleError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}), file=sys.stderr); return 1


if __name__ == "__main__": raise SystemExit(main())
