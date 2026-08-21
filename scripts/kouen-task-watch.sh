#!/bin/bash
# Kouen Task Watch — event-driven trigger
#
# Fired by launchd's WatchPaths the instant
# ~/Library/Application Support/Kouen/tasks.json changes (task created,
# updated, or deleted) -- not on a timer. Unlike kouen-task-scheduler.sh
# (the passive daily check, see rules/routing.md's Kouen Task Sync section),
# this one actively spawns a real Kouen session via kouen-cli the moment a
# genuinely NEW open task shows up, so the sync flow starts immediately
# instead of waiting for the user's next session. Cost is only ever paid
# when a task actually exists -- the exact property the old blind-interval
# Kouen Automation (id 52875F60-..., disabled 2026-08-21) couldn't offer.
#
# De-dup: WatchPaths fires on ANY write to tasks.json, including marking an
# existing task done or deleting one -- track already-notified task IDs in
# a state file so those don't re-trigger a spawn.
#
# Lock: WatchPaths can fire more than once for a single logical change
# (e.g. write-then-rename); a simple mkdir lock prevents overlapping runs.

source "$HOME/.claude/scripts/lib/kouen-spawn.sh"

TASKS_FILE="$HOME/Library/Application Support/Kouen/tasks.json"
STATE_DIR="$HOME/.claude/agent-memory/.state"
SEEN_FILE="$STATE_DIR/kouen-task-watch-seen.txt"
LOCKDIR="/tmp/.kouen-task-watch.lock"

mkdir -p "$STATE_DIR"
touch "$SEEN_FILE"

if ! mkdir "$LOCKDIR" 2>/dev/null; then
  exit 0
fi
trap 'rmdir "$LOCKDIR" 2>/dev/null' EXIT

# Let a partial/in-progress write settle before reading.
sleep 1

# KouenTask model is id/sessionId/title/done only.
NEW_IDS=$(python3 -c '
import json, sys
try:
    with open(sys.argv[1]) as f:
        tasks = json.load(f)
except Exception:
    tasks = []
try:
    with open(sys.argv[2]) as f:
        seen = set(line.strip() for line in f if line.strip())
except Exception:
    seen = set()
for t in tasks:
    tid = t.get("id")
    if tid and not t.get("done") and tid not in seen:
        print(tid)
' "$TASKS_FILE" "$SEEN_FILE" 2>/dev/null)

[ -z "$NEW_IDS" ] && exit 0

# Mark as seen immediately so a rapid re-fire (or the session spawn below
# itself failing) doesn't cause a duplicate spawn for the same task.
echo "$NEW_IDS" >> "$SEEN_FILE"

PROMPT='sync kouen tasks — a new open task was just created (event-triggered, not a blind daily check). Follow rules/routing.md'"'"'s "Kouen Task Sync" flow exactly (steps 1-6), including the confirm-first rule and the calibration-outcome logging step. Re-read routing.md'"'"'s current wording each time — it may have changed since this trigger was set up. Do not auto-file or auto-act on any task. If no open tasks are actually found, say so briefly and stop.'

kouen_spawn_and_prompt "$PROMPT"
