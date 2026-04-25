#!/bin/bash
# Consolidate knowledge.md: dedupe, sort, clean
# Usage: consolidate-knowledge.sh

set -e

KNOWLEDGE_FILE="${HOME}/.claude/.memory/knowledge.md"

if [ ! -f "$KNOWLEDGE_FILE" ]; then
  echo "{\"ok\": true, \"message\": \"Knowledge file doesn't exist yet\"}"
  exit 0
fi

# Create backup
cp "$KNOWLEDGE_FILE" "$KNOWLEDGE_FILE.bak"

# Extract header and dedupe files section
HEADER_LINE=$(grep -n "^## Files Tagged" "$KNOWLEDGE_FILE" | cut -d: -f1)
HEAD=$(sed -n "1,$((HEADER_LINE-1))p" "$KNOWLEDGE_FILE")
FILES=$(sed -n "${HEADER_LINE},\$p" "$KNOWLEDGE_FILE" | tail -n +2 | sort -u)

# Rebuild file
cat > "$KNOWLEDGE_FILE" << EOF
$HEAD

## Files Tagged
$FILES
EOF

echo "{\"ok\": true, \"message\": \"Consolidated knowledge.md\", \"backup\": \"$KNOWLEDGE_FILE.bak\"}"
