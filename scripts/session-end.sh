#!/usr/bin/env bash
# End-of-session: scaffold CONTEXT/MEMORY update checklist + prune + graphify.
# Usage: session-end.sh [project-dir] [keep_days=7]
set -euo pipefail

PROJ="${1:-$PWD}"
KEEP_DAYS="${2:-7}"
SCRIPT_DIR="$(dirname "$0")"
MEM_DIR="$PROJ/agent-memory"

echo "═══ session-end — $(basename "$PROJ") ══════════════════"
echo ""

# ── 1. Checklist: what the AI must do before running this ─────────────────
echo "▸ Memory update checklist (AI task — do before running this script)"
echo "  [ ] Rewrite agent-memory/CONTEXT.md  → current task state + last session block"
echo "  [ ] Append to agent-memory/MEMORY.md → new decisions (date-prefixed)"
echo "  [ ] Update agent-memory/INDEX.md     → if new plans/ or knowledge/ files added"
echo "  [ ] If work continues elsewhere      → Skill(handoff) to fill CONTEXT.md ## Handoff"
echo "  [ ] Release any claims you made      → delete your line in CONTEXT.md ## Claims"
echo ""

# ── 2. Prune all agent-memory dirs ────────────────────────────────────────
echo "▸ Prune agent-memory (keep_days=${KEEP_DAYS})"
bash "$SCRIPT_DIR/prune-all-agent-memory.sh" "$KEEP_DAYS"

# ── 3. Update graphify for current project ────────────────────────────────
GOUT="$PROJ/graphify-out"
if [[ -d "$GOUT" ]] && git -C "$PROJ" rev-parse --git-dir &>/dev/null; then
  REPORT="$GOUT/GRAPH_REPORT.md"
  STORED=$(grep -oE 'Built from commit: `[a-f0-9]+`' "$REPORT" 2>/dev/null | grep -oE '[a-f0-9]{7,}' | head -1 || echo "")
  CURRENT=$(git -C "$PROJ" rev-parse --short HEAD 2>/dev/null || echo "")

  echo ""
  echo "▸ Graphify — $(basename "$PROJ")"
  if [[ -z "$STORED" || "$STORED" != "$CURRENT"* ]]; then
    graphify update "$PROJ" 2>&1 | tail -1 || true
  else
    echo "  graph up-to-date (${CURRENT})"
  fi
fi

echo ""
echo "═══ done ════════════════════════════════════════"
