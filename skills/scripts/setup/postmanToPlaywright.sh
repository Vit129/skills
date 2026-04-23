#!/bin/bash

# Postman-to-Playwright Setup Script
# Copy postman migration skill ไปยัง target project
# เหตุผล: postman migration ไม่ใช่งาน AI-DLC → แยกออกมาเป็น standalone
#
# Prerequisites (ต้องติดตั้งก่อนรัน migration scripts):
#   - Node.js (v18+)
#   - npx tsx              → TypeScript runner (npx จะ auto-download)
#   - @inquirer/prompts    → npm install @inquirer/prompts (ใช้ใน readPostmanEnv.ts)

if [ -z "$1" ]; then
    echo "❌ กรุณาระบุ folder (เช่น Automate2, AAA/Automate3)"
    echo "Usage: $0 <PROJECT_FOLDER>"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
POSTMAN_SRC="$SKILLS_ROOT/postman-to-playwright/postman"

# --- validate source ---
if [ ! -d "$POSTMAN_SRC" ]; then
    echo "❌ Source not found: $POSTMAN_SRC"
    exit 1
fi

cd "$ROOT_DIR" || exit 1
TARGET_DIR="$1"

# Folder detection logic (same pattern as setupTests.sh)
if [[ "$TARGET_DIR" == *"/"* ]] || [ -d "$TARGET_DIR" ]; then
    if [ ! -d "$TARGET_DIR" ]; then
        echo "❌ Folder $TARGET_DIR ไม่พบ"
        exit 1
    fi
    echo "📁 Using: $TARGET_DIR"
else
    echo "🔍 Searching for folder: $TARGET_DIR"
    FOUND_PATHS=($(find . -maxdepth 3 -type d -name "$TARGET_DIR" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/tests/*" 2>/dev/null))

    if [ ${#FOUND_PATHS[@]} -eq 0 ]; then
        echo "❌ Folder $TARGET_DIR ไม่พบ"
        exit 1
    elif [ ${#FOUND_PATHS[@]} -eq 1 ]; then
        TARGET_DIR="${FOUND_PATHS[0]#./}"
        echo "✅ Found: $TARGET_DIR"
    else
        echo "⚠️  พบหลายตำแหน่ง:"
        for i in "${!FOUND_PATHS[@]}"; do
            echo "  [$((i+1))] ${FOUND_PATHS[$i]#./}"
        done
        read -p "เลือกตำแหน่ง (1-${#FOUND_PATHS[@]}): " choice

        if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le ${#FOUND_PATHS[@]} ]; then
            TARGET_DIR="${FOUND_PATHS[$((choice-1))]#./}"
            echo "✅ Selected: $TARGET_DIR"
        else
            echo "❌ Invalid choice"
            exit 1
        fi
    fi
fi

cd "$TARGET_DIR" || exit 1
echo "📁 Working in: $(pwd)"
echo ""

# --- create target & copy ---
DEST_DIR="postman-to-playwright"
echo "📁 Creating $DEST_DIR ..."
mkdir -p "$DEST_DIR"

echo "📋 Copying postman skill → $DEST_DIR ..."
cp -R "$POSTMAN_SRC/"* "$DEST_DIR/" 2>/dev/null || true
# copy hidden files if any (except .DS_Store)
find "$POSTMAN_SRC" -maxdepth 1 -name '.*' ! -name '.DS_Store' ! -name '.' -exec cp -R {} "$DEST_DIR/" \; 2>/dev/null || true

echo ""
echo "✅ Done! postman-to-playwright created at:"
echo "   $(pwd)/$DEST_DIR"
echo ""

# --- install dependencies ---
echo "📦 Installing dependencies..."
if [ -f "package.json" ]; then
    npm install --save-dev @inquirer/prompts 2>/dev/null && echo "  ✅ @inquirer/prompts installed" || echo "  ⚠️  npm install failed — install manually: npm install @inquirer/prompts"
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
