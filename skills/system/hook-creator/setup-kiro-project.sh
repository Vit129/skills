#!/bin/bash
# setup-kiro-project.sh
# Sets up Kiro hooks and steering for a new project.
# Usage: ./setup-kiro-project.sh /path/to/project
#
# Self-locating: SKILLS_ROOT is resolved relative to this script's location.
# Moving the skills folder = just re-run this script. No hardcoded paths.

set -e

PROJECT="${1:?Usage: $0 /path/to/project}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🔧 Setting up Kiro project: $PROJECT"
echo "   Skills root: $SKILLS_ROOT"

# --- Hooks ---
HOOKS_SRC="$SKILLS_ROOT/system/hook-creator/templates/kiro"
HOOKS_DST="$PROJECT/.kiro/hooks"
mkdir -p "$HOOKS_DST"

hook_count=0
for hook in "$HOOKS_SRC"/*.kiro.hook; do
  [ -f "$hook" ] || continue
  filename="$(basename "$hook")"
  if [ -f "$HOOKS_DST/$filename" ]; then
    echo "   ⏭️  Hook exists, skipping: $filename"
  else
    cp "$hook" "$HOOKS_DST/"
    echo "   ✅ Copied hook: $filename"
  fi
  hook_count=$((hook_count + 1))
done

# --- Steering ---
STEERING_SRC="$SKILLS_ROOT/system/hook-creator/templates/kiro/steering"
STEERING_DST="$PROJECT/.kiro/steering"
mkdir -p "$STEERING_DST"

steering_count=0
for steering in "$STEERING_SRC"/*.md; do
  [ -f "$steering" ] || continue
  filename="$(basename "$steering")"
  # Replace __SKILLS_ROOT__ placeholder with actual path
  sed "s|__SKILLS_ROOT__|$SKILLS_ROOT|g" "$steering" > "$STEERING_DST/$filename"
  steering_count=$((steering_count + 1))
  echo "   ✅ Steering: $filename (SKILLS_ROOT=$SKILLS_ROOT)"
done

# --- MCP config ---
MCP_DST="$PROJECT/.kiro/settings"
mkdir -p "$MCP_DST"
if [ ! -f "$MCP_DST/mcp.json" ]; then
  # Check common locations for MCP config template
  MCP_SOURCES=(
    "$PROJECT/ai-agent/docs/KIRO_MCP.json"
    "$SKILLS_ROOT/../docs/KIRO_MCP.json"
  )
  for mcp_src in "${MCP_SOURCES[@]}"; do
    if [ -f "$mcp_src" ]; then
      cp "$mcp_src" "$MCP_DST/mcp.json"
      echo "   ✅ MCP config copied from: $mcp_src"
      break
    fi
  done
fi

echo ""
echo "✅ Kiro project setup complete: $PROJECT"
echo "   Hooks:    $hook_count templates → $HOOKS_DST"
echo "   Steering: $steering_count files → $STEERING_DST"
echo ""
echo "Next steps:"
echo "  1. Review hooks in $HOOKS_DST — disable any you don't need"
echo "  2. Tell Kiro: 'Read $SKILLS_ROOT/KIRO.md and follow those instructions'"
