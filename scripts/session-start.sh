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

# ── agent-memory/PLAYBOOK.md: corroborated patterns, most-proven first ──
# Applied+Prevented is our existing evidence-count signal (same role as
# Atlaso's manual thin/settled/contested labels, or Memento/MEMTIER's
# episodic->semantic promotion weight) — it already exists in the file but
# was never surfaced at the point memory actually gets read. Same
# `while IFS='|' read` row-parse memory-decay-scheduler.sh already uses.
PLAYBOOK_FILE=$(find "$PROJ/agent-memory" -maxdepth 1 -iname "playbook.md" 2>/dev/null | head -1 || true)
if [[ -n "${PLAYBOOK_FILE:-}" && -f "$PLAYBOOK_FILE" ]]; then
  trim() { sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' <<< "$1"; }
  playbook_lines=$(
    while IFS='|' read -r _ id trigger fix domain outcome applied prevented _; do
      id=$(trim "$id")
      [[ "$id" != CASE-* ]] && continue
      applied=$(trim "$applied")
      prevented=$(trim "$prevented")
      [[ "$applied" =~ ^[0-9]+$ ]] || continue
      [[ "$prevented" =~ ^[0-9]+$ ]] || continue
      total=$((applied + prevented))
      domain=$(trim "$domain")
      trigger=$(trim "$trigger")
      printf '%03d|%s (%dx: %d applied + %d prevented) %s — %s\n' \
        "$total" "$id" "$total" "$applied" "$prevented" "$domain" "$trigger"
    done < "$PLAYBOOK_FILE" | sort -t'|' -k1,1rn | cut -d'|' -f2- | head -10
  )
  if [[ -n "$playbook_lines" ]]; then
    echo "## Playbook — corroborated patterns, most-proven first (agent-memory/PLAYBOOK.md)"
    while IFS= read -r line; do echo "- $line"; done <<< "$playbook_lines"
    sep
  fi
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
  # return 0 explicitly on every early exit — a bare `return` after `grep || return`
  # inherits grep's failing status, which set -e does NOT exempt (it's the command
  # on the right of the final ||), and that killed the whole script whenever a
  # report had zero actionable bullets — the common case, so this silently
  # truncated session-start.sh's output (GATE-STATE/digest/maintenance sections
  # never ran) far more often than the empty auto-act case alone would suggest.
  [[ -z "$latest" ]] && return 0
  grep -q "^ACTED:" "$latest" 2>/dev/null && return 0
  grep -qE '^- .+' "$latest" 2>/dev/null || return 0
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
auto_act_check "kouen-task-checks" "Kouen Tasks" "run rules/routing.md's Kouen Task Sync flow for each open task listed above — confirm the project per task with the user via AskUserQuestion first, never auto-file or auto-act on a guess."

# ── agent-memory/digest: today's daily digest, if generated ──
DIGEST_FILE="$HOME/.claude/agent-memory/digest/$(date '+%Y-%m-%d').md"
if [[ -f "$DIGEST_FILE" ]]; then
  echo "## Today's digest (agent-memory/digest/$(date '+%Y-%m-%d').md)"
  cat "$DIGEST_FILE"
  sep
fi

# ── agent-memory/maintenance.log: pending scheduled maintenance report ──
MAINT_LOG="$PROJ/agent-memory/maintenance.log"
if [[ -s "$MAINT_LOG" ]]; then
  echo "## Pending memory maintenance report (agent-memory/maintenance.log)"
  cat "$MAINT_LOG"
  echo "(Apply genuine archive/crystallize candidates per agent-memory SKILL.md rules, then clear this log.)"
  sep
fi
