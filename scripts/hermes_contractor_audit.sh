#!/bin/sh
set -eu

PROJECT_DIR="${RAINWATER_PROJECT_DIR:-/opt/data/projects/rainwater}"
STATE_DIR="${RAINWATER_SOURCE_STATE_DIR:-/opt/data/state/rainwater/source-monitor}"
PYTHON="${RAINWATER_PYTHON:-/opt/hermes/.venv/bin/python3}"
RUN_ID="${HERMES_RUN_ID:-rainwater-contractor-audit-$(date -u +%Y%m%dT%H%M%SZ)-$$}"
LOCKED=0

release_lock() {
  if [ "$LOCKED" -eq 1 ]; then
    "$PYTHON" "$PROJECT_DIR/scripts/repo_lock.py" release --run-id "$RUN_ID"
  fi
}

trap release_lock EXIT HUP INT TERM

cd "$PROJECT_DIR"
"$PYTHON" scripts/repo_lock.py acquire --run-id "$RUN_ID"
LOCKED=1

monitor_output=$("$PYTHON" scripts/source_monitor.py --state-dir "$STATE_DIR")
if [ -n "$monitor_output" ]; then
  printf '%s\n' "$monitor_output"
else
  printf '%s\n' "Rainwater source monitor: no normalized source changes"
fi

"$PYTHON" scripts/contractor_tool.py audit
