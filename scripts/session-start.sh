#!/usr/bin/env bash
# Condensed session context for AI. Prints .claude/memory index.
# Usage: session-start.sh [project-dir]
set -euo pipefail

PROJ="${1:-$PWD}"

# Resolve .claude/projects/{slug}/memory/ — slug = abs path with /. → -
PROJ_ABS=$(cd "$PROJ" && pwd)
SLUG=$(echo "$PROJ_ABS" | sed 's|[/.]|-|g')
CLAUDE_MEM="$HOME/.claude/projects/${SLUG}/memory"

sep() { printf '%.0s─' {1..56}; echo; }

echo "# Context — $(basename "$PROJ") · $(date '+%Y-%m-%d %H:%M')"
echo "# ponytail=on · headroom=localhost:8787 · grep+graphify for lookup"
sep

# ── .claude/memory: Claude Code auto-memory (feedback + user prefs) ────
if [[ -d "$CLAUDE_MEM" ]]; then
  entries=$(find "$CLAUDE_MEM" -name "*.md" ! -name "MEMORY.md" 2>/dev/null)
  if [[ -n "$entries" ]]; then
    echo "## Claude Code memory (.claude/memory)"
    while IFS= read -r f; do
      # Print name + first body line after frontmatter
      name=$(grep -m1 "^name:" "$f" 2>/dev/null | sed 's/name: *//' || basename "$f" .md)
      body=$(awk '/^---/{c++; next} c>=2 && NF{print; exit}' "$f" 2>/dev/null || true)
      echo "- $name: $body"
    done <<< "$entries"
    sep
  fi
fi

# ── agent-memory/GATE-STATE.md: paused HITL gates from a prior session ──
GATE_STATE="$PROJ/agent-memory/GATE-STATE.md"
if [[ -f "$GATE_STATE" ]] && grep -q "^- Status: OPEN *$" "$GATE_STATE" 2>/dev/null; then
  echo "## ⏸ Paused gate(s) — agent-memory/GATE-STATE.md"
  awk 'BEGIN{RS="## GATE-"; ORS=""} NR>1{
    open=0; n=split($0, lines, "\n")
    for (i=1; i<=n; i++) if (lines[i] ~ /^- Status: OPEN[ \t]*$/) open=1
    if (open) print "## GATE-" $0
  }' "$GATE_STATE"
  echo "(Resume the named skill at the stated gate — don't restart from scratch. Mark RESOLVED once the question is answered.)"
  sep
fi

# ── Auto-act: unattended-detected eval/candidate DUE reports needing action,
# not just review. Cron (eval-scheduler.sh, candidate-scheduler.sh) detects
# unattended; the actual write/promote step only ever runs inside a real
# session (hooks/gates stay live) — this is that trigger. Global only
# (skills/SKILL-LOG.md are global, not per-project), regardless of $PROJ.
auto_act_check() {
  local dir="$1" label="$2" instructions="${3:-}"
  local logdir="$HOME/.claude/agent-memory/$dir"
  local latest
  latest=$(find "$logdir" -maxdepth 1 -name "20*.md" 2>/dev/null | sort | tail -1)
  [[ -z "$latest" ]] && return
  grep -q "^ACTED:" "$latest" 2>/dev/null && return
  grep -qE '^- ' "$latest" 2>/dev/null || return
  echo "## Auto-act due — $label (${latest#$HOME/.claude/})"
  cat "$latest"
  echo ""
  if [[ -n "$instructions" ]]; then
    echo "(This session's first action, before the user's own ask: $instructions Once handled, append a line 'ACTED: <date>' to $latest so it doesn't resurface next session.)"
  else
    echo "(This session's first action, before the user's own ask: act on the items above — promote skill-candidates at hit_count>=3 via skill-creator, run pass@3 eval / apply safe SKILL-LOG.md 'proposed' improvements, otherwise leave proposed with a one-line reason. Don't just report it to the user as a to-do. Once handled, append a line 'ACTED: <date>' to $latest so it doesn't resurface next session.)"
  fi
  sep
}
auto_act_check "evals" "Skill Eval"
auto_act_check "candidate-checks" "Skill Candidates"
auto_act_check "routing-adherence-checks" "Routing Adherence" "review each gap — a keyword nudge firing with no matching Skill() call can be a real routing miss or a correctly-judged false positive (keyword matched quoted/reported text, not the user's actual ask). Only act on real misses: note a recurring pattern in a feedback memory, or flag the specific skill-keywords.json rule if it's producing noise. Don't blanket-treat every listed gap as a violation."
auto_act_check "graphify-label-checks" "Graphify Semantic Labels" "dispatch labeling to agy/an agent ONE PROJECT AT A TIME (never a single batch across all flagged projects — that produced garbage labels silently before), then quality-check each result (duplicate-label ratio + spot-check community membership in graph.json) before trusting it, reverting via git checkout or the graphify-out/<date>/ backup folder if it fails. Otherwise leave 'proposed' with a one-line reason."

# ── agent-memory/maintenance.log: pending scheduled maintenance report ──
MAINT_LOG="$PROJ/agent-memory/maintenance.log"
if [[ -s "$MAINT_LOG" ]]; then
  echo "## Pending memory maintenance report (agent-memory/maintenance.log)"
  cat "$MAINT_LOG"
  echo "(Apply genuine archive/crystallize candidates per agent-memory SKILL.md rules, then clear this log.)"
  sep
fi
