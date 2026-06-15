#!/bin/bash
# mcpSetup.sh — Setup ~/.kiro/settings/mcp.json with standard MCP servers
# Usage: bash mcpSetup.sh [--force] [--markitdown] [--chrome-devtools] [--appium]
#
# Core (always installed):
#   • playwright-cli (npm global) — token-efficient browser CLI for agents
#   • playwright MCP server
#   • azure-devops MCP server (disabled by default)
#   • figma (power)
#
# Optional (pass flag to install):
#   --markitdown      Install markitdown-mcp (convert files to Markdown)
#   --chrome-devtools Install chrome-devtools-mcp (browser debugging & perf)
#   --appium          Install appium-mcp (mobile automation — Android/iOS)
#
# Safe by default: skips mcp.json write if file already exists unless --force is passed.

set -euo pipefail

FORCE=0
OPT_MARKITDOWN=0
OPT_CHROME_DEVTOOLS=0
OPT_APPIUM=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    --markitdown) OPT_MARKITDOWN=1; shift ;;
    --chrome-devtools) OPT_CHROME_DEVTOOLS=1; shift ;;
    --appium) OPT_APPIUM=1; shift ;;
    -h|--help)
      echo "Usage: bash mcpSetup.sh [--force] [--markitdown] [--chrome-devtools] [--appium]"
      echo ""
      echo "  --force           overwrite existing mcp.json"
      echo "  --markitdown      install markitdown-mcp (file → Markdown converter)"
      echo "  --chrome-devtools install chrome-devtools-mcp (browser debugging)"
      echo "  --appium          install appium-mcp (mobile automation)"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Core: Install Playwright CLI ──────────────────────────────
if command -v playwright-cli &>/dev/null; then
  echo "  ⏭️  playwright-cli already installed"
else
  echo "🔧 Installing @playwright/cli globally ..."
  npm install -g @playwright/cli@latest
  echo "  ✅ playwright-cli installed"
fi

# ── Optional: Install markitdown-mcp ─────────────────────────
if [ "$OPT_MARKITDOWN" -eq 1 ]; then
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
fi

# ── Optional: Verify chrome-devtools-mcp ──────────────────────
if [ "$OPT_CHROME_DEVTOOLS" -eq 1 ]; then
  echo "  ✅ chrome-devtools-mcp will be added to mcp.json (runs via npx)"
fi

# ── Optional: Verify appium-mcp ──────────────────────────────
if [ "$OPT_APPIUM" -eq 1 ]; then
  echo "  ✅ appium-mcp will be added to mcp.json (runs via npx)"
  if [ -z "${ANDROID_HOME:-}" ]; then
    echo "  ⚠️  ANDROID_HOME not set — appium-mcp needs it for Android testing"
    echo "     Set it in your shell profile: export ANDROID_HOME=~/Library/Android/sdk"
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

  # Build JSON with jq-like heredoc approach
  # Start with core servers, add optional ones based on flags
  MARKITDOWN_BLOCK=""
  if [ "$OPT_MARKITDOWN" -eq 1 ]; then
    MARKITDOWN_BLOCK='
    "markitdown": {
      "command": "markitdown-mcp",
      "args": [],
      "disabled": false,
      "autoApprove": []
    },'
  fi

  CHROME_DEVTOOLS_BLOCK=""
  if [ "$OPT_CHROME_DEVTOOLS" -eq 1 ]; then
    CHROME_DEVTOOLS_BLOCK='
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"],
      "disabled": false,
      "autoApprove": [
        "performance_start_trace",
        "performance_analyze_insight",
        "navigate_page",
        "take_screenshot",
        "list_console_messages"
      ]
    },'
  fi

  APPIUM_BLOCK=""
  if [ "$OPT_APPIUM" -eq 1 ]; then
    APPIUM_BLOCK='
    "appium-mcp": {
      "command": "npx",
      "args": ["-y", "appium-mcp@latest"],
      "env": {
        "ANDROID_HOME": "'"${ANDROID_HOME:-\$HOME/Library/Android/sdk}"'",
        "NO_UI": "true"
      },
      "disabled": true,
      "autoApprove": []
    },'
  fi

  cat > "$MCP_FILE" << EOF
{
  "mcpServers": {
    ${MARKITDOWN_BLOCK}${CHROME_DEVTOOLS_BLOCK}${APPIUM_BLOCK}
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "disabled": false,
      "autoApprove": []
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
echo "  Core (always):"
echo "  • playwright-cli  (npm global)                — token-efficient browser CLI for agents"
echo "  • playwright      (npx @playwright/mcp)       — browser automation (accessibility)"
echo "  • azure-devops    (disabled by default)       — Azure DevOps work items"
echo "  • figma           (power — mcp.figma.com)     — Figma design integration"
echo ""
echo "  Optional (installed this run):"
[ "$OPT_MARKITDOWN" -eq 1 ] && echo "  • markitdown      (markitdown-mcp)             — convert files to Markdown"
[ "$OPT_CHROME_DEVTOOLS" -eq 1 ] && echo "  • chrome-devtools (npx chrome-devtools-mcp)   — browser debugging & perf"
[ "$OPT_APPIUM" -eq 1 ] && echo "  • appium-mcp      (npx appium-mcp, disabled)   — mobile automation (Android/iOS)"
echo ""
echo "  To add optional servers later:"
echo "    bash mcpSetup.sh --force --markitdown"
echo "    bash mcpSetup.sh --force --chrome-devtools"
echo "    bash mcpSetup.sh --force --appium"
echo ""
echo "Next: Restart Kiro or reconnect MCP servers from the Kiro feature panel."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
