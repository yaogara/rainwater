#!/usr/bin/env python3
"""Fetch known official sources and report meaningful content changes."""

import argparse
import datetime as dt
import hashlib
import html
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def normalized_text(raw: str) -> str:
    raw = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", " ", raw, flags=re.I | re.S)
    raw = re.sub(r"<[^>]+>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(raw)).strip()


def fetch(url: str) -> tuple[int, str]:
    request = urllib.request.Request(url, headers={"User-Agent": "RainwaterDirectorySourceMonitor/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.status, normalized_text(response.read().decode("utf-8", errors="replace"))


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
    args = parser.parse_args()
    args.state_dir.mkdir(parents=True, exist_ok=True)
    catalog = json.loads(args.sources.read_text())
    previous_path = args.state_dir / "latest.json"
    previous = json.loads(previous_path.read_text()) if previous_path.exists() else {"sources": {}}
    baseline = last_good_sources(previous)
    observed = {"schema_version": 2, "observed_at": dt.datetime.now(dt.timezone.utc).isoformat(),
                "sources": {}, "last_good": baseline}
    changes, failures = [], []

    for source in catalog["sources"]:
        source_id = source["id"]
        try:
            status, text = fetch(source["url"])
            digest = hashlib.sha256(text.encode()).hexdigest()
            observed["sources"][source_id] = {"url": source["url"], "http_status": status, "sha256": digest, "text_length": len(text)}
            old = baseline.get(source_id)
            if old and old.get("sha256") != digest:
                changes.append(source_id)
            observed["last_good"][source_id] = observed["sources"][source_id]
        except Exception as exc:
            observed["sources"][source_id] = {"url": source["url"], "error": str(exc)}
            failures.append(f"{source_id}: {exc}")

    write_atomic(args.state_dir / f"{dt.datetime.now(dt.timezone.utc):%Y%m%dT%H%M%S%fZ}.json", observed)
    write_atomic(previous_path, observed)
    if failures:
        print("Rainwater source monitor FAILED\n" + "\n".join(f"- {failure}" for failure in failures))
        return 1
    if changes:
        print("Rainwater sources changed; editorial review required: " + ", ".join(changes))
    elif not baseline:
        print(f"Rainwater source-monitor baseline saved for {len(observed['sources'])} sources")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
