#!/bin/bash
# setupCodexSkills.sh — Expose ~/.claude/skills to Codex as SSOT
# Default behavior: symlink ~/.claude/skills into ~/.codex/skills/claude-ssot
# Usage:
#   bash setupCodexSkills.sh
#   bash setupCodexSkills.sh --mode copy --force
#   bash setupCodexSkills.sh --source /path/to/skills --dest /path/to/.codex/skills/custom-root

set -euo pipefail

SOURCE_DIR="$HOME/.claude/skills"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
DEST_DIR="$CODEX_HOME_DIR/skills/claude-ssot"
MODE="symlink"
FORCE=0

usage() {
  cat <<'EOF'
Usage: bash setupCodexSkills.sh [options]

Options:
  --source <path>   Source skills root (default: ~/.claude/skills)
  --dest <path>     Destination inside Codex skills root
                    (default: ~/.codex/skills/claude-ssot)
  --mode <value>    symlink | copy   (default: symlink)
  --force           Replace existing destination
  -h, --help        Show this help

Notes:
  - SSOT-friendly mode is --mode symlink because Codex reads the same files Claude uses.
  - Restart Codex after setup so new skills are discovered.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --source)
      SOURCE_DIR="${2:-}"
      shift 2
      ;;
    --dest)
      DEST_DIR="${2:-}"
      shift 2
      ;;
    --mode)
      MODE="${2:-}"
      shift 2
      ;;
    --force)
      FORCE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "❌ Unknown argument: $1"
      echo ""
      usage
      exit 1
      ;;
  esac
done

if [[ "$MODE" != "symlink" && "$MODE" != "copy" ]]; then
  echo "❌ Invalid --mode: $MODE"
  echo "   Use: symlink | copy"
  exit 1
fi

if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ Source not found: $SOURCE_DIR"
  exit 1
fi

mkdir -p "$(dirname "$DEST_DIR")"

SOURCE_REAL="$(cd "$SOURCE_DIR" && pwd -P)"
DEST_PARENT_REAL="$(cd "$(dirname "$DEST_DIR")" && pwd -P)"
DEST_REAL_CANDIDATE="$DEST_PARENT_REAL/$(basename "$DEST_DIR")"

if [ "$SOURCE_REAL" = "$DEST_REAL_CANDIDATE" ]; then
  echo "❌ Source and destination resolve to the same path."
  exit 1
fi

if [ -e "$DEST_DIR" ] || [ -L "$DEST_DIR" ]; then
  if [ "$FORCE" -ne 1 ]; then
    echo "❌ Destination already exists: $DEST_DIR"
    echo "   Re-run with --force to replace it."
    exit 1
  fi
  rm -rf "$DEST_DIR"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧩 Setup Codex skills from Claude SSOT"
echo "   source: $SOURCE_REAL"
echo "   dest:   $DEST_DIR"
echo "   mode:   $MODE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$MODE" = "symlink" ]; then
  ln -s "$SOURCE_REAL" "$DEST_DIR"
  echo "✅ Symlink created"
else
  cp -R "$SOURCE_REAL" "$DEST_DIR"
  find "$DEST_DIR" -name ".DS_Store" -delete 2>/dev/null || true
  echo "✅ Skills copied"
fi

echo ""
echo "Codex will discover any nested folder that contains SKILL.md."
echo "This keeps ~/.claude/skills as the single source of truth."
echo ""
echo "Next:"
echo "1. Restart Codex"
echo "2. In a new session, call a skill naturally (example: use frontend-dev to build this UI)"
echo "3. If a skill is not picked up, verify its SKILL.md has YAML frontmatter with name + description"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
