#!/bin/bash

# Postman-to-Playwright Setup Script
# Copy postman migration skill ไปยัง target project
# เหตุผล: postman migration ไม่ใช่งาน AI-DLC → แยกออกมาเป็น standalone
#
# Prerequisites (ต้องติดตั้งก่อนรัน migration scripts):
#   - Node.js (v18+)
#   - npx tsx              → TypeScript runner (npx จะ auto-download)
#   - @inquirer/prompts    → npm install @inquirer/prompts (ใช้ใน readPostmanEnv.ts)

if [ -z "${1:-}" ]; then
    echo "❌ กรุณาระบุ folder (เช่น Automate2, AAA/Automate3, . สำหรับ root)"
    echo "Usage: $0 [PROJECT_NAME_OR_PATH|.|--self]"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Walk up from cwd to find project root
_dir="$(pwd)"
while [ "$_dir" != "/" ]; do
  if [ -d "$_dir/.git" ]; then
    BASE_DIR="$_dir"
    break
  fi
  _dir="$(dirname "$_dir")"
done
if [ -z "${BASE_DIR:-}" ]; then
  echo "⚠️  .git/ not found — falling back to cwd"
  BASE_DIR="$(pwd)"
fi

TARGET_DIR=""
FORCE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    *) TARGET_DIR="$1"; shift ;;
  esac
done

POSTMAN_SRC="$SKILLS_ROOT/postman-to-playwright/postman"

# --- validate source ---
if [ ! -d "$POSTMAN_SRC" ]; then
    echo "❌ Source not found: $POSTMAN_SRC"
    exit 1
fi

# ── Folder detection (same as setupMemory.sh) ──
cd "$BASE_DIR" || exit 1
source "$SCRIPT_DIR/_resolveTarget.sh"

ROOT_DIR="$(cd "$TARGET_DIR" && pwd)"

echo "📁 Working in: $ROOT_DIR"
echo ""

# --- check if skill already exists in ai-agent/skills/ ---
SKILL_IN_AIAGENT="$ROOT_DIR/ai-agent/skills/postman-to-playwright"
if [ -d "$SKILL_IN_AIAGENT" ]; then
    echo "ℹ️  postman-to-playwright skill already exists at:"
    echo "   $SKILL_IN_AIAGENT"
    echo ""
    echo "✅ ไม่ต้องติดตั้งเพิ่ม — skill พร้อมใช้งานแล้ว"
    exit 0
fi

# --- choose install location ---
echo "📦 ติดตั้ง postman-to-playwright ที่ไหน?"
echo "  [1] ai-agent/skills/postman-to-playwright/  (default — รวมกับ skills อื่น)"
echo "  [2] postman-to-playwright/                  (แยกออกมาระดับ project root)"
read -p "เลือก [1/2, default=1]: " install_choice
install_choice="${install_choice:-1}"

if [[ "$install_choice" == "2" ]]; then
    DEST_DIR="$ROOT_DIR/postman-to-playwright"
    echo "  → ติดตั้งที่: $DEST_DIR"
else
    DEST_DIR="$ROOT_DIR/ai-agent/skills/postman-to-playwright"
    echo "  → ติดตั้งที่: $DEST_DIR"
fi

# --- create target & copy ---
echo "📁 Creating $DEST_DIR ..."
mkdir -p "$DEST_DIR"

echo "📋 Copying postman skill → $DEST_DIR ..."
cp -R "$POSTMAN_SRC/"* "$DEST_DIR/" 2>/dev/null || true
# copy hidden files if any (except .DS_Store)
find "$POSTMAN_SRC" -maxdepth 1 -name '.*' ! -name '.DS_Store' ! -name '.' -exec cp -R {} "$DEST_DIR/" \; 2>/dev/null || true

echo ""
echo "✅ Done! postman-to-playwright created at:"
echo "   $DEST_DIR"
echo ""

# --- install dependencies ---
echo "📦 Installing dependencies..."
if [ -f "$ROOT_DIR/package.json" ]; then
    (cd "$ROOT_DIR" && npm install --save-dev @inquirer/prompts 2>/dev/null) && echo "  ✅ @inquirer/prompts installed" || echo "  ⚠️  npm install failed — install manually: npm install @inquirer/prompts"
else
    echo "  ⚠️  No package.json found — run 'npm init -y' first, then 'npm install @inquirer/prompts'"
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📖 NEXT STEPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Run migration scripts:"
echo "    # Step 1: Analyze Collection"
echo "    npx tsx $DEST_DIR/scripts/readPostmanCollection.ts \\"
echo "      \"postman/collections/xxx.postman_collection.json\""
echo ""
echo "    # Step 2: Analyze Environment (optional)"
echo "    npx tsx $DEST_DIR/scripts/readPostmanEnv.ts \\"
echo "      \"postman/environments/yyy.postman_environment.json\""
echo ""
echo "2️⃣  Ask AI to generate Playwright from the .md files:"
echo "    → \"Generate Playwright from collection.md — folder by folder\""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit 0
