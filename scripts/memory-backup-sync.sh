#!/usr/bin/env bash
# memory-backup-sync.sh — mirror two things into the private
# claude-memory-private repo, then commit+push if anything changed:
#   1. ~/.claude/projects/*/memory/       -> projects/<name>/memory/
#   2. ~/Git/Personal/*/agent-memory/     -> agent-memory/<name>/
#
# Scope is deliberately narrow: memory/*.md content only, never the *.jsonl
# session transcripts (regenerable, 2GB+, not memory) and never Company-*
# project dirs (user decision 2026-08-16 -- company-repo knowledge stays
# off a personal-account backup, even a private one). Item 2 is sourced
# only from ~/Git/Personal/ -- Company repos live under ~/Git/Company/,
# structurally out of scope, no name-based filter needed there.
#
# agent-memory/ stays physically in place in each project (no symlinks --
# see [[project_new_machine_memory_backup]] for why); this is a second,
# independent copy, not the only one, same as item 1.
set -euo pipefail

CLAUDE_SRC="$HOME/.claude/projects"
CLAUDE_DST="$HOME/.claude-memory-backup/projects"
PERSONAL_SRC="$HOME/Git/Personal"
PERSONAL_DST="$HOME/.claude-memory-backup/agent-memory"

mkdir -p "$CLAUDE_DST"

for project_dir in "$CLAUDE_SRC"/*/; do
  name="$(basename "$project_dir")"
  memory_dir="${project_dir}memory"
  [ -d "$memory_dir" ] || continue
  case "$name" in
    *Company*) echo "skip (company): $name"; continue ;;
  esac
  mkdir -p "$CLAUDE_DST/$name/memory"
  rsync -a --delete "$memory_dir/" "$CLAUDE_DST/$name/memory/"
done

mkdir -p "$PERSONAL_DST"

for project_dir in "$PERSONAL_SRC"/*/; do
  name="$(basename "$project_dir")"
  am_dir="${project_dir}agent-memory"
  [ -d "$am_dir" ] || continue
  mkdir -p "$PERSONAL_DST/$name"
  rsync -a --delete "$am_dir/" "$PERSONAL_DST/$name/"
done

cd "$HOME/.claude-memory-backup"
git add -A

if git diff --cached --quiet; then
  echo "no changes"
  exit 0
fi

git commit -q -m "sync: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -q origin main
echo "synced and pushed"
