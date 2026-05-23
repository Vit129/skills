#!/bin/bash
# sync-agents.sh — Sync agent persona files from ~/.claude/.claude/agents/ to all AI agent targets
#
# Source of truth: ~/.claude/.claude/agents/
# Targets:
#   - ~/.codex/agents/      (OpenAI Codex — mirror mode)
#   - ~/.gemini/agents/     (Google Gemini CLI — mirror mode)
#
# Usage:
#   bash ~/.claude/scripts/sync-agents.sh              # sync all enabled targets
#   bash ~/.claude/scripts/sync-agents.sh --dry-run    # preview without changes
#   bash ~/.claude/scripts/sync-agents.sh --target codex
#   bash ~/.claude/scripts/sync-agents.sh --target gemini
#   bash ~/.claude/scripts/sync-agents.sh --list
#
# Config: ~/.claude/scripts/sync-agents.config.json

set -euo pipefail

# ── Colors ──────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── Resolve paths ───────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

_dir="$SCRIPT_DIR"
while [ "$_dir" != "/" ]; do
  if [ -d "$_dir/.git" ]; then
    PROJECT_ROOT="$_dir"
    break
  fi
  _dir="$(dirname "$_dir")"
done
if [ -z "${PROJECT_ROOT:-}" ]; then
  PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

CONFIG_FILE="$SCRIPT_DIR/sync-agents.config.json"
AGENTS_SOURCE="$HOME/.claude/.claude/agents"

# ── Parse args ──────────────────────────────────────────────
DRY_RUN=0
TARGET_FILTER=""
LIST_MODE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --target) TARGET_FILTER="$2"; shift 2 ;;
    --list) LIST_MODE=1; shift ;;
    -h|--help)
      echo "Usage: bash sync-agents.sh [--dry-run] [--target <name>] [--list]"
      echo ""
      echo "Options:"
      echo "  --dry-run        Preview changes without writing"
      echo "  --target <name>  Sync only specific target (codex|gemini)"
      echo "  --list           Show current sync configuration"
      exit 0 ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
done

# ── Load or create config ───────────────────────────────────
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${YELLOW}⚠️  Config not found. Creating default: $CONFIG_FILE${NC}"
  cat > "$CONFIG_FILE" << 'EOF'
{
  "source": "~/.claude/.claude/agents",
  "targets": {
    "codex": {
      "enabled": true,
      "path": "~/.codex/agents",
      "description": "OpenAI Codex CLI — mirror agent personas",
      "mode": "mirror",
      "exclude": ["*.DS_Store"]
    },
    "gemini": {
      "enabled": true,
      "path": "~/.gemini/agents",
      "description": "Google Gemini CLI — mirror agent personas",
      "mode": "mirror",
      "exclude": ["*.DS_Store"]
    }
  },
  "version": "1.0.0"
}
EOF
  echo -e "${GREEN}✅ Default config created${NC}"
  echo ""
fi

# ── Validate source ─────────────────────────────────────────
if [ ! -d "$AGENTS_SOURCE" ]; then
  echo -e "${RED}❌ Agents source not found: $AGENTS_SOURCE${NC}"
  exit 1
fi

# ── List mode ───────────────────────────────────────────────
if [ "$LIST_MODE" -eq 1 ]; then
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}📋 Sync Agents Configuration${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  ${BLUE}Source:${NC} $AGENTS_SOURCE"
  echo ""
  echo -e "  ${BLUE}Agents available:${NC}"
  for f in "$AGENTS_SOURCE"/*.md; do
    [ -f "$f" ] && echo "    • $(basename "$f")"
  done
  echo ""
  echo -e "  ${BLUE}Targets:${NC}"
  python3 -c "
import json
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
for name, t in cfg['targets'].items():
    status = '✅' if t['enabled'] else '⏸️ '
    print(f\"    {status} {name:8s} → {t['path']}\")
    print(f\"       Mode: {t['mode']} | {t['description']}\")
"
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 0
fi

# ── Header ──────────────────────────────────────────────────
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔄 Sync Agents — ~/.claude/.claude/agents/ → Multi-Agent${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BLUE}Source:${NC} $AGENTS_SOURCE"
[ "$DRY_RUN" -eq 1 ] && echo -e "  ${YELLOW}⚠️  DRY RUN — no files will be written${NC}"
echo ""

# ── Sync function ───────────────────────────────────────────
sync_mirror() {
  local target_path="$1"
  local target_name="$2"

  target_path="${target_path/#\~/$HOME}"

  echo -e "  ${GREEN}📂 [$target_name]${NC} Mirror → $target_path"

  if [ "$DRY_RUN" -eq 1 ]; then
    local file_count
    file_count=$(find "$AGENTS_SOURCE" -name "*.md" -type f | wc -l | tr -d ' ')
    echo "     Would rsync: $AGENTS_SOURCE/ → $target_path/"
    echo "     Agent files: $file_count"
    return
  fi

  mkdir -p "$target_path"
  rsync -av --delete --exclude="*.DS_Store" \
    "$AGENTS_SOURCE/" "$target_path/" > /dev/null 2>&1

  local file_count
  file_count=$(find "$target_path" -name "*.md" -type f | wc -l | tr -d ' ')
  echo -e "     ${GREEN}✅ Synced: $file_count agent files${NC}"
}

# ── Execute sync ────────────────────────────────────────────
python3 -c "
import json
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
for name, t in cfg['targets'].items():
    if t['enabled']:
        print(f\"{name}|{t['path']}|{t['mode']}\")
" | while IFS='|' read -r name path mode; do
  if [ -n "$TARGET_FILTER" ] && [ "$name" != "$TARGET_FILTER" ]; then
    continue
  fi
  case "$mode" in
    mirror) sync_mirror "$path" "$name" ;;
    *) echo -e "  ${YELLOW}⚠️  Unknown mode '$mode' for $name — skipping${NC}" ;;
  esac
done

# ── Summary ─────────────────────────────────────────────────
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$DRY_RUN" -eq 1 ]; then
  echo -e "${YELLOW}🔍 Dry run complete — no changes made${NC}"
else
  echo -e "${GREEN}✅ Sync complete!${NC}"
fi
echo ""
echo "  Run again:     bash ~/.claude/scripts/sync-agents.sh"
echo "  Preview only:  bash ~/.claude/scripts/sync-agents.sh --dry-run"
echo "  Config:        ~/.claude/scripts/sync-agents.config.json"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
