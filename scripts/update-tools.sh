#!/bin/bash
# update-tools.sh — Update all AI agent tools, plugins, and CLIs
# Run: ~/.claude/scripts/update-tools.sh

set -e
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BOLD}═══ AI Agent Tools Update ═══${NC}"
echo ""

# 1. Headroom proxy
echo -e "${BOLD}[1/4] Headroom proxy${NC}"
pip3 install --upgrade "headroom-ai[all]" --quiet 2>&1 | grep -v "already satisfied" | tail -3
HEADROOM_VER=$(headroom --version 2>/dev/null || echo "not installed")
echo -e "  ${GREEN}✓${NC} ${HEADROOM_VER}"
# Restart proxy if running
if launchctl list 2>/dev/null | grep -q com.headroom.proxy; then
    launchctl unload ~/Library/LaunchAgents/com.headroom.proxy.plist 2>/dev/null
    launchctl load ~/Library/LaunchAgents/com.headroom.proxy.plist
    echo -e "  ${GREEN}✓${NC} Proxy restarted"
fi
echo ""

# 2. Ponytail plugin
echo -e "${BOLD}[2/4] Ponytail plugin${NC}"
PONYTAIL_DIR="$HOME/.claude/plugins/marketplaces/ponytail"
if [ -d "$PONYTAIL_DIR/.git" ]; then
    cd "$PONYTAIL_DIR"
    OLD=$(git rev-parse --short HEAD)
    git pull --quiet 2>/dev/null
    NEW=$(git rev-parse --short HEAD)
    if [ "$OLD" != "$NEW" ]; then
        # Update cache
        VERSION=$(python3 -c "import json; print(json.load(open('.claude-plugin/plugin.json'))['version'])")
        CACHE="$HOME/.claude/plugins/cache/DietrichGebert/ponytail/$VERSION"
        rm -rf "$HOME/.claude/plugins/cache/DietrichGebert/ponytail"
        mkdir -p "$CACHE"
        cp -R "$PONYTAIL_DIR"/* "$CACHE"/
        echo -e "  ${GREEN}✓${NC} Updated $OLD → $NEW (v$VERSION)"
    else
        echo -e "  ${GREEN}✓${NC} Already latest ($NEW)"
    fi
else
    echo -e "  ${YELLOW}⚠${NC} Not installed (run: git clone https://github.com/DietrichGebert/ponytail ~/.claude/plugins/marketplaces/ponytail)"
fi
echo ""

# 3. Graphify (installed via uv tool as "graphifyy")
echo -e "${BOLD}[3/4] Graphify${NC}"
if command -v graphify &>/dev/null; then
    GRAPHIFY_VER=$(graphify --version 2>/dev/null || echo "unknown")
    uv tool upgrade graphifyy --quiet 2>/dev/null || true
    GRAPHIFY_NEW=$(graphify --version 2>/dev/null || echo "unknown")
    echo -e "  ${GREEN}✓${NC} ${GRAPHIFY_NEW}"
else
    echo -e "  ${YELLOW}⚠${NC} Not installed"
fi
echo ""

# 4. Agy (Antigravity CLI)
echo -e "${BOLD}[4/4] Agy (Antigravity CLI)${NC}"
if command -v agy &>/dev/null; then
    AGY_VER=$(agy --version 2>/dev/null || echo "unknown")
    agy update 2>&1 | tail -2 || echo -e "  ${YELLOW}⚠${NC} Self-update not available"
    AGY_NEW=$(agy --version 2>/dev/null || echo "unknown")
    if [ "$AGY_VER" != "$AGY_NEW" ]; then
        echo -e "  ${GREEN}✓${NC} Updated $AGY_VER → $AGY_NEW"
    else
        echo -e "  ${GREEN}✓${NC} Already latest (v$AGY_VER)"
    fi
else
    echo -e "  ${YELLOW}⚠${NC} Not installed"
fi
echo ""

# Summary
echo -e "${BOLD}═══ Status ═══${NC}"
echo -e "  Headroom: $(headroom --version 2>/dev/null || echo 'N/A') — $(curl -s http://127.0.0.1:8787/health 2>/dev/null | python3 -c 'import sys,json;print(json.load(sys.stdin)["status"])' 2>/dev/null || echo 'not running')"
echo -e "  Ponytail: $(python3 -c "import json;print('v'+json.load(open('$HOME/.claude/plugins/marketplaces/ponytail/.claude-plugin/plugin.json'))['version'])" 2>/dev/null || echo 'N/A')"
echo -e "  Graphify: $(graphify --version 2>/dev/null || echo 'N/A')"
echo -e "  Agy:      v$(agy --version 2>/dev/null || echo 'N/A')"
