#!/bin/bash
# setupMemory.sh — Bootstrap agent-memory for any project
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

# ── agent-memory bootstrap ────────────────────────────────
echo "🧠 Setting up agent-memory..."

AGENT_MEM="$ROOT_DIR/agent-memory"
if [ ! -d "$AGENT_MEM/palace" ] || [ "$FORCE" -eq 1 ]; then
  mkdir -p "$AGENT_MEM/palace/wings"
  mkdir -p "$AGENT_MEM/palace/archive"
  mkdir -p "$AGENT_MEM/knowledge/lessons"

  # ── palace/state.md ──
  if [ ! -f "$AGENT_MEM/palace/state.md" ] || [ "$FORCE" -eq 1 ]; then
    cat > "$AGENT_MEM/palace/state.md" << 'STATE_EOF'
# 🏛️ Agent Memory Palace — State

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
    echo "  ✅ palace/state.md"
  fi

  # ── palace/tunnels.md ──
  if [ ! -f "$AGENT_MEM/palace/tunnels.md" ] || [ "$FORCE" -eq 1 ]; then
    cat > "$AGENT_MEM/palace/tunnels.md" << 'TUNNELS_EOF'
# Cross-Wing Tunnels

| From | To | Relationship |
|------|----|-------------|
TUNNELS_EOF
    echo "  ✅ palace/tunnels.md"
  fi

  # ── palace/search-index.md ──
  if [ ! -f "$AGENT_MEM/palace/search-index.md" ] || [ "$FORCE" -eq 1 ]; then
    cat > "$AGENT_MEM/palace/search-index.md" << 'SEARCH_EOF'
# Session Search Index

| Date | Wing | Keywords | Room Path | Summary |
|------|------|----------|-----------|---------|
SEARCH_EOF
    echo "  ✅ palace/search-index.md"
  fi

  # ── palace/user-profile.md ──
  if [ ! -f "$AGENT_MEM/palace/user-profile.md" ] || [ "$FORCE" -eq 1 ]; then
    cat > "$AGENT_MEM/palace/user-profile.md" << 'PROFILE_EOF'
# User Profile

Updated: (auto)

## Preferences
(auto-captured from interactions)

## Observed Patterns
(auto-captured from sessions)

## Communication
(auto-captured from interactions)

## Domain Expertise
(auto-captured from sessions)
PROFILE_EOF
    echo "  ✅ palace/user-profile.md"
  fi

  # ── palace/date-index.json ──
  if [ ! -f "$AGENT_MEM/palace/date-index.json" ] || [ "$FORCE" -eq 1 ]; then
    cat > "$AGENT_MEM/palace/date-index.json" << 'DATE_EOF'
{"_meta":{"version":"2.0","description":"Sorted date array for date-range queries.","total_docs":0,"last_updated":null},"by_date":[]}
DATE_EOF
    echo "  ✅ palace/date-index.json"
  fi

  # ── palace/keyword-index.json ──
  if [ ! -f "$AGENT_MEM/palace/keyword-index.json" ] || [ "$FORCE" -eq 1 ]; then
    cat > "$AGENT_MEM/palace/keyword-index.json" << 'KW_EOF'
{"_meta":{"version":"2.0","description":"Inverted index for keyword search.","total_docs":0,"total_terms":0},"terms":{}}
KW_EOF
    echo "  ✅ palace/keyword-index.json"
  fi

  # ── palace/archive/index.md ──
  if [ ! -f "$AGENT_MEM/palace/archive/index.md" ] || [ "$FORCE" -eq 1 ]; then
    cat > "$AGENT_MEM/palace/archive/index.md" << 'ARCHIVE_EOF'
# Archive Index

Archived wings and rooms are stored here when compressed or retired.
ARCHIVE_EOF
    echo "  ✅ palace/archive/index.md"
  fi

  # ── knowledge/index.json ──
  if [ ! -f "$AGENT_MEM/knowledge/index.json" ] || [ "$FORCE" -eq 1 ]; then
    echo '{"domains":[],"evolution_log":[]}' > "$AGENT_MEM/knowledge/index.json"
    echo "  ✅ knowledge/index.json"
  fi

  echo "  ✅ agent-memory/ created (full structure)"
else
  echo "  skip  agent-memory/ (already exists, use --force to update)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ agent-memory setup complete"
echo "  agent-memory/           ← persistent memory + knowledge"
echo ""
echo "To re-run: bash $(basename "$0") $TARGET_DIR --force"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
