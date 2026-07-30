#!/bin/bash
# Routing Adherence Scheduler
# Daily check: cross-references agent-memory/routing-nudges.log (written by
# hooks/user-prompt-submit.py's check_skill_trigger on every UserPromptSubmit
# keyword match, format date|session_id|keyword|skill) against
# agent-memory/skill-usage.log (written by hooks/skill-usage-log.py on every
# actual Skill() call, format date|session_id|skill) to flag keyword-triggered
# routing suggestions that were never followed in the same session.
#
# This is the audit trail interview-gate.py/mandatory-skill-gate.py don't
# provide: those two are hard PreToolUse blocks but only cover Edit/Write and
# only interview / a project's own MANDATORY skill -- the keyword-based nudge
# (skill-keywords.json) that covers the rest of routing.md's Skill Map
# (debug-mantra-workflow, backend-dev, qa-architect, ...) is soft-only
# (additionalContext, no block) and previously left no record of whether it
# was obeyed or correctly judged a false positive.
#
# A flagged gap is NOT proof of a routing miss -- a keyword match can be a
# false positive (matched inside quoted/reported text, not the user's actual
# ask -- this happened in this exact workspace: "fastapi" fired from a
# sub-agent's report text mid-conversation and was correctly ignored). This
# check surfaces candidates for review, same review-not-auto-act contract as
# memory-decay-scheduler.sh and candidate-scheduler.sh.
#
# Only nudges since the last check are scanned (routing-nudges.log grows
# forever; re-flagging the same already-reviewed gap every day would just be
# noise) -- same LAST_CHECK cadence-state pattern as the other schedulers.
#
# Usage: ./routing-adherence-scheduler.sh [--force]
# Returns exit 0 + report if due, exit 1 if not due.

STATE="$HOME/.claude/agent-memory/ROUTING-ADHERENCE-STATE.md"
LOG_DIR="$HOME/.claude/agent-memory/routing-adherence-checks"
NUDGES_LOG="$HOME/.claude/agent-memory/routing-nudges.log"
SKILL_USAGE_LOG="$HOME/.claude/agent-memory/skill-usage.log"
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
  echo "ROUTING_ADHERENCE_CHECK_DUE"
  echo "---"
  echo "## Routing Adherence Snapshot ($TODAY)"
  echo ""

  if [ ! -f "$NUDGES_LOG" ]; then
    echo "_(no routing-nudges.log yet — check not yet meaningful)_"
  else
    echo "Keyword-triggered routing suggestions since ${LAST_CHECK} with no matching Skill() call in the same session:"
    echo ""
    gap_count=0
    seen="|"
    while IFS='|' read -r ndate nsession nkeyword nskill; do
      [ -z "$ndate" ] && continue
      [[ "$ndate" < "$LAST_CHECK" ]] && continue
      key="${nsession}:${nskill}"
      case "$seen" in *"|${key}|"*) continue ;; esac
      seen="${seen}${key}|"
      if [ -f "$SKILL_USAGE_LOG" ] && grep -q "|${nsession}|${nskill}\$" "$SKILL_USAGE_LOG"; then
        continue
      fi
      echo "- session \`${nsession}\` (${ndate}): keyword \"${nkeyword}\" suggested Skill(${nskill}), never invoked in that session"
      gap_count=$((gap_count + 1))
    done < "$NUDGES_LOG"
    [ "$gap_count" -eq 0 ] && echo "_(none)_"
  fi

  echo ""
  echo "## Result"
  echo ""
  echo "_(review above — a gap can be a real routing miss or a correctly-ignored false positive (quoted/reported text, not the actual user ask). Only act if it's a real miss: note the pattern in a feedback memory or agent-memory/SKILL-LOG.md if it reveals a systemic gap, otherwise leave it.)_"
} | tee "$LOG_FILE"

echo "last_check: $TODAY" > "$STATE"
