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
#
# Also runs a global skill-dormancy flag (2026-07-29, prompted by comparing this
# workspace against Boris/Anthropic's system-prompt ablation practice — see
# agent-memory memory "project_orchestration_vs_agent_frameworks"): reuses
# agent-memory/skill-usage.log (already written by hooks/skill-usage-log.py on
# every Skill invocation) to flag skills/*/SKILL.md with zero hits since the log
# started. This is NOT measured ablation — there is no eval/scoring harness for
# prose skills the way Boris's team has for models, so removal impact can't be
# remeasured. It is a dormancy flag only, same review-not-auto-act contract as
# every other section in this file. Scope is deliberately narrow: only
# ~/.claude/skills/*/SKILL.md (the routing.md-registered catalog). rules/*.md are
# NOT covered — they load via CLAUDE.md @import on every session regardless of
# use, so there is no invocation signal to measure them by; that gap is a known,
# accepted limit, not an oversight. Plugin-namespaced skills (caveman:*, codex:*,
# fable-advisor:*, watch:*, 9arm-skills:*) and command-based skills
# (commands/*.md) are also out of scope — different lifecycle/ownership than the
# skills/ catalog this check targets.
#
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
SKILLS_DIR="$HOME/.claude/skills"
USAGE_LOG="$HOME/.claude/agent-memory/skill-usage.log"
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

# scan_skill_dormancy — flag skills/*/SKILL.md with zero hits in
# agent-memory/skill-usage.log since the log's first recorded entry. Gated on
# the log having at least STALE_DAYS of history so day-one/early runs don't
# flag the whole catalog as noise.
scan_skill_dormancy() {
  echo "Dormancy flag, not measured ablation — no eval/scoring harness exists for"
  echo "skill prose the way Boris/Anthropic's team has for models, so removal"
  echo "impact can't be remeasured. Zero hits over a long window is a proxy for"
  echo "'unused lately or ever' — the real recurring cost is the skill's one-line"
  echo "entry in the available-skills listing injected into every session's"
  echo "context, not the file itself. Seasonal/conditional skills (thai-accountant,"
  echo "japanese-practice, fitness, finance/*, platform-specific skills, etc.) are"
  echo "EXPECTED to show zero hits for long stretches — that's normal, not a"
  echo "defect. Only act if a skill is provably superseded/duplicated by another"
  echo "routing.md row, or the user confirms it's dead weight — review, don't"
  echo "auto-retire."
  echo ""

  if [ ! -f "$USAGE_LOG" ]; then
    echo "_(no skill-usage.log yet — check not yet meaningful)_"
    return
  fi

  local first_date first_epoch log_age_days
  first_date=$(head -1 "$USAGE_LOG" | cut -d'|' -f1)
  first_epoch=$(date -j -f "%Y-%m-%d" "$first_date" "+%s" 2>/dev/null || echo "0")
  log_age_days=$(( (NOW_EPOCH - first_epoch) / 86400 ))

  if [ "$log_age_days" -lt "$STALE_DAYS" ]; then
    echo "_(usage log only ${log_age_days}d old (starts ${first_date}) — needs >= ${STALE_DAYS}d of history before this check is meaningful, skipping)_"
    return
  fi

  local dormant_count=0
  for d in "$SKILLS_DIR"/*/; do
    local name
    name=$(basename "$d")
    [ -f "${d}SKILL.md" ] || continue
    if ! grep -q "|${name}\$" "$USAGE_LOG"; then
      echo "- $name (0 hits in ${log_age_days}d of usage log)"
      dormant_count=$((dormant_count + 1))
    fi
  done
  [ "$dormant_count" -eq 0 ] && echo "_(none)_"
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

  echo "### Global skills — zero recorded uses since usage-log start:"
  scan_skill_dormancy
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
