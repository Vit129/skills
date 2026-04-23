#!/bin/bash
# setupKiro.sh — Setup Kiro IDE config for a project
# Handles: .kiro/ folders, steering (with KIRO.md reference), hooks, MCP
# Usage: bash setupKiro.sh [PROJECT_NAME_OR_PATH|.|--self] [--force]
#
# Previously delegated to setup-kiro-project.sh — now all logic is inline.

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
      echo "Usage: bash setupKiro.sh [PROJECT_NAME_OR_PATH|.|--self] [--force]"
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

# ── Find skills root ────────────────────────────────────────
KIRO_STEERING_SOURCE=""
STEERING_CANDIDATES=(
  "$SCRIPT_DIR/../../KIRO.md"                   # skills/KIRO.md (relative to script)
  "$HOME/.claude/skills/KIRO.md"                # Claude user-level
  "$ROOT_DIR/ai-agent/skills/KIRO.md"           # project-local
)

SKILLS_ROOT=""
for candidate in "${STEERING_CANDIDATES[@]}"; do
  if [ -f "$candidate" ]; then
    SKILLS_ROOT="$(cd "$(dirname "$candidate")" && pwd)"
    KIRO_STEERING_SOURCE="$candidate"
    echo "✅ Found KIRO.md at: $candidate"
    break
  fi
done

# ── Create directories ──────────────────────────────────────
echo "🔧 Setting up Kiro IDE..."
mkdir -p "$ROOT_DIR/.kiro/hooks"
mkdir -p "$ROOT_DIR/.kiro/steering"
mkdir -p "$ROOT_DIR/.kiro/settings"

# ── Hooks ───────────────────────────────────────────────────
HOOKS_TEMPLATE_DIR=""
HOOKS_CANDIDATES=(
  "$SKILLS_ROOT/system/hook-creator/templates/kiro"
  "$HOME/.claude/skills/system/hook-creator/templates/kiro"
)

for candidate in "${HOOKS_CANDIDATES[@]}"; do
  if [ -d "$candidate" ]; then
    HOOKS_TEMPLATE_DIR="$candidate"
    break
  fi
done

hook_count=0
skip_count=0
if [ -n "$HOOKS_TEMPLATE_DIR" ]; then
    for hook_file in "$HOOKS_TEMPLATE_DIR"/*.kiro.hook; do
        [ -f "$hook_file" ] || continue
        hook_name="$(basename "$hook_file")"
        if [ -f "$ROOT_DIR/.kiro/hooks/$hook_name" ] && [ "$FORCE" -ne 1 ]; then
            skip_count=$((skip_count + 1))
            echo "  ⏭️  Hook exists: $hook_name"
        else
            cp "$hook_file" "$ROOT_DIR/.kiro/hooks/$hook_name"
            hook_count=$((hook_count + 1))
            echo "  ✅ Hook: $hook_name"
        fi
    done
    echo "  Hooks: $hook_count copied, $skip_count skipped"
else
    echo "  ⏭️  No hook templates found"
fi

# ── Steering ────────────────────────────────────────────────
# Try template-based steering first (from hook-creator/templates/kiro/steering/)
steering_count=0
STEERING_TEMPLATE_DIR=""
if [ -n "$SKILLS_ROOT" ]; then
    STEERING_TEMPLATE_DIR="$SKILLS_ROOT/system/hook-creator/templates/kiro/steering"
fi

if [ -n "$STEERING_TEMPLATE_DIR" ] && [ -d "$STEERING_TEMPLATE_DIR" ]; then
    for steering in "$STEERING_TEMPLATE_DIR"/*.md; do
        [ -f "$steering" ] || continue
        filename="$(basename "$steering")"
        if [ -f "$ROOT_DIR/.kiro/steering/$filename" ] && [ "$FORCE" -ne 1 ]; then
            echo "  ⏭️  Steering exists: $filename"
        else
            # Replace __SKILLS_ROOT__ placeholder with actual path
            sed "s|__SKILLS_ROOT__|$SKILLS_ROOT|g" "$steering" > "$ROOT_DIR/.kiro/steering/$filename"
            steering_count=$((steering_count + 1))
            echo "  ✅ Steering: $filename (SKILLS_ROOT=$SKILLS_ROOT)"
        fi
    done
fi

# Ensure agent-skills.md exists (fallback if no template produced it)
if [ ! -f "$ROOT_DIR/.kiro/steering/agent-skills.md" ] || [ "$FORCE" -eq 1 ]; then
    if [ -n "$KIRO_STEERING_SOURCE" ]; then
        # Use #[[file:]] reference — prefer relative path
        if [ -f "$ROOT_DIR/ai-agent/skills/KIRO.md" ]; then
            KIRO_REF="ai-agent/skills/KIRO.md"
        else
            KIRO_REF="$KIRO_STEERING_SOURCE"
        fi
        cat > "$ROOT_DIR/.kiro/steering/agent-skills.md" << STEERING_EOF
---
inclusion: always
---

#[[file:$KIRO_REF]]

## AIDLC — Mandatory Entry Point

ALL dev and QA work MUST start by reading \`ai-agent/skills/ai-dlc/core/aidlc/SKILL.md\` and following DECISIONS → PLAN → EXECUTE.

**Never produce output files (code, design, test scripts, specs) without a DECISIONS file and approved PLAN first.**
STEERING_EOF
        steering_count=$((steering_count + 1))
        echo "  ✅ agent-skills.md (reference → $KIRO_REF)"
    else
        cat > "$ROOT_DIR/.kiro/steering/agent-skills.md" << 'STEERING_EOF'
---
inclusion: always
---

# Kiro Workspace

## AIDLC — Mandatory Entry Point

ALL dev and QA work MUST start by reading the AIDLC skill and following DECISIONS → PLAN → EXECUTE.

**Never produce output files (code, design, test scripts, specs) without a DECISIONS file and approved PLAN first.**
STEERING_EOF
        steering_count=$((steering_count + 1))
        echo "  ✅ agent-skills.md (minimal)"
    fi
fi

# ── MCP config ──────────────────────────────────────────────
MCP_DST="$ROOT_DIR/.kiro/settings"
if [ ! -f "$MCP_DST/mcp.json" ]; then
    MCP_SOURCES=(
        "$ROOT_DIR/ai-agent/docs/KIRO_MCP.json"
        "$SKILLS_ROOT/../docs/KIRO_MCP.json"
    )
    for mcp_src in "${MCP_SOURCES[@]}"; do
        if [ -f "$mcp_src" ]; then
            cp "$mcp_src" "$MCP_DST/mcp.json"
            echo "  ✅ MCP config from: $mcp_src"
            break
        fi
    done
    [ ! -f "$MCP_DST/mcp.json" ] && echo "  ⏭️  No MCP config source found"
else
    echo "  ⏭️  MCP config exists"
fi

# ── Summary ─────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Kiro IDE setup complete"
echo "  .kiro/steering/  ← $steering_count steering files"
echo "  .kiro/hooks/     ← $hook_count hooks copied, $skip_count skipped"
echo "  .kiro/settings/  ← MCP config"
echo ""
echo "Next: Open project in Kiro IDE"
echo "To re-run: bash $(basename "$0") $TARGET_DIR --force"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
