#!/bin/bash
# copySkills.sh — Copy shared skills to project's ai-agent/skills/
# Copies: ai-dlc/, doc/, system/, postman-to-playwright/, KIRO.md
# Excludes: finance/, GEMINI.md, scripts/ (personal/local-only)
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
  echo "❌ Usage: bash copySkills.sh <PROJECT_NAME_OR_PATH> [--force]"
  echo "   e.g. bash copySkills.sh VitProjects"
  echo "   e.g. bash copySkills.sh /path/to/VitProjects"
  exit 1
fi

FORCE=1
TARGET=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    *) TARGET="$1"; shift ;;
  esac
done

# ── Resolve TARGET → project root ──
if [[ "$TARGET" == /* ]]; then
  # absolute path — use directly
  if [ ! -d "$TARGET" ]; then
    echo "❌ Path not found: $TARGET"
    exit 1
  fi
  PROJECT_ROOT="$TARGET"
elif [[ "$TARGET" == *"/"* ]] || [ -d "$TARGET" ]; then
  # relative path
  if [ ! -d "$TARGET" ]; then
    echo "❌ Path not found: $TARGET"
    exit 1
  fi
  PROJECT_ROOT="$(cd "$TARGET" && pwd)"
else
  # folder name — search from cwd (same pattern as setupTests.sh)
  echo "🔍 Searching for folder: $TARGET"
  FOUND_PATHS=()
  for depth in 1 2 3 4; do
    while IFS= read -r -d '' p; do
      FOUND_PATHS+=("$p")
    done < <(find . -mindepth "$depth" -maxdepth "$depth" -type d -name "$TARGET" \
      -not -path "*/node_modules/*" \
      -not -path "*/.git/*" \
      -not -path "*/agent-memory/*" \
      -print0 2>/dev/null)
  done

  if [ ${#FOUND_PATHS[@]} -eq 0 ]; then
    echo "❌ Folder $TARGET ไม่พบ"
    exit 1
  elif [ ${#FOUND_PATHS[@]} -eq 1 ]; then
    PROJECT_ROOT="$(cd "${FOUND_PATHS[0]}" && pwd)"
    echo "✅ Found: $PROJECT_ROOT"
  else
    echo "⚠️  พบหลายตำแหน่ง:"
    for i in "${!FOUND_PATHS[@]}"; do
      echo "  [$((i+1))] ${FOUND_PATHS[$i]#./}"
    done
    read -p "เลือกตำแหน่ง (1-${#FOUND_PATHS[@]}): " choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le ${#FOUND_PATHS[@]} ]; then
      PROJECT_ROOT="$(cd "${FOUND_PATHS[$((choice-1))]}" && pwd)"
      echo "✅ Selected: $PROJECT_ROOT"
    else
      echo "❌ Invalid choice"
      exit 1
    fi
  fi
fi

DEST="$PROJECT_ROOT/ai-agent/skills"

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

# ── Copy scripts/setup/ → $DEST/scripts/setup/ (exclude setupCodexSkills.sh) ──
SCRIPTS_SRC="$SRC/scripts/setup"
SCRIPTS_DEST="$DEST/scripts/setup"
if [ ! -d "$SCRIPTS_SRC" ]; then
  echo "  ⏭️  skip  scripts/setup/ (not found in source)"
else
  if [ -d "$SCRIPTS_DEST" ] && [ "$FORCE" -ne 1 ]; then
    echo "  ⏭️  skip  scripts/setup/ (exists, use --force to overwrite)"
  else
    rm -rf "$SCRIPTS_DEST"
    mkdir -p "$SCRIPTS_DEST"
    cp -R "$SCRIPTS_SRC"/. "$SCRIPTS_DEST"/
    rm -f "$SCRIPTS_DEST/setupCodexSkills.sh"
    find "$SCRIPTS_DEST" -name ".DS_Store" -delete 2>/dev/null || true
    echo "  ✅ scripts/setup/ (excluded: setupCodexSkills.sh)"
  fi
fi

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

# ── Remove .DS_Store ──
find "$DEST" -name ".DS_Store" -delete 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Done — shared skills copied to $DEST"
echo "   Excluded: finance/, GEMINI.md, scripts/ (personal)"
echo ""
echo "To overwrite: bash $(basename "$0") $TARGET --force"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
