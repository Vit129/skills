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

# ── 3. Daily skill eval check (global, not per-project) ───────────────────
EVAL_SCHEDULER="$HOME/.claude/scripts/eval-scheduler.sh"
if [[ -f "$EVAL_SCHEDULER" ]]; then
  echo "▸ Skill eval"
  bash "$EVAL_SCHEDULER" 2>&1 | sed 's/^/  /' || true
  echo ""
fi

# ── 4. Daily skill-candidate check (global, not per-project) ──────────────
CANDIDATE_SCHEDULER="$HOME/.claude/scripts/candidate-scheduler.sh"
if [[ -f "$CANDIDATE_SCHEDULER" ]]; then
  echo "▸ Skill candidates"
  bash "$CANDIDATE_SCHEDULER" 2>&1 | sed 's/^/  /' || true
  echo ""
fi

# ── 5. Daily memory decay check (global, not per-project) ─────────────────
DECAY_SCHEDULER="$HOME/.claude/scripts/memory-decay-scheduler.sh"
if [[ -f "$DECAY_SCHEDULER" ]]; then
  echo "▸ Memory decay"
  bash "$DECAY_SCHEDULER" 2>&1 | sed 's/^/  /' || true
  echo ""
fi

# ── 6. Weekly build/cache cleanup check (global, not per-project) ─────────
BUILD_CACHE_SCHEDULER="$HOME/.claude/scripts/build-cache-scheduler.sh"
if [[ -f "$BUILD_CACHE_SCHEDULER" ]]; then
  echo "▸ Build/cache cleanup"
  bash "$BUILD_CACHE_SCHEDULER" 2>&1 | sed 's/^/  /' || true
  echo ""
fi

# ── 7. Weekly graphify semantic-label staleness check (global) ────────────
GRAPHIFY_LABEL_SCHEDULER="$HOME/.claude/scripts/graphify-label-scheduler.sh"
if [[ -f "$GRAPHIFY_LABEL_SCHEDULER" ]]; then
  echo "▸ Graphify semantic labels"
  bash "$GRAPHIFY_LABEL_SCHEDULER" 2>&1 | sed 's/^/  /' || true
  echo ""
fi

# ── 8. Daily routing-adherence check (global, not per-project) ────────────
ROUTING_ADHERENCE_SCHEDULER="$HOME/.claude/scripts/routing-adherence-scheduler.sh"
if [[ -f "$ROUTING_ADHERENCE_SCHEDULER" ]]; then
  echo "▸ Routing adherence"
  bash "$ROUTING_ADHERENCE_SCHEDULER" 2>&1 | sed 's/^/  /' || true
  echo ""
fi

echo "═══ done ════════════════════════════════════════"
