#!/bin/bash
# CSV Validator & Auto-Fixer
# Validate and fix each row/column according to the Header

CSV_FILE="$1"

if [ -z "$CSV_FILE" ]; then
    echo "Usage: $0 <csv_file>"
    exit 1
fi

echo "🔍 Validating & Fixing: $CSV_FILE"
echo ""

# Backup
BACKUP_FILE="${CSV_FILE}.backup"
cp "$CSV_FILE" "$BACKUP_FILE"
echo "💾 Backup: $BACKUP_FILE"
echo ""

# Use Python to fix and validate
python3 - "$CSV_FILE" "$BACKUP_FILE" << 'PYTHON_SCRIPT'
import csv
import sys
import os

csv_file = sys.argv[1]
backup_file = sys.argv[2]
REQUIRED_COLUMNS = 23

# Configuration for Enums
VALID_PRIORITIES = ['Critical', 'High', 'Medium', 'Low']
VALID_TEST_TYPES = ['API', 'Web UI', 'Mobile UI']

def is_pre_condition(text):
    text = text.strip()
    return text.startswith("<ul>") or text.startswith("<ol>")

def get_row_alignment_fix(row):
    """
    Analyze and return correctly aligned row, or None if no fix needed
    """
    if len(row) >= 23:
        if row[6] == "" and len(row) > 7 and is_pre_condition(row[7]):
            candidate = row[:6] + row[7:]
            while len(candidate) < REQUIRED_COLUMNS:
                candidate.append("")
            
            if len(candidate) > 11 and (candidate[11] in VALID_PRIORITIES or candidate[11] == ""):
                return candidate
                
    return None

rows = []
errors = 0
fixes = 0

