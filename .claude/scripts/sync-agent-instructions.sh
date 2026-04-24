#!/bin/bash
# Sync agent-core.md → ~/.codex/CODEX.md and ~/.gemini/GEMINI.md
# Usage: ./.claude/scripts/sync-agent-instructions.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SHARED_FILE="$PROJECT_ROOT/.claude/shared/agent-core.md"

if [[ ! -f "$SHARED_FILE" ]]; then
  echo "❌ Error: $SHARED_FILE not found"
  exit 1
fi

# Function to generate agent config
generate_agent_config() {
  local agent_name=$1
  local agent_uppercase=$2
  local output_file=$3
  local agent_dir=$4

  echo "📝 Generating $agent_name config..."

  mkdir -p "$(dirname "$output_file")"

  cat > "$output_file" << 'HEADER'
# {{AGENT_NAME}} Agent Configuration

> Extends `.claude/shared/agent-core.md` (SSOT). Agent-specific overrides below.

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

## Shared Rules (from `.claude/shared/agent-core.md`)

HEADER

  # Append shared content
  cat "$SHARED_FILE" >> "$output_file"

  # Replace placeholders (handle symlinks by removing and recreating)
  if [[ -L "$output_file" ]]; then
    local target=$(readlink "$output_file")
    rm "$output_file"
    output_file="$target"
  fi

  sed -i.bak "s/{{AGENT_NAME}}/$agent_name/g" "$output_file"
  sed -i.bak "s/{{AGENT_UPPERCASE}}/$agent_uppercase/g" "$output_file"
  rm -f "$output_file.bak"

  echo "✅ Generated: $output_file"
}

# Generate for Codex
generate_agent_config "Codex" "CODEX" ~/.codex/CODEX.md "codex"

# Generate for Gemini
generate_agent_config "Gemini" "GEMINI" ~/.gemini/GEMINI.md "gemini"

echo ""
echo "🎯 Sync complete!"
echo "   ~/.codex/CODEX.md"
echo "   ~/.gemini/GEMINI.md"
echo ""
echo "📌 Reminder: Commit .claude/shared/ to GitHub, user-level files are local-only."
