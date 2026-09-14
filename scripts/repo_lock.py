#!/usr/bin/env python3
"""One owner-aware write lock for unattended Rainwater repository jobs."""

import argparse
import datetime as dt
import json
import os
import shutil
import socket
import sys
import uuid
from pathlib import Path

LOCK_DIR = Path(os.environ.get("RAINWATER_LOCK_DIR", "/opt/data/state/rainwater/repo-write.lock"))
OWNER_FILE = LOCK_DIR / "owner.json"


def read_owner():
    try: return json.loads(OWNER_FILE.read_text())
    except (OSError, json.JSONDecodeError): return None


def acquire(run_id: str, stale_minutes: int) -> int:
    now = dt.datetime.now(dt.timezone.utc)
    try:
        LOCK_DIR.mkdir(parents=True)
    except FileExistsError:
        owner = read_owner() or {}
        observed = owner.get("acquired_at")
        stale = False
        if observed:
            try: stale = now - dt.datetime.fromisoformat(observed) > dt.timedelta(minutes=stale_minutes)
            except ValueError: stale = True
        if stale:
            shutil.rmtree(LOCK_DIR)
            LOCK_DIR.mkdir(parents=True)
        else:
            print(json.dumps({"acquired": False, "owner": owner}), file=sys.stderr)
            return 2
    owner = {"run_id": run_id, "acquired_at": now.isoformat(), "host": socket.gethostname(), "pid": os.getpid()}
    OWNER_FILE.write_text(json.dumps(owner, indent=2) + "\n")
    print(json.dumps({"acquired": True, **owner}))
    return 0


def release(run_id: str) -> int:
    owner = read_owner()
    if not owner:
        print(json.dumps({"released": False, "reason": "lock not found"}))
        return 0
    if owner.get("run_id") != run_id:
        print(json.dumps({"released": False, "reason": "run_id does not own lock", "owner": owner}), file=sys.stderr)
        return 2
    shutil.rmtree(LOCK_DIR)
    print(json.dumps({"released": True, "run_id": run_id}))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    acquire_parser = sub.add_parser("acquire")
    acquire_parser.add_argument("--run-id", default=os.environ.get("HERMES_RUN_ID") or str(uuid.uuid4()))
    acquire_parser.add_argument("--stale-minutes", type=int, default=180)
    release_parser = sub.add_parser("release")
    release_parser.add_argument("--run-id", required=True)
    sub.add_parser("status")
    args = parser.parse_args()
    if args.command == "acquire": return acquire(args.run_id, args.stale_minutes)
    if args.command == "release": return release(args.run_id)
    print(json.dumps({"locked": LOCK_DIR.exists(), "owner": read_owner()}))
    return 0


if __name__ == "__main__": raise SystemExit(main())
