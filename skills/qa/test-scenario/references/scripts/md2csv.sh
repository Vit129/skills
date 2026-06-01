#!/bin/bash
# MD to CSV Converter & Strict Validator
# Convert testScenario{id}.md → testScenario{id}.csv
# Hardcoded Validation Rules based on Checklist A, B, C

MD_FILE="$1"

if [ -z "$MD_FILE" ]; then
    echo "Usage: $0 <md_file>"
    exit 1
fi

if [ ! -f "$MD_FILE" ]; then
    echo "❌ File not found: $MD_FILE"
    exit 1
fi

CSV_FILE="${MD_FILE%.md}.csv"

python3 - "$MD_FILE" "$CSV_FILE" << 'PYTHON_SCRIPT'
import re
import sys
import csv

md_file = sys.argv[1]
csv_file = sys.argv[2]

# --- Helper Functions ---
def clean_path(path):
    """Ensure single backslash for paths"""
    if not path: return ""
    return path.replace('\\\\', '\\').strip()

def truncate(text, width):
    if not text: return ""
    text = str(text).replace('\n', ' ').replace('\r', '')
    if len(text) > width:
        return text[:width-3] + "..."
    return text

# --- SECTION 1: Parse MD File ---
with open(md_file, 'r', encoding='utf-8') as f:
    content = f.read()

ID_info = {}
id_match = re.search(r'testScenarioPbi(\d+)', md_file, re.IGNORECASE)
if not id_match:
    id_match = re.search(r'testScenario(\d+)', md_file, re.IGNORECASE)
if not id_match:
    id_match = re.search(r'ID[-_]?(\d+)', md_file, re.IGNORECASE)
if id_match: ID_info['id'] = id_match.group(1)

title_match = re.search(r'\*\*ID Title:\*\*\s*(.+)', content)
if title_match: ID_info['title'] = title_match.group(1).strip()

state_match = re.search(r'\*\*(?:State|Status):\*\*\s*(.+)', content, re.IGNORECASE)
if state_match:
    status = state_match.group(1).strip()
    ID_info['state'] = status

priority_match = re.search(r'\*\*Priority:\*\*\s*(\d+)', content)
if priority_match: ID_info['priority'] = priority_match.group(1).strip()

# Area & Iteration Paths
area_match = re.search(r'\*\*Area:\*\*\s*(.+)', content)
ID_info['area_path'] = clean_path(area_match.group(1).strip()) if area_match else ""

iteration_match = re.search(r'\*\*Iteration:\*\*\s*(.+)', content)
ID_info['iteration_path'] = clean_path(iteration_match.group(1).strip()) if iteration_match else ""

# ID Assigned To: Extract from ID Header
po_email_match = re.search(r'\*\*Assigned To \(PO\):\*\*\s*([^\n]+)', content)
ID_info['assigned_to'] = po_email_match.group(1).strip() if po_email_match else ''

# Tags: Extract from ID Header (e.g. **Tags:** 2026SP11)
tags_match = re.search(r'\*\*Tags:\*\*\s*([^\n]+)', content)
ID_info['tags'] = tags_match.group(1).strip() if tags_match else ''

# Test Scenario Assigned To: Extract from ### Assign To:
assigned_match = re.search(r'###\s+Assign To:\s*(.+)', content)
ts_assigned_to = assigned_match.group(1).strip() if assigned_match else ''

# --- SECTION 2: Parse Scenarios ---
test_scenarios = []
scenario_pattern = r'####\s+Test Scenario:\s+TS-\d+\s+-\s+(.+?)\n\n(.+?)(?=####|###|\Z)'
scenarios = re.findall(scenario_pattern, content, re.DOTALL)

