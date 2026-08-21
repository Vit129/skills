#!/bin/bash
# Generic event-driven trigger for the existing DUE-report schedulers.
#
# Extends the pattern proven by kouen-task-watch.sh (2026-08-21) to any
# scheduler whose "due" condition is really "a specific file changed", not a
# blind daily timer: eval-scheduler.sh (agent-memory/SKILL-LOG.md),
# candidate-scheduler.sh (skills/candidates/), routing-adherence-scheduler.sh
# (agent-memory/routing-nudges.log). Each gets its own launchd WatchPaths
# plist pointed at its real trigger file/dir, all three calling this one
# script with different args instead of three near-duplicate scripts.
#
# Deliberately NOT extended to every scheduler (no silent scope-creep):
#   - graphify-label-scheduler.sh: scans many dynamic per-project graph.json
#     paths, no single static path to watch -- stays weekly/time-based.
#   - build-cache-scheduler.sh: auto-applies with no human/AI review step at
#     all (not even in session-start.sh's auto_act_check list) -- there is
#     nothing here for an event-driven wake to hand off to.
#   - memory-decay-scheduler.sh: staleness IS elapsed time, not a discrete
#     event -- also presented as an informational digest, not an actionable
#     auto_act_check item. Event-driving it would be a category error.
#
# Reuses the SAME regenerate-then-check-bullets logic session-start.sh's
# auto_act_check already applies to today's report, so nothing about what
# counts as "actionable" is duplicated or can drift out of sync with it.
# The spawned session is told to just run session-start.sh itself and act on
# its Auto-act section -- the per-scheduler instructions live there once,
# not copied into this script too.
#
# Usage: scheduler-event-watch.sh <scheduler-script-name> <report-dir-name> <label>
#   e.g. scheduler-event-watch.sh eval-scheduler.sh evals "Skill Eval"

SCHEDULER_SCRIPT="$1"
REPORT_DIR_NAME="$2"
LABEL="$3"

if [ -z "$SCHEDULER_SCRIPT" ] || [ -z "$REPORT_DIR_NAME" ] || [ -z "$LABEL" ]; then
  echo "usage: scheduler-event-watch.sh <scheduler-script-name> <report-dir-name> <label>" >&2
  exit 2
fi

source "$HOME/.claude/scripts/lib/kouen-spawn.sh"

REPORT_DIR="$HOME/.claude/agent-memory/$REPORT_DIR_NAME"
STATE_DIR="$HOME/.claude/agent-memory/.state"
LOCKDIR="/tmp/.scheduler-event-watch-${REPORT_DIR_NAME}.lock"
TODAY=$(date "+%Y-%m-%d")
NOTIFIED_MARKER="$STATE_DIR/event-watch-notified-${REPORT_DIR_NAME}-${TODAY}.marker"

mkdir -p "$STATE_DIR" "$REPORT_DIR"

if ! mkdir "$LOCKDIR" 2>/dev/null; then
  exit 0
fi
trap 'rmdir "$LOCKDIR" 2>/dev/null' EXIT

# Let a partial/in-progress write settle before reading.
sleep 1

# Regenerate today's report right now instead of waiting for the daily
# launchd fire -- cheap (no LLM), same script, just forced early.
bash "$HOME/.claude/scripts/$SCHEDULER_SCRIPT" --force >/dev/null 2>&1

TODAY_REPORT="$REPORT_DIR/${TODAY}.md"
[ -f "$TODAY_REPORT" ] || exit 0

# Same actionable-bullet test session-start.sh's auto_act_check uses -- a
# report with no "- " lines means nothing due, not a broken pipeline.
grep -qE '^- .+' "$TODAY_REPORT" || exit 0

# Already notified for this label today -- don't spawn twice (WatchPaths can
# fire again for e.g. a second unrelated write to the same file same day).
[ -f "$NOTIFIED_MARKER" ] && exit 0
touch "$NOTIFIED_MARKER"

PROMPT="Auto-act due — ${LABEL} (event-triggered just now, not the next scheduled session). Run \`bash ~/.claude/scripts/session-start.sh\` and act on its Auto-act section for ${LABEL} — don't just report it as a to-do."

kouen_spawn_and_prompt "$PROMPT"
