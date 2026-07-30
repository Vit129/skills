#!/bin/bash
# setup-agent-memory.sh — Bootstrap the CURRENT agent-memory template
# (PLAYBOOK.md, SKILL-LOG.md, INDEX.md, knowledge/, plans/) for any project.
#
# EVAL-STATE.md/evals//drafts/ are deliberately NOT bootstrapped here (removed
# 2026-07-30) -- checked real instances across 7 projects and found 0/7 ever
# used them; EVAL-STATE.md is a ~/.claude-global-only concept read by
# scripts/eval-scheduler.sh's hardcoded $HOME/.claude path, never per-project.
#
# Self-contained under ~/.claude on purpose: ~/.kiro/scripts/setup/setupMemory.sh
# is the older bootstrap script and lives in a separate, company-scoped,
# optional directory (~/.kiro) that ships with this ~/.claude repo -- unlike
# ~/.claude/scripts/, which is guaranteed present wherever this repo is cloned.
# A core ~/.claude skill (agent-memory) hard-depending on a ~/.kiro path was a
# real portability bug, found 2026-07-30 while auditing why an
# already-bootstrapped project (Git/Personal/graphify) was still missing 4 of
# the 8 v2 files. Both this script and the ~/.kiro one now read the SAME
# templates from skills/agent-memory/references/templates/ (single source of
# truth) specifically so they can't drift apart again the way they just did
# (the ~/.kiro script had silently stayed on an older "PLAYBOOK.md + knowledge/
# only" subset while SKILL.md's documented structure moved on to v2.1.0).
#
# Idempotent: existing files are left alone unless --force is passed.
#
# Usage: bash setup-agent-memory.sh [PROJECT_PATH|.] [--force]
#   .            bootstrap at the project root (walks up from cwd to nearest .git)
#   PROJECT_PATH bootstrap at a specific path
#   --force      overwrite existing template files with the current template

set -euo pipefail

TEMPLATES_DIR="$HOME/.claude/skills/agent-memory/references/templates"

if [ -z "${1:-}" ]; then
  echo "Usage: $0 [PROJECT_PATH|.] [--force]"
  exit 1
fi

FORCE=0
TARGET_DIR=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    -h|--help)
      echo "Usage: $0 [PROJECT_PATH|.] [--force]"
      echo "  .            bootstrap at the project root (walks up to nearest .git)"
      echo "  PROJECT_PATH bootstrap at a specific path"
      echo "  --force      overwrite existing template files with the current template"
      exit 0 ;;
    *) TARGET_DIR="$1"; shift ;;
  esac
done

if [ -z "$TARGET_DIR" ]; then
  echo "Usage: $0 [PROJECT_PATH|.] [--force]"
  exit 1
fi

if [ ! -d "$TEMPLATES_DIR" ]; then
  echo "Templates dir not found: $TEMPLATES_DIR"
  exit 1
fi

if [ "$TARGET_DIR" = "." ] || [ "$TARGET_DIR" = "--self" ]; then
  _dir="$(pwd)"
  ROOT_DIR=""
  while [ "$_dir" != "/" ]; do
    if [ -d "$_dir/.git" ]; then
      ROOT_DIR="$_dir"
      break
    fi
    _dir="$(dirname "$_dir")"
  done
  [ -z "$ROOT_DIR" ] && ROOT_DIR="$(pwd)"
else
  if [ ! -d "$TARGET_DIR" ]; then
    echo "Folder not found: $TARGET_DIR"
    exit 1
  fi
  ROOT_DIR="$(cd "$TARGET_DIR" && pwd)"
fi

echo "Project root: $ROOT_DIR"
AM="$ROOT_DIR/agent-memory"
mkdir -p "$AM/knowledge" "$AM/plans"

install_file() {
  local rel="$1"
  local dest="$AM/$rel"
  local src="$TEMPLATES_DIR/$rel"
  if [ -f "$dest" ] && [ "$FORCE" -eq 0 ]; then
    echo "  skip  agent-memory/$rel (exists)"
    return
  fi
  if [ ! -f "$src" ]; then
    echo "  missing template: $src"
    return
  fi
  cp "$src" "$dest"
  echo "  ok    agent-memory/$rel"
}

install_file "PLAYBOOK.md"
install_file "SKILL-LOG.md"
install_file "INDEX.md"

echo ""
echo "agent-memory ready: $AM"
echo "  PLAYBOOK.md, SKILL-LOG.md, INDEX.md, knowledge/, plans/"
echo "Re-run with --force to overwrite existing files with the current template."