for idx, (title, body) in enumerate(scenarios, 1):
    scenario = {
        'title': title.strip(),
        'pre_conditions': '', 'test_steps': '', 'expected_result': '',
        'priority': 'Medium', 'test_type': '', 'automation_status': 'Automatable',
        'cannot_automate_reason': '', 'assigned_to': ts_assigned_to, 'effort': '1'
    }
    
    def extract(pattern, key):
        m = re.search(pattern, body, re.DOTALL)
        if m: scenario[key] = m.group(1).strip()
            
    extract(r'\*\*Pre_conditions:\*\*\s*\n(<ul>.+?</ul>)', 'pre_conditions')
    extract(r'\*\*Test Steps with test data:\*\*\s*\n(.+?)(?=\n\*\*|\Z)', 'test_steps')
    extract(r'\*\*Expected test result:\*\*\s*\n(<ul>.+?</ul>)', 'expected_result')
    
    # Extract single-line fields (stop at newline)
    m = re.search(r'\*\*Test_type:\*\*\s*([^\n]+)', body)
    if m: scenario['test_type'] = m.group(1).strip()
    
    m = re.search(r'\*\*Priority level:\*\*\s*([^\n]+)', body)
    if m: scenario['priority'] = m.group(1).strip()
    
    m = re.search(r'\*\*Automation test status:\*\*\s*([^\n]+)', body)
    if m: scenario['automation_status'] = m.group(1).strip()
    
    m = re.search(r'\*\*Cannot automate reason:\*\*\s*([^\n]+)', body)
    if m: scenario['cannot_automate_reason'] = m.group(1).strip()
    
    m = re.search(r'\*\*Assigned to:\*\*\s*([^\n]+)', body)
    if m: scenario['assigned_to'] = m.group(1).strip()
    
    m = re.search(r'\*\*Effort:\*\*\s*(\d+)', body)
    if m: scenario['effort'] = m.group(1).strip()
    
    test_scenarios.append(scenario)

# --- SECTION 2.5: Clean Data (Force Single Line) ---
def clean_single_line(text, is_html=False):
    if not text: return ""
    # Remove carriage returns
    text = text.replace('\r', '')
    
    if is_html:
        # For HTML lists (ul/li), we want to remove newlines completely to make it one long string
        # pattern: </li>\n<li> -> </li><li>
        text = text.replace('\n', '')
    else:
        # For text content that might rely on newlines for readability (like Steps without <br>)
        # If it already has <br>, we can just strip \n. If it relies on \n, we might need to convert to <br> first.
        # Assuming MD input already has <br> or we want to strip \n for pure single line.
        # Let's replace \n with space if it's regular text, or nothing if it's weird.
        # Check if it looks like step data "1. xxx\n2. xxx" -> "1. xxx<br>2. xxx"
        if '\n' in text and not '<br>' in text:
             text = text.replace('\n', '<br>')
        else:
             text = text.replace('\n', '')
             
    return text.strip()

# --- SECTION 3: Generate Rows ---
rows = []
header = [
    'Work Item Type', 'ID', 'State', 'Title 1', 'Title 2', 'Priority',
    'Pre_conditions', 'Test steps with test data', 'Expected test result',
    'Actual test result', 'Test result', 'Priority level', 'Test_type',
    'Automation test status', 'Cannot automate reason', 'Reason',
    'Area Path', 'Iteration Path', 'Tags', 'Assigned To',
    'Remaining Work', 'Effort', 'Actual Effort'
]
rows.append(header)

ID_row = [
    'Product Backlog Item', ID_info.get('id', ''), ID_info.get('state', 'New'),
    clean_single_line(ID_info.get('title', '')), 
    '', 
    ID_info.get('priority', '2'),
    '', '', '', '', '', '', '', '', '', '', # Cols 7-16 Empty
    ID_info.get('area_path', ''), ID_info.get('iteration_path', ''),
    '', ID_info.get('assigned_to', ''), '', '', ''
]
rows.append(ID_row)

for scenario in test_scenarios:
    ts_row = [
        'Test Scenario', '', 'To Do', '', 
        clean_single_line(scenario['title']),
        '', 
        clean_single_line(scenario['pre_conditions'], is_html=True), 
        clean_single_line(scenario['test_steps']), 
        clean_single_line(scenario['expected_result'], is_html=True),
        '', 'Not start', scenario['priority'], scenario['test_type'],
        scenario['automation_status'], scenario['cannot_automate_reason'], '',
        ID_info.get('area_path', ''), ID_info.get('iteration_path', ''),
        ID_info.get('tags', ''), scenario.get('assigned_to', ''),
        scenario['effort'], scenario['effort'], ''
    ]
    rows.append(ts_row)

# --- SECTION 4: STRICT VALIDATION (Checklist A, B, C) ---
print("\n" + "="*60)
print("🧐 STRICT VALIDATION CHECK")
print("="*60)
errors = 0

