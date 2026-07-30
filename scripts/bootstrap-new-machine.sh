#!/usr/bin/env bash
# Full new-machine bootstrap for ~/.claude ONLY (never touches ~/.kiro).
# Clone this repo to ~/.claude on a fresh machine, run this once, restart
# Claude Code -- hooks, MCP servers (graphify/kouen), and cron are all wired.
#
# Idempotent -- every step it calls is additive-only and safe to re-run.
# Usage: bash ~/.claude/scripts/bootstrap-new-machine.sh
set -euo pipefail

echo "== rtk =="
if command -v rtk &>/dev/null; then
  echo "  already installed: $(rtk --version)"
else
  echo "  installing via brew..."
  brew install rtk
fi

echo "== graphify =="
if command -v graphify-mcp &>/dev/null; then
  echo "  already installed: $(command -v graphify-mcp)"
elif ! command -v uv &>/dev/null; then
  echo "  uv not found -- install it first: https://docs.astral.sh/uv/"
  echo "  then re-run this script"
else
  FORK=""
  for d in "$HOME/git/personal/graphify" "$HOME/Git/Personal/graphify"; do
    [ -d "$d" ] && FORK="$d" && break
  done
  if [ -n "$FORK" ]; then
    echo "  installing from local fork: $FORK"
    uv tool install --from "${FORK}[mcp,pagerank]" graphifyy
  else
    echo "  installing graphifyy[mcp,pagerank] from PyPI"
    echo "  note: a known mcp>=2.0 compat break was patched only in the personal"
    echo "  fork (github.com/Vit129/graphify) as of 2026-07-29, not yet upstream."
    echo "  if graphify-mcp fails to connect after this, clone the fork:"
    echo "    git clone https://github.com/Vit129/graphify ~/git/personal/graphify"
    echo "  and re-run this script."
    uv tool install "graphifyy[mcp,pagerank]" || echo "  graphify install failed -- see note above"
  fi
fi

echo "== hooks =="
python3 "$HOME/.claude/scripts/install-hooks.py"

echo "== mcp servers =="
python3 "$HOME/.claude/scripts/install-mcp.py"

echo "== cron =="
bash "$HOME/.claude/scripts/install-cron.sh"

echo ""
echo "done -- restart Claude Code to pick up the new MCP servers."
echo "kouen MCP entry is added but disabled by default (Kouen.app is a personal"
echo "Mac app, not on brew -- install it manually, then flip \"disabled\": false"
echo "and KOUEN_MCP_ALLOW_CONTROL if you want it live)."
