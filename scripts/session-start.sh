#!/usr/bin/env bash
# Condensed session context for AI. Prints .claude/memory index.
# Usage: session-start.sh [project-dir]
set -euo pipefail

PROJ="${1:-$PWD}"

# Resolve .claude/projects/{slug}/memory/ — slug = abs path with /. → -
PROJ_ABS=$(cd "$PROJ" && pwd)
SLUG=$(echo "$PROJ_ABS" | sed 's|[/.]|-|g')
CLAUDE_MEM="$HOME/.claude/projects/${SLUG}/memory"

sep() { printf '%.0s─' {1..56}; echo; }

echo "# Context — $(basename "$PROJ") · $(date '+%Y-%m-%d %H:%M')"
echo "# ponytail=on · headroom=localhost:8787 · grep+graphify for lookup"
sep

# ── .claude/memory: Claude Code auto-memory (feedback + user prefs) ────
if [[ -d "$CLAUDE_MEM" ]]; then
  entries=$(find "$CLAUDE_MEM" -name "*.md" ! -name "MEMORY.md" 2>/dev/null)
  if [[ -n "$entries" ]]; then
    echo "## Claude Code memory (.claude/memory)"
    while IFS= read -r f; do
      # Print name + first body line after frontmatter
      name=$(grep -m1 "^name:" "$f" 2>/dev/null | sed 's/name: *//' || basename "$f" .md)
      body=$(awk '/^---/{c++; next} c>=2 && NF{print; exit}' "$f" 2>/dev/null || true)
      echo "- $name: $body"
    done <<< "$entries"
    sep
  fi
fi
