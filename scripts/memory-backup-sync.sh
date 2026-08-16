#!/usr/bin/env bash
# memory-backup-sync.sh — mirror ~/.claude/projects/*/memory/ into the
# private claude-memory-private repo, then commit+push if anything changed.
#
# Scope is deliberately narrow: memory/*.md only, never the *.jsonl session
# transcripts (regenerable, 2GB+, not memory) and never Company-* project
# dirs (user decision 2026-08-16 -- company-repo knowledge stays off a
# personal-account backup, even a private one).
set -euo pipefail

SRC="$HOME/.claude/projects"
DST="$HOME/.claude-memory-backup/projects"

mkdir -p "$DST"

for project_dir in "$SRC"/*/; do
  name="$(basename "$project_dir")"
  memory_dir="${project_dir}memory"
  [ -d "$memory_dir" ] || continue
  case "$name" in
    *Company*) echo "skip (company): $name"; continue ;;
  esac
  mkdir -p "$DST/$name/memory"
  rsync -a --delete "$memory_dir/" "$DST/$name/memory/"
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
