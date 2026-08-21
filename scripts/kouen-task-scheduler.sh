#!/bin/bash
# Kouen Task Check Scheduler
#
# Cheap daily check of Kouen's Task Dashboard for open tasks, reading
# ~/Library/Application Support/Kouen/tasks.json directly instead of going
# through the kouenTaskList MCP tool -- costs zero tokens and needs no agent
# session at all. Replaces the old kouenAutomationCreate daily-spawn trigger
# (id 52875F60-E056-451D-8D95-D46AC60B1780, disabled 2026-08-21): that fired
# a full interactive Claude session every day regardless of whether there was
# anything to sync, because Kouen's own Automation only supports a fixed
# interval, no conditional trigger. Trade-off made explicitly with the user:
# this loses the proactive daily ping while away, in exchange for zero cost
# on the (usual) empty case -- surfacing now happens passively via
# session-start.sh's auto_act_check, same as evals/candidate-checks.
#
# Same DUE/NOT_DUE + dated-report convention as candidate-scheduler.sh.
# Usage: ./kouen-task-scheduler.sh [--force]
# Returns exit 0 + snapshot if due, exit 1 if not due.

STATE="$HOME/.claude/agent-memory/KOUEN-TASK-STATE.md"
TASKS_FILE="$HOME/Library/Application Support/Kouen/tasks.json"
LOG_DIR="$HOME/.claude/agent-memory/kouen-task-checks"
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

# KouenTask model is id/sessionID/title/done in the raw store (verified live
# 2026-08-21 -- capital ID, not the MCP schema's "sessionId") -- no createdAt
# in the raw store either, don't invent one.
OPEN_TASKS=$(python3 -c '
import json, sys
try:
    with open(sys.argv[1]) as f:
        tasks = json.load(f)
except Exception:
    tasks = []
for t in tasks:
    if not t.get("done"):
        tid, title, sid = t.get("id", "?"), t.get("title", "?"), t.get("sessionID", "?")
        print(f"{tid}\t{title}\t{sid}")
' "$TASKS_FILE" 2>/dev/null)

{
  echo "CHECK_DUE"
  echo "---"
  echo "## Kouen Task Check ($TODAY)"
  echo ""
  if [ -z "$OPEN_TASKS" ]; then
    echo "0 open task(s)."
  else
    count=$(echo "$OPEN_TASKS" | wc -l | xargs)
    echo "$count open task(s):"
    echo ""
    while IFS=$'\t' read -r id title sid; do
      echo "- id=$id title=\"$title\" sessionId=$sid"
    done <<< "$OPEN_TASKS"
  fi
  echo ""
  echo "## Result"
  echo ""
  echo "_(review above -- run rules/routing.md's Kouen Task Sync flow, confirm the project per task with the user via AskUserQuestion, never auto-file)_"
} | tee "$LOG_FILE"

echo "last_check: $TODAY" > "$STATE"
