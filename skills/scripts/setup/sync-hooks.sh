#!/bin/bash
# sync-hooks.sh — Sync active Kiro hooks → hook-creator templates
# Usage: bash sync-hooks.sh

set -euo pipefail

SRC="$HOME/.claude/.kiro/hooks"
DEST="$HOME/.claude/skills/system/hook-creator/templates/kiro"

if [ ! -d "$SRC" ]; then echo "❌ Source not found: $SRC"; exit 1; fi
if [ ! -d "$DEST" ]; then echo "❌ Dest not found: $DEST"; exit 1; fi

count=0
for f in "$SRC"/agent-memory-*.kiro.hook; do
  [ -f "$f" ] || continue
  name="$(basename "$f")"
  cp "$f" "$DEST/$name"
  ver=$(python3 -c "import json; print(json.load(open('$f'))['version'])" 2>/dev/null || echo "?")
  echo "  ✅ $name (v$ver)"
  count=$((count + 1))
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Synced $count hooks → templates"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
