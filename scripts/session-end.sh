#!/usr/bin/env bash
# End-of-session: update INDEX.md + graphify.
# Usage: session-end.sh [project-dir]
set -euo pipefail

PROJ="${1:-$PWD}"
MEM_DIR="$PROJ/agent-memory"

echo "═══ session-end — $(basename "$PROJ") ══════════════════"
echo ""

# ── 1. Checklist: what the AI must do before running this ─────────────────
echo "▸ Memory update checklist (AI task — do before running this script)"
echo "  [ ] Update agent-memory/INDEX.md     → if new plans/ or knowledge/ files added"
echo ""

# ── 2. Update graphify for current project ────────────────────────────────
GOUT="$PROJ/graphify-out"
if [[ -d "$GOUT" ]] && git -C "$PROJ" rev-parse --git-dir &>/dev/null; then
  REPORT="$GOUT/GRAPH_REPORT.md"
  STORED=$(grep -oE 'Built from commit: `[a-f0-9]+`' "$REPORT" 2>/dev/null | grep -oE '[a-f0-9]{7,}' | head -1 || echo "")
  CURRENT=$(git -C "$PROJ" rev-parse --short HEAD 2>/dev/null || echo "")

  echo ""
  echo "▸ Graphify — $(basename "$PROJ")"
  if [[ -z "$STORED" || "$STORED" != "$CURRENT"* ]]; then
    if [[ -f "$PROJ/scripts/graphify-refresh.sh" ]]; then
      echo "  running custom refresh script (scripts/graphify-refresh.sh)..."
      bash "$PROJ/scripts/graphify-refresh.sh" || true
    elif [[ -f "$PROJ/Scripts/graphify-refresh.sh" ]]; then
      echo "  running custom refresh script (Scripts/graphify-refresh.sh)..."
      bash "$PROJ/Scripts/graphify-refresh.sh" || true
    else
      graphify update "$PROJ" 2>&1 | tail -1 || true
    fi
  else
    echo "  graph up-to-date (${CURRENT})"
  fi
fi

echo ""

# ── 3. Weekly skill eval check (global, not per-project) ──────────────────
EVAL_SCHEDULER="$HOME/.claude/scripts/eval-scheduler.sh"
if [[ -f "$EVAL_SCHEDULER" ]]; then
  echo "▸ Skill eval"
  bash "$EVAL_SCHEDULER" 2>&1 | sed 's/^/  /' || true
  echo ""
fi

echo "═══ done ════════════════════════════════════════"
