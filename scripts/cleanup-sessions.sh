#!/bin/bash
# Cleanup old session-env and file-history entries
# Keeps entries from the last 7 days, removes the rest
# Safe: only removes auto-generated ephemeral data

CLAUDE_DIR="$HOME/.claude"
DAYS=7

echo "[$(date '+%Y-%m-%d %H:%M')] Cleanup started"

# Cleanup session-env (older than $DAYS days)
count_sessions=$(find "$CLAUDE_DIR/session-env" -maxdepth 1 -type d -mtime +$DAYS ! -path "$CLAUDE_DIR/session-env" | wc -l | tr -d ' ')
find "$CLAUDE_DIR/session-env" -maxdepth 1 -type d -mtime +$DAYS ! -path "$CLAUDE_DIR/session-env" -exec rm -rf {} +

# Cleanup file-history (older than $DAYS days)
count_history=$(find "$CLAUDE_DIR/file-history" -maxdepth 1 -type d -mtime +$DAYS ! -path "$CLAUDE_DIR/file-history" | wc -l | tr -d ' ')
find "$CLAUDE_DIR/file-history" -maxdepth 1 -type d -mtime +$DAYS ! -path "$CLAUDE_DIR/file-history" -exec rm -rf {} +

# Remove .DS_Store files
find "$CLAUDE_DIR/session-env" -name ".DS_Store" -delete 2>/dev/null
find "$CLAUDE_DIR/file-history" -name ".DS_Store" -delete 2>/dev/null

echo "  Removed: $count_sessions session-env, $count_history file-history"
echo "[$(date '+%Y-%m-%d %H:%M')] Cleanup done"
