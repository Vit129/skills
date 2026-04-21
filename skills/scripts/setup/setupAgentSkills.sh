#!/bin/bash
# setupAgentSkills.sh — Setup AI agent context layer for any project
# Handles: .agents/ scaffold + Kiro IDE (.kiro/) + unified-memory bootstrap
# Usage: bash setupAgentSkills.sh [PROJECT_NAME_OR_PATH] [--force]
# Portable: works with ~/.claude/skills, ~/ai-agent/skills, or project-local skills

set -euo pipefail

if [ -z "${1:-}" ]; then
    echo "❌ กรุณาระบุ folder (เช่น MyProject, AAA/MyProject)"
    echo "Usage: $0 [PROJECT_NAME_OR_PATH] [--force]"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"   # walk up to workspace root

FORCE=0
TARGET_DIR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    -h|--help)
      echo "Usage: bash setupAgentSkills.sh [PROJECT_NAME_OR_PATH] [--force]"
      echo "  PROJECT_NAME_OR_PATH  folder name or path to project root"
      echo "  --force               overwrite existing files"
      exit 0 ;;
    *) TARGET_DIR="$1"; shift ;;
  esac
done

# ── Folder detection (same pattern as setupTests.sh) ────────
cd "$BASE_DIR" || exit 1

if [[ "$TARGET_DIR" == *"/"* ]] || [ -d "$TARGET_DIR" ]; then
    if [ ! -d "$TARGET_DIR" ]; then
        echo "❌ Folder $TARGET_DIR ไม่พบ"
        exit 1
    fi
    echo "📁 Using: $TARGET_DIR"
