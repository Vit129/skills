#!/bin/bash
# Auto-update knowledge.md with file metadata + test results
# Usage: update-knowledge.sh <file_path> <test_result>
# test_result: PASS or FAIL

set -e

FILE_PATH="${1:-.}"
TEST_RESULT="${2:-NONE}"
KNOWLEDGE_FILE="${HOME}/.claude/.memory/knowledge.md"

# Create knowledge.md if doesn't exist
mkdir -p "$(dirname "$KNOWLEDGE_FILE")"
if [ ! -f "$KNOWLEDGE_FILE" ]; then
  cat > "$KNOWLEDGE_FILE" << 'EOF'
# Knowledge Index

## Skills by Utility Score

### High (≥7.0)
- (none yet)

### Active (3.0-6.9)
- (none yet)

### Flagged (<3.0)
- (none yet)

## Files Tagged
EOF
fi

# Extract filename and path
FILENAME=$(basename "$FILE_PATH")
FILE_DIR=$(dirname "$FILE_PATH" | sed 's|^./||')
TIMESTAMP=$(date +%s)
DATE=$(date +%Y-%m-%d)

# Add file tag
echo "- ${FILENAME} | path: ${FILE_DIR} | tagged: ${DATE}" >> "$KNOWLEDGE_FILE"

# Update utility score based on test result
if [ "$TEST_RESULT" = "PASS" ]; then
  echo "  - status: PASS | utility_score: +0.5" >> "$KNOWLEDGE_FILE"
elif [ "$TEST_RESULT" = "FAIL" ]; then
  echo "  - status: FAIL | utility_score: -1.0" >> "$KNOWLEDGE_FILE"
fi

echo "{\"ok\": true, \"file\": \"$FILENAME\", \"updated\": \"$KNOWLEDGE_FILE\"}"
