#!/bin/bash
# Sync shared SSOT files → ~/.codex/CODEX.md and ~/.gemini/GEMINI.md
# Usage: ./.claude/scripts/sync-agent-instructions.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RULES_DIR="$PROJECT_ROOT/rules"

CORE_FILE="$RULES_DIR/agent-core.md"
SKILL_MAP_FILE="$RULES_DIR/skill-map.md"
PROJECT_RULES_FILE="$RULES_DIR/project-rules.md"
CITATION_FILE="$RULES_DIR/citation-format.md"

require_file() {
  local path=$1
  if [[ ! -f "$path" ]]; then
    echo "Error: required file not found: $path" >&2
    exit 1
  fi
}

require_file "$CORE_FILE"
require_file "$SKILL_MAP_FILE"
require_file "$PROJECT_RULES_FILE"
require_file "$CITATION_FILE"

resolve_output_path() {
  local output_file=$1
  if [[ -L "$output_file" ]]; then
    readlink "$output_file"
  else
    echo "$output_file"
  fi
}

append_if_exists() {
  local file_path=$1
  local temp_file=$2
  if [[ -f "$file_path" ]]; then
    printf '\n' >> "$temp_file"
    cat "$file_path" >> "$temp_file"
  fi
}

generate_agent_config() {
  local agent_name=$1
  local agent_uppercase=$2
  local output_file=$3
  local target_file
  local temp_file
  local target_dir
  local agent_lowercase
  local agent_override_file

  agent_lowercase="$(printf '%s' "$agent_uppercase" | tr '[:upper:]' '[:lower:]')"
  agent_override_file="$RULES_DIR/${agent_lowercase}-overrides.md"

  echo "Generating $agent_name config..."

  mkdir -p "$(dirname "$output_file")"
  target_file="$(resolve_output_path "$output_file")"
  target_dir="$(dirname "$target_file")"
  mkdir -p "$target_dir"

  temp_file="$(mktemp "$target_dir/.tmp.${agent_lowercase}.XXXXXX")"

  cat > "$temp_file" <<'HEADER'
# {{AGENT_NAME}} Agent Configuration

> Generated from `rules/` (SSOT). Edit rules files or agent-specific overrides, not this file directly.

---

## 🚨 MANDATORY: Plan Before Non-Trivial Work

**Make the approach explicit when:**
- Implementing new features (unclear scope)
- Multiple valid approaches exist
- Code changes affecting behavior/structure
- Architectural decisions needed
- Multi-file changes likely
- Requirements unclear

**Skip explicit planning only for:**
- Single-line fixes
- One-function additions with clear requirements
- Research tasks (use Agent tool instead)
- Explicit detailed instructions

---

## {{AGENT_UPPERCASE}} Agent Tier (pick before every task)

| Task | Agent |
|------|-------|
| Read code / research / scaffold | {{AGENT_NAME}} Flash |
| Single-file fix, clear spec | {{AGENT_NAME}} Pro |
| Logic bug / arch / async / critical | {{AGENT_NAME}} Pro |

> One agent owns a task end-to-end — no mid-task handoffs.

## Rules ({{AGENT_UPPERCASE}}-specific)

- **Cache:** Do NOT edit generated {{AGENT_UPPERCASE}}.md directly during normal use; update `rules/` or `{{AGENT_UPPERCASE}}` overrides and resync instead
- **Token:** Toggle Extended Thinking off (Tab) for simple tasks

---

## Shared Core (from `rules/agent-core.md`)

HEADER

  cat "$CORE_FILE" >> "$temp_file"

  printf '\n\n## Shared Skill Map (from `rules/skill-map.md`)\n\n' >> "$temp_file"
  cat "$SKILL_MAP_FILE" >> "$temp_file"

  printf '\n\n## Shared Project Rules (from `rules/project-rules.md`)\n\n' >> "$temp_file"
  cat "$PROJECT_RULES_FILE" >> "$temp_file"

  printf '\n\n## Shared Citation Format (from `rules/citation-format.md`)\n\n' >> "$temp_file"
  cat "$CITATION_FILE" >> "$temp_file"

  append_if_exists "$agent_override_file" "$temp_file"

  sed -i.bak "s/{{AGENT_NAME}}/$agent_name/g" "$temp_file"
  sed -i.bak "s/{{AGENT_UPPERCASE}}/$agent_uppercase/g" "$temp_file"
  rm -f "$temp_file.bak"

  mv "$temp_file" "$target_file"

  echo "Generated: $target_file"
}

generate_agent_config "Codex" "CODEX" "$HOME/.codex/CODEX.md"
generate_agent_config "Gemini" "GEMINI" "$HOME/.gemini/GEMINI.md"

echo ""
echo "Sync complete:"
echo "  $HOME/.codex/CODEX.md"
echo "  $HOME/.gemini/GEMINI.md"
echo ""
echo "Reminder: commit rules/ and scripts/ to GitHub; generated user-level files remain local."
