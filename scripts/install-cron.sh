#!/usr/bin/env bash
# Install/refresh the claude-managed crontab block from scripts/crontab.claude.
# Idempotent — safe to re-run (strips old managed block by marker before re-adding),
# and never touches cron lines outside the markers (any pre-existing personal crontab
# entries survive).
# Usage: ./install-cron.sh
set -euo pipefail

SRC="$HOME/.claude/scripts/crontab.claude"
[[ -f "$SRC" ]] || { echo "missing $SRC"; exit 1; }

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

# Keep existing crontab minus any previous claude-managed blocks.
(crontab -l 2>/dev/null || true) | awk '
  /# BEGIN claude-managed/ { skip=1 }
  !skip { print }
  /# END claude-managed/ { skip=0 }
' > "$TMP"

# Append the current managed blocks from the repo file.
cat "$SRC" >> "$TMP"

crontab "$TMP"
echo "installed. current crontab:"
crontab -l
