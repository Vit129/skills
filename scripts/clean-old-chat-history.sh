#!/bin/bash
# Delete old chat history: Claude Code session transcripts + Kouen scrollback.
# Default: dry-run (list only). Pass --force to actually delete.
set -euo pipefail

DAYS="${DAYS:-30}"
FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    --days=*) DAYS="${arg#*=}" ;;
    *) echo "Unknown arg: $arg" >&2; exit 1 ;;
  esac
done

CLAUDE_DIR="$HOME/.claude/projects"
KOUEN_DIR="$HOME/Library/Application Support/Kouen/sessions/scrollback"

echo "Threshold: older than $DAYS days"
echo "Mode: $([ "$FORCE" -eq 1 ] && echo DELETE || echo DRY-RUN)"
echo

total=0
delete_old() {
  local dir="$1" label="$2" pattern="$3"
  [ -d "$dir" ] || { echo "[$label] dir not found, skip: $dir"; return; }
  local count=0
  while IFS= read -r -d '' f; do
    count=$((count + 1))
    if [ "$FORCE" -eq 1 ]; then
      rm -f -- "$f"
      echo "[$label] deleted: $f"
    else
      echo "[$label] would delete: $f"
    fi
  done < <(find "$dir" -type f -name "$pattern" -not -path '*/memory/*' -mtime "+$DAYS" -print0)
  echo "[$label] $count file(s)"
  total=$((total + count))
}

# Only actual session transcripts (*.jsonl) — never memory/ persistent files
delete_old "$CLAUDE_DIR" "claude" "*.jsonl"
delete_old "$KOUEN_DIR" "kouen" "*.scroll"

echo
echo "Total: $total file(s) $([ "$FORCE" -eq 1 ] && echo deleted || echo "matched (dry-run, use --force to delete)")"