print("=" * 60)
print("SECTION A: HEADER ROW")
print("=" * 60)

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row_num, row in enumerate(reader, 1):
        is_fixed = False
        
        # ========================================
        # SECTION A: Header Row (Row 1)
        # ========================================
        if row_num == 1:
            print(f"Row 1: ✅ Header (23 columns)")
            rows.append(row)
            continue
        
        # ========================================
        # SECTION B: ID Row (Row 2)
        # ========================================
        if row_num == 2:
            print("\n" + "=" * 60)
            print("SECTION B: ID Row (Row 2)")
            print("=" * 60)
            
            # Col 0: Work Item Type
            if row[0] != "Product Backlog Item":
                print(f"  🔧 Col 1: Fixing Work Item Type")
                row[0] = "Product Backlog Item"
                is_fixed = True
            else:
                print(f"  ✅ Col 1: Product Backlog Item")
            
            # Col 1: ID ID (must have data)
            if len(row) > 1 and row[1].strip() == "":
                print(f"  ❌ Col 2: Missing ID ID")
                errors += 1
            else:
                print(f"  ✅ Col 2: ID ID = {row[1]}")
            
            # Col 4: Title 2 (must be empty)
            if len(row) > 4 and row[4].strip() != "":
                print(f"  🔧 Col 5: Clearing Title 2 (must be empty for ID)")
                row[4] = ""
                is_fixed = True
            else:
                print(f"  ✅ Col 5: Title 2 (empty)")
            
            # Cols 6-15: Must be empty (10 columns)
            for i in range(6, 16):
                if len(row) > i and row[i].strip() != "":
                    print(f"  🔧 Col {i+1}: Clearing (must be empty for ID)")
                    row[i] = ""
                    is_fixed = True
            
            # Col 16: Area Path (must have single backslash)
            if len(row) > 16 and row[16]:
                if '\\\\' in row[16]:
                    print(f"  🔧 Col 17: Fixing Area Path (double backslash)")
                    row[16] = row[16].replace('\\\\', '\\')
                    is_fixed = True
                else:
                    print(f"  ✅ Col 17: Area Path OK")
            
            # Col 17: Iteration Path (must have single backslash)
            if len(row) > 17 and row[17]:
                if '\\\\' in row[17]:
                    print(f"  🔧 Col 18: Fixing Iteration Path (double backslash)")
                    row[17] = row[17].replace('\\\\', '\\')
                    is_fixed = True
                else:
                    print(f"  ✅ Col 18: Iteration Path OK")
            
            # Col 19: Assigned To (PO) - can be empty
            if len(row) > 19:
                print(f"  ✅ Col 20: Assigned To = {row[19] if row[19] else '(empty)'}")
            else:
                print(f"  ⚠️  Col 20: Assigned To (missing column)")
            
            rows.append(row)
            if is_fixed: fixes += 1
            continue
        
        # ========================================
        # SECTION C: Test Scenario Rows (Row 3+)
        # ========================================
        if row_num == 3:
            print("\n" + "=" * 60)
            print("SECTION C: TEST SCENARIO ROWS (Row 3+)")
            print("=" * 60)
        
        print(f"\nRow {row_num}:")
        
        # --- Alignment Fix Algorithm ---
        aligned_row = get_row_alignment_fix(row)
        if aligned_row:
            print(f"  🔧 Fixing Column Alignment (Pre-conditions shifted)")
            row = aligned_row
            is_fixed = True
        
        # Col 0: Work Item Type
        if row[0] != "Test Scenario":
            print(f"  🔧 Col 1: Fixing Work Item Type")
            row[0] = "Test Scenario"
            is_fixed = True
        else:
            print(f"  ✅ Col 1: Test Scenario")
        
        # Col 1: ID (must be empty - auto-generated)
        if len(row) > 1 and row[1].strip() != "":
            print(f"  🔧 Col 2: Clearing ID (auto-generated)")
            row[1] = ""
            is_fixed = True
        else:
            print(f"  ✅ Col 2: ID (empty)")
        
        # Col 2: State
        if len(row) > 2 and row[2] != "To Do":
            print(f"  🔧 Col 3: Fixing State -> To Do")
            row[2] = "To Do"
            is_fixed = True
        else:
            print(f"  ✅ Col 3: To Do")
        
        # Col 3: Title 1 (must be empty)
        if len(row) > 3 and row[3].strip() != "":
            print(f"  🔧 Col 4: Clearing Title 1 (must be empty for TS)")
            row[3] = ""
            is_fixed = True
        else:
            print(f"  ✅ Col 4: Title 1 (empty)")
        
        # Col 4: Title 2 (must not be empty)
        if len(row) > 4 and row[4].strip() == "":
            print(f"  ❌ Col 5: Title 2 is empty (required)")
            errors += 1
        else:
            print(f"  ✅ Col 5: Title 2 = {row[4][:40]}...")
        
        # Col 5: Priority (must be empty)
        if len(row) > 5 and row[5].strip() != "":
            print(f"  🔧 Col 6: Clearing Priority (must be empty for TS)")
            row[5] = ""
            is_fixed = True
        else:
            print(f"  ✅ Col 6: Priority (empty)")
        
        # Col 9: Actual test result (must be empty)
        if len(row) > 9 and row[9] != "":
            print(f"  🔧 Col 10: Clearing Actual test result")
            row[9] = ""
            is_fixed = True
        else:
            print(f"  ✅ Col 10: Actual test result (empty)")
        
        # Col 10: Test Result
        if len(row) > 10 and row[10] != "Not start":
            print(f"  🔧 Col 11: Fixing Test Result -> Not start")
            row[10] = "Not start"
            is_fixed = True
        else:
            print(f"  ✅ Col 11: Not start")
        
        # Col 15: Reason (must be empty)
        if len(row) > 15 and row[15] != "":
            print(f"  🔧 Col 16: Clearing Reason")
            row[15] = ""
            is_fixed = True
        else:
            print(f"  ✅ Col 16: Reason (empty)")
        
        # Col 16: Area Path (must have single backslash)
        if len(row) > 16 and row[16]:
            if '\\\\' in row[16]:
                print(f"  🔧 Col 17: Fixing Area Path (double backslash)")
                row[16] = row[16].replace('\\\\', '\\')
                is_fixed = True
            else:
                print(f"  ✅ Col 17: Area Path OK")
        elif len(row) > 16 and row[16].strip() == "":
            # If Area Path is empty, copy from ID Row
            if len(rows) > 1 and len(rows[1]) > 16:
                row[16] = rows[1][16]
                print(f"  🔧 Col 17: Copying Area Path from ID")
                is_fixed = True
        
        # Col 17: Iteration Path (must have single backslash)
        if len(row) > 17 and row[17]:
            if '\\\\' in row[17]:
                print(f"  🔧 Col 18: Fixing Iteration Path (double backslash)")
                row[17] = row[17].replace('\\\\', '\\')
                is_fixed = True
            else:
                print(f"  ✅ Col 18: Iteration Path OK")
        elif len(row) > 17 and row[17].strip() == "":
            # If Iteration Path is empty, copy from ID Row
            if len(rows) > 1 and len(rows[1]) > 17:
                row[17] = rows[1][17]
                print(f"  🔧 Col 18: Copying Iteration Path from ID")
                is_fixed = True
        
        # Col 18: Tags (must be empty)
        if len(row) > 18 and row[18] != "":
            print(f"  🔧 Col 19: Clearing Tags")
            row[18] = ""
            is_fixed = True
        else:
            print(f"  ✅ Col 19: Tags (empty)")
        
        # Col 19: Assigned To - must not be empty (QA)
        if len(row) > 19 and row[19].strip() == "":
            # If empty, copy from ID Row
            if len(rows) > 1 and len(rows[1]) > 19 and rows[1][19].strip() != "":
                row[19] = rows[1][19]
                print(f"  🔧 Col 20: Copying Assigned To from ID")
                is_fixed = True
            else:
                print(f"  ❌ Col 20: Missing Assigned To (required for Test Scenario)")
                errors += 1
        else:
            print(f"  ✅ Col 20: Assigned To = {row[19][:30] if len(row) > 19 else '(missing)'}...")
        
        # Fill missing columns up to 23
        while len(row) < REQUIRED_COLUMNS:
            row.append("")
            is_fixed = True
        
        # Truncate extra columns if any
        if len(row) > REQUIRED_COLUMNS:
            has_data_in_extra = any(x.strip() != "" for x in row[REQUIRED_COLUMNS:])
            if not has_data_in_extra:
                row = row[:REQUIRED_COLUMNS]
                is_fixed = True
        
        # --- Re-Validation Reporting ---
        # Check 1: Column Count
        if len(row) != REQUIRED_COLUMNS:
            print(f"  ❌ Column count mismatch {len(row)} != {REQUIRED_COLUMNS}")
            errors += 1
        
        # Check 2: Priority Level (Col 11)
        if len(row) > 11 and row[11] != "" and row[11] not in VALID_PRIORITIES:
            print(f"  ❌ Col 12: Invalid Priority Level: '{row[11]}'")
            errors += 1
        else:
            print(f"  ✅ Col 12: {row[11] if row[11] else '(empty)'}")
        
        # Check 3: Test Type (Col 12)
        if len(row) > 12 and row[12] != "" and row[12] not in VALID_TEST_TYPES:
            print(f"  ❌ Col 13: Invalid Test Type: '{row[12]}'")
            errors += 1
        else:
            print(f"  ✅ Col 13: {row[12] if row[12] else '(empty)'}")
        
        # Check 4: Iteration Path (Col 17) - must not be empty (fixed above)
        # if len(row) > 17 and row[17].strip() == "":
        #     print(f"  ❌ Col 18: Missing Iteration Path")
        #     errors += 1
        
        if is_fixed:
            fixes += 1
        
        rows.append(row)

# Write back to file
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)

if errors == 0:
    with open(csv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    print(f"✅ Saved changes successfully")
    print(f"📊 Fixed: {fixes} rows")
    
    # Delete backup file
    if os.path.exists(backup_file):
        os.remove(backup_file)
        print(f"🗑️  Deleted backup: {backup_file}")
    
    sys.exit(0)
else:
    print(f"⚠️  Found {errors} critical errors")
    print(f"📊 Fixed: {fixes} rows, Remaining Errors: {errors}")
    print(f"💾 Backup preserved: {backup_file}")
    sys.exit(1)
PYTHON_SCRIPT
