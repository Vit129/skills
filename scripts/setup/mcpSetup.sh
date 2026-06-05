#!/bin/bash
# mcpSetup.sh — Setup ~/.kiro/settings/mcp.json with standard MCP servers
# Usage: bash mcpSetup.sh [--force]
#
# Installs markitdown-mcp via uv tool install, then writes the canonical
# mcp.json to the user-level Kiro settings directory.
# Safe by default: skips mcp.json write if file already exists unless --force is passed.

set -euo pipefail

FORCE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    -h|--help)
      echo "Usage: bash mcpSetup.sh [--force]"
      echo "  --force   overwrite existing mcp.json"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Install markitdown-mcp ───────────────────────────────────
# Use 'uv tool install' for fast startup (no uvx download delay on each run)
if command -v uv &>/dev/null; then
  if uv tool list 2>/dev/null | grep -q "markitdown-mcp"; then
    echo "  ⏭️  markitdown-mcp already installed (uv tool)"
  else
    echo "🔧 Installing markitdown-mcp via uv tool install ..."
    uv tool install markitdown-mcp
    echo "  ✅ markitdown-mcp installed"
  fi
else
  echo "  ⚠️  uv not found — skipping markitdown-mcp install"
  echo "     Install uv: https://docs.astral.sh/uv/getting-started/installation/"
  echo "     Then run: uv tool install markitdown-mcp"
fi

# ── Install Playwright CLI ────────────────────────────────────
if command -v playwright-cli &>/dev/null; then
  echo "  ⏭️  playwright-cli already installed"
else
  echo "🔧 Installing @playwright/cli globally ..."
  npm install -g @playwright/cli@latest
  echo "  ✅ playwright-cli installed"
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

  cat > "$MCP_FILE" << 'EOF'
{
  "mcpServers": {
    "markitdown": {
      "command": "markitdown-mcp",
      "args": [],
      "disabled": false,
      "autoApprove": []
    },
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ],
      "disabled": false,
      "autoApprove": [
        "performance_start_trace",
        "performance_analyze_insight",
        "navigate_page",
        "take_screenshot",
        "list_console_messages"
      ]
    },
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ],
      "disabled": false,
      "autoApprove": []
    },
    "azure-devops": {
      "command": "npx",
      "args": [
        "-y",
        "@azure-devops/mcp",
        "your-ado-org",
        "-d",
        "core",
        "work",
        "work-items"
      ],
      "autoApprove": [
        "wit_get_work_item",
        "wit_my_work_items",
        "core_list_projects",
        "core_list_project_teams"
      ],
      "disabled": true
    }
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
echo "  Servers configured:"
echo "  • markitdown      (markitdown-mcp direct)     — convert files to Markdown"
echo "  • chrome-devtools (npx chrome-devtools-mcp)   — browser automation & debugging"
echo "  • playwright      (npx @playwright/mcp)       — browser automation (accessibility)"
echo "  • azure-devops    (disabled by default)       — Azure DevOps work items"
echo "  • figma           (power — mcp.figma.com)     — Figma design integration"
echo ""
echo "  CLI tools installed:"
echo "  • playwright-cli  (npm global)                — token-efficient browser CLI for agents"
echo ""
echo "Next: Restart Kiro or reconnect MCP servers from the Kiro feature panel."
echo "To re-run: bash $(basename "$0") --force"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
