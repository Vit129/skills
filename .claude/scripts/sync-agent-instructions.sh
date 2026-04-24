#!/bin/bash
# Sync Full SSOT: extract marked sections from CLAUDE.md → generate agent configs
# Usage: ./.claude/scripts/sync-agent-instructions.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SHARED_CORE="$PROJECT_ROOT/.claude/shared/agent-core.md"
SHARED_DIR="$PROJECT_ROOT/.claude/shared"
SKILL_MAP="$SHARED_DIR/skill-map.md"
PROJECT_RULES="$SHARED_DIR/project-rules.md"
CITATION_FORMAT="$SHARED_DIR/citation-format.md"

if [[ ! -f "$SHARED_CORE" ]]; then
  echo "❌ Error: $SHARED_CORE not found"
  exit 1
fi

if [[ ! -f "$SKILL_MAP" ]]; then
  echo "❌ Error: $SKILL_MAP not found"
  exit 1
fi

if [[ ! -f "$PROJECT_RULES" ]]; then
  echo "❌ Error: $PROJECT_RULES not found"
  exit 1
fi

if [[ ! -f "$CITATION_FORMAT" ]]; then
  echo "❌ Error: $CITATION_FORMAT not found"
  exit 1
fi

# Function to generate agent config
generate_agent_config() {
  local agent_name=$1
  local agent_uppercase=$2
  local output_file=$3

  echo "📝 Generating $agent_name config..."

  mkdir -p "$(dirname "$output_file")"

  # Read synced sections from shared files
  local skill_map=$(cat "$SKILL_MAP")
  local project_rules=$(cat "$PROJECT_RULES")
  local citation_format=$(cat "$CITATION_FORMAT")

  # Generate file with all content
  {
    cat << 'HEADER'
# {{AGENT_NAME}} Agent Configuration

> Full SSOT: extends `.claude/shared/agent-core.md` + synced sections from `CLAUDE.md`.
> **Sync:** Run `./.claude/scripts/sync-agent-instructions.sh` to regenerate.

## {{AGENT_UPPERCASE}} Agent Tier (pick before every task)

| Task | Agent |
|------|-------|
| Read code / research / scaffold | {{AGENT_NAME}} Flash |
| Single-file fix, clear spec | {{AGENT_NAME}} Pro |
| Logic bug / arch / async / critical | {{AGENT_NAME}} Pro |

> One agent owns a task end-to-end — no mid-task handoffs.

## Rules ({{AGENT_UPPERCASE}}-specific)

- **Cache:** Do NOT edit {{AGENT_UPPERCASE}}.md / rules / MCP config mid-session (breaks prompt cache)
- **Token:** Toggle Extended Thinking off (Tab) for simple tasks

---

## Shared Core Rules (from `.claude/shared/agent-core.md`)

HEADER

    cat "$SHARED_CORE"

    cat << 'SECTIONS'

---

## Project Rules (synced from CLAUDE.md)

SECTIONS

    echo "$project_rules"

    cat << 'SKILLS'

---

## Skill Map (synced from CLAUDE.md)

SKILLS

    echo "$skill_map"

    cat << 'CITATIONS'

---

## Citation Format (synced from CLAUDE.md)

CITATIONS

    echo "$citation_format"

  } > "$output_file.tmp"

  # Replace placeholders (macOS compatible)
  sed -i '' "s/{{AGENT_NAME}}/$agent_name/g" "$output_file.tmp"
  sed -i '' "s/{{AGENT_UPPERCASE}}/$agent_uppercase/g" "$output_file.tmp"

  mv "$output_file.tmp" "$output_file"

  echo "✅ Generated: $output_file"
}

# Generate for Codex
generate_agent_config "Codex" "CODEX" ~/.codex/CODEX.md

# Generate for Gemini
generate_agent_config "Gemini" "GEMINI" ~/.gemini/GEMINI.md

echo ""
echo "🎯 Sync complete! Full SSOT implemented."
echo "   ~/.codex/CODEX.md (Codex + all synced content)"
echo "   ~/.gemini/GEMINI.md (Gemini + all synced content)"
echo ""
echo "📌 Edit CLAUDE.md → run this script → agents automatically synced"
