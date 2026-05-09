#!/bin/bash
# setupAgentSkills.sh — Setup AI agent context layer for any project
# Wrapper: runs setupMemory.sh + optionally setupKiro.sh
# Usage: bash setupAgentSkills.sh [PROJECT_NAME_OR_PATH|.|--self] [--force]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Pass all args to setupMemory.sh
bash "$SCRIPT_DIR/setupMemory.sh" "$@"

echo ""
read -p "🔧 ต้องการ setup Kiro IDE ด้วยมั้ย? [Y/n] " setup_kiro
setup_kiro="${setup_kiro:-y}"
if [[ "$setup_kiro" =~ ^[Yy]$ ]]; then
    echo ""
    bash "$SCRIPT_DIR/setupKiro.sh" "$@"
fi

# Optional: run setupTests.sh
SETUP_TESTS="$SCRIPT_DIR/setupTests.sh"
if [ -f "$SETUP_TESTS" ]; then
  echo ""
  read -p "🧪 ต้องการ setup QA tests (API/Web/Mobile) ด้วยมั้ย? [Y/n] " run_tests
  run_tests="${run_tests:-y}"
  if [[ "$run_tests" =~ ^[Yy]$ ]]; then
    echo ""
    bash "$SETUP_TESTS" "$@"
  else
    echo "⏭️  Skipped. Run manually: bash $SETUP_TESTS $1"
  fi
fi

# Optional: run postmanToPlaywright.sh
SETUP_POSTMAN="$SCRIPT_DIR/postmanToPlaywright.sh"
if [ -f "$SETUP_POSTMAN" ]; then
  echo ""
  read -p "📬 ต้องการ setup Postman → Playwright migration ด้วยมั้ย? [Y/n] " run_postman
  run_postman="${run_postman:-y}"
  if [[ "$run_postman" =~ ^[Yy]$ ]]; then
    echo ""
    bash "$SETUP_POSTMAN" "$@"
  else
    echo "⏭️  Skipped. Run manually: bash $SETUP_POSTMAN $1"
  fi
fi
