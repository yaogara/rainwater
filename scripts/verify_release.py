#!/usr/bin/env python3
"""Verify built-site invariants and emit a machine-readable release receipt."""

import argparse, json, subprocess, sys, urllib.error, urllib.request
from datetime import datetime, timezone
from pathlib import Path

from contractor_tool import parse_frontmatter, slugify


PROJECT_ROOT = Path(__file__).resolve().parent.parent


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
    if any("Fact-Checked &amp; Code-Verified" in path.read_text(errors="ignore") for path in html): failures.append("Unsupported sitewide verification badge found in HTML")

    verified_entities = 0; verified_reviews = 0; checked_installer_pages = 0
    for source_path in sorted((PROJECT_ROOT / "src" / "content" / "installers").glob("*.md")):
        data, error = parse_frontmatter(source_path)
        if error or not data:
            failures.append(f"Could not inspect contractor evidence in {source_path.name}: {error}")
            continue
        expected_entities = 0; expected_reviews = 0
        for installer in data.get("installers", []):
            evidence = installer.get("evidence", {}) if isinstance(installer, dict) else {}
            if isinstance(evidence, dict) and evidence.get("entity", {}).get("status") == "verified": expected_entities += 1
            if isinstance(evidence, dict) and evidence.get("reviews", {}).get("status") == "verified" and installer.get("rating") is not None and installer.get("reviews_count") is not None: expected_reviews += 1
        built_path = directory / "installers" / slugify(str(data.get("state", ""))) / slugify(str(data.get("city", ""))) / "index.html"
        if not built_path.exists():
            failures.append(f"Built contractor page missing for {source_path.name}")
            continue
        built_text = built_path.read_text(errors="ignore")
        actual_entities = built_text.count('"@type":"LocalBusiness"')
        actual_reviews = built_text.count('"aggregateRating"')
        if actual_entities != expected_entities: failures.append(f"{built_path}: expected {expected_entities} evidence-backed LocalBusiness schemas, found {actual_entities}")
        if actual_reviews != expected_reviews: failures.append(f"{built_path}: expected {expected_reviews} evidence-backed aggregate ratings, found {actual_reviews}")
        verified_entities += expected_entities; verified_reviews += expected_reviews; checked_installer_pages += 1
    checks["installer_pages_evidence_checked"] = checked_installer_pages
    checks["verified_entity_schemas"] = verified_entities
    checks["verified_review_schemas"] = verified_reviews

    source_catalog = json.loads((PROJECT_ROOT / "data" / "sources" / "incentives.json").read_text())
    verified_policy_states = {
        source["state"] for source in source_catalog["sources"]
        if source.get("kind") == "official-guidance" and source.get("status") == "verified"
    }
    checked_state_pages = 0
    for state_path in sorted((directory / "states").glob("*/index.html")):
        state_name = state_path.parent.name
        built_text = state_path.read_text(errors="ignore")
        has_pending_notice = "State-specific legal source review pending" in built_text
        if state_name not in {slugify(state) for state in verified_policy_states} and not has_pending_notice:
            failures.append(f"{state_path}: missing legal source-review notice")
        checked_state_pages += 1
    checks["state_policy_pages_checked"] = checked_state_pages
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
