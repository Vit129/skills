#!/usr/bin/env bash
# Prune stale agent-memory entries across all projects.
# Usage: prune-all-agent-memory.sh [keep_days=7]
set -euo pipefail

KEEP_DAYS="${1:-7}"
SCRIPT="$(dirname "$0")/prune-agent-memory.py"

echo "Pruning agent-memory (keep_days=${KEEP_DAYS}, cutoff=$(python3 -c "from datetime import date,timedelta; print(date.today()-timedelta(days=${KEEP_DAYS}))"))"
echo ""

find \
  "$HOME/.claude/agent-memory" \
  "$HOME/Git/Personal" \
  -maxdepth 4 \
  -name "agent-memory" \
  -type d \
  ! -path "*/skills-backup*" \
  ! -path "*/.claude/skills/*" \
  2>/dev/null | sort | while read -r dir; do
    python3 "$SCRIPT" "$dir" "$KEEP_DAYS"
done

echo ""
echo "Done."
