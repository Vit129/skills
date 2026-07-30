#!/usr/bin/env bash
# Full new-machine bootstrap for ~/.claude ONLY (never touches ~/.kiro).
# Clone this repo to ~/.claude on a fresh machine, run this once, restart
# Claude Code -- CLI companions (claude/codex/agy), hooks, MCP servers
# (graphify/kouen), the agy + 9arm-skills plugins (Claude Code), 9arm-skills
# for Codex/Gemini (cross-agent, via npx skills), and cron are all wired.
#
# claude/agy install via curl|bash -- deliberately NOT auto-run here (piping
# a remote script to bash unattended is exactly what you don't want in a
# script meant to be run non-interactively). This prints the command and
# stops; run it yourself, then re-run this script.
#
# Idempotent -- every step it calls is additive-only and safe to re-run.
# Usage: bash ~/.claude/scripts/bootstrap-new-machine.sh
set -euo pipefail

echo "== claude CLI =="
if command -v claude &>/dev/null; then
  echo "  already installed: $(claude --version 2>&1)"
else
  echo "  not installed. Run this yourself, then re-run this script:"
  echo "    curl -fsSL https://claude.ai/install.sh | bash"
fi

echo "== codex CLI (for the codex plugin / codex-rescue) =="
if command -v codex &>/dev/null; then
  echo "  already installed: $(codex --version 2>&1)"
elif command -v npm &>/dev/null; then
  npm install -g @openai/codex
else
  echo "  npm not found -- install Node.js first, then: npm install -g @openai/codex"
fi

echo "== agy CLI (for the agy plugin) =="
if command -v agy &>/dev/null; then
  echo "  already installed: $(agy --version 2>&1)"
else
  echo "  not installed. Run this yourself, then re-run this script:"
  echo "    curl -fsSL https://antigravity.google/cli/install.sh | bash"
fi

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

echo "== 9arm-skills (Codex/Gemini) =="
if command -v npx &>/dev/null; then
  npx skills add thananon/9arm-skills --agent codex gemini-cli -g -y || true
  # npx skills has proven unreliable propagating every skill to every agent dir in
  # one pass (silently dropped 3 of 6 on a real run) -- verify against its own
  # canonical ~/.agents/skills/ output and backfill anything it skipped.
  for s in debug-mantra post-mortem qwen-agent scrutinize management-talk qwenchance; do
    src="$HOME/.agents/skills/$s"
    [ -d "$src" ] || continue
    for dst in "$HOME/.codex/skills/$s" "$HOME/.gemini/antigravity-cli/skills/$s"; do
      [ -e "$dst" ] || { mkdir -p "$(dirname "$dst")" && cp -r "$src" "$dst" && echo "  backfilled $dst"; }
    done
  done
else
  echo "  npx not found -- skip (need Node.js/npm)"
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