# A. Header Validation
if len(header) != 23:
    print(f"❌ Header: Column count is {len(header)} (Expected 23)")
    errors += 1
else:
    print("✅ Header: 23 Columns OK")

# B. ID Row Validation
ID = rows[1]
if ID[0] != "Product Backlog Item":
    print(f"❌ ID Row: Col 1 is '{ID[0]}' (Expected 'Product Backlog Item')")
    errors += 1
if not ID[1]: print("❌ ID Row: Col 2 (ID) is empty"); errors += 1
if ID[4]: print("❌ ID Row: Col 5 (Title 2) must be empty"); errors += 1
# Check Cols 7-16 (Indices 6-15) must be empty
for i in range(6, 16):
    if ID[i]: print(f"❌ ID Row: Col {i+1} must be empty"); errors += 1
if '\\\\' in ID[16]: print("❌ ID Row: Area Path has double backslash"); errors += 1
if '\\\\' in ID[17]: print("❌ ID Row: Iteration Path has double backslash"); errors += 1

# C. Scenario Rows Validation
for idx, row in enumerate(rows[2:], 3):
    if row[0] != "Test Scenario":
        print(f"❌ Row {idx}: Col 1 is '{row[0]}' (Expected 'Test Scenario')")
        errors += 1
    if row[1]: print(f"❌ Row {idx}: Col 2 (ID) must be empty (Auto-gen)"); errors += 1
    if row[2] != "To Do": print(f"❌ Row {idx}: Col 3 is '{row[2]}' (Expected 'To Do')"); errors += 1
    if row[3]: print(f"❌ Row {idx}: Col 4 (Title 1) must be empty"); errors += 1
    if not row[4]: print(f"❌ Row {idx}: Col 5 (Title 2) is empty"); errors += 1
    if row[5]: print(f"❌ Row {idx}: Col 6 must be empty"); errors += 1
    
    # HTML Check (Basic) - Pre-conditions (Col 7 / Index 6)
    if row[6] and not (row[6].startswith("<ul>") or row[6].startswith("<ol>")):
        print(f"⚠️ Row {idx}: Pre_conditions format warning (Should start with <ul>/<ol>)")
        
    if row[9]: print(f"❌ Row {idx}: Col 10 (Actual Result) must be empty"); errors += 1
    if row[10] != "Not start": print(f"❌ Row {idx}: Col 11 is '{row[10]}' (Expected 'Not start')"); errors += 1
    
    if '\\\\' in row[16]: print(f"❌ Row {idx}: Area Path has double backslash"); errors += 1
    if '\\\\' in row[17]: print(f"❌ Row {idx}: Iteration Path has double backslash"); errors += 1
    
    # Col 19: Assigned To (QA) - ต้องไม่ว่าง
    if not row[19] or row[19].strip() == "":
        print(f"❌ Row {idx}: Col 20 (Assigned To) is empty (required for Test Scenario)")
        errors += 1

if errors == 0:
    print("✅ All Validation Checks Passed!")
else:
    print(f"❌ Found {errors} Validation Errors!")

# --- SECTION 5: Write CSV ---
with open(csv_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

# --- SECTION 6: Display Horizontal Table ---
print("\n" + "="*140)
print(f"📊 CSV Generated: {csv_file}")
print("="*140)
print(f"{'Type':<22} | {'ID':<8} | {'State':<10} | {'Title':<40} | {'Pri':<5} | {'Type':<8} | {'Auto':<12} | {'Assign':<20}")
print("-" * 140)
print(f"{ID_row[0]:<22} | {ID_row[1]:<8} | {ID_row[2]:<10} | {truncate(ID_row[3], 40):<40} | {ID_row[5]:<5} | {'-':<8} | {'-':<12} | {truncate(ID_row[19], 20):<20}")
for i, sc in enumerate(test_scenarios, 1):
    print(f"{'Test Scenario':<22} | {i:<8} | {'To Do':<10} | {truncate(sc['title'], 40):<40} | {truncate(sc['priority'], 5):<5} | {sc['test_type']:<8} | {truncate(sc['automation_status'], 12):<12} | {truncate(sc.get('assigned_to', ''), 20):<20}")
print("-" * 140)
print(f"✅ Total Scenarios: {len(test_scenarios)}")
print("="*140)

sys.exit(0 if errors == 0 else 1)
PYTHON_SCRIPT
