#!/usr/bin/env bash
# Scan a project's agent-memory/ for [[wikilink]] references and report broken ones.
# Usage: memory-link-check.sh <path-to-agent-memory-dir>
set -euo pipefail

DIR="${1:?Usage: memory-link-check.sh <path-to-agent-memory-dir>}"
DIR="$(cd "$DIR" && pwd)"

broken=0
total=0

while IFS=: read -r file link; do
  total=$((total + 1))
  target="$DIR/$link.md"
  if [ ! -f "$target" ]; then
    broken=$((broken + 1))
    echo "BROKEN: $file -> [[$link]] (expected $target)"
  fi
done < <(grep -rhoE '\[\[[^]]+\]\]' --include='*.md' "$DIR" -l 2>/dev/null | while read -r f; do
  grep -oE '\[\[[^]]+\]\]' "$f" | sed 's/\[\[//;s/\]\]//' | while read -r l; do
    echo "$f:$l"
  done
done)

echo "Checked $total link(s), $broken broken."
[ "$broken" -eq 0 ]
