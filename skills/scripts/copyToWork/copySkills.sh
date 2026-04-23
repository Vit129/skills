#!/bin/bash
# copySkills.sh — Copy shared skills to project's ai-agent/skills/
# Copies: ai-dlc/, doc/, system/, postman-to-playwright/, KIRO.md, scripts/setup/*
# Excludes: finance/, GEMINI.md (personal)
#
# Usage: bash copySkills.sh <PROJECT_ROOT> [--force]
#   e.g. bash copySkills.sh /Users/supavit.cho/Git/VitProjects

set -euo pipefail

# ── Source: always ~/.claude/skills ──
SRC="$HOME/.claude/skills"

if [ ! -d "$SRC" ]; then
  echo "❌ Source not found: $SRC"
  exit 1
fi

# ── Target ──
if [ -z "${1:-}" ]; then
  echo "❌ Usage: bash copySkills.sh <PROJECT_ROOT> [--force]"
  echo "   e.g. bash copySkills.sh /path/to/VitProjects"
  exit 1
fi

FORCE=0
TARGET=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    *) TARGET="$1"; shift ;;
  esac
done

DEST="$TARGET/ai-agent/skills"

# ── SAFETY: if DEST is a symlink, remove it first (prevents destroying source) ──
if [ -L "$DEST" ]; then
  LINK_TARGET="$(readlink "$DEST")"
  echo "⚠️  $DEST is a symlink → $LINK_TARGET"
  echo "   Removing symlink (source is safe)..."
  rm "$DEST"
fi

mkdir -p "$DEST"

# ── Verify SRC and DEST are different (resolved) paths ──
REAL_SRC="$(cd "$SRC" && pwd -P)"
REAL_DEST="$(cd "$DEST" && pwd -P)"
if [ "$REAL_SRC" = "$REAL_DEST" ]; then
  echo "❌ Source and destination resolve to the same path!"
  echo "   SRC:  $REAL_SRC"
  echo "   DEST: $REAL_DEST"
  echo "   This would destroy the source. Aborting."
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Copy shared skills"
echo "   from: $SRC"
echo "   to:   $DEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Folders to copy ──
FOLDERS=("ai-dlc" "doc" "system" "postman-to-playwright")

for folder in "${FOLDERS[@]}"; do
  if [ ! -d "$SRC/$folder" ]; then
    echo "  ⏭️  skip  $folder/ (not found in source)"
    continue
  fi
  if [ -d "$DEST/$folder" ] && [ "$FORCE" -ne 1 ]; then
    echo "  ⏭️  skip  $folder/ (exists, use --force to overwrite)"
  else
    rm -rf "$DEST/$folder"
    cp -R "$SRC/$folder" "$DEST/$folder"
    echo "  ✅ $folder/"
  fi
done

# ── Files to copy ──
FILES=("KIRO.md")

for file in "${FILES[@]}"; do
  if [ ! -f "$SRC/$file" ]; then
    echo "  ⏭️  skip  $file (not found in source)"
    continue
  fi
  if [ -f "$DEST/$file" ] && [ "$FORCE" -ne 1 ]; then
    echo "  ⏭️  skip  $file (exists, use --force to overwrite)"
  else
    if [ "$file" = "KIRO.md" ]; then
      # Strip personal finance/ section (marked with <!-- PERSONAL: strip ... -->)
      sed '/^### finance\/ — Investment Portfolio/,/^## /{ /^## /!d; }' "$SRC/$file" > "$DEST/$file"
      echo "  ✅ $file (finance/ section stripped)"
    else
      cp "$SRC/$file" "$DEST/$file"
      echo "  ✅ $file"
    fi
  fi
done

# ── scripts/setup/ ──
mkdir -p "$DEST/scripts/setup"
setup_count=0
skip_count=0
for f in "$SRC/scripts/setup/"*; do
  [ -f "$f" ] || continue
  fname="$(basename "$f")"
  [ "$fname" = ".DS_Store" ] && continue
  if [ -f "$DEST/scripts/setup/$fname" ] && [ "$FORCE" -ne 1 ]; then
    skip_count=$((skip_count + 1))
  else
    cp "$f" "$DEST/scripts/setup/$fname"
    setup_count=$((setup_count + 1))
  fi
done
echo "  ✅ scripts/setup/ ($setup_count copied, $skip_count skipped)"

# ── Remove .DS_Store ──
find "$DEST" -name ".DS_Store" -delete 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Done — shared skills copied to $DEST"
echo "   Excluded: finance/, GEMINI.md (personal)"
echo ""
echo "To overwrite: bash $(basename "$0") $TARGET --force"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
