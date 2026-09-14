#!/bin/sh
set -eu

PROJECT_DIR="${RAINWATER_PROJECT_DIR:-/opt/data/projects/rainwater}"
STATE_DIR="${RAINWATER_STATE_DIR:-/opt/data/state/rainwater/health}"
exec python3 "$PROJECT_DIR/scripts/site_health_audit.py" --output-dir "$STATE_DIR" --inspection-count 20
