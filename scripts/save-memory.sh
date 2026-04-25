#!/bin/bash
# Save session timestamp to memory state
STATE_FILE="${HOME}/.claude/.memory/state.md"
DIRTY_FLAG="${HOME}/.claude/.memory/.dirty"
DATE=$(date '+%Y-%m-%d %H:%M')

mkdir -p "$(dirname "$STATE_FILE")"

# Append session log
if grep -q "## Recent Sessions" "$STATE_FILE" 2>/dev/null; then
  sed -i '' "/## Recent Sessions/a\\
- ${DATE}: session saved (work detected)
" "$STATE_FILE"
else
  echo -e "\n## Recent Sessions\n- ${DATE}: session saved (work detected)" >> "$STATE_FILE"
fi

# Remove dirty flag
rm -f "$DIRTY_FLAG"
echo "✓ Memory saved"
