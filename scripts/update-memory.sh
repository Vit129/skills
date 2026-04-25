#!/bin/bash
# Auto-update memory state.md with session info
# Usage: update-memory.sh <action>
# action: SESSION_START | SESSION_END | FILE_WRITE

set -e

ACTION="${1:-SESSION_START}"
MEMORY_DIR="${HOME}/.claude/.memory"
STATE_FILE="${MEMORY_DIR}/state.md"

# Create memory dir if doesn't exist
mkdir -p "$MEMORY_DIR"

# Initialize state.md if missing
if [ ! -f "$STATE_FILE" ]; then
  cat > "$STATE_FILE" << 'EOF'
# Memory Palace — State Map

## Active Wings
- (none)

## Recent Sessions
- (none)

## Threads (In Progress)
- (none)

## Updated
EOF
fi

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)

case "$ACTION" in
  SESSION_START)
    # Add session start marker
    echo "- Session started: ${DATE} ${TIME}" >> "$STATE_FILE"
    echo "{\"ok\": true, \"action\": \"SESSION_START\", \"state\": \"$STATE_FILE\"}"
    ;;
  SESSION_END)
    # Archive old sessions (keep only last 5)
    TOTAL_SESSIONS=$(grep -c "Session started:" "$STATE_FILE" 2>/dev/null || echo "0")
    if [ "$TOTAL_SESSIONS" -gt 5 ]; then
      # Keep only last 5 session lines
      grep -v "^- Session started:" "$STATE_FILE" > "$STATE_FILE.tmp"
      tail -5 <(grep "^- Session started:" "$STATE_FILE") >> "$STATE_FILE.tmp"
      mv "$STATE_FILE.tmp" "$STATE_FILE"
    fi
    echo "- Session ended: ${DATE} ${TIME}" >> "$STATE_FILE"
    echo "{\"ok\": true, \"action\": \"SESSION_END\", \"state\": \"$STATE_FILE\"}"
    ;;
  FILE_WRITE)
    # Log that a file was written (generic)
    echo "- File written: ${DATE} ${TIME}" >> "$STATE_FILE"
    echo "{\"ok\": true, \"action\": \"FILE_WRITE\", \"state\": \"$STATE_FILE\"}"
    ;;
  *)
    echo "{\"ok\": false, \"error\": \"Unknown action: $ACTION\"}"
    exit 1
    ;;
esac
