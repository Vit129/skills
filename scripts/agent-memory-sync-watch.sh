#!/bin/bash
# Agent-Memory Sync Watch — event-driven live mirror to Codex/Gemini
#
# Closes the "manual, not live" cross-tool sync gap found while comparing
# against Atlaso (see project_agent_memory_vs_atlaso.md Claude Code memory):
# sync-all.sh's Memory step already mirrors ~/.claude/agent-memory/ ->
# ~/.codex/agent-memory/ and ~/.gemini/agent-memory/, but only runs when
# someone remembers to invoke it by hand. Same WatchPaths + mkdir-lock +
# settle-sleep pattern as kouen-task-watch.sh / candidate-scheduler-watch
# (which already proves watching a whole directory, not just one file,
# works in this workspace's launchd setup).
#
# No spawned Kouen session here (unlike scheduler-event-watch.sh's targets)
# -- this is a pure mechanical rsync-style mirror with no human/AI review
# step, same reasoning scheduler-event-watch.sh already uses to exclude
# build-cache-scheduler.sh from event-driving.

LOCKDIR="/tmp/.agent-memory-sync-watch.lock"
# Deliberately OUTSIDE agent-memory/ -- WatchPaths watches the whole
# directory tree, so a log file written inside it (as this originally was,
# in agent-memory/.state/) re-triggers this same script on every run,
# producing a self-sustaining fire loop. Confirmed live 2026-08-21: 15+
# runs in ~20 minutes, some 10s apart, traced to exactly this.
LOG_DIR="$HOME/.claude/logs"
LOG_FILE="$LOG_DIR/agent-memory-sync-watch.log"

mkdir -p "$LOG_DIR"

if ! mkdir "$LOCKDIR" 2>/dev/null; then
  exit 0
fi
trap 'rmdir "$LOCKDIR" 2>/dev/null' EXIT

# Let a burst of writes (e.g. memory-decay-scheduler.sh touching many files
# in one run) settle before mirroring, so one sync captures the final state
# instead of firing mid-burst.
sleep 3

{
  echo "--- $(date '+%Y-%m-%d %H:%M:%S') ---"
  bash "$HOME/.claude/scripts/sync-all.sh" --only memory
} >> "$LOG_FILE" 2>&1
