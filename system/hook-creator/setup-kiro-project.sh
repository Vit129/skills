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
  cp "$hook" "$HOOKS_DST/"
  hook_count=$((hook_count + 1))
done

# --- Steering ---
STEERING_SRC="$SKILLS_ROOT/system/hook-creator/templates/kiro/steering"
STEERING_DST="$PROJECT/.kiro/steering"
mkdir -p "$STEERING_DST"

steering_count=0
for steering in "$STEERING_SRC"/*.md; do
  [ -f "$steering" ] || continue
  cp "$steering" "$STEERING_DST/"
  steering_count=$((steering_count + 1))
done

# --- STEERING_INDEX.md ---
# Create/update STEERING_INDEX.md with correct SKILLS_ROOT
INDEX_DST="$PROJECT/.kiro/steering/STEERING_INDEX.md"
if [ ! -f "$INDEX_DST" ]; then
  cat > "$INDEX_DST" << EOF
---
inclusion: auto
---

# Kiro Steering — Skills Index

<!-- SKILLS_ROOT: $SKILLS_ROOT -->
<!-- เปลี่ยนบรรทัดบนนี้บรรทัดเดียวเมื่อย้าย skills folder -->
<!-- Entry point: $SKILLS_ROOT/AGENT.md -->

All steering files reference \`{SKILLS_ROOT}\` as the single source of truth.

## Skills Discovery

Read \`$SKILLS_ROOT/AGENT.md\` for full skill index and instructions.

## Auto-loaded

| File | Purpose |
|------|---------|
| \`ai-dlc-standards.md\` | AI-DLC engineering standards every session |

## Manual (load via # in chat)

See \`$SKILLS_ROOT/AGENT.md\` for full list of available skills and their trigger phrases.
EOF
  echo "   Created: STEERING_INDEX.md (with SKILLS_ROOT=$SKILLS_ROOT)"
else
  # Update SKILLS_ROOT in existing index
  sed -i.bak "s|<!-- SKILLS_ROOT:.*-->|<!-- SKILLS_ROOT: $SKILLS_ROOT -->|" "$INDEX_DST"
  rm -f "$INDEX_DST.bak"
  echo "   Updated: STEERING_INDEX.md (SKILLS_ROOT=$SKILLS_ROOT)"
fi

echo ""
echo "✅ Kiro project setup complete: $PROJECT"
echo "   Hooks:    $hook_count files → $HOOKS_DST"
echo "   Steering: $steering_count files → $STEERING_DST"
echo ""
echo "Next steps:"
echo "  1. Review hooks in $HOOKS_DST — disable any you don't need"
echo "  2. Tell Kiro: 'Read $SKILLS_ROOT/AGENT.md and follow those instructions'"
