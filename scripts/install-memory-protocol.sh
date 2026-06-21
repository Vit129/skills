#!/usr/bin/env bash
# install-memory-protocol.sh — Wire memory-protocol.md into all projects
# Usage: ~/.claude/scripts/install-memory-protocol.sh
# Idempotent: safe to re-run.

set -euo pipefail

CANONICAL="$HOME/.claude/scripts/shared/memory-protocol.md"
PROJECTS=(
  "$HOME/Git/Personal/harness-terminal"
  "$HOME/Git/Personal/Home-Assistant"
  "$HOME/Git/Personal/Language-Learning"
  "$HOME/Git/Personal/My-Investment-Port"
)

# Agent instruction files to update
AGENT_FILES=("CLAUDE.md" "AGENTS.md" "GEMINI.md")
INCLUDE_LINE="@.ai/memory-protocol.md"

echo "=== Memory Protocol Installer ==="
echo "Source: $CANONICAL"
echo ""

if [[ ! -f "$CANONICAL" ]]; then
  echo "ERROR: Canonical file not found: $CANONICAL"
  exit 1
fi

for project in "${PROJECTS[@]}"; do
  if [[ ! -d "$project" ]]; then
    echo "SKIP: $project (not found)"
    continue
  fi

  name=$(basename "$project")
  echo "--- $name ---"

  # 1. Create .ai/ dir and symlink
  mkdir -p "$project/.ai"
  target="$project/.ai/memory-protocol.md"
  if [[ -L "$target" ]]; then
    echo "  ✓ Symlink exists"
  else
    rm -f "$target"
    ln -s "$CANONICAL" "$target"
    echo "  ✓ Created symlink"
  fi

  # 2. Add .ai/ to .gitignore if not already there
  gitignore="$project/.gitignore"
  if [[ -f "$gitignore" ]]; then
    if ! grep -qF ".ai/" "$gitignore"; then
      echo "" >> "$gitignore"
      echo "# Shared agent protocol (symlinked)" >> "$gitignore"
      echo ".ai/" >> "$gitignore"
      echo "  ✓ Added .ai/ to .gitignore"
    else
      echo "  ✓ .gitignore already has .ai/"
    fi
  else
    printf "# Shared agent protocol (symlinked)\n.ai/\n" > "$gitignore"
    echo "  ✓ Created .gitignore with .ai/"
  fi

  # 3. Add @.ai/memory-protocol.md to agent instruction files
  for agent_file in "${AGENT_FILES[@]}"; do
    filepath="$project/$agent_file"
    if [[ -f "$filepath" ]]; then
      if ! grep -qF "$INCLUDE_LINE" "$filepath"; then
        echo "" >> "$filepath"
        echo "<!-- Agent Memory Lifecycle (shared protocol) -->" >> "$filepath"
        echo "$INCLUDE_LINE" >> "$filepath"
        echo "  ✓ Added include to $agent_file"
      else
        echo "  ✓ $agent_file already includes protocol"
      fi
    fi
  done

  echo ""
done

echo "=== Verification ==="
for project in "${PROJECTS[@]}"; do
  if [[ ! -d "$project" ]]; then continue; fi
  name=$(basename "$project")
  link="$project/.ai/memory-protocol.md"
  if [[ -L "$link" ]] && [[ -f "$link" ]]; then
    echo "✓ $name — symlink OK, file readable"
  else
    echo "✗ $name — BROKEN"
  fi
done

echo ""
echo "Done. All agents will read the protocol via @.ai/memory-protocol.md"
