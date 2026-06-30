#!/usr/bin/env bash
# Update graphify + GRAPH_SUMMARY for all projects where git HEAD changed since last build.
# Usage: update-graphify-all.sh [--force]
set -euo pipefail

FORCE=0
[[ "${1:-}" == "--force" ]] && FORCE=1

SUMMARY_SCRIPT="$(dirname "$0")/generate-graph-summary.sh"

stale_commit() {
  local report="$1"
  local proj_dir="$2"
  local stored current
  stored=$(grep -oE 'Built from commit: `[a-f0-9]+`' "$report" 2>/dev/null | grep -oE '[a-f0-9]{7,}' | head -1)
  current=$(git -C "$proj_dir" rev-parse --short HEAD 2>/dev/null || echo "")
  [[ -z "$stored" || -z "$current" || "$stored" != "$current"* ]]
}

find "$HOME/git/personal" "$HOME/.claude" \
  -maxdepth 4 -name "graphify-out" -type d \
  ! -path "*/skills-backup*" \
  ! -path "*/.claude/skills/*" \
  2>/dev/null | sort | while read -r gout; do

  proj="$(dirname "$gout")"
  report="$gout/GRAPH_REPORT.md"

  # skip if no git repo
  git -C "$proj" rev-parse --git-dir &>/dev/null || continue

  if [[ "$FORCE" -eq 1 ]] || [[ ! -f "$report" ]] || stale_commit "$report" "$proj"; then
    echo "→ $(basename "$proj") (updating)"
    graphify update "$proj" 2>&1 | tail -1 || true
    "$SUMMARY_SCRIPT" "$proj"
  else
    echo "  $(basename "$proj") (clean)"
  fi
done

echo ""
echo "Done."
