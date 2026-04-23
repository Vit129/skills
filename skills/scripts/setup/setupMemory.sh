#!/bin/bash
# setupMemory.sh — Bootstrap unified-memory for any project
# Usage: bash setupMemory.sh [PROJECT_NAME_OR_PATH|.|--self] [--force]

set -euo pipefail

if [ -z "${1:-}" ]; then
    echo "❌ กรุณาระบุ folder (เช่น MyProject, AAA/MyProject, . สำหรับ root)"
    echo "Usage: $0 [PROJECT_NAME_OR_PATH|.|--self] [--force]"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Walk up from cwd to find project root
_dir="$(pwd)"
while [ "$_dir" != "/" ]; do
  if [ -d "$_dir/.git" ]; then
    BASE_DIR="$_dir"
    break
  fi
  _dir="$(dirname "$_dir")"
done
if [ -z "${BASE_DIR:-}" ]; then
  echo "⚠️  .git/ not found — falling back to cwd"
  BASE_DIR="$(pwd)"
fi

FORCE=0
TARGET_DIR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    -h|--help)
      echo "Usage: bash setupMemory.sh [PROJECT_NAME_OR_PATH|.|--self] [--force]"
      echo "  .  or  --self   install at workspace root"
      echo "  --force         overwrite existing files"
      exit 0 ;;
    *) TARGET_DIR="$1"; shift ;;
  esac
done

# ── Folder detection ────────────────────────────────────────
cd "$BASE_DIR" || exit 1
source "$SCRIPT_DIR/_resolveTarget.sh"

ROOT_DIR="$(cd "$TARGET_DIR" && pwd)"
echo "📁 Working in: $ROOT_DIR"
echo ""

# ── unified-memory bootstrap ────────────────────────────────
echo "🧠 Setting up unified-memory..."

UNIFIED_MEM="$ROOT_DIR/.unified-memory"
if [ ! -d "$UNIFIED_MEM/palace" ]; then
  mkdir -p "$UNIFIED_MEM/palace/wings"
  mkdir -p "$UNIFIED_MEM/palace/archive"
  mkdir -p "$UNIFIED_MEM/knowledge/lessons"

  cat > "$UNIFIED_MEM/palace/state.md" << 'STATE_EOF'
# 🏛️ Unified Memory Palace — State

## Active Wings
(none yet)

## Recent Sessions
(none yet)

## Current Focus
- focus: ""
- blockers: ""
- next_action: ""

## Open Threads
(none)
STATE_EOF

  echo '{"domains":[],"evolution_log":[]}' > "$UNIFIED_MEM/knowledge/index.json"
  echo "  ✅ .unified-memory/ created"
else
  echo "  skip  .unified-memory/ (already exists)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ unified-memory setup complete"
echo "  .unified-memory/           ← persistent memory + knowledge"
echo ""
echo "To re-run: bash $(basename "$0") $TARGET_DIR --force"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
