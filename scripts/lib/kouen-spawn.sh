#!/bin/bash
# Shared helper: spawn a real Kouen session running Claude Code and type a
# prompt into it, without needing an MCP/agent context to do so.
#
# Used by kouen-task-watch.sh and scheduler-event-watch.sh -- factored out
# 2026-08-21 so both event-driven triggers share one spawn implementation
# instead of copy-pasted logic drifting apart.
#
# Usage: source this file, then call:
#   kouen_spawn_and_prompt "<prompt text>"
# Returns 0 on success (prompt typed into a new pane), 1 if the new pane's
# surface couldn't be resolved.

KOUEN_CLI="/Users/supavit.cho/Library/Application Support/Kouen/bin/kouen-cli"
KOUEN_TARGET_CWD="/Users/supavit.cho/.claude"

kouen_spawn_and_prompt() {
  local prompt="$1"

  local workspace
  workspace=$("$KOUEN_CLI" list-workspaces --json 2>/dev/null | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d[0]["name"] if d else "Default")' 2>/dev/null)
  [ -z "$workspace" ] && workspace="Default"

  local before after surface
  before=$("$KOUEN_CLI" list-surfaces --json 2>/dev/null)
  "$KOUEN_CLI" new-session --workspace "$workspace" --cwd "$KOUEN_TARGET_CWD" --name "auto-act" >/dev/null 2>&1
  sleep 1.5
  after=$("$KOUEN_CLI" list-surfaces --json 2>/dev/null)

  surface=$(python3 -c '
import json, sys
before = {s["surfaceID"] for s in json.loads(sys.argv[1] or "[]")}
after = json.loads(sys.argv[2] or "[]")
for s in after:
    if s["surfaceID"] not in before and s.get("cwd") == sys.argv[3]:
        print(s["surfaceID"])
        break
' "$before" "$after" "$KOUEN_TARGET_CWD" 2>/dev/null)

  [ -z "$surface" ] && return 1

  "$KOUEN_CLI" send --surface "$surface" --text "claude" >/dev/null 2>&1
  "$KOUEN_CLI" send-keys --surface "$surface" --keys "Enter" >/dev/null 2>&1

  # Poll for Claude Code's TUI to actually render before typing the prompt --
  # a flat sleep raced a slow boot in testing (2026-08-21: the prompt arrived
  # before the TUI was ready and was silently dropped, pane sat idle at the
  # dashboard) instead of assuming a fixed delay is always enough.
  local waited=0
  while [ "$waited" -lt 15 ]; do
    "$KOUEN_CLI" capture-pane --surface "$surface" 2>/dev/null | grep -q "Claude Code" && break
    sleep 1
    waited=$((waited + 1))
  done
  sleep 1

  "$KOUEN_CLI" send --surface "$surface" --text "$prompt" >/dev/null 2>&1
  "$KOUEN_CLI" send-keys --surface "$surface" --keys "Enter" >/dev/null 2>&1
  return 0
}
