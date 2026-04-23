#!/bin/bash
# postmanMigrate.sh — Wrapper that auto-detects skills path
# Usage: bash postmanMigrate.sh --collection "path/to/collection.json" [--env "path/to/env.json"] [--folder "name"] [--output-dir "."]
#
# Searches for postmanMigrate.ts in these locations (first match wins):
#   1. Same directory as this wrapper script
#   2. <project-root>/ai-agent/skills/ai-dlc/qa/postman/scripts/
#   3. ~/.claude/skills/ai-dlc/qa/postman/scripts/

set -euo pipefail

SCRIPT_NAME="postmanMigrate.ts"
WRAPPER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Find the .ts script ──
CANDIDATES=(
  "$WRAPPER_DIR/$SCRIPT_NAME"
  "$(pwd)/ai-agent/skills/ai-dlc/qa/postman/scripts/$SCRIPT_NAME"
  "$HOME/.claude/skills/ai-dlc/qa/postman/scripts/$SCRIPT_NAME"
)

SCRIPT_PATH=""
for candidate in "${CANDIDATES[@]}"; do
  if [ -f "$candidate" ]; then
    SCRIPT_PATH="$(cd "$(dirname "$candidate")" && pwd)/$SCRIPT_NAME"
    break
  fi
done

if [ -z "$SCRIPT_PATH" ]; then
  echo "❌ Cannot find $SCRIPT_NAME in any known location:"
  for c in "${CANDIDATES[@]}"; do echo "   - $c"; done
  exit 1
fi

echo "📍 Using: $SCRIPT_PATH"
exec npx tsx "$SCRIPT_PATH" "$@"
