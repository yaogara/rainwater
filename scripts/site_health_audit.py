#!/usr/bin/env python3
"""Deterministic Rainwater health audit. Writes evidence; prints only changes or failures."""

import argparse, datetime as dt, json, os, sys, urllib.error, urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from gsc_client import GSCError, get_access_token, get_search_analytics, inspect_url
from plausible_client import PlausibleError, get_aggregate

BASE_URL = "https://rainwaterdirectory.com"
KEY_URLS = [f"{BASE_URL}/", f"{BASE_URL}/sitemap-index.xml", f"{BASE_URL}/robots.txt", f"{BASE_URL}/calculator/"]


def fetch(url: str) -> tuple[int, str, dict]:
    request = urllib.request.Request(url, headers={"User-Agent": "RainwaterDirectoryHealth/2.0"})
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.status, response.read().decode("utf-8", errors="replace"), dict(response.headers)


def sitemap_urls() -> list[str]:
    _, index_body, _ = fetch(f"{BASE_URL}/sitemap-index.xml")
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    child_maps = [node.text for node in ET.fromstring(index_body).findall("sm:sitemap/sm:loc", namespace) if node.text]
    urls = []
    for child in child_maps:
        _, body, _ = fetch(child)
        urls.extend(node.text for node in ET.fromstring(body).findall("sm:url/sm:loc", namespace) if node.text)
    return sorted(set(urls))


def previous_snapshot(output_dir: Path):
    files = sorted(output_dir.glob("*.json"))
    if not files: return None
    try: return json.loads(files[-1].read_text())
    except (OSError, json.JSONDecodeError): return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, default=Path(os.environ.get("RAINWATER_STATE_DIR", ".runtime/health")))
    parser.add_argument("--inspection-count", type=int, default=20)
    args = parser.parse_args(); args.output_dir.mkdir(parents=True, exist_ok=True)
    now = dt.datetime.now(dt.timezone.utc); problems = []; http = {}

    for url in KEY_URLS:
        try:
            status, _, headers = fetch(url); http[url] = {"status": status, "content_type": headers.get("Content-Type")}
            if status != 200: problems.append(f"{url} returned HTTP {status}")
        except Exception as exc:
            http[url] = {"error": str(exc)}; problems.append(f"{url} failed: {exc}")

    urls = []
    try: urls = sitemap_urls()
    except Exception as exc: problems.append(f"Sitemap parse failed: {exc}")

    gsc = {"ok": False}; plausible = {"ok": False}
    try:
        token = get_access_token(); rows = get_search_analytics(token)
        start = (now.date().toordinal() * max(1, args.inspection_count)) % max(1, len(urls))
        sample = (urls + urls)[start:start + min(args.inspection_count, len(urls))]
        inspections = {}
        for url in sample:
            try: inspections[url] = {"ok": True, **inspect_url(token, url)}
            except GSCError as exc:
                inspections[url] = {"ok": False, "error": str(exc)}
                problems.append(f"GSC inspection failed for {url}: {exc}")
        gsc = {"ok": True, "analytics_row_count": len(rows), "inspections": inspections}
    except GSCError as exc:
        gsc = {"ok": False, "error": str(exc)}; problems.append(f"GSC failed: {exc}")

    try: plausible = {"ok": True, "period": "30d", "metrics": get_aggregate(period="30d")}
    except PlausibleError as exc:
        plausible = {"ok": False, "error": str(exc)}; problems.append(f"Plausible failed: {exc}")

    snapshot = {"schema_version": 1, "run_id": now.strftime("%Y%m%dT%H%M%SZ"), "observed_at": now.isoformat(),
        "http": http, "sitemap_url_count": len(urls), "gsc": gsc, "plausible": plausible, "problems": problems}
    previous = previous_snapshot(args.output_dir)
    target = args.output_dir / f"{snapshot['run_id']}.json"; target.write_text(json.dumps(snapshot, indent=2, sort_keys=True) + "\n")

    changes = []
    if previous:
        old_http = previous.get("http", {})
        for url in sorted(set(old_http) | set(http)):
            old_value = old_http.get(url, {})
            new_value = http.get(url, {})
            old_result = old_value.get("status", old_value.get("error", "missing"))
            new_result = new_value.get("status", new_value.get("error", "missing"))
            if old_result != new_result:
                changes.append(f"{url} changed from {old_result} to {new_result}")
        if previous.get("sitemap_url_count") != len(urls): changes.append(f"sitemap URLs {previous.get('sitemap_url_count')} -> {len(urls)}")
        old_metrics = previous.get("plausible", {}).get("metrics", {}); new_metrics = plausible.get("metrics", {})
        if old_metrics and new_metrics and old_metrics != new_metrics: changes.append(f"Plausible metrics changed: {old_metrics} -> {new_metrics}")
        old_states = {url: value.get("coverageState") for url, value in previous.get("gsc", {}).get("inspections", {}).items()}
        new_states = {url: value.get("coverageState") for url, value in gsc.get("inspections", {}).items()}
        shared_changes = [url for url in old_states.keys() & new_states.keys() if old_states[url] != new_states[url]]
        if shared_changes: changes.append(f"GSC coverage changed for {len(shared_changes)} sampled URLs")
    else: changes.append(f"baseline saved with {len(urls)} sitemap URLs")

    if problems:
        print("Rainwater daily audit FAILED\n" + "\n".join(f"- {problem}" for problem in problems)); return 1
    if changes: print("Rainwater daily audit: " + "; ".join(changes))
    return 0


if __name__ == "__main__": raise SystemExit(main())
