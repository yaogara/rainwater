#!/usr/bin/env python3
"""Fetch known official sources and report meaningful content changes."""

import argparse
import datetime as dt
import hashlib
import html
import http.client
import json
import os
import re
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
USER_AGENT = "RainwaterDirectorySourceMonitor/1.0"
ACCEPT_HEADER = "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8"
TRANSIENT_HTTP_CODES = {429, 500, 502, 503, 504}
PERMANENT_HTTP_CODES = {404, 410}


def normalized_text(raw: str) -> str:
    raw = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", " ", raw, flags=re.I | re.S)
    raw = re.sub(r"<[^>]+>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(raw)).strip()


def fetch_via_curl(url: str) -> tuple[int, str]:
    proc = subprocess.run(
        ["curl", "-sSL", "--max-time", "30", "-w", "\n%{http_code}", url],
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        detail = proc.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(f"curl failed ({proc.returncode}): {detail}")
    raw = proc.stdout.decode("utf-8", errors="replace")
    body, _, status_raw = raw.rpartition("\n")
    if not status_raw.strip().isdigit():
        raise RuntimeError(f"curl returned unexpected status output for {url}")
    status = int(status_raw.strip())
    if status >= 400:
        raise urllib.error.HTTPError(url, status, f"HTTP {status} via curl", None, None)
    return status, normalized_text(body)


def _fetch_once(url: str) -> tuple[int, str]:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": ACCEPT_HEADER},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.status, normalized_text(response.read().decode("utf-8", errors="replace"))
    except urllib.error.HTTPError as exc:
        if exc.code == 403:
            return fetch_via_curl(url)
        raise


def fetch(url: str) -> tuple[int, str]:
    for attempt in range(2):
        try:
            return _fetch_once(url)
        except urllib.error.HTTPError as exc:
            if exc.code in TRANSIENT_HTTP_CODES and attempt == 0:
                time.sleep(2)
                continue
            raise
        except (urllib.error.URLError, TimeoutError, OSError, http.client.HTTPException, RuntimeError):
            if attempt == 0:
                time.sleep(2)
                continue
            raise
    raise RuntimeError(f"Unreachable retry loop end for {url}")


def write_atomic(path: Path, value: dict) -> None:
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n")
    temp.replace(path)


def last_good_sources(previous: dict) -> dict:
    # schema 1 stored only the latest observation, which could be a failed fetch.
    # Recover every successful hash still present during the schema 2 migration.
    return dict(previous.get("last_good", {
        source_id: record for source_id, record in previous.get("sources", {}).items()
        if record.get("sha256")
    }))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sources", type=Path, default=PROJECT_ROOT / "data/sources/incentives.json")
    parser.add_argument("--state-dir", type=Path, default=Path(os.environ.get("RAINWATER_SOURCE_STATE_DIR", ".runtime/source-monitor")))
    parser.add_argument("--strict", action="store_true", help="Exit 1 on transient source outages as well as permanent failures")
    args = parser.parse_args()
    args.state_dir.mkdir(parents=True, exist_ok=True)
    catalog = json.loads(args.sources.read_text())
    previous_path = args.state_dir / "latest.json"
    previous = json.loads(previous_path.read_text()) if previous_path.exists() else {"sources": {}}
    baseline = last_good_sources(previous)
    prev_failures = previous.get("consecutive_failures", {})
    observed = {
        "schema_version": 2,
        "observed_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "sources": {},
        "last_good": baseline,
        "consecutive_failures": {},
    }
    changes, hard_failures, transient_warnings = [], [], []

    for source in catalog["sources"]:
        source_id = source["id"]
        try:
            status, text = fetch(source["url"])
            digest = hashlib.sha256(text.encode()).hexdigest()
            observed["sources"][source_id] = {
                "url": source["url"],
                "http_status": status,
                "sha256": digest,
                "text_length": len(text),
            }
            old = baseline.get(source_id)
            if old and old.get("sha256") != digest:
                changes.append(source_id)
            observed["last_good"][source_id] = observed["sources"][source_id]
            observed["consecutive_failures"][source_id] = 0
        except Exception as exc:
            observed["sources"][source_id] = {"url": source["url"], "error": str(exc)}
            observed["consecutive_failures"][source_id] = int(prev_failures.get(source_id, 0)) + 1
            if isinstance(exc, urllib.error.HTTPError) and exc.code in PERMANENT_HTTP_CODES:
                hard_failures.append(f"{source_id}: {exc}")
            else:
                transient_warnings.append(f"{source_id}: {exc}")

    write_atomic(args.state_dir / f"{dt.datetime.now(dt.timezone.utc):%Y%m%dT%H%M%S%fZ}.json", observed)
    write_atomic(previous_path, observed)

    if changes:
        print("Rainwater sources changed; editorial review required: " + ", ".join(changes))
    if hard_failures or (transient_warnings and args.strict):
        all_failures = hard_failures + transient_warnings
        print("Rainwater source monitor FAILED\n" + "\n".join(f"- {failure}" for failure in all_failures))
        return 1
    if transient_warnings:
        print("Rainwater source monitor WARNING (temporary source unavailable; last_good preserved)\n" + "\n".join(f"- {warning}" for warning in transient_warnings))
        return 2
    if not changes and not baseline:
        print(f"Rainwater source-monitor baseline saved for {len(observed['sources'])} sources")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
