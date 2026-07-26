#!/bin/bash
# Memory Decay Scheduler
# Daily staleness sweep of agent-memory/*.md + agent-memory/knowledge/**/*.md
# (global ~/.claude AND every project under ~/Git/Personal/* that has its own
# agent-memory/ dir, auto-discovered — a new project just needs an agent-memory/
# dir to be picked up next run, no manual registration) plus skills/candidates/*.md
# (global only — no project has its own candidates staging dir). Flags files
# untouched past STALE_DAYS (mtime proxy, no per-fact timestamp exists) and
# PLAYBOOK.md/playbook.md rows that already meet the file's own documented
# archive rule (Applied+Prevented >= 5) so they can be reviewed/archived.
# Same daily-cadence-state-file pattern as eval-scheduler.sh / candidate-scheduler.sh.
# Usage: ./memory-decay-scheduler.sh [--force]
# Returns exit 0 + report if due, exit 1 if not due.
#
# ponytail: mtime is a staleness proxy, not a correctness signal — a file can be
# untouched because it's still true. This only flags for human/AI review, never
# auto-deletes or auto-archives.

STATE="$HOME/.claude/agent-memory/DECAY-STATE.md"
LOG_DIR="$HOME/.claude/agent-memory/decay-checks"
CHECK_INTERVAL_DAYS=1
LOG_RETENTION_DAYS=7
STALE_DAYS=90

CANDIDATES_DIR="$HOME/.claude/skills/candidates"
PROJECTS_ROOT="$HOME/Git/Personal"
# no-touch: third-party repo, read-only per rules/core.md — never scan it
SKIP_PROJECTS=(9arm-skills)

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

# scan_project <label> <agent-memory-dir>
scan_project() {
  local label="$1" mem="$2"
  [ -d "$mem" ] || return

  echo "### $label"
  echo ""
  echo "Files untouched >${STALE_DAYS}d (mtime proxy — review, don't assume wrong):"
  local stale_count=0
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    echo "- ${f#$HOME/}"
    stale_count=$((stale_count + 1))
  done < <(find "$mem" -maxdepth 3 -name "*.md" ! -name "README.md" -mtime "+${STALE_DAYS}" 2>/dev/null)
  [ "$stale_count" -eq 0 ] && echo "_(none)_"

  echo ""
  echo "PLAYBOOK rows meeting archive rule (Applied+Prevented >= 5):"
  local playbook archive_count=0
  playbook=$(find "$mem" -maxdepth 1 -iname "playbook.md" | head -1)
  if [ -n "$playbook" ] && [ -f "$playbook" ]; then
    while IFS='|' read -r _ id trigger fix domain outcome applied prevented _; do
      id=$(echo "$id" | xargs)
      [[ "$id" != CASE-* ]] && continue
      applied=$(echo "$applied" | xargs)
      prevented=$(echo "$prevented" | xargs)
      [[ "$applied" =~ ^[0-9]+$ ]] || continue
      [[ "$prevented" =~ ^[0-9]+$ ]] || continue
      total=$((applied + prevented))
      if [ "$total" -ge 5 ]; then
        echo "- $id (Applied=$applied, Prevented=$prevented) — candidate to move to knowledge/archive-playbook.md"
        archive_count=$((archive_count + 1))
      fi
    done < "$playbook"
  fi
  [ "$archive_count" -eq 0 ] && echo "_(none)_"
  echo ""
}

{
  echo "DECAY_CHECK_DUE"
  echo "---"
  echo "## Memory Decay Snapshot ($TODAY)"
  echo ""

  scan_project "Global (~/.claude)" "$HOME/.claude/agent-memory"

  echo "### Global skill-candidates untouched >${STALE_DAYS}d:"
  cand_count=0
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    echo "- ${f#$HOME/}"
    cand_count=$((cand_count + 1))
  done < <(find "$CANDIDATES_DIR" -maxdepth 1 -name "*.md" ! -name "README.md" -mtime "+${STALE_DAYS}" 2>/dev/null)
  [ "$cand_count" -eq 0 ] && echo "_(none)_"
  echo ""

  for proj_dir in "$PROJECTS_ROOT"/*/; do
    proj=$(basename "$proj_dir")
    skip=0
    for s in "${SKIP_PROJECTS[@]}"; do
      [[ "$proj" == "$s" ]] && skip=1 && break
    done
    [ "$skip" -eq 1 ] && continue
    scan_project "$proj" "${proj_dir}agent-memory"
  done

  echo "## Result"
  echo ""
  echo "_(review above — this is a flag list, not an action list. Archive/update manually, or ask before bulk-editing.)_"
} | tee "$LOG_FILE"

echo "last_check: $TODAY" > "$STATE"
