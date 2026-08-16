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

echo "== plugins + marketplaces =="
# All 23 currently-enabled plugins (was hardcoded to just agy + 9arm-skills --
# the other 21, including claude-security/code-review/skill-creator/hookify/
# pr-review-toolkit, had zero reinstall path at all before this). Driven by
# scripts/settings-plugins.template.json, a checked-in snapshot of
# enabledPlugins/extraKnownMarketplaces; additive-only, safe to re-run.
# thananon/9arm-skills has no .claude-plugin/marketplace.json of its own (only
# a plugin.json), so it can't be added as a marketplace directly -- the
# template points its entry at the small wrapper manifest checked into this
# repo (scripts/marketplace-manifests/9arm) instead.
if command -v claude &>/dev/null; then
  python3 "$HOME/.claude/scripts/install-plugins.py"
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

echo "== prefs (statusLine etc. -- functional wiring only, not cosmetic taste) =="
python3 "$HOME/.claude/scripts/install-prefs.py"

echo "== mcp servers =="
python3 "$HOME/.claude/scripts/install-mcp.py"

echo "== cron =="
bash "$HOME/.claude/scripts/install-cron.sh"

echo "== claude code + per-project memory (private backup) =="
# Two things are gitignored from this public repo on purpose and restored
# separately from the private agent-memory-private repo:
#   1. ~/.claude/projects/*/memory/   -- Claude Code's own auto-memory
#   2. ~/Git/Personal/*/agent-memory/ -- per-project memory, untracked from
#      each project's own repo since 2026-08-16 (repo-cleanliness migration;
#      see project_new_machine_memory_backup memory entry). Company-* is
#      never in this backup (2026-08-16 decision) -- company-side only.
# Clone-to-temp-then-rsync, not a direct clone: both targets may already
# exist and be non-empty on a machine that's run before.
if command -v git &>/dev/null; then
  TMP_MEMORY_CLONE="$(mktemp -d)"
  if git clone --quiet --depth 1 https://github.com/Vit129/agent-memory-private.git "$TMP_MEMORY_CLONE" 2>/dev/null; then
    mkdir -p "$HOME/.claude/projects"
    for project_dir in "$TMP_MEMORY_CLONE"/projects/*/; do
      [ -d "$project_dir" ] || continue
      name="$(basename "$project_dir")"
      mkdir -p "$HOME/.claude/projects/$name/memory"
      rsync -a "$project_dir/memory/" "$HOME/.claude/projects/$name/memory/"
    done
    restored_count="$(find "$HOME/.claude/projects" -path '*/memory/*.md' 2>/dev/null | wc -l | tr -d ' ')"
    echo "  restored $restored_count claude code memory files from agent-memory-private"

    for am_dir in "$TMP_MEMORY_CLONE"/agent-memory/*/; do
      [ -d "$am_dir" ] || continue
      name="$(basename "$am_dir")"
      target="$HOME/Git/Personal/$name/agent-memory"
      if [ -d "$HOME/Git/Personal/$name" ]; then
        mkdir -p "$target"
        rsync -a "$am_dir" "$target/"
        echo "  restored agent-memory/ for $name"
      else
        echo "  skip agent-memory/ for $name -- ~/Git/Personal/$name not cloned yet"
      fi
    done
    rm -rf "$TMP_MEMORY_CLONE"
  else
    rm -rf "$TMP_MEMORY_CLONE"
    echo "  could not clone agent-memory-private (needs gh/git auth to a private repo you own) -- skipping"
  fi
else
  echo "  git not found -- skipping"
fi

echo ""
echo "done -- restart Claude Code to pick up the new MCP servers."
echo "kouen MCP entry is added but disabled by default (Kouen.app is a personal"
echo "Mac app, not on brew -- install it manually, then flip \"disabled\": false"
echo "and KOUEN_MCP_ALLOW_CONTROL if you want it live)."
echo ""
echo "== manual secrets (never backed up anywhere, re-enter by hand) =="
echo "  ~/.claude/settings.json -> mcpServers.line-bot.env:"
echo "    CHANNEL_ACCESS_TOKEN, DESTINATION_USER_ID"
echo "  A git repo, even a private one, is not a secrets manager -- these are"
echo "  deliberately absent from both the public skills repo and the private"
echo "  memory backup. Pull them from wherever they're actually kept (password"
echo "  manager / LINE Developers console) and paste into settings.json by hand."
