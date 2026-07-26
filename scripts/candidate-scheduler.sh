#!/bin/bash
# Skill Candidate Scheduler
# Daily snapshot of ~/.claude/skills/candidates/ (shadow-capture staging, see
# skills/candidates/README.md), logged and rotated the same way
# eval-scheduler.sh handles skill eval checks.
#
# Global-only by design, not an oversight: the candidate/promotion pipeline
# (routing.md's 3x-occurrence bar -> skill-creator) only ever produces global
# skills, and no project under ~/Git/Personal/* has its own candidates/ dir
# (checked 2026-07-26) — there is nothing per-project to scan. Contrast with
# memory-decay-scheduler.sh, which DOES walk every project's agent-memory/.
# Usage: ./candidate-scheduler.sh [--force]
# Returns exit 0 + snapshot if due, exit 1 if not due.
#
# Only the dated snapshot reports get cleared after 7 days -- these are
# derived summaries, same as eval-scheduler.sh's evals/*.md. The actual
# candidate .md files in skills/candidates/ are real data and are never
# touched by this script.

STATE="$HOME/.claude/agent-memory/CANDIDATE-STATE.md"
CANDIDATES_DIR="$HOME/.claude/skills/candidates"
LOG_DIR="$HOME/.claude/agent-memory/candidate-checks"
CHECK_INTERVAL_DAYS=1
LOG_RETENTION_DAYS=7

mkdir -p "$LOG_DIR"

# Clear snapshot reports older than the retention window (cheap, every run).
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
  echo "CHECK_DUE"
  echo "---"
  echo "## Candidate Snapshot ($TODAY)"
  echo ""
  count=$(find "$CANDIDATES_DIR" -maxdepth 1 -name "*.md" ! -name "README.md" 2>/dev/null | wc -l | xargs)
  echo "$count candidate(s) staged."
  echo ""
  if [ "$count" -gt 0 ]; then
    for f in "$CANDIDATES_DIR"/*.md; do
      base=$(basename "$f")
      [ "$base" = "README.md" ] && continue
      name=$(grep -m1 "^name:" "$f" | cut -d' ' -f2-)
      hit=$(grep -m1 "^hit_count:" "$f" | cut -d' ' -f2-)
      created=$(grep -m1 "^created_at:" "$f" | cut -d' ' -f2-)
      echo "- $base -- name=${name:-?} hit_count=${hit:-?} created_at=${created:-?}"
    done
  fi
  echo ""
  echo "## Result"
  echo ""
  echo "_(review above -- promote via skill-creator if genuinely reusable, otherwise leave staged or delete manually)_"
} | tee "$LOG_FILE"

echo "last_check: $TODAY" > "$STATE"
