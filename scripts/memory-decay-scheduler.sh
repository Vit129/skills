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
# Also flags auto-memory (~/.claude/projects/*/memory/*.md, the per-project
# curated-fact layer) name collisions across active vs archive/ — the mechanical
# signal for "this fact got superseded but the stale copy is still sitting active,
# or reappeared after being archived": same `name:` frontmatter slug in both
# places. Recency (mtime) decides which one is presumed current; never auto-merges
# semantic content (no NLP here — this is a duplicate-slug detector, not a
# contradiction detector like "moved city" — that needs a human/AI read).
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

# scan_memory_conflicts <auto-memory-dir> — flag `name:` frontmatter slugs that
# appear both in the active dir and its archive/ subfolder (superseded-but-not-
# cleaned-up), or twice within the active dir itself (literal duplicate).
scan_memory_conflicts() {
  local dir="$1"
  [ -d "$dir" ] || return
  local active_names archive_names name f newer older
  active_names=$(grep -l "^name:" "$dir"/*.md 2>/dev/null | while IFS= read -r f; do
    name=$(grep -m1 "^name:" "$f" | sed 's/^name: *//')
    echo "$name|$f"
  done)
  archive_names=""
  if [ -d "$dir/archive" ]; then
    archive_names=$(grep -l "^name:" "$dir/archive"/*.md 2>/dev/null | while IFS= read -r f; do
      name=$(grep -m1 "^name:" "$f" | sed 's/^name: *//')
      echo "$name|$f"
    done)
  fi

  local found=0
  # active vs archive collisions
  while IFS='|' read -r name f; do
    [ -z "$name" ] && continue
    local match
    match=$(echo "$archive_names" | grep "^${name}|" | cut -d'|' -f2)
    if [ -n "$match" ]; then
      if [ "$(stat -f %m "$f" 2>/dev/null)" -ge "$(stat -f %m "$match" 2>/dev/null)" ]; then
        newer="$f"; older="$match"
      else
        newer="$match"; older="$f"
      fi
      echo "- \"$name\" — active AND archived copy both exist. Newer: \`${newer#$HOME/}\`, older: \`${older#$HOME/}\` — review whether the older one should be deleted or the newer one is itself wrong"
      found=1
    fi
  done <<< "$active_names"
  # duplicate within active
  while IFS= read -r dup; do
    [ -z "$dup" ] && continue
    echo "- \"$dup\" — appears in more than one active memory file — check for a literal duplicate"
    found=1
  done < <(echo "$active_names" | cut -d'|' -f1 | sort | uniq -d)
  [ "$found" -eq 0 ] && echo "_(none)_"
}

{
  echo "DECAY_CHECK_DUE"
  echo "---"
  echo "## Memory Decay Snapshot ($TODAY)"
  echo ""

  scan_project "Global (~/.claude)" "$HOME/.claude/agent-memory"

  echo "### Auto-memory name collisions (active vs archive, or duplicate active):"
  for mem_dir in "$HOME"/.claude/projects/*/memory; do
    [ -d "$mem_dir" ] || continue
    proj_label=$(basename "$(dirname "$mem_dir")")
    conflicts=$(scan_memory_conflicts "$mem_dir")
    if ! echo "$conflicts" | grep -q "^_(none)_$"; then
      echo "**$proj_label:**"
      echo "$conflicts"
    fi
  done
  echo ""

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
