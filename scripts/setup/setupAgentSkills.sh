#!/bin/bash
# setupAgentSkills.sh — Setup AI agent context layer for any project
# Wrapper: runs setupMemory.sh + setupKiro.sh + postmanToPlaywright.sh + mcpSetup.sh
# Usage: bash setupAgentSkills.sh [PROJECT_NAME_OR_PATH|.|--self] [--force]
# All steps run automatically (no prompts). setupTests.sh is excluded — run separately if needed.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Memory setup
bash "$SCRIPT_DIR/setupMemory.sh" "$@"

# 2. Kiro IDE config (.kiro/ + steering + hooks + MCP)
echo ""
bash "$SCRIPT_DIR/setupKiro.sh" "$@"

# 3. Postman → Playwright migration scaffold
SETUP_POSTMAN="$SCRIPT_DIR/postmanToPlaywright.sh"
if [ -f "$SETUP_POSTMAN" ]; then
  echo ""
  bash "$SETUP_POSTMAN" "$@"
fi

# 4. MCP servers (~/.kiro/settings/mcp.json)
SETUP_MCP="$SCRIPT_DIR/mcpSetup.sh"
if [ -f "$SETUP_MCP" ]; then
  echo ""
  bash "$SETUP_MCP"
fi
