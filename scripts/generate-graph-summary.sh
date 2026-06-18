#!/usr/bin/env bash
# Extract a capped ~120-line summary from graphify-out/GRAPH_REPORT.md for CLAUDE.md auto-load.
# Usage: generate-graph-summary.sh [project-dir]   (defaults to cwd)
set -euo pipefail

PROJ="${1:-$PWD}"
REPORT="$PROJ/graphify-out/GRAPH_REPORT.md"
OUT="$PROJ/graphify-out/GRAPH_SUMMARY.md"

if [ ! -f "$REPORT" ]; then
  echo "skip: no GRAPH_REPORT.md in $PROJ"
  exit 0
fi

# section <START_HEADER> <MAX_LINES>
# Print from START header up to the next "## " header, capped at MAX_LINES.
section() {
  awk -v start="$1" -v max="$2" '
    $0 ~ "^"start { on=1; n=0 }
    on && /^## / && $0 !~ "^"start { on=0 }
    on { print; if (++n >= max) on=0 }
  ' "$REPORT"
}

{
  echo "# Graph Summary — $(basename "$PROJ")"
  echo "_Auto-generated from graphify-out/GRAPH_REPORT.md · do not edit manually_"
  echo "_Regen: \`~/.claude/scripts/generate-graph-summary.sh .\` after \`graphify update .\`_"
  echo

  section "## Summary"           8
  echo
  section "## Graph Freshness"   6
  echo
  section "## God Nodes"         13
  echo
  section "## Surprising Connections" 12
  echo

  echo "## Community Hubs (top 25)"
  awk '/^## Community Hubs/{on=1;next} on&&/^## /{exit} on&&/^- /{print; if(++c>=25)exit}' "$REPORT"
  echo
  echo "_Full map → graphify-out/GRAPH_REPORT.md · query: \`graphify query \"...\"\`_"
} > "$OUT"

echo "wrote $(wc -l < "$OUT") lines → $OUT"
