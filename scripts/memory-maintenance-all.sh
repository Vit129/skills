#!/usr/bin/env bash
# Run memory-maintenance-apply.sh across every project with agent-memory/.
# Mirrors update-graphify-all.sh's scan pattern. Usage: memory-maintenance-all.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

find "$HOME/Git/Personal" "$HOME/.claude" \
  -maxdepth 3 -name "agent-memory" -type d \
  ! -path "*/skills-backup*" \
  ! -path "*/.claude/skills/*" \
  ! -path "*/9arm-skills*" \
  2>/dev/null | sort | while read -r mem_dir; do

  proj="$(dirname "$mem_dir")"
  echo "→ $(basename "$proj")"
  bash "$SCRIPT_DIR/memory-maintenance-apply.sh" "$proj" || true
done
