#!/bin/bash
# Graphify Semantic-Label Staleness Scheduler
# Weekly scan of every graphified project (~/.claude + ~/Git/Personal/*) for
# communities still sitting as unlabeled "Community N" placeholders in
# GRAPH_REPORT.md. Same weekly-cadence state-file pattern as
# build-cache-scheduler.sh / eval-scheduler.sh / candidate-scheduler.sh.
# Usage: ./graphify-label-scheduler.sh [--force]
# Returns exit 0 + report if due, exit 1 if not due.
#
# Flag-only, NEVER auto-labels (see 2026-07-29 incident: a single unsupervised
# batch labeling pass across 11 projects at once silently produced garbage
# labels for 6 of them — e.g. "Fixed"/"Added"/"Changed" reused as community
# names hundreds of times — while self-reporting 100% success. Labeling
# quality needs a human/AI in the loop per project, not a cron job.

STATE="$HOME/.claude/agent-memory/GRAPHIFY-LABEL-STATE.md"
LOG_DIR="$HOME/.claude/agent-memory/graphify-label-checks"
CHECK_INTERVAL_DAYS=7
LOG_RETENTION_DAYS=28
PLACEHOLDER_THRESHOLD_PCT=10  # flag if >10% of communities are still "Community N"

PROJECTS_ROOT="$HOME/Git/Personal"
SKIP_PROJECTS=(9arm-skills)

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

# check_project <label> <project-dir>
check_project() {
  local label="$1" proj="$2"
  local report="$proj/graphify-out/GRAPH_REPORT.md"
  [ -f "$report" ] || return

  local total placeholders pct
  total=$(grep -cE '^### Community [0-9]+' "$report" 2>/dev/null)
  total=${total:-0}
  [ "$total" -eq 0 ] && return
  placeholders=$(grep -cE '^### Community [0-9]+ - "Community [0-9]+"$|^### Community [0-9]+$' "$report" 2>/dev/null)
  placeholders=${placeholders:-0}
  pct=$(( placeholders * 100 / total ))

  if [ "$pct" -gt "$PLACEHOLDER_THRESHOLD_PCT" ]; then
    echo "- **$label** — ${placeholders}/${total} communities (${pct}%) still unlabeled — \`${proj#$HOME/}\`"
  fi
}

{
  echo "GRAPHIFY_LABEL_CHECK_DUE"
  echo "---"
  echo "## Graphify Semantic-Label Snapshot ($TODAY)"
  echo ""
  echo "### Projects with unlabeled communities (>${PLACEHOLDER_THRESHOLD_PCT}% placeholder):"
  echo ""

  found=0
  tmp=$(mktemp)
  check_project "Global (~/.claude)" "$HOME/.claude" >> "$tmp"
  for proj_dir in "$PROJECTS_ROOT"/*/; do
    proj=$(basename "$proj_dir")
    skip=0
    for s in "${SKIP_PROJECTS[@]}"; do
      [[ "$proj" == "$s" ]] && skip=1 && break
    done
    [ "$skip" -eq 1 ] && continue
    check_project "$proj" "${proj_dir%/}" >> "$tmp"
  done
  if [ -s "$tmp" ]; then
    cat "$tmp"
    found=1
  fi
  rm -f "$tmp"
  [ "$found" -eq 0 ] && echo "_(none — every graphified project's communities are labeled)_"

  echo ""
  echo "## Result"
  echo ""
  echo "_(review above — for each flagged project, dispatch labeling ONE PROJECT AT A TIME (not a single batch across all of them — that's exactly what produced garbage last time), then quality-check the result before trusting it: check for a small number of distinct labels covering a large number of communities \`python3 -c \"import json,collections; d=json.load(open('<proj>/graphify-out/.graphify_labels.json')); print(collections.Counter(d.values()).most_common(3))\"\`, and spot-check 1-2 of the most-duplicated labels' actual community node membership in graph.json — a real duplicate (e.g. near-identical platform-doc copies) is fine, a duplicate across unrelated files/content is not. Revert via git checkout or the graphify-out/<date>/ backup folder if it fails the check. Leave 'proposed' with a one-line reason if not acted on this session.)_"
} | tee "$LOG_FILE"

echo "last_check: $TODAY" > "$STATE"
