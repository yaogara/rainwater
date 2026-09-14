#!/usr/bin/env python3
"""Import the supplied SEMrush evidence into a durable, dated SEO archive."""

import argparse, csv, hashlib, json, shutil
from pathlib import Path


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""): value.update(chunk)
    return value.hexdigest()


def copy_source(source: Path, destination: Path):
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)
    return {"path": str(destination), "sha256": digest(destination), "bytes": destination.stat().st_size}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--numbers", type=Path, required=True)
    parser.add_argument("--seeds", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("data/seo"))
    args = parser.parse_args()
    from numbers_parser import Document

    numbers_target = args.output / "raw/2025-09-24" / args.numbers.name
    seeds_target = args.output / "raw/2026-08-09" / args.seeds.name
    manifest = {"schema_version": 1, "sources": [copy_source(args.numbers, numbers_target), copy_source(args.seeds, seeds_target)]}

    table = Document(args.numbers).sheets[0].tables[0]
    values = table.rows(values_only=True); headers = [str(value) for value in values[0]]
    records = [dict(zip(headers, row)) for row in values[1:] if len(row) > 1 and row[1]]
    extracted = args.output / "raw/2025-09-24/rainwater-harvesting_clusters_2025-09-24.csv"
    with extracted.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=headers); writer.writeheader(); writer.writerows(records)
    manifest["sources"].append({"path": str(extracted), "sha256": digest(extracted), "bytes": extracted.stat().st_size, "derived_from": str(numbers_target)})

    by_keyword = {str(row["Keyword"]).strip().lower(): row for row in records}
    assignments = [
        ("RW-001", "rainwater collection calculator", "/calculator/", "Build and improve the demand-based planning calculator", "NOAA or another primary rainfall source"),
        ("RW-002", "first flush diverter", "/blog/choose-right-downspout-diverter-rain-barrels/", "Add a sourced first-flush selection and maintenance section", "University extension or standards-body guidance"),
        ("RW-003", "rainwater collection tanks", "/blog/top-10-water-storage-tanks-100-to-5000-gallons/", "Improve the tank-selection guide around use, capacity and evidence", "Manufacturer specifications and applicable standards"),
        ("RW-004", "rainwater collection system cost", "/blog/how-to-choose-an-installer/", "Replace unsupported price claims with traceable examples or clearly labeled planning inputs", "Current public vendor or public-program cost evidence"),
        ("RW-005", "is it illegal to collect rainwater in texas", "/states/texas/", "Strengthen the Texas legal and incentive guide", "Texas statutes, TWDB and municipal program sources"),
        ("RW-006", "rain barrel diverter kit", "/blog/choose-right-downspout-diverter-rain-barrels/", "Improve diverter fit and selection coverage", "Manufacturer fit specifications and extension guidance"),
    ]
    queue = []
    for rank, (identifier, keyword, url, change, required) in enumerate(assignments, start=1):
        row = by_keyword[keyword]
        queue.append({"opportunity_id": identifier, "status": "backlog", "priority": rank, "market": row["Database"],
            "keyword": row["Keyword"], "intent": row["Intent"], "historical_volume": row["Volume"],
            "historical_kd": row["Keyword Difficulty"], "historical_cpc_usd": row["CPC (USD)"], "source_date": "2025-09-24",
            "source_file": str(numbers_target), "owner_url": url, "current_gsc_clicks": "", "current_gsc_impressions": "",
            "current_gsc_position": "", "required_sources": required, "proposed_change": change, "outcome": ""})

    with seeds_target.open(newline="", encoding="utf-8-sig") as stream:
        seed = next(row for row in csv.DictReader(stream) if row["keyword"].strip().lower() == "rainwater harvesting system installation")
    queue.append({"opportunity_id": "RW-007", "status": "backlog", "priority": 7, "market": seed["market"], "keyword": seed["keyword"],
        "intent": seed["intent"], "historical_volume": seed["volume"], "historical_kd": seed["kd_percent"],
        "historical_cpc_usd": seed["cpc_usd"], "source_date": "2026-08-09", "source_file": str(seeds_target),
        "owner_url": "/blog/how-to-choose-an-installer/", "current_gsc_clicks": "", "current_gsc_impressions": "",
        "current_gsc_position": "", "required_sources": "GSC query evidence and current contractor demand", "proposed_change": "Improve installation-intent routing after GSC evidence appears", "outcome": ""})

    queue_path = args.output / "opportunities.csv"; queue_path.parent.mkdir(parents=True, exist_ok=True)
    with queue_path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(queue[0])); writer.writeheader(); writer.writerows(queue)
    manifest["sources"].append({"path": str(queue_path), "sha256": digest(queue_path), "bytes": queue_path.stat().st_size, "derived_from": "two preserved SEMrush exports"})
    (args.output / "source-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({"keywords": len(records), "queue": len(queue), "manifest": str(args.output / "source-manifest.json")}))
    return 0


if __name__ == "__main__": raise SystemExit(main())
