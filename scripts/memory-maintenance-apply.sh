#!/usr/bin/env bash
# Unattended memory maintenance: generate a report, then let a headless Claude Code
# agent apply the agent-memory archive/crystallize/link-fix rules.
# Safety: --allowedTools grants Read/Edit/Write only, no Bash — git commands are
# structurally impossible in this run, not just prompted against.
# Usage: memory-maintenance-apply.sh <project-root>
set -euo pipefail

CLAUDE_BIN="/Users/supavit.cho/.local/bin/claude"
MODEL="${MEMORY_MAINTENANCE_MODEL:-claude-sonnet-5}"
EFFORT="${MEMORY_MAINTENANCE_EFFORT:-medium}"
PROJECT="${1:?Usage: memory-maintenance-apply.sh <project-root>}"
PROJECT="$(cd "$PROJECT" && pwd)"
AGENT_MEM="$PROJECT/agent-memory"
LOG="$AGENT_MEM/maintenance.log"

if [ ! -d "$AGENT_MEM" ]; then
  echo "No agent-memory/ at $PROJECT — skipping."
  exit 0
fi

REPORT="$("$(dirname "$0")/memory-maintenance-report.sh" "$AGENT_MEM")"

echo "=== Maintenance run $(date '+%Y-%m-%d %H:%M %Z') ===" >> "$LOG"

PROMPT=$(cat <<EOF
You are running as an unattended scheduled maintenance job on this agent-memory/ directory.
Below is a read-only maintenance report (broken wikilinks, PLAYBOOK archive candidates, crystallize candidates):

$REPORT

Apply the existing agent-memory rules (~/.claude/skills/agent-memory/SKILL.md Rules section) to genuine candidates only:
- Archive candidates: move the PLAYBOOK row to knowledge/archive-playbook.md (create if missing), remove it from PLAYBOOK.md/playbook.md.
- Crystallize candidates: only if the files genuinely share a reusable pattern, not just the same Domain tag — write knowledge/{domain}-pattern.md synthesizing them, update INDEX.md/index.md.
- Broken links: fix only if the correct target is obvious from context; otherwise leave a one-line TODO note in the file instead of guessing.
- Skip anything ambiguous and say why — do not force an action to clear the report.

You have Read/Edit/Write only, no Bash — a git command cannot run in this session regardless of instruction. Do not attempt one anyway. When done, append a short bullet summary of what changed (or "no changes needed") to maintenance.log in this directory.
EOF
)

cd "$AGENT_MEM"
"$CLAUDE_BIN" -p "$PROMPT" --model "$MODEL" --effort "$EFFORT" --allowedTools "Read Edit Write" --permission-mode acceptEdits >> "$LOG" 2>&1
echo "" >> "$LOG"
