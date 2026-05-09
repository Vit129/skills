#!/bin/bash
# sync-rules.sh — Sync AI skills from central source to all AI agent targets
# Inspired by: James AppzStory's _skills concept (single source → multi-agent sync)
#
# Source of truth: configured in sync-rules.config.json
# Targets:
#   - ~/.codex/skills/      (OpenAI Codex — mirror mode)
#   - ~/.gemini/skills/     (Google Gemini CLI — mirror mode)
#   - .kiro/steering/       (Kiro IDE — DISABLED: uses kiro-workspace.md synced from KIRO.md)
#
# Usage:
#   bash .claude/scripts/sync-rules.sh              # sync all enabled targets
#   bash .claude/scripts/sync-rules.sh --dry-run    # preview without changes
#   bash .claude/scripts/sync-rules.sh --target codex   # sync only Codex
#   bash .claude/scripts/sync-rules.sh --target gemini  # sync only Gemini
#   bash .claude/scripts/sync-rules.sh --list        # show sync config
#
# Config: .claude/scripts/sync-rules.config.json

set -euo pipefail

# ── Colors ──────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ── Resolve paths ───────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Walk up from this script to find project root (.git)
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

CONFIG_FILE="$SCRIPT_DIR/sync-rules.config.json"

resolve_source_path() {
  local source_path="$1"
  if [[ "$source_path" != /* ]] && [[ "$source_path" != ~* ]]; then
    source_path="$PROJECT_ROOT/$source_path"
  fi
  echo "${source_path/#\~/$HOME}"
}

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
      echo "Usage: bash sync-rules.sh [--dry-run] [--target <name>] [--list]"
      echo ""
      echo "Options:"
      echo "  --dry-run        Preview changes without writing"
      echo "  --target <name>  Sync only specific target (codex|gemini|kiro)"
      echo "  --list           Show current sync configuration"
      echo ""
      echo "Source: configured in sync-rules.config.json"
      echo "Config: .claude/scripts/sync-rules.config.json"
      exit 0 ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
done

# ── Load or create config ───────────────────────────────────
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${YELLOW}⚠️  Config not found. Creating default: $CONFIG_FILE${NC}"
  cat > "$CONFIG_FILE" << 'EOF'
{
  "source": "~/.claude/skills",
  "targets": {
    "kiro": {
      "enabled": true,
      "path": ".kiro/steering",
      "description": "Kiro IDE — generates steering .md files from SKILL.md",
      "mode": "steering",
      "exclude": ["*.DS_Store", "__pycache__", "references/", "templates/", "scripts/"]
    },
    "codex": {
      "enabled": true,
      "path": "~/.codex/skills",
      "description": "OpenAI Codex CLI — mirror all Claude skills into ~/.codex/skills/",
      "mode": "mirror",
      "exclude": ["*.DS_Store"]
    },
    "gemini": {
      "enabled": true,
      "path": "~/.gemini/skills",
      "description": "Google Gemini CLI — mirror all Claude skills into ~/.gemini/skills/",
      "mode": "mirror",
      "exclude": ["*.DS_Store"]
    }
  },
  "version": "1.1.0"
}
EOF
  echo -e "${GREEN}✅ Default config created${NC}"
  echo ""
fi

RULES_SOURCE=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
print(cfg.get('source', 'ai-agent/rules/ai-dlc'))
")
RULES_SOURCE="$(resolve_source_path "$RULES_SOURCE")"

# ── Validate source ─────────────────────────────────────────
if [ ! -d "$RULES_SOURCE" ]; then
  echo -e "${RED}❌ Skills source not found: $RULES_SOURCE${NC}"
  echo "   Check the 'source' value in $CONFIG_FILE."
  exit 1
fi

# ── List mode ───────────────────────────────────────────────
if [ "$LIST_MODE" -eq 1 ]; then
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}📋 Sync Rules Configuration${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  ${BLUE}Source:${NC} $RULES_SOURCE"
  echo ""
  echo -e "  ${BLUE}Targets:${NC}"

  # Parse config with python (available on macOS)
  python3 -c "
import json, sys
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
echo -e "${CYAN}🔄 Sync Rules — Single Source → Multi-Agent${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BLUE}Source:${NC} $RULES_SOURCE"
[ "$DRY_RUN" -eq 1 ] && echo -e "  ${YELLOW}⚠️  DRY RUN — no files will be written${NC}"
echo ""

# ── Sync functions ──────────────────────────────────────────

sync_mirror() {
  local target_path="$1"
  local target_name="$2"

  # Expand ~ to $HOME
  target_path="${target_path/#\~/$HOME}"

  echo -e "  ${GREEN}📂 [$target_name]${NC} Mirror → $target_path"

  # Build exclude args from config
  local exclude_args=""
  exclude_args=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
excludes = cfg['targets']['$target_name'].get('exclude', [])
for e in excludes:
    print(f'--exclude={e}')
")

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "     Would rsync: $RULES_SOURCE/ → $target_path/"
    echo "     Excludes: $exclude_args"
    local file_count
    file_count=$(python3 -c "
import fnmatch, json
from pathlib import Path
source = Path('$RULES_SOURCE')
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
excludes = cfg['targets']['$target_name'].get('exclude', [])
count = 0
for path in source.rglob('*'):
    if not path.is_file():
        continue
    rel = path.relative_to(source).as_posix()
    parts = rel.split('/')
    if any(
        fnmatch.fnmatch(rel, pattern)
        or fnmatch.fnmatch(path.name, pattern)
        or (
            pattern.endswith('/')
            and rel == pattern.rstrip('/')
        )
        or (
            pattern.endswith('/')
            and rel.startswith(pattern)
        )
        or pattern.rstrip('/') in parts
        for pattern in excludes
    ):
        continue
    count += 1
print(count)
")
    echo "     Files after excludes: $file_count"
    return
  fi

  mkdir -p "$target_path"

  # shellcheck disable=SC2086
  rsync -av --delete --delete-excluded \
    $exclude_args \
    "$RULES_SOURCE/" "$target_path/" > /dev/null 2>&1

  local file_count
  file_count=$(find "$target_path" -type f | wc -l | tr -d ' ')
  echo -e "     ${GREEN}✅ Synced: $file_count files${NC}"
}

sync_steering() {
  local target_path="$1"
  local target_name="$2"

  # Resolve relative to project root
  if [[ "$target_path" != /* ]] && [[ "$target_path" != ~* ]]; then
    target_path="$PROJECT_ROOT/$target_path"
  fi
  target_path="${target_path/#\~/$HOME}"

  echo -e "  ${GREEN}📂 [$target_name]${NC} Steering → $target_path"

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "     Would generate steering files from SKILL.md files"
    local skill_count
    skill_count=$(find "$RULES_SOURCE" -name "SKILL.md" | wc -l | tr -d ' ')
    echo "     SKILL.md files found: $skill_count"
    return
  fi

  mkdir -p "$target_path"

  # Find all SKILL.md files and generate steering entries
  local generated=0
  while IFS= read -r skill_file; do
    # Extract relative path for naming
    local rel_path="${skill_file#$RULES_SOURCE/}"
    local dir_path="$(dirname "$rel_path")"
    local steering_name="${dir_path//\//-}.md"

    # Extract first line (title) and content
    local title
    title=$(head -1 "$skill_file" | sed 's/^#\s*//')

    # Generate steering file with front-matter
    local output_file="$target_path/$steering_name"
    cat > "$output_file" << STEERING_EOF
---
inclusion: manual
---
# $title

<!-- Auto-generated from: ai-agent/rules/$rel_path -->
<!-- Last synced: $(date +%Y-%m-%d\ %H:%M:%S) -->

STEERING_EOF

    # Append SKILL.md content (skip first line since we used it as title)
    tail -n +2 "$skill_file" >> "$output_file"

    generated=$((generated + 1))
  done < <(find "$RULES_SOURCE" -name "SKILL.md" -type f)

  echo -e "     ${GREEN}✅ Generated: $generated steering files${NC}"
}

sync_agents_md() {
  local target_path="$1"
  local target_name="$2"

  # Resolve relative to project root
  if [[ "$target_path" != /* ]] && [[ "$target_path" != ~* ]]; then
    target_path="$PROJECT_ROOT/$target_path"
  fi
  target_path="${target_path/#\~/$HOME}"

  echo -e "  ${GREEN}📂 [$target_name]${NC} AGENTS.md → $target_path"

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "     Would generate AGENTS.md from SKILL.md files"
    local skill_count
    skill_count=$(find "$RULES_SOURCE" -name "SKILL.md" | wc -l | tr -d ' ')
    echo "     SKILL.md files found: $skill_count"
    return
  fi

  # Ensure parent directory exists
  mkdir -p "$(dirname "$target_path")"

  # Generate single AGENTS.md with all skills concatenated
  cat > "$target_path" << AGENTS_HEADER
# Project Skills & Instructions

<!-- Auto-generated by sync-rules.sh from ai-agent/rules/ -->
<!-- Last synced: $(date +%Y-%m-%d\ %H:%M:%S) -->
<!-- Do NOT edit manually — changes will be overwritten on next sync -->

AGENTS_HEADER

  local skill_count=0
  while IFS= read -r skill_file; do
    local rel_path="${skill_file#$RULES_SOURCE/}"
    local dir_path="$(dirname "$rel_path")"

    echo "---" >> "$target_path"
    echo "" >> "$target_path"
    echo "## Skill: $dir_path" >> "$target_path"
    echo "" >> "$target_path"
    cat "$skill_file" >> "$target_path"
    echo "" >> "$target_path"

    skill_count=$((skill_count + 1))
  done < <(find "$RULES_SOURCE" -name "SKILL.md" -type f | sort)

  echo -e "     ${GREEN}✅ Generated: AGENTS.md ($skill_count skills merged)${NC}"
}

sync_gemini_md() {
  local target_path="$1"
  local target_name="$2"

  # Resolve relative to project root
  if [[ "$target_path" != /* ]] && [[ "$target_path" != ~* ]]; then
    target_path="$PROJECT_ROOT/$target_path"
  fi
  target_path="${target_path/#\~/$HOME}"

  echo -e "  ${GREEN}📂 [$target_name]${NC} GEMINI.md → $target_path"

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "     Would generate GEMINI.md from SKILL.md files"
    local skill_count
    skill_count=$(find "$RULES_SOURCE" -name "SKILL.md" | wc -l | tr -d ' ')
    echo "     SKILL.md files found: $skill_count"
    return
  fi

  # Ensure parent directory exists
  mkdir -p "$(dirname "$target_path")"

  # Generate GEMINI.md — Gemini supports @import syntax for modular context
  cat > "$target_path" << GEMINI_HEADER
# Project Skills & Instructions

<!-- Auto-generated by sync-rules.sh from ai-agent/rules/ -->
<!-- Last synced: $(date +%Y-%m-%d\ %H:%M:%S) -->
<!-- Do NOT edit manually — changes will be overwritten on next sync -->

GEMINI_HEADER

  local skill_count=0
  while IFS= read -r skill_file; do
    local rel_path="${skill_file#$RULES_SOURCE/}"
    local dir_path="$(dirname "$rel_path")"

    echo "---" >> "$target_path"
    echo "" >> "$target_path"
    echo "## Skill: $dir_path" >> "$target_path"
    echo "" >> "$target_path"
    cat "$skill_file" >> "$target_path"
    echo "" >> "$target_path"

    skill_count=$((skill_count + 1))
  done < <(find "$RULES_SOURCE" -name "SKILL.md" -type f | sort)

  echo -e "     ${GREEN}✅ Generated: GEMINI.md ($skill_count skills merged)${NC}"
}

# ── Execute sync ────────────────────────────────────────────
SYNC_COUNT=0
SKIP_COUNT=0

# Parse targets from config and sync
python3 -c "
import json, sys
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
for name, t in cfg['targets'].items():
    if t['enabled']:
        print(f\"{name}|{t['path']}|{t['mode']}\")
" | while IFS='|' read -r name path mode; do
  # Apply target filter
  if [ -n "$TARGET_FILTER" ] && [ "$name" != "$TARGET_FILTER" ]; then
    continue
  fi

  case "$mode" in
    mirror)     sync_mirror "$path" "$name" ;;
    steering)   sync_steering "$path" "$name" ;;
    agents-md)  sync_agents_md "$path" "$name" ;;
    gemini-md)  sync_gemini_md "$path" "$name" ;;
    *)          echo -e "  ${YELLOW}⚠️  Unknown mode '$mode' for $name — skipping${NC}" ;;
  esac
  SYNC_COUNT=$((SYNC_COUNT + 1))
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
echo "  Run again:     bash ai-agent/scripts/sync-rules.sh"
echo "  Preview only:  bash ai-agent/scripts/sync-rules.sh --dry-run"
echo "  Config:        ai-agent/scripts/sync-rules.config.json"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
