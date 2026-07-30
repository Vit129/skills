#!/usr/bin/env bash
# Full new-machine bootstrap for ~/.claude ONLY (never touches ~/.kiro).
# Clone this repo to ~/.claude on a fresh machine, run this once, restart
# Claude Code -- hooks, MCP servers (graphify/kouen), the agy + 9arm-skills
# plugins, and cron are all wired.
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
GRAPHIFY_FORK="graphifyy[mcp,pagerank] @ git+https://github.com/Vit129/graphify.git"
if command -v graphify-mcp &>/dev/null; then
  echo "  already installed: $(command -v graphify-mcp)"
elif ! command -v uv &>/dev/null; then
  echo "  uv not found -- install it first: https://docs.astral.sh/uv/"
  echo "  then re-run this script"
else
  # Always from github.com/Vit129/graphify (the personal fork), never PyPI --
  # upstream graphifyy[mcp] resolves mcp>=2.0, which breaks graphify-mcp at
  # startup (AnyUrl import moved, list_tools decorator removed). The fork
  # pins mcp<2.0; this fix is not upstreamed.
  echo "  installing from $GRAPHIFY_FORK"
  uv tool install --from "$GRAPHIFY_FORK" graphifyy
fi

echo "== agy plugin =="
if command -v claude &>/dev/null; then
  claude plugin marketplace add Vit129/agy-plugin-cc
  claude plugin install agy@agy-plugin-cc
else
  echo "  claude CLI not found -- skipping (run this script from inside Claude Code's shell)"
fi

echo "== 9arm-skills plugin =="
if command -v claude &>/dev/null; then
  # thananon/9arm-skills has no .claude-plugin/marketplace.json of its own (only a
  # plugin.json), so it can't be added as a marketplace directly -- this small
  # wrapper manifest (checked into this repo) declares it as one, matching the
  # existing "9arm-marketplace" name so the enabledPlugins key never changes.
  claude plugin marketplace add "$HOME/.claude/scripts/marketplace-manifests/9arm"
  claude plugin install 9arm-skills@9arm-marketplace
else
  echo "  claude CLI not found -- skipping (run this script from inside Claude Code's shell)"
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
