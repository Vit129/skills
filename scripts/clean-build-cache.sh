#!/usr/bin/env bash
# Find + delete build/cache dirs under a projects root (default ~/Git/Personal).
# Dry-run by default — pass --apply to actually delete.
# Usage: clean-build-cache.sh [root-dir] [--apply] [--days N]
set -euo pipefail

ROOT="$HOME/Git/Personal"
APPLY=0
DAYS=""
NEXT_IS_DAYS=0
for arg in "$@"; do
  if [[ "$NEXT_IS_DAYS" == 1 ]]; then DAYS="$arg"; NEXT_IS_DAYS=0; continue; fi
  case "$arg" in
    --apply) APPLY=1 ;;
    --days) NEXT_IS_DAYS=1 ;;
    -*) ;;
    *) ROOT="$arg" ;;
  esac
done

# no-touch: third-party repo, read-only per rules/core.md
SKIP_DIRS=("$ROOT/9arm-skills")

NAMES=(node_modules dist build .next .nuxt .turbo .cache .venv .build __pycache__ .pytest_cache DerivedData)

FIND_NAME_EXPR=(-false)
for n in "${NAMES[@]}"; do
  FIND_NAME_EXPR+=(-o -name "$n")
done
FIND_NAME_EXPR+=(-o -name "*.egg-info")

MTIME_EXPR=()
[[ -n "$DAYS" ]] && MTIME_EXPR=(-mtime +"$DAYS")

echo "Scanning $ROOT${DAYS:+ (older than ${DAYS}d)} ..."
while IFS= read -r -d '' path; do
  skip=0
  for s in "${SKIP_DIRS[@]}"; do
    [[ "$path" == "$s"* ]] && skip=1 && break
  done
  [[ "$skip" == 1 ]] && continue
  size=$(du -sh "$path" 2>/dev/null | cut -f1)
  echo "  $size  $path"
  if [[ "$APPLY" == 1 ]]; then
    rm -rf "$path"
  fi
done < <(find "$ROOT" -mindepth 1 -type d \( "${FIND_NAME_EXPR[@]}" \) ${MTIME_EXPR[@]+"${MTIME_EXPR[@]}"} -print0 -prune 2>/dev/null)

if [[ "$APPLY" == 1 ]]; then
  echo "Deleted."
else
  echo "Dry-run only. Re-run with --apply to delete."
fi
