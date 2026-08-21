#!/usr/bin/env bash
# memory-backup-sync.sh — mirror two things into the private
# agent-memory-private repo, then commit+push if anything changed:
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

BACKUP_REPO="$HOME/Git/Personal/agent-memory-private"
CLAUDE_SRC="$HOME/.claude/projects"
CLAUDE_DST="$BACKUP_REPO/projects"
PERSONAL_SRC="$HOME/Git/Personal"
PERSONAL_DST="$BACKUP_REPO/agent-memory"

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
  # agent-memory-private itself now lives under ~/Git/Personal/ (2026-08-16
  # rename, was ~/.claude-memory-backup) -- its own agent-memory/ subtree is
  # the destination, not a source; without this guard every run would rsync
  # it into itself one level deeper.
  [ "$name" = "agent-memory-private" ] && continue
  am_dir="${project_dir}agent-memory"
  [ -d "$am_dir" ] || continue
  mkdir -p "$PERSONAL_DST/$name"
  rsync -a --delete "$am_dir/" "$PERSONAL_DST/$name/"
done

cd "$BACKUP_REPO"
git add -A

if git diff --cached --quiet; then
  echo "no changes"
  exit 0
fi

# Refresh the fact-graph (graphify-out/) over the synced memory content --
# wikilinks ([[name]]) between memory files resolve as real graph edges, this
# is what closes the Hermes "Holographic" fact-graph gap. AST-only, no LLM/API
# cost. Re-stage afterward to catch graphify-out/*.md changes in this commit.
if command -v graphify &>/dev/null; then
  graphify update "$BACKUP_REPO" 2>&1 | tail -3
  git add -A
fi

git commit -q -m "sync: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -q origin main
echo "synced and pushed"
