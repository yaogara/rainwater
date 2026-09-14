#!/usr/bin/env python3
"""
Rainwater Directory — Autonomous Contractor Tooling
CLI utility for auditing contractor coverage, validating schema integrity,
and adding verified contractors under zero-fabrication editorial standards.

Usage:
  python3 scripts/contractor_tool.py audit
  python3 scripts/contractor_tool.py validate [--file PATH]
  python3 scripts/contractor_tool.py add --state "Ohio" --city "Columbus" --name "Rain Brothers LLC" ...
"""

import os
import sys
import re
import json
import argparse
from pathlib import Path

# Base paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
INSTALLERS_DIR = Path(os.environ.get("RAINWATER_INSTALLERS_DIR", PROJECT_ROOT / "src" / "content" / "installers"))

def slugify(text: str) -> str:
    """Converts text to URL-safe slug matching project slugify rules."""
    text = text.lower().strip()
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'&', '-and-', text)
    text = re.sub(r'[^a-z0-9-]', '', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def read_document(file_path: Path):
    content = file_path.read_text(encoding="utf-8")
    parts = content.split("---", 2)
    return content, (parts[2] if len(parts) >= 3 else "")


def parse_frontmatter(file_path: Path):
    """
    Parses frontmatter from a markdown file.
    Supports pyyaml if installed, otherwise uses robust internal parser.
    """
    content, _ = read_document(file_path)

    if not content.startswith("---"):
        return None, "File does not start with frontmatter ---"

    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, "Malformed frontmatter (missing closing ---)"

    raw_yaml = parts[1]
    
    try:
        import yaml
        data = yaml.safe_load(raw_yaml)
        return data, None
    except ImportError:
        pass
    except Exception as e:
        return None, f"YAML parse error: {e}"

    # Robust fallback line-by-line parser if PyYAML is unavailable
    data = {"installers": []}
    current_installer = None
    current_list_key = None

    for line in raw_yaml.splitlines():
        trimmed = line.strip()
        if not trimmed or trimmed.startswith("#"):
            continue

        # Top-level keys
        if not line.startswith(" ") and ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if key == "installers":
                current_installer = None
                current_list_key = None
            else:
                data[key] = val
            continue

        # Installer item start
        if trimmed.startswith("- name:"):
            current_installer = {}
            name_val = trimmed[7:].strip().strip('"').strip("'")
            current_installer["name"] = name_val
            data["installers"].append(current_installer)
            current_list_key = None
            continue

        if current_installer is not None:
            # Sub-list items (e.g. services, service_area)
            if trimmed.startswith("- ") and current_list_key:
                val = trimmed[2:].strip().strip('"').strip("'")
                current_installer[current_list_key].append(val)
                continue

            # Installer fields
            if ":" in trimmed:
                sub_k, sub_v = trimmed.split(":", 1)
                sub_k = sub_k.strip()
                sub_v = sub_v.strip().strip('"').strip("'")
                if sub_v == "":
                    # likely a list like services: or service_area:
                    current_installer[sub_k] = []
                    current_list_key = sub_k
                else:
                    current_list_key = None
                    if sub_v.lower() == "true":
                        current_installer[sub_k] = True
                    elif sub_v.lower() == "false":
                        current_installer[sub_k] = False
                    else:
                        try:
                            if "." in sub_v:
                                current_installer[sub_k] = float(sub_v)
                            else:
                                current_installer[sub_k] = int(sub_v)
                        except ValueError:
                            current_installer[sub_k] = sub_v

    return data, None

def format_yaml_entry(entry: dict) -> str:
    """Formats an installer directory data dictionary cleanly to frontmatter YAML."""
    try:
        import yaml
        return "---\n" + yaml.safe_dump(entry, sort_keys=False, allow_unicode=True, width=120) + "---\n"
    except ImportError:
        pass
    lines = ["---"]
    lines.append(f'state: "{entry["state"]}"')
    lines.append(f'city: "{entry["city"]}"')
    lines.append(f'summary: "{entry["summary"]}"')
    if "latitude" in entry and entry["latitude"] is not None:
        lines.append(f'latitude: {entry["latitude"]}')
    if "longitude" in entry and entry["longitude"] is not None:
        lines.append(f'longitude: {entry["longitude"]}')

    lines.append("installers:")
    for inst in entry.get("installers", []):
        lines.append(f'  - name: "{inst["name"]}"')
        if inst.get("phone"):
            lines.append(f'    phone: "{inst["phone"]}"')
        if inst.get("website"):
            lines.append(f'    website: "{inst["website"]}"')
        if inst.get("address"):
            lines.append(f'    address: "{inst["address"]}"')
        if inst.get("rating") is not None:
            lines.append(f'    rating: {inst["rating"]}')
        if inst.get("reviews_count") is not None:
            lines.append(f'    reviews_count: {inst["reviews_count"]}')
        if inst.get("certifications"):
            lines.append(f'    certifications: "{inst["certifications"]}"')
        if inst.get("audiences"):
            lines.append(f'    audiences: "{inst["audiences"]}"')
        if inst.get("services"):
            lines.append("    services:")
            for s in inst["services"]:
                lines.append(f'      - "{s}"')
        if inst.get("service_area"):
            lines.append("    service_area:")
            for a in inst["service_area"]:
                lines.append(f'      - "{a}"')
        if inst.get("lat") is not None:
            lines.append(f'    lat: {inst["lat"]}')
        if inst.get("lng") is not None:
            lines.append(f'    lng: {inst["lng"]}')
        if inst.get("verified"):
            lines.append("    verified: true")

    lines.append("---")
    lines.append("")
    return "\n".join(lines)


def merge_installer(existing: dict, incoming: dict) -> dict:
    """Merge an update without deleting fields or claim-level evidence not in the update."""
    merged = {**existing, **incoming}
    if existing.get("evidence") or incoming.get("evidence"):
        merged["evidence"] = {**existing.get("evidence", {}), **incoming.get("evidence", {})}
    return merged

def run_audit(args):
    """Audits current installer database density and coverage gaps."""
    files = list(INSTALLERS_DIR.glob("*.md"))
    state_installers = {}
    city_installers = []
    thin_cities = []
    total_installers = 0
    evidence_complete = 0

    for f in sorted(files):
        data, err = parse_frontmatter(f)
        if err or not data:
            print(f"[WARN] Error reading {f.name}: {err}")
            continue

        state = data.get("state", "Unknown")
        city = data.get("city", "Unknown")
        installers = data.get("installers", [])
        count = len(installers)
        total_installers += count
        evidence_complete += sum(
            1 for installer in installers
            if isinstance(installer.get("evidence"), dict)
            and installer["evidence"].get("entity", {}).get("status") == "verified"
        )

        state_installers[state] = state_installers.get(state, 0) + count
        city_installers.append((state, city, count, f.name))
        if count <= 1:
            thin_cities.append((state, city, count, f.name))

    print("=" * 60)
    print("RAINWATER DIRECTORY — CONTRACTOR DATABASE AUDIT")
    print("=" * 60)
    print(f"Total City Hubs:       {len(files)}")
    print(f"Total Contractors:     {total_installers}")
    print(f"States Represented:    {len(state_installers)} / 50")
    print(f"Single-Installer Hubs: {len(thin_cities)} ({len(thin_cities)/len(files)*100:.1f}%)")
    print(f"Source-Verified Records: {evidence_complete} / {total_installers}")
    print("-" * 60)
    print("TOP 10 STATES BY CONTRACTOR DENSITY:")
    for state, cnt in sorted(state_installers.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {state:<20} {cnt:>3} contractors")

    print("-" * 60)
    print("EVIDENCE PRIORITY:")
    if evidence_complete < total_installers:
        print(f"  Verify the sources for {total_installers - evidence_complete} existing records before expanding coverage.")
        print("  No automatic additions are recommended until source evidence and search demand are recorded.")
    else:
        for state, city, count, filename in sorted(thin_cities, key=lambda row: (row[2], row[0], row[1]))[:10]:
            print(f"  * Review {city}, {state}: {count} listed provider(s) ({filename})")
    print("=" * 60)
    return 0

def run_validate(args):
    """Validates contractor frontmatter against safety, schema, and zero-fabrication rules."""
    target_files = [Path(args.file)] if args.file else sorted(INSTALLERS_DIR.glob("*.md"))
    violations = []
    checked = 0

    FORBIDDEN_TERMS = ["example.com", "555-555-5555", "lorem ipsum", "dummy", "placeholder", "fake"]

    for f in target_files:
        checked += 1
        data, err = parse_frontmatter(f)
        if err:
            violations.append((f.name, f"Frontmatter parse failure: {err}"))
            continue

        if not data.get("state"):
            violations.append((f.name, "Missing 'state' field"))
        if not data.get("city"):
            violations.append((f.name, "Missing 'city' field"))
        if not data.get("summary"):
            violations.append((f.name, "Missing 'summary' field"))

        installers = data.get("installers", [])
        if not isinstance(installers, list) or len(installers) == 0:
            violations.append((f.name, "Empty or missing 'installers' list"))
            continue

        for idx, inst in enumerate(installers):
            if not isinstance(inst, dict):
                violations.append((f.name, f"Installer #{idx+1} is not a dictionary"))
                continue
            name = inst.get("name")
            if not name or not str(name).strip():
                violations.append((f.name, f"Installer #{idx+1} is missing 'name'"))

            # Check forbidden terms
            dumped = json.dumps(inst).lower()
            for term in FORBIDDEN_TERMS:
                if term in dumped:
                    violations.append((f.name, f"Installer '{name}' contains forbidden placeholder term '{term}'"))

            # Check rating bounds
            rating = inst.get("rating")
            if rating is not None:
                try:
                    r_val = float(rating)
                    if r_val < 1.0 or r_val > 5.0:
                        violations.append((f.name, f"Installer '{name}' rating {r_val} outside [1.0, 5.0]"))
                except ValueError:
                    violations.append((f.name, f"Installer '{name}' invalid rating: {rating}"))

            evidence = inst.get("evidence") or {}
            if not isinstance(evidence, dict):
                violations.append((f.name, f"Installer '{name}' evidence must be an object"))
                evidence = {}
            for claim, claim_evidence in evidence.items():
                if claim not in {"entity", "contact", "services", "credentials", "reviews"} or not isinstance(claim_evidence, dict):
                    violations.append((f.name, f"Installer '{name}' has invalid evidence claim '{claim}'"))
                    continue
                missing = [key for key in ("source_url", "source_excerpt", "verified_at", "status") if not claim_evidence.get(key)]
                if missing:
                    violations.append((f.name, f"Installer '{name}' evidence '{claim}' missing {', '.join(missing)}"))
                if claim_evidence.get("status") not in {"verified", "needs_review", "unverified"}:
                    violations.append((f.name, f"Installer '{name}' evidence '{claim}' has invalid status"))
            if inst.get("verified") and evidence.get("entity", {}).get("status") != "verified":
                violations.append((f.name, f"Installer '{name}' uses legacy verified=true without verified entity evidence"))
            if rating is not None and inst.get("reviews_count") is None:
                violations.append((f.name, f"Installer '{name}' rating is missing reviews_count"))
            if evidence.get("reviews", {}).get("status") == "verified" and (rating is None or inst.get("reviews_count") is None):
                violations.append((f.name, f"Installer '{name}' verified review evidence requires rating and reviews_count"))

            # Check website format
            website = inst.get("website")
            if website and not (website.startswith("http://") or website.startswith("https://")):
                violations.append((f.name, f"Installer '{name}' website must start with http:// or https://: {website}"))

    print(f"Validated {checked} file(s).")
    if violations:
        print(f"[FAIL] Found {len(violations)} violation(s):")
        for fname, msg in violations:
            print(f"  - {fname}: {msg}")
        return 1
    else:
        print("[PASS] All inspected files adhere to schema and safety rules.")
        return 0

def run_add(args):
    """Safely adds a verified contractor entry to an existing or new city file."""
    if not args.state or not args.city or not args.name:
        print("[ERROR] --state, --city, and --name are required.")
        return 1
    if not re.match(r"^https?://", args.source_url):
        print("[ERROR] --source-url must be an absolute HTTP(S) URL.")
        return 1
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", args.verified_at):
        print("[ERROR] --verified-at must use YYYY-MM-DD.")
        return 1
    if (args.rating is None) != (args.reviews_count is None):
        print("[ERROR] --rating and --reviews-count must be supplied together.")
        return 1

    state_slug = slugify(args.state)
    city_slug = slugify(args.city)
    filename = f"{state_slug}-{city_slug}.md"
    file_path = INSTALLERS_DIR / filename

    existing_data = None
    existing_body = ""
    if file_path.exists():
        _, existing_body = read_document(file_path)
        existing_data, err = parse_frontmatter(file_path)
        if err:
            print(f"[ERROR] Could not parse existing file {filename}: {err}")
            return 1

    services = [s.strip() for s in args.services.split(",")] if args.services else ["Rainwater harvesting", "System design and installation"]
    service_area = [a.strip() for a in args.service_area.split(",")] if args.service_area else [args.city, args.state]

    new_installer = {
        "name": args.name.strip(),
    }
    if args.phone:
        new_installer["phone"] = args.phone.strip()
    if args.website:
        new_installer["website"] = args.website.strip()
    if args.address:
        new_installer["address"] = args.address.strip()
    if args.rating:
        new_installer["rating"] = float(args.rating)
    if args.reviews_count:
        new_installer["reviews_count"] = int(args.reviews_count)
    if args.certifications:
        new_installer["certifications"] = args.certifications.strip()
    if services:
        new_installer["services"] = services
    if service_area:
        new_installer["service_area"] = service_area
    if args.lat is not None:
        new_installer["lat"] = float(args.lat)
    if args.lng is not None:
        new_installer["lng"] = float(args.lng)
    if args.source_url:
        claim = {"source_url": args.source_url.strip(), "source_excerpt": args.source_excerpt.strip(),
                 "verified_at": args.verified_at, "status": "verified"}
        new_installer["evidence"] = {"entity": dict(claim), "contact": dict(claim), "services": dict(claim)}
        if args.certifications: new_installer["evidence"]["credentials"] = dict(claim)
        if args.rating is not None: new_installer["evidence"]["reviews"] = dict(claim)

    if existing_data:
        # Check for duplicate
        installers = existing_data.get("installers", [])
        duplicate_idx = -1
        for idx, inst in enumerate(installers):
            if inst.get("name", "").lower() == args.name.lower():
                duplicate_idx = idx
                break

        if duplicate_idx >= 0:
            print(f"[UPDATE] Updating existing contractor '{args.name}' in {filename}...")
            installers[duplicate_idx] = merge_installer(installers[duplicate_idx], new_installer)
        else:
            print(f"[APPEND] Appending contractor '{args.name}' to {filename}...")
            installers.append(new_installer)
        existing_data["installers"] = installers
        target_dict = existing_data
    else:
        print(f"[CREATE] Creating new city hub {filename}...")
        target_dict = {
            "state": args.state.strip(),
            "city": args.city.strip(),
            "summary": f"Leading rainwater harvesting installers and system designers in {args.city.strip()}, {args.state.strip()}.",
            "installers": [new_installer]
        }

    # Write file
    formatted = format_yaml_entry(target_dict) + existing_body.lstrip("\n")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(formatted)

    print(f"[SUCCESS] Successfully saved {file_path}.")
    # Validate the written file
    return run_validate(argparse.Namespace(file=str(file_path)))

def main():
    parser = argparse.ArgumentParser(description="Rainwater Directory Contractor Tool")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # audit command
    p_audit = subparsers.add_parser("audit", help="Audit contractor density and find gaps")

    # validate command
    p_validate = subparsers.add_parser("validate", help="Validate frontmatter schema and safety rules")
    p_validate.add_argument("--file", help="Specific file to validate (optional)")

    # add command
    p_add = subparsers.add_parser("add", help="Add a verified contractor")
    p_add.add_argument("--state", required=True, help="State name (e.g. Ohio)")
    p_add.add_argument("--city", required=True, help="City name (e.g. Columbus)")
    p_add.add_argument("--name", required=True, help="Contractor business name")
    p_add.add_argument("--phone", help="Phone number")
    p_add.add_argument("--website", help="Website URL")
    p_add.add_argument("--address", help="Physical business address")
    p_add.add_argument("--certifications", help="Verified certifications / licenses")
    p_add.add_argument("--services", help="Comma-separated services")
    p_add.add_argument("--rating", type=float, help="Review rating (1.0 - 5.0)")
    p_add.add_argument("--reviews-count", type=int, help="Total review count")
    p_add.add_argument("--service-area", help="Comma-separated service area")
    p_add.add_argument("--lat", type=float, help="Latitude")
    p_add.add_argument("--lng", type=float, help="Longitude")
    p_add.add_argument("--source-url", required=True, help="Primary source URL supporting this record")
    p_add.add_argument("--source-excerpt", required=True, help="Short excerpt supporting the claims")
    p_add.add_argument("--verified-at", required=True, help="Verification date in YYYY-MM-DD format")

    args = parser.parse_args()

    if args.command == "audit":
        sys.exit(run_audit(args))
    elif args.command == "validate":
        sys.exit(run_validate(args))
    elif args.command == "add":
        sys.exit(run_add(args))

if __name__ == "__main__":
    main()
