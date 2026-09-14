#!/usr/bin/env python3
"""Verify built-site invariants and emit a machine-readable release receipt."""

import argparse, json, subprocess, sys, urllib.error, urllib.request
from datetime import datetime, timezone
from pathlib import Path


def git(*args):
    return subprocess.run(["git", *args], check=True, capture_output=True, text=True).stdout.strip()


def verify_build(directory: Path):
    checks = {}; failures = []
    html = list(directory.rglob("*.html")); checks["html_pages"] = len(html)
    checks["canonical_pages"] = sum('rel="canonical" href="https://rainwaterdirectory.com' in path.read_text(errors="ignore") for path in html)
    if not html or checks["canonical_pages"] != len(html): failures.append("Every generated HTML page must have the production canonical")
    sitemap = directory / "sitemap-0.xml"; robots = directory / "robots.txt"; cname = directory / "CNAME"
    checks["sitemap_present"] = sitemap.exists(); checks["robots_present"] = robots.exists(); checks["cname_present"] = cname.exists()
    if not sitemap.exists() or "https://rainwaterdirectory.com/" not in sitemap.read_text(): failures.append("Production sitemap is missing or invalid")
    if not robots.exists() or "https://rainwaterdirectory.com/sitemap-index.xml" not in robots.read_text(): failures.append("robots.txt sitemap is invalid")
    if not cname.exists() or cname.read_text().strip() != "rainwaterdirectory.com": failures.append("CNAME is invalid")
    if any("yaogara.github.io/rainwater" in path.read_text(errors="ignore") for path in html): failures.append("Legacy host found in HTML")
    return checks, failures


def main() -> int:
    parser = argparse.ArgumentParser(); parser.add_argument("--built-dir", type=Path, default=Path("docs")); parser.add_argument("--production", action="store_true"); args = parser.parse_args()
    checks, failures = verify_build(args.built_dir)
    if args.production:
        for path in ("/", "/calculator/", "/sitemap-index.xml", "/robots.txt"):
            try:
                with urllib.request.urlopen("https://rainwaterdirectory.com" + path, timeout=25) as response: checks[f"production:{path}"] = response.status
                if checks[f"production:{path}"] != 200: failures.append(f"Production {path} returned {checks[f'production:{path}']}")
            except Exception as exc: failures.append(f"Production {path} failed: {exc}")
    receipt = {"schema_version": 1, "generated_at": datetime.now(timezone.utc).isoformat(), "commit": git("rev-parse", "HEAD"),
        "branch": git("branch", "--show-current"), "checks": checks, "passed": not failures, "failures": failures}
    print(json.dumps(receipt, indent=2, sort_keys=True)); return 0 if not failures else 1


if __name__ == "__main__": raise SystemExit(main())
