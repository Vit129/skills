#!/usr/bin/env bash
# Condensed session context for AI. Prints Now-status + last 7 decisions + .claude/memory.
# Usage: session-start.sh [project-dir]
set -euo pipefail

PROJ="${1:-$PWD}"
MEM_DIR="$PROJ/agent-memory"
MEMORY="$MEM_DIR/MEMORY.md"
ARCHIVE="$MEM_DIR/COMPLETED-TASKS-ARCHIVE.md"

# Resolve .claude/projects/{slug}/memory/ — slug = abs path with /. → -
PROJ_ABS=$(cd "$PROJ" && pwd)
SLUG=$(echo "$PROJ_ABS" | sed 's|[/.]|-|g')
CLAUDE_MEM="$HOME/.claude/projects/${SLUG}/memory"

# ── 1. Auto-archive MEMORY.md if > 100 lines ──────────────────────────────
if [[ -f "$MEMORY" ]]; then
  lines=$(wc -l < "$MEMORY")
  if [[ $lines -gt 100 ]]; then
    echo "⚠  MEMORY.md ${lines} lines — archiving oldest 40" >&2
    head -40 "$MEMORY" >> "$ARCHIVE"
    tail -n +41 "$MEMORY" > "${MEMORY}.tmp" && mv "${MEMORY}.tmp" "$MEMORY"
  fi
fi

# ── 2. Prune stale blocks in CONTEXT.md ───────────────────────────────────
python3 "$(dirname "$0")/prune-agent-memory.py" "$MEM_DIR" 7 >/dev/null

sep() { printf '%.0s─' {1..56}; echo; }

echo "# Context — $(basename "$PROJ") · $(date '+%Y-%m-%d %H:%M')"
echo "# ponytail=on · headroom=localhost:8787 · grep+graphify for lookup"
sep

# ── 3. CONTEXT: ## Now status only (stop at first ###) ────────────────────
if [[ -f "$MEM_DIR/CONTEXT.md" ]]; then
  awk '/^## Now/{p=1; next} p && /^#{1,3} /{exit} p && /^---/{exit} p' "$MEM_DIR/CONTEXT.md"
  last=$(grep -m1 "^### " "$MEM_DIR/CONTEXT.md" 2>/dev/null || true)
  [[ -n "$last" ]] && echo "(last: ${last#'### '})"
  echo "(full: cat agent-memory/CONTEXT.md)"
  sep
fi

# ── 3b. CONTEXT: ## Handoff — only if not (none) ──────────────────────────
if [[ -f "$MEM_DIR/CONTEXT.md" ]]; then
  handoff=$(awk '/^## Handoff/{p=1; next} p && /^#{1,3} /{exit} p && /^<!--/{next} p && /^- /{print}' "$MEM_DIR/CONTEXT.md")
  if [[ -n "$handoff" ]] && ! grep -q '\*\*From:\*\* (none)' <<< "$handoff"; then
    echo "## Handoff — work continuing across agent/session"
    echo "$handoff"
    sep
  fi
fi

# ── 3c. CONTEXT: ## Claims — only if not (none) ───────────────────────────
if [[ -f "$MEM_DIR/CONTEXT.md" ]]; then
  claims=$(awk '/^## Claims/{p=1; next} p && /^#{1,3} /{exit} p && /^<!--/{next} p && /^- /{print}' "$MEM_DIR/CONTEXT.md")
  if [[ -n "$claims" ]] && ! grep -q '^- (none)' <<< "$claims"; then
    echo "## Claims — check before starting overlapping work"
    echo "$claims"
    sep
  fi
fi

# ── 4. agent-memory/MEMORY.md: Active Decisions — newest 7 ───────────────
if [[ -f "$MEMORY" ]]; then
  echo "## Active Decisions (agent-memory — recent 7)"
  awk '/^## Active Decisions/{p=1; next} p && /^## /{exit} p && /^- /{print}' "$MEMORY" | head -7
  total=$(awk '/^## Active Decisions/{p=1; next} p && /^## /{exit} p && /^- /' "$MEMORY" | wc -l | tr -d ' ')
  [[ $total -gt 7 ]] && echo "(+$((total - 7)) more: cat agent-memory/MEMORY.md)"
  sep
fi

# ── 5. .claude/memory: Claude Code auto-memory (feedback + user prefs) ────
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
