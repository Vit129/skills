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
SKILLS_ROOT="$HOME/.kiro/skills"
TEMPLATES_DIR="$SKILLS_ROOT/meta-skills/agent-memory/references/templates"

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

if [ -d "$AGENT_MEM" ] && [ "$FORCE" -eq 0 ]; then
  echo "  skip  agent-memory/ (already exists, use --force to overwrite)"
else
  mkdir -p "$AGENT_MEM"

  for file in PLAYBOOK.md SKILL-LOG.md index.md EVAL-STATE.md; do
    if [ ! -f "$AGENT_MEM/$file" ] || [ "$FORCE" -eq 1 ]; then
      cp "$TEMPLATES_DIR/$file" "$AGENT_MEM/$file"
      echo "  ✅ agent-memory/$file"
    else
      echo "  skip  agent-memory/$file (exists)"
    fi
  done

  mkdir -p "$AGENT_MEM/plans" "$AGENT_MEM/knowledge" "$AGENT_MEM/evals"
  echo "  ✅ agent-memory/ ready (plans/ knowledge/ evals/ drafts/ created on demand)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ agent-memory setup complete"
echo "  agent-memory/PLAYBOOK.md        ← problem resolution cases"
echo "  agent-memory/SKILL-LOG.md       ← skill improvement log"
echo "  agent-memory/index.md           ← catalog of knowledge/ and plans/"
echo "  agent-memory/EVAL-STATE.md      ← last eval date tracker"
echo "  agent-memory/evals/             ← eval results (skill stocktake, etc.)"
echo ""
echo "To re-run: bash $(basename "$0") $TARGET_DIR --force"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
