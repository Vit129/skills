#!/bin/bash
# sync-all.sh — Sync ALL agent artifacts from ~/.claude/ to Codex + Gemini
#
# Replaces: sync-skills.sh, sync-rules.sh, sync-commands.sh,
#           sync-agents.sh, sync-agent-instructions.sh
#
# Source of truth: ~/.claude/
# Targets: ~/.codex/  ~/.gemini/
#
# Usage:
#   bash ~/.claude/scripts/sync-all.sh              # sync everything
#   bash ~/.claude/scripts/sync-all.sh --dry-run    # preview without changes
#   bash ~/.claude/scripts/sync-all.sh --only skills|rules|commands|agents|instructions
#   bash ~/.claude/scripts/sync-all.sh --list       # show config summary

set -euo pipefail

# ── Colors ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_HOME="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Parse args ───────────────────────────────────────────────────────────────
DRY_RUN=0
ONLY_FILTER=""
LIST_MODE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)  DRY_RUN=1; shift ;;
    --only)     ONLY_FILTER="$2"; shift 2 ;;
    --list)     LIST_MODE=1; shift ;;
    -h|--help)
      echo "Usage: bash sync-all.sh [--dry-run] [--only <step>] [--list]"
      echo ""
      echo "Steps: skills | rules | commands | agents | instructions"
      echo ""
      echo "Examples:"
      echo "  bash ~/.claude/scripts/sync-all.sh"
      echo "  bash ~/.claude/scripts/sync-all.sh --dry-run"
      echo "  bash ~/.claude/scripts/sync-all.sh --only skills"
      exit 0 ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
done

# ── Helpers ──────────────────────────────────────────────────────────────────
expand_path() { echo "${1/#\~/$HOME}"; }

# Mirror a source directory to a target directory via rsync
mirror_dir() {
  local label="$1"
  local src="$2"
  local dst="$3"

  src="$(expand_path "$src")"
  dst="$(expand_path "$dst")"

  if [ ! -d "$src" ]; then
    echo -e "    ${YELLOW}⚠️  Source not found, skipping: $src${NC}"
    return
  fi

  if [ "$DRY_RUN" -eq 1 ]; then
    local count
    count=$(find "$src" -type f | wc -l | tr -d ' ')
    echo -e "    ${DIM}would rsync $src/ → $dst/ ($count files)${NC}"
    return
  fi

  mkdir -p "$dst"
  rsync -a --delete --exclude="*.DS_Store" "$src/" "$dst/" > /dev/null 2>&1
  local count
  count=$(find "$dst" -type f | wc -l | tr -d ' ')
  echo -e "    ${GREEN}✅ $label → $dst ($count files)${NC}"
}

# Generate AGENTS.md / GEMINI.md from CLAUDE.md with token substitution
generate_instruction_file() {
  local agent_name="$1"   # e.g. CODEX or GEMINI
  local entry_file="$2"   # e.g. AGENTS.md or GEMINI.md
  local dst="$3"

  dst="$(expand_path "$dst")"
  local claude_file="$CLAUDE_HOME/CLAUDE.md"

  if [ ! -f "$claude_file" ]; then
    echo -e "    ${YELLOW}⚠️  CLAUDE.md not found, skipping $agent_name${NC}"
    return
  fi

  if [ "$DRY_RUN" -eq 1 ]; then
    echo -e "    ${DIM}would generate $dst from CLAUDE.md${NC}"
    return
  fi

  mkdir -p "$(dirname "$dst")"
  local agent_lower
  agent_lower="$(echo "$agent_name" | tr '[:upper:]' '[:lower:]')"

  local content
  content="$(cat "$claude_file")"
  content="${content//Claude Agent Workspace/${agent_name} Agent Workspace}"
  content="${content//CLAUDE.md/${entry_file}}"
  content="${content//rules\//$HOME/.${agent_lower}/rules/}"
  content="${content//skills\//$HOME/.${agent_lower}/skills/}"
  content="${content//output-styles\//$HOME/.claude/output-styles/}"
  content="${content//agent-memory\//$HOME/.claude/agent-memory/}"
  content="${content//GRAPH_REPORT.md/$HOME/.claude/GRAPH_REPORT.md}"
  content="${content//scripts\//$HOME/.claude/scripts/}"

  printf '%s\n' "$content" > "$dst"
  echo -e "    ${GREEN}✅ Generated $dst${NC}"
}

# ── Step runner ──────────────────────────────────────────────────────────────
should_run() { [[ -z "$ONLY_FILTER" || "$ONLY_FILTER" == "$1" ]]; }