else
    echo "🔍 Searching for folder: $TARGET_DIR"
    FOUND_PATHS=($(find . -maxdepth 4 -type d -name "$TARGET_DIR" \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/tests/*" \
        -not -path "*/.unified-memory/*" \
        2>/dev/null))

    if [ ${#FOUND_PATHS[@]} -eq 0 ]; then
        echo "❌ Folder $TARGET_DIR ไม่พบ"
        exit 1
    elif [ ${#FOUND_PATHS[@]} -eq 1 ]; then
        TARGET_DIR="${FOUND_PATHS[0]#./}"
        echo "✅ Found: $TARGET_DIR"
    else
        echo "⚠️  พบหลายตำแหน่ง:"
        for i in "${!FOUND_PATHS[@]}"; do
            echo "  [$((i+1))] ${FOUND_PATHS[$i]#./}"
        done
        read -p "เลือกตำแหน่ง (1-${#FOUND_PATHS[@]}): " choice
        if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le ${#FOUND_PATHS[@]} ]; then
            TARGET_DIR="${FOUND_PATHS[$((choice-1))]#./}"
            echo "✅ Selected: $TARGET_DIR"
        else
            echo "❌ Invalid choice"
            exit 1
        fi
    fi
fi

ROOT_DIR="$(cd "$TARGET_DIR" && pwd)"
echo "📁 Working in: $ROOT_DIR"
echo ""

# ── Resolve AGENTS_SOURCE (portable — not tied to ~/.claude) ─
# Search order: script-relative → ~/.claude/skills → ~/ai-agent/skills → project-local
AGENTS_SOURCE=""
AGENTS_CANDIDATES=(
  "$SCRIPT_DIR/../AGENTS.md"                    # skills/AGENTS.md (relative to script)
  "$HOME/.claude/skills/AGENTS.md"              # Claude user-level
  "$HOME/ai-agent/skills/AGENTS.md"             # standalone ai-agent install
  "$ROOT_DIR/ai-agent/skills/AGENTS.md"         # project-local
)

for candidate in "${AGENTS_CANDIDATES[@]}"; do
  if [ -f "$candidate" ]; then
    AGENTS_SOURCE="$(cd "$(dirname "$candidate")" && pwd)/$(basename "$candidate")"
    break
  fi
done

# ── Helper ──────────────────────────────────────────────────
write_file() {
  local path="$1"
  shift
  if [ -f "$path" ] && [ "$FORCE" -ne 1 ]; then
    echo "  skip  $path (exists, use --force to overwrite)"
    return 0
  fi
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  echo "  write $path"
}

# ════════════════════════════════════════════════════════════
# STEP 1: .agents/ scaffold
# ════════════════════════════════════════════════════════════
echo "🤖 Setting up .agents/ context layer..."

if [ -z "$AGENTS_SOURCE" ]; then
  echo "❌ Source AGENTS.md not found. Searched:"
  for c in "${AGENTS_CANDIDATES[@]}"; do echo "     $c"; done
  echo "   Set AGENTS_SOURCE env var to override, e.g.:"
  echo "   AGENTS_SOURCE=/custom/path/AGENTS.md bash $0 $TARGET_DIR"
  exit 1
fi

echo "  source $AGENTS_SOURCE"
mkdir -p "$ROOT_DIR/.agents"

# Symlink AGENTS.md → source of truth
if [ -L "$ROOT_DIR/.agents/AGENTS.md" ]; then
  echo "  skip  .agents/AGENTS.md (symlink exists)"
elif [ -f "$ROOT_DIR/.agents/AGENTS.md" ] && [ "$FORCE" -ne 1 ]; then
  echo "  skip  .agents/AGENTS.md (file exists, use --force to replace with symlink)"
else
  [ -f "$ROOT_DIR/.agents/AGENTS.md" ] && rm "$ROOT_DIR/.agents/AGENTS.md"
  ln -s "$AGENTS_SOURCE" "$ROOT_DIR/.agents/AGENTS.md"
  echo "  link  .agents/AGENTS.md → $AGENTS_SOURCE"
fi

# .gitignore entry for .unified-memory
GITIGNORE="$ROOT_DIR/.gitignore"
if [ -f "$GITIGNORE" ]; then
  if ! grep -Fq ".unified-memory/" "$GITIGNORE"; then
    echo ".unified-memory/" >> "$GITIGNORE"
    echo "  append .gitignore → .unified-memory/"
  else
    echo "  skip  .gitignore (already has .unified-memory/)"
  fi
else
  echo ".unified-memory/" > "$GITIGNORE"
  echo "  write .gitignore"
fi

# unified-memory bootstrap
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
  echo "  write .unified-memory/ (bootstrapped)"
else
  echo "  skip  .unified-memory/ (already exists)"
fi

echo "✅ .agents/ + unified-memory setup complete"
echo ""

# ════════════════════════════════════════════════════════════
# STEP 2: Kiro IDE setup
# ════════════════════════════════════════════════════════════
echo "🔧 Setting up Kiro IDE..."

KIRO_MD_PATHS=(
    "$HOME/.claude/skills/KIRO.md"
    "$ROOT_DIR/ai-agent/skills/KIRO.md"
)

SKILLS_ROOT=""
for kiro_path in "${KIRO_MD_PATHS[@]}"; do
    if [ -f "$kiro_path" ]; then
        SKILLS_ROOT="$(dirname "$kiro_path")"
        echo "✅ Found KIRO.md at: $kiro_path"
        break
    fi
done

if [ -z "$SKILLS_ROOT" ]; then
    echo "⚠️  KIRO.md not found — skipping Kiro setup"
    echo "    Install skills first, then re-run this script"
    for p in "${KIRO_MD_PATHS[@]}"; do echo "      $p"; done
else
    SETUP_SCRIPT="$SKILLS_ROOT/system/hook-creator/setup-kiro-project.sh"
    if [ -f "$SETUP_SCRIPT" ]; then
        bash "$SETUP_SCRIPT" "$ROOT_DIR"
    else
        echo "⚠️  setup-kiro-project.sh not found — creating minimal Kiro setup..."

        mkdir -p "$ROOT_DIR/.kiro/hooks"
        mkdir -p "$ROOT_DIR/.kiro/steering"
        mkdir -p "$ROOT_DIR/.kiro/settings"

        cat > "$ROOT_DIR/.kiro/steering/agent-skills.md" << STEERING_EOF
---
inclusion: auto
---

<!-- SKILLS_ROOT: $SKILLS_ROOT -->
<!-- เปลี่ยน path ด้านล่างเมื่อย้าย skills folder -->

#[[file:$SKILLS_ROOT/KIRO.md]]

## AIDLC — Mandatory Entry Point

ALL dev and QA work MUST start by reading \`$SKILLS_ROOT/ai-dlc/core/aidlc/SKILL.md\` and following DECISIONS → PLAN → EXECUTE.

**Never produce output files (code, design, test scripts, specs) without a DECISIONS file and approved PLAN first.**
STEERING_EOF
        echo "✅ .kiro/steering/agent-skills.md created (fallback)"
    fi

    # MCP config
    if [ ! -f "$ROOT_DIR/.kiro/settings/mcp.json" ] && [ -f "$ROOT_DIR/ai-agent/docs/KIRO_MCP.json" ]; then
        cp "$ROOT_DIR/ai-agent/docs/KIRO_MCP.json" "$ROOT_DIR/.kiro/settings/mcp.json"
        echo "✅ .kiro/settings/mcp.json created"
    else
        echo "✅ .kiro/settings/mcp.json already exists, skipping"
    fi
fi

echo "✅ Kiro IDE setup complete"
echo ""

# ── Done ─────────────────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ AI Agent Skills setup complete"
echo ""
echo "Created:"
echo "  .agents/AGENTS.md          ← symlink → $AGENTS_SOURCE"
echo "  .unified-memory/           ← persistent memory + knowledge"
echo "  .kiro/                     ← Kiro IDE config (hooks, steering, settings)"
echo ""
echo "Next steps:"
echo "  1. Open project in Kiro IDE"
echo "  2. Run 'load memory' to initialize unified-memory session"
echo ""
echo "To re-run with overwrite:"
echo "  bash $(basename "$0") $TARGET_DIR --force"
echo ""
echo "To use custom AGENTS.md location:"
echo "  AGENTS_SOURCE=/custom/path/AGENTS.md bash $(basename "$0") $TARGET_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Optional: run setupTests.sh ──────────────────────────────
SETUP_TESTS="$SCRIPT_DIR/setupTests.sh"
if [ -f "$SETUP_TESTS" ]; then
  echo ""
  read -p "🧪 ต้องการ setup QA tests (API/Web/Mobile) ด้วยมั้ย? [y/N] " run_tests
  if [[ "$run_tests" =~ ^[Yy]$ ]]; then
    echo ""
    bash "$SETUP_TESTS" "$TARGET_DIR"
  else
    echo "⏭️  Skipped. Run manually: bash $SETUP_TESTS $TARGET_DIR"
  fi
fi
