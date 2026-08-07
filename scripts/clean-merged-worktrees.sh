#!/bin/bash
# Remove worktrees + local branches already merged into main.
# Scope: ~/Git/Personal/*/ and ~/.claude only.
# Default: dry-run. Pass --force to actually remove.
#
# "Merged" check is two-layer (per rules/core.md branch-cleanup rule):
#  1. plain ancestry (git branch --merged main)
#  2. squash-merge fallback: branch's last commit subject found in main's log
# Ancestry alone under-reports after a squash-merge (hash changes).
set -euo pipefail

FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    *) echo "Unknown arg: $arg" >&2; exit 1 ;;
  esac
done

echo "Mode: $([ "$FORCE" -eq 1 ] && echo DELETE || echo DRY-RUN)"
echo

REPOS=("$HOME/.claude")
for d in "$HOME"/Git/Personal/*/; do
  [ -d "$d/.git" ] && REPOS+=("${d%/}")
done

total=0
for repo in "${REPOS[@]}"; do
  [ -d "$repo/.git" ] || continue
  main_branch=""
  for cand in main master; do
    if git -C "$repo" show-ref --verify --quiet "refs/heads/$cand"; then
      main_branch="$cand"
      break
    fi
  done
  [ -n "$main_branch" ] || { echo "[$repo] no main/master branch, skip"; continue; }

  while IFS= read -r line; do
    wt_path=$(awk '{print $1}' <<<"$line")
    branch=$(sed -n 's/.*\[\(.*\)\]/\1/p' <<<"$line")
    [ "$wt_path" = "$repo" ] && continue   # skip the main worktree itself
    [ -n "$branch" ] || continue

    merged=0
    if git -C "$repo" branch --merged "$main_branch" 2>/dev/null | grep -qx "  $branch\|+ $branch\|\* $branch"; then
      merged=1
    else
      subject=$(git -C "$repo" log -1 --format=%s "$branch" 2>/dev/null || true)
      if [ -n "$subject" ] && git -C "$repo" log "$main_branch" --format=%s 2>/dev/null | grep -qxF "$subject"; then
        merged=1
      fi
    fi

    if [ "$merged" -eq 1 ]; then
      total=$((total + 1))
      if [ "$FORCE" -eq 1 ]; then
        git -C "$repo" worktree remove "$wt_path" --force
        git -C "$repo" branch -D "$branch" 2>/dev/null || true
        echo "[$repo] removed worktree + branch: $branch ($wt_path)"
      else
        echo "[$repo] would remove worktree + branch: $branch ($wt_path)"
      fi
    fi
  done < <(git -C "$repo" worktree list 2>/dev/null)
done

echo
echo "Total: $total worktree(s) $([ "$FORCE" -eq 1 ] && echo removed || echo "matched (dry-run, use --force to remove)")"
