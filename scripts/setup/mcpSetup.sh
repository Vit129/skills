#!/bin/bash
# mcpSetup.sh — Setup ~/.kiro/settings/mcp.json with chrome-devtools + azure-devops MCP
# Usage: bash mcpSetup.sh [--force]
#
# Installs:
#   • playwright-cli (npm global) — token-efficient browser CLI for coding agents
#   • chrome-devtools MCP (performance, Lighthouse, network inspection)
#   • azure-devops MCP (work items, pipelines)
#   • figma power (design integration)
#
# Safe by default: skips mcp.json write if file already exists unless --force is passed.

set -euo pipefail

FORCE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    -h|--help)
      echo "Usage: bash mcpSetup.sh [--force]"
      echo "  --force  overwrite existing mcp.json"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Install Playwright CLI ────────────────────────────────────
if command -v playwright-cli &>/dev/null; then
  echo "  ⏭️  playwright-cli already installed"
else
  echo "🔧 Installing @playwright/cli globally ..."
  npm install -g @playwright/cli@latest
  echo "  ✅ playwright-cli installed"
fi

# Install playwright-cli skills (creates ~/.claude/skills/playwright-cli/)
echo "🔧 Installing playwright-cli skills ..."
playwright-cli install --skills
echo "  ✅ playwright-cli skills installed"

# ── Ask: markitdown (Excel, PDF, DOCX → Markdown) ─────────────
OPT_MARKITDOWN=0
echo ""
read -rp "📄 Need to read PDF/Excel/Word/Images (screenshots, specs)? Install markitdown-mcp? [y/N] " answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
  OPT_MARKITDOWN=1
  if command -v uv &>/dev/null; then
    if uv tool list 2>/dev/null | grep -q "markitdown-mcp"; then
      echo "  ⏭️  markitdown-mcp already installed"
    else
      echo "🔧 Installing markitdown-mcp via uv ..."
      uv tool install markitdown-mcp
      echo "  ✅ markitdown-mcp installed"
    fi
  else
    echo "  ⚠️  uv not found — install it first: https://docs.astral.sh/uv/"
    echo "     Then run: uv tool install markitdown-mcp"
  fi
fi

# ── Write mcp.json ───────────────────────────────────────────
MCP_DIR="$HOME/.kiro/settings"
MCP_FILE="$MCP_DIR/mcp.json"

mkdir -p "$MCP_DIR"

if [ -f "$MCP_FILE" ] && [ "$FORCE" -ne 1 ]; then
  echo "  ⏭️  mcp.json already exists at $MCP_FILE"
  echo "     Run with --force to overwrite."
else
  echo "🔧 Writing MCP config to $MCP_FILE ..."

  # Build markitdown block if selected
  MARKITDOWN_JSON=""
  if [ "$OPT_MARKITDOWN" -eq 1 ]; then
    MARKITDOWN_JSON=',
    "markitdown": {
      "command": "markitdown-mcp",
      "args": [],
      "disabled": false,
      "autoApprove": []
    }'
  fi

  cat > "$MCP_FILE" << EOF
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"],
      "disabled": false,
      "autoApprove": [
        "performance_start_trace",
        "performance_analyze_insight",
        "navigate_page",
        "take_screenshot",
        "take_snapshot",
        "list_console_messages"
      ]
    },
    "azure-devops": {
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "your-ado-org", "-d", "core", "work", "work-items"],
      "autoApprove": [
        "wit_get_work_item",
        "wit_my_work_items",
        "core_list_projects",
        "core_list_project_teams"
      ],
      "disabled": true
    }${MARKITDOWN_JSON}
  },
  "powers": {
    "mcpServers": {
      "power-figma-figma": {
        "url": "https://mcp.figma.com/mcp",
        "disabled": false,
        "disabledTools": []
      }
    }
  }
}
EOF

  echo "  ✅ mcp.json written"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ MCP setup complete: $MCP_FILE"
echo ""
echo "  • playwright-cli    (npm global)              — token-efficient browser CLI"
echo "  • chrome-devtools   (npx chrome-devtools-mcp) — Lighthouse, performance, network"
echo "  • azure-devops      (disabled by default)     — Azure DevOps work items MCP"
echo "  • figma             (power — mcp.figma.com)   — Figma design integration"
echo ""
echo "Next: Restart Kiro or reconnect MCP servers from the Kiro feature panel."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
