#!/bin/bash
# Skill Eval Scheduler
# Checks if daily eval is due, outputs skills to evaluate, logs the result.
# Usage: ./eval-scheduler.sh [--force]
# Returns exit 0 + skill list if eval due, exit 1 if not due.

EVAL_STATE="$HOME/.claude/agent-memory/EVAL-STATE.md"
SKILL_LOG="$HOME/.claude/agent-memory/SKILL-LOG.md"
EVALS_DIR="$HOME/.claude/agent-memory/evals"
EVAL_INTERVAL_DAYS=1
LOG_RETENTION_DAYS=7

mkdir -p "$EVALS_DIR"

# Clear logs older than the retention window (runs every invocation, cheap).
find "$EVALS_DIR" -maxdepth 1 -name "20*.md" -mtime "+${LOG_RETENTION_DAYS}" -delete 2>/dev/null

# Create eval-state if missing
if [ ! -f "$EVAL_STATE" ]; then
  echo "last_eval: 1970-01-01" > "$EVAL_STATE"
fi

LAST_EVAL=$(grep "last_eval:" "$EVAL_STATE" | cut -d' ' -f2)
LAST_EPOCH=$(date -j -f "%Y-%m-%d" "$LAST_EVAL" "+%s" 2>/dev/null || echo "0")
NOW_EPOCH=$(date "+%s")
DIFF_DAYS=$(( (NOW_EPOCH - LAST_EPOCH) / 86400 ))
TODAY=$(date "+%Y-%m-%d")

if [ "$1" != "--force" ] && [ "$DIFF_DAYS" -lt "$EVAL_INTERVAL_DAYS" ]; then
  echo "NOT_DUE (last eval: $LAST_EVAL, ${DIFF_DAYS}d ago, next in $((EVAL_INTERVAL_DAYS - DIFF_DAYS))d)"
  exit 1
fi

LOG_FILE="$EVALS_DIR/${TODAY}.md"

{
  echo "EVAL_DUE"
  echo "---"
  echo "## Skills to Evaluate ($TODAY)"
  echo ""

  # Skills with proposed improvements in skill-log (only real input this
  # scheduler has -- a prior "Skill_Flags in memory.md" priority tier was
  # removed 2026-07-27: memory.md doesn't exist in this workspace and nothing
  # ever wrote that table -- leftover from an unported ~/.kiro-only workflow,
  # see eval-check.kiro.hook. skill-usage-log.py's repeat-invocation nudge is
  # what feeds SKILL-LOG.md now.)
  echo "### Pending improvements:"
  grep -E '^\| *[0-9]{4}-[0-9]{2}-[0-9]{2} *\|' "$SKILL_LOG" 2>/dev/null | awk -F'|' '{
    status=$6; gsub(/^[ \t]+|[ \t]+$/, "", status)
    if (status == "proposed") {
      skill=$3; gsub(/^[ \t]+|[ \t]+$/, "", skill)
      print "- " skill
    }
  }' | sort -u

  echo ""
  echo "### Run: pass@3 eval on each skill above"
  echo "### Report result here (append below this line, before the next scheduled run overwrites nothing -- this file is dated, not appended-over)"
  echo ""
  echo "## Result"
  echo ""
  echo "_(not yet run -- append findings here, or a one-line 'no skills due' note)_"
} | tee "$LOG_FILE"

# Mark today as the last eval check -- this line was previously missing
# entirely, so the scheduler had been reporting EVAL_DUE on every single
# invocation since 1970-01-01.
echo "last_eval: $TODAY" > "$EVAL_STATE"