# ── List mode ────────────────────────────────────────────────────────────────
if [ "$LIST_MODE" -eq 1 ]; then
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}📋 sync-all — Configuration Summary${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  ${BLUE}Source root:${NC} $CLAUDE_HOME"
  echo ""
  printf "  %-14s %-30s %s\n" "Step" "Source" "Targets"
  printf "  %-14s %-30s %s\n" "────────────" "──────────────────────────" "──────────────────────────────"
  printf "  %-14s %-30s %s\n" "skills"       "~/.claude/skills/"         "~/.codex/skills/  ~/.gemini/skills/"
  printf "  %-14s %-30s %s\n" "rules"        "~/.claude/rules/"          "~/.codex/rules/   ~/.gemini/rules/"
  printf "  %-14s %-30s %s\n" "commands"     "~/.claude/commands/"       "~/.codex/commands/ ~/.gemini/commands/"
  printf "  %-14s %-30s %s\n" "agents"       "~/.claude/.claude/agents/" "~/.codex/agents/  ~/.gemini/agents/"
  printf "  %-14s %-30s %s\n" "instructions" "~/.claude/CLAUDE.md"       "~/.codex/AGENTS.md  ~/.gemini/GEMINI.md"
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 0
fi

# ── Header ───────────────────────────────────────────────────────────────────
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔄 sync-all — ~/.claude/ → Codex + Gemini${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
[ "$DRY_RUN" -eq 1 ] && echo -e "  ${YELLOW}⚠️  DRY RUN — no files will be written${NC}\n"
[ -n "$ONLY_FILTER" ] && echo -e "  ${BLUE}Filter:${NC} --only $ONLY_FILTER\n"

# ── 1. Skills ────────────────────────────────────────────────────────────────
if should_run "skills"; then
  echo -e "  ${BLUE}[1/5] Skills${NC}  ~/.claude/skills/ → codex + gemini"
  mirror_dir "codex/skills"  "~/.claude/skills" "~/.codex/skills"
  mirror_dir "gemini/skills" "~/.claude/skills" "~/.gemini/skills"
  echo ""
fi

# ── 2. Rules ─────────────────────────────────────────────────────────────────
if should_run "rules"; then
  echo -e "  ${BLUE}[2/5] Rules${NC}   ~/.claude/rules/ → codex + gemini"
  mirror_dir "codex/rules"  "~/.claude/rules" "~/.codex/rules"
  mirror_dir "gemini/rules" "~/.claude/rules" "~/.gemini/rules"
  echo ""
fi

# ── 3. Commands ───────────────────────────────────────────────────────────────
if should_run "commands"; then
  echo -e "  ${BLUE}[3/5] Commands${NC} ~/.claude/commands/ → codex + gemini"
  mirror_dir "codex/commands"  "~/.claude/commands" "~/.codex/commands"
  mirror_dir "gemini/commands" "~/.claude/commands" "~/.gemini/commands"
  echo ""
fi

# ── 4. Agent personas ─────────────────────────────────────────────────────────
if should_run "agents"; then
  echo -e "  ${BLUE}[4/5] Agents${NC}  ~/.claude/.claude/agents/ → codex + gemini"
  mirror_dir "codex/agents"  "~/.claude/.claude/agents" "~/.codex/agents"
  mirror_dir "gemini/agents" "~/.claude/.claude/agents" "~/.gemini/agents"
  echo ""
fi

# ── 5. Instruction files (AGENTS.md / GEMINI.md) ─────────────────────────────
if should_run "instructions"; then
  echo -e "  ${BLUE}[5/5] Instructions${NC} CLAUDE.md → AGENTS.md + GEMINI.md"
  generate_instruction_file "CODEX"  "AGENTS.md" "~/.codex/AGENTS.md"
  generate_instruction_file "GEMINI" "GEMINI.md" "~/.gemini/GEMINI.md"
  echo ""
fi

# ── Footer ────────────────────────────────────────────────────────────────────
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$DRY_RUN" -eq 1 ]; then
  echo -e "${YELLOW}🔍 Dry run complete — no changes made${NC}"
else
  echo -e "${GREEN}✅ Sync complete!${NC}"
fi
echo ""
echo "  Run again:    bash ~/.claude/scripts/sync-all.sh"
echo "  Preview:      bash ~/.claude/scripts/sync-all.sh --dry-run"
echo "  Single step:  bash ~/.claude/scripts/sync-all.sh --only skills"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
