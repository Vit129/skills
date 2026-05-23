#!/bin/bash
# sync-agent-instructions.sh — Generate AGENTS.md and GEMINI.md from ~/.claude/CLAUDE.md
#
# Source of truth: ~/.claude/CLAUDE.md + ~/.claude/rules/
# Targets:
#   - ~/.codex/AGENTS.md    (OpenAI Codex — generated)
#   - ~/.gemini/GEMINI.md   (Google Gemini CLI — generated)
#
# Usage:
#   bash ~/.claude/scripts/sync-agent-instructions.sh
#   bash ~/.claude/scripts/sync-agent-instructions.sh --dry-run
#   bash ~/.claude/scripts/sync-agent-instructions.sh --target codex
#   bash ~/.claude/scripts/sync-agent-instructions.sh --target gemini
#   bash ~/.claude/scripts/sync-agent-instructions.sh --list

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/sync-agent-instructions.config.json"
RULES_DIR="$PROJECT_ROOT/rules"
STYLE_FILE="$PROJECT_ROOT/output-styles/communication-style.md"
GRAPH_FILE="$PROJECT_ROOT/GRAPH_REPORT.md"
CLAUDE_FILE="$PROJECT_ROOT/CLAUDE.md"

resolve_path() {
  local path="$1"
  if [[ "$path" != /* ]] && [[ "$path" != ~* ]]; then
    path="$PROJECT_ROOT/$path"
  fi
  echo "${path/#\~/$HOME}"
}

require_file() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    echo -e "${RED}❌ Required file not found: $path${NC}"
    exit 1
  fi
}

require_dir() {
  local path="$1"
  if [[ ! -d "$path" ]]; then
    echo -e "${RED}❌ Required directory not found: $path${NC}"
    exit 1
  fi
}

read_config_value() {
  local expr="$1"
  python3 - "$CONFIG_FILE" "$expr" <<'PY'
import json
import sys

config_path = sys.argv[1]
expr = sys.argv[2]

with open(config_path) as f:
    cfg = json.load(f)

if expr == "source":
    print(cfg.get("source", "rules"))
    raise SystemExit

targets = cfg.get("targets", {})
for name, target in targets.items():
    if target.get("enabled"):
        print(f"{name}|{target.get('path','')}|{target.get('mode','')}")
PY
}

render_agent_md() {
  local agent_name="$1"
  local entry_file="$2"
  local agent_lower
  agent_lower="$(echo "$agent_name" | tr "[:upper:]" "[:lower:]")"
  
  local content
  content="$(cat "$CLAUDE_FILE")"
  
  content="${content//Claude Agent Workspace/${agent_name} Agent Workspace}"
  content="${content//CLAUDE.md/${entry_file}}"
  content="${content//rules\//~/.${agent_lower}/rules/}"
  content="${content//skills\//~/.${agent_lower}/skills/}"
  content="${content//output-styles\//~/.claude/output-styles/}"
  content="${content//agent-memory\//~/.claude/agent-memory/}"
  content="${content//GRAPH_REPORT.md/~/.claude/GRAPH_REPORT.md}"
  content="${content//scripts\//~/.claude/scripts/}"
  
  echo "$content"
}

write_target() {
  local target_name="$1"
  local target_path="$2"
  local dry_run="$3"
  local agent_uppercase
  agent_uppercase="$(printf '%s' "$target_name" | tr '[:lower:]' '[:upper:]')"
  target_path="$(resolve_path "$target_path")"
  local entry_file
  entry_file="$(basename "$target_path")"

  echo -e "  ${GREEN}📂 [$target_name]${NC} Generate → $target_path"

  if [[ "$dry_run" -eq 1 ]]; then
    echo "     Would generate from:"
    echo "       - $RULES_DIR"
    echo "       - $STYLE_FILE"
    [[ -f "$GRAPH_FILE" ]] && echo "       - $GRAPH_FILE"
    echo "       - $CLAUDE_FILE"
    return
  fi

  mkdir -p "$(dirname "$target_path")"
  local tmp_file
  tmp_file="$(mktemp "$(dirname "$target_path")/.tmp.${target_name}.XXXXXX")"
  {
    render_agent_md "$agent_uppercase" "$entry_file"
    printf '\n'
  } > "$tmp_file"
  mv "$tmp_file" "$target_path"
  echo -e "     ${GREEN}✅ Generated: $target_path${NC}"
}

DRY_RUN=0
TARGET_FILTER=""
LIST_MODE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --target) TARGET_FILTER="$2"; shift 2 ;;
    --list) LIST_MODE=1; shift ;;
    -h|--help)
      echo "Usage: bash sync-agent-instructions.sh [--dry-run] [--target <name>] [--list]"
      echo ""
      echo "Options:"
      echo "  --dry-run        Preview changes without writing"
      echo "  --target <name>  Sync only specific target (codex|gemini)"
      echo "  --list           Show current sync configuration"
      echo ""
      echo "Source: configured in sync-agent-instructions.config.json"
      echo "Config: .claude/scripts/sync-agent-instructions.config.json"
      exit 0 ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
done

require_file "$CONFIG_FILE"
require_dir "$RULES_DIR"
require_file "$STYLE_FILE"
require_file "$CLAUDE_FILE"

SOURCE_VALUE="$(python3 -c "import json; print(json.load(open('$CONFIG_FILE')).get('source', 'rules'))")"
SOURCE_PATH="$(resolve_path "$SOURCE_VALUE")"

if [[ ! -d "$SOURCE_PATH" ]]; then
  echo -e "${RED}❌ Source not found: $SOURCE_PATH${NC}"
  echo "   Check the 'source' value in $CONFIG_FILE."
  exit 1
fi

if [[ "$LIST_MODE" -eq 1 ]]; then
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}📋 Sync Agent Instructions Configuration${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  ${BLUE}Source:${NC} $SOURCE_PATH"
  echo ""
  echo -e "  ${BLUE}Targets:${NC}"
  python3 -c "
import json
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
for name, t in cfg['targets'].items():
    status = '✅' if t.get('enabled') else '⏸️ '
    print(f\"    {status} {name:8s} → {t.get('path', '')}\")
    print(f\"       Mode: {t.get('mode', '')} | {t.get('description', '')}\")
"
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 0
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔄 Sync Agent Instructions${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BLUE}Source:${NC} $SOURCE_PATH"
[ "$DRY_RUN" -eq 1 ] && echo -e "  ${YELLOW}⚠️  DRY RUN — no files will be written${NC}"
echo ""

SYNC_COUNT=0
python3 -c "
import json
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
for name, t in cfg['targets'].items():
    if t.get('enabled'):
        print(f\"{name}|{t.get('path','')}|{t.get('mode','')}\")
" | while IFS='|' read -r name path mode; do
  if [[ -n "$TARGET_FILTER" && "$name" != "$TARGET_FILTER" ]]; then
    continue
  fi
  case "$mode" in
    generate)
      write_target "$name" "$path" "$DRY_RUN"
      SYNC_COUNT=$((SYNC_COUNT + 1))
      ;;
    *)
      echo -e "  ${YELLOW}⚠️  Unknown mode '$mode' for $name — skipping${NC}"
      ;;
  esac
done

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [[ "$DRY_RUN" -eq 1 ]]; then
  echo -e "${YELLOW}🔍 Dry run complete — no changes made${NC}"
else
  echo -e "${GREEN}✅ Sync complete!${NC}"
fi
echo ""
echo "  Run again:     bash ~/.claude/scripts/sync-agent-instructions.sh"
echo "  Preview only:  bash ~/.claude/scripts/sync-agent-instructions.sh --dry-run"
echo "  Config:        ~/.claude/scripts/sync-agent-instructions.config.json"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
