#!/bin/bash
# Daily Digest Scheduler
#
# One-look daily snapshot of outstanding local state, synthesized the same
# way eval-scheduler.sh / candidate-scheduler.sh check-and-report: state file
# gates the once-a-day cadence, dated report under agent-memory/digest/.
#
# Deliberately LOCAL STATE ONLY (open HITL gates, pending auto-act DUE
# reports, first unchecked task per in-progress plan, decay-flagged files) —
# no network fetches, no portfolio/stock-news summarization. That's a
# different feature with a different risk profile (network calls, API
# keys, unbounded content) and isn't built here.
#
# Read-only surfacing, not an auto-act item: no ACTED: marker needed
# (nothing here is "apply or leave a reason", it's just informational).
#
# Usage: ./daily-digest-scheduler.sh [--force]
# Returns exit 0 + digest if due, exit 1 if not due.

STATE="$HOME/.claude/agent-memory/DIGEST-STATE.md"
CLAUDE_DIR="$HOME/.claude"
LOG_DIR="$HOME/.claude/agent-memory/digest"
CHECK_INTERVAL_DAYS=1
LOG_RETENTION_DAYS=7

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
  echo "## Daily Digest ($TODAY)"
  echo ""

  # ── Open HITL gates ──
  GATE_STATE="$CLAUDE_DIR/agent-memory/GATE-STATE.md"
  open_gates=""
  if [ -f "$GATE_STATE" ]; then
    open_gates=$(awk 'BEGIN{RS="## GATE-"; ORS=""} NR>1{
      open=0; n=split($0, lines, "\n")
      for (i=1; i<=n; i++) if (lines[i] ~ /^- Status: OPEN[ \t]*$/) open=1
      if (open) print "## GATE-" $0
    }' "$GATE_STATE")
  fi
  if [ -n "$open_gates" ]; then
    echo "### Paused gates"
    printf '%s\n' "$open_gates"
  else
    echo "### Paused gates"
    echo "_(none)_"
  fi
  echo ""

  # ── Pending auto-act DUE reports (unattended-detected, not yet ACTED) ──
  echo "### Pending auto-act reports"
  any_pending=0
  for dir in evals candidate-checks routing-adherence-checks graphify-label-checks; do
    logdir="$CLAUDE_DIR/agent-memory/$dir"
    latest=$(find "$logdir" -maxdepth 1 -name "20*.md" 2>/dev/null | sort | tail -1)
    [ -z "$latest" ] && continue
    grep -q "^ACTED:" "$latest" 2>/dev/null && continue
    grep -qE '^- .+' "$latest" 2>/dev/null || continue
    any_pending=1
    echo "- $dir: ${latest#$CLAUDE_DIR/} (not yet ACTED)"
  done
  [ "$any_pending" -eq 0 ] && echo "_(none)_"
  echo ""

  # ── In-progress plans: first unchecked task each ──
  echo "### In-progress plans (first unchecked task)"
  any_plan=0
  for f in "$CLAUDE_DIR"/agent-memory/plans/*/dev-task-progress.md "$CLAUDE_DIR"/agent-memory/plans/*/qa-task-progress.md; do
    [ -f "$f" ] || continue
    first_unchecked=$(grep -m1 -E '^\s*- \[ \]' "$f" 2>/dev/null)
    [ -z "$first_unchecked" ] && continue
    any_plan=1
    feature=$(basename "$(dirname "$f")")
    echo "- $feature (${f#$CLAUDE_DIR/}):"
    echo "  ${first_unchecked# }"
  done
  [ "$any_plan" -eq 0 ] && echo "_(none — no in-progress plan has an unchecked task)_"
  echo ""

  # ── Decay-flagged files (staleness, from the existing decay scheduler) ──
  echo "### Decay flags"
  decay_dir="$CLAUDE_DIR/agent-memory/decay-checks"
  latest_decay=$(find "$decay_dir" -maxdepth 1 -name "20*.md" 2>/dev/null | sort | tail -1)
  if [ -n "$latest_decay" ] && grep -qE '^- .+' "$latest_decay" 2>/dev/null; then
    echo "See ${latest_decay#$CLAUDE_DIR/}"
  else
    echo "_(none flagged in latest decay check)_"
  fi
  echo ""
  echo "_(informational snapshot — act on individual sections via their own existing flow; nothing here needs its own separate confirmation)_"
} | tee "$LOG_FILE"

echo "last_check: $TODAY" > "$STATE"
