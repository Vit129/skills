#!/bin/bash
# Build/Cache Cleanup Scheduler
# Weekly scan+delete of ~/Git/Personal stale build/cache dirs (node_modules, .venv,
# .build, __pycache__, dist, build, egg-info, DerivedData, etc. — see
# clean-build-cache.sh) via that script's --apply mode. Same weekly-cadence
# state-file pattern as eval-scheduler.sh / candidate-scheduler.sh / memory-decay-scheduler.sh.
# Usage: ./build-cache-scheduler.sh [--force]
# Returns exit 0 + report if due, exit 1 if not due.
#
# Auto-applies (2026-07-27): plain deterministic script, fixed dir-name list,
# no AI in the loop -- unlike memory-decay-scheduler.sh which stays flag-only
# on purpose. Worst case: a cache regenerates on next build, no data loss.

STATE="$HOME/.claude/agent-memory/BUILD-CACHE-STATE.md"
LOG_DIR="$HOME/.claude/agent-memory/build-cache-checks"
CHECK_INTERVAL_DAYS=7
LOG_RETENTION_DAYS=28

CLEAN_SCRIPT="$HOME/.claude/scripts/clean-build-cache.sh"

mkdir -p "$LOG_DIR"

find "$LOG_DIR" -maxdepth 1 -name "20*.md" -mtime "+${LOG_RETENTION_DAYS}" -delete 2>/dev/null

if [ ! -f "$STATE" ]; then
  echo "last_check: 1970-01-01" > "$STATE"
fi

LAST_CHECK=$(grep "last_check:" "$STATE" | cut -d' ' -f2)
LAST_EPOCH=$(date -j -f "%Y-%m-%d" "$LAST_CHECK" "+%s" 2>/dev/null || echo "0")
NOW_EPOCH=$(date "+%s")
DIFF_DAYS=$(( (NOW_EPOCH - LAST_EPOCH) / 86400 ))
TODAY=$(date "+%Y-%m-%d")

if [ "$1" != "--force" ] && [ "$DIFF_DAYS" -lt "$CHECK_INTERVAL_DAYS" ]; then
  echo "NOT_DUE (last check: $LAST_CHECK, ${DIFF_DAYS}d ago, next in $((CHECK_INTERVAL_DAYS - DIFF_DAYS))d)"
  exit 1
fi

LOG_FILE="$LOG_DIR/${TODAY}.md"

{
  echo "BUILD_CACHE_CHECK_DUE"
  echo "---"
  echo "## Build/Cache Cleanup Snapshot ($TODAY)"
  echo ""
  if [ -f "$CLEAN_SCRIPT" ]; then
    bash "$CLEAN_SCRIPT" --apply
  else
    echo "_(clean-build-cache.sh not found)_"
  fi
  echo ""
  echo "## Result"
  echo ""
  echo "_(above is the deletion record for this run.)_"
} | tee "$LOG_FILE"

echo "last_check: $TODAY" > "$STATE"
