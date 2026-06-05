#!/bin/bash
# _resolveTarget.sh — Shared folder detection logic
# Sourced by setupMemory.sh and setupKiro.sh
# Expects: TARGET_DIR set, running inside BASE_DIR

if [[ "$TARGET_DIR" == "." ]] || [[ "$TARGET_DIR" == "--self" ]]; then
    TARGET_DIR="."
    echo "📁 Using workspace root: $BASE_DIR"
elif [[ "$TARGET_DIR" == /* ]]; then
    if [ ! -d "$TARGET_DIR" ]; then
        echo "❌ Folder $TARGET_DIR ไม่พบ"
        exit 1
    fi
    echo "📁 Using absolute path: $TARGET_DIR"
elif [[ "$TARGET_DIR" == *"/"* ]] || [ -d "$TARGET_DIR" ]; then
    if [ ! -d "$TARGET_DIR" ]; then
        echo "❌ Folder $TARGET_DIR ไม่พบ"
        exit 1
    fi
    echo "📁 Using: $TARGET_DIR"
else
    echo "🔍 Searching for folder: $TARGET_DIR"
    FOUND_PATHS=()
    for depth in 1 2 3 4; do
        while IFS= read -r -d '' p; do
            FOUND_PATHS+=("$p")
        done < <(find . -mindepth "$depth" -maxdepth "$depth" -type d -name "$TARGET_DIR" \
            -not -path "*/node_modules/*" \
            -not -path "*/.git/*" \
            -not -path "*/tests/*" \
            -not -path "*/agent-memory/*" \
            -print0 2>/dev/null)
    done

    if [ ${#FOUND_PATHS[@]} -eq 0 ]; then
        echo "❌ Folder $TARGET_DIR ไม่พบ"
        exit 1
    elif [ ${#FOUND_PATHS[@]} -eq 1 ]; then
        TARGET_DIR="${FOUND_PATHS[0]#./}"
        echo "✅ Found: $TARGET_DIR"
    else
        echo "⚠️  พบหลายตำแหน่ง (เรียงจาก root → ลึก):"
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
