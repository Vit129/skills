#!/bin/bash
# Skill Eval Scheduler
# Checks if weekly eval is due, outputs skills to evaluate.
# Usage: ./eval-scheduler.sh [--force]
# Returns exit 0 + skill list if eval due, exit 1 if not due.

EVAL_STATE="$HOME/.kiro/agent-memory/eval-state.md"
SKILL_LOG="$HOME/.kiro/agent-memory/skill-log.md"
MEMORY="$HOME/.kiro/agent-memory/memory.md"
EVAL_INTERVAL_DAYS=7

# Create eval-state if missing
if [ ! -f "$EVAL_STATE" ]; then
  echo "last_eval: 1970-01-01" > "$EVAL_STATE"
fi

LAST_EVAL=$(grep "last_eval:" "$EVAL_STATE" | cut -d' ' -f2)
LAST_EPOCH=$(date -j -f "%Y-%m-%d" "$LAST_EVAL" "+%s" 2>/dev/null || echo "0")
NOW_EPOCH=$(date "+%s")
DIFF_DAYS=$(( (NOW_EPOCH - LAST_EPOCH) / 86400 ))

if [ "$1" != "--force" ] && [ "$DIFF_DAYS" -lt "$EVAL_INTERVAL_DAYS" ]; then
  echo "NOT_DUE (last eval: $LAST_EVAL, ${DIFF_DAYS}d ago, next in $((EVAL_INTERVAL_DAYS - DIFF_DAYS))d)"
  exit 1
fi

echo "EVAL_DUE"
echo "---"
echo "## Skills to Evaluate"
echo ""

# Priority 1: Flagged skills from memory.md
echo "### Flagged (priority):"
grep -A 100 "Skill_Flags" "$MEMORY" | grep "^|" | grep -v "Skill.*Domain" | grep -v "^|---" | while read -r line; do
  skill=$(echo "$line" | cut -d'|' -f2 | xargs)
  if [ -n "$skill" ]; then
    echo "- $skill (flagged in memory)"
  fi
done

# Priority 2: Skills with proposed improvements in skill-log
echo ""
echo "### Pending improvements:"
grep "proposed" "$SKILL_LOG" 2>/dev/null | while read -r line; do
  skill=$(echo "$line" | cut -d'|' -f3 | xargs)
  echo "- $skill"
done | sort -u

echo ""
echo "### Run: pass@3 eval on each skill above"
echo "### Report to: ~/.kiro/agent-memory/evals/"
