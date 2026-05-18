---
name: azure-devops-bridge
description: >
  Bridge between Azure DevOps and AIDLC workflow.
  Triggers: "ทำ PBI #xxx", "ดู Bug #xxx", "upload TS", "close PBI",
  "sync Azure", "sprint report", "PBI xxx", "bug workflow"
  This skill uses MCP azure-devops tools directly — no scripts needed.
---

# Azure DevOps Bridge

> เชื่อม Azure DevOps ↔ AIDLC workflow ผ่าน MCP tools
> ไม่ต้องใช้ hook — agent detect PBI/Bug ID จาก user message แล้วทำเอง

---

## Trigger Detection

เมื่อ user message มี pattern เหล่านี้ → activate skill นี้:

| Pattern | Action |
|---------|--------|
| `PBI #xxx` หรือ `ทำ PBI xxx` | → fetch-pbi → AIDLC |
| `Bug #xxx` หรือ `ดู Bug xxx` หรือ `แก้ Bug xxx` | → bug-workflow |
| `upload TS` หรือ `อัพ test scenario` | → upload-ts |
| `close PBI` หรือ `ปิด PBI xxx` | → close-pbi |
| `sprint report` หรือ `สรุป sprint` | → sprint-report |
| Azure DevOps URL (dev.azure.com/...) | → extract ID → route |

---

## Workflows

### 1. Fetch PBI → AIDLC (fetch-pbi)

**When:** User ระบุ PBI ID หรือ Azure URL ที่มี workitem ID

**Steps:**

```
1. MCP: get_work_item(id, expand="relations")
   → ดึง Title, Description, AcceptanceCriteria, State, Relations

2. Extract:
   - system = AreaPath.split('\\')[0] หรือ project name
   - feature = PBI Title (kebab-case)
   - children = filter relations → Bug, Task, Test Scenario

3. Format PBI data เป็น AIDLC input:
   - Description → Goal + Persona + Requirements
   - AcceptanceCriteria → AC list (Given/When/Then)
   - Children summary → existing work

4. Route to AIDLC:
   - ถ้า .aidlc/[system]/[feature]/ มีอยู่แล้ว → /resume
   - ถ้าไม่มี → Phase 0 (Lite Inception หรือ Full ตาม mode)

5. Store PBI metadata ใน .aidlc/[system]/[feature]/planning/decisions/pbi-source.md:
   - PBI ID, URL, Title, State, Priority
   - Linked Bugs, Tasks, Test Scenarios
```

**MCP Tools Used:**
- `wit_get_work_item` (expand=relations)
- `wit_get_work_items_batch_by_ids` (for children details)

---

### 2. Upload Test Scenarios (upload-ts)

**When:** Phase 2.2 (Test Case Design) เสร็จ + CSV approved แล้ว

**⚡ ใช้ Script (ไม่ใช้ MCP) — ประหยัด token 100%**

```bash
npx ts-node --project ai-agent/scripts/azure-devops/tsconfig.json \
  ai-agent/scripts/azure-devops/upload-ts/uploadTsToAdo.ts \
  --csv <path-to-test-scenarios-api.csv> \
  --pbi-id <PBI_ID> \
  --ado-project "<project>" \
  --company
```

**Script:** `ai-agent/scripts/azure-devops/upload-ts/uploadTsToAdo.ts`

**Steps:**

```
1. Parse CSV → extract Test Scenario rows
   (Title 2, Pre_conditions, Test steps, Expected result,
    Priority level, Test_type, Automation status, Effort)

2. For each TS:
   a. POST /wit/workitems/$Test Scenario (fields ครบ)
   b. PATCH /wit/workitems/{TS_ID} → add Hierarchy-Reverse link to PBI

3. Output: <csv-dir>/ts-azure-ids.md
   → TS title → Azure ID mapping (ใช้ใน queryTestScenarios.ts ต่อ)
```

**Dry run (ทดสอบก่อน upload จริง):**
```bash
... uploadTsToAdo.ts --csv <path> --pbi-id <id> --ado-project <project> --dry-run
```

**Required CSV columns:**
`Work Item Type` | `Title 2` | `Pre_conditions` | `Test steps with test data` |
`Expected test result` | `Priority level` | `Test_type` | `Automation test status` |
`Effort` | `Iteration Path` | `Area Path`

**Output file:** `<csv-dir>/ts-azure-ids.md` — ID mapping สำหรับ automation workflow

---

### 3. Bug Workflow (bug-workflow)

**When:** User ระบุ Bug ID หรือ "ดู Bug ใน PBI xxx"

**Flow:**

```
┌─────────────────────────────────────────────────┐
│ 1. Fetch Bug details                            │
│    MCP: get_work_item(bugId, expand=relations)  │
│    → Title, Repro Steps, State, Parent PBI      │
├─────────────────────────────────────────────────┤
│ 2. Analyze                                      │
│    → อ่าน Description + Repro Steps             │
│    → ดู Parent PBI context (AC ที่เกี่ยวข้อง)    │
│    → ดู linked Test Scenarios                   │
├─────────────────────────────────────────────────┤
│ 3. Plan Fix                                     │
│    → ระบุ root cause                            │
│    → เสนอ fix approach                          │
│    → ระบุ test ที่ต้อง verify                    │
├─────────────────────────────────────────────────┤
│ 4. Implement Fix (ถ้า user approve)             │
│    → แก้ code                                   │
│    → run test ที่เกี่ยวข้อง                      │
│    → commit                                     │
├─────────────────────────────────────────────────┤
│ 5. Update Azure                                 │
│    MCP: update_work_item(bugId,                 │
│      state → "Resolved" หรือ "Closed")          │
│    MCP: add_work_item_comment(bugId,            │
│      "Fixed in commit {hash}. Root cause: ...")  │
├─────────────────────────────────────────────────┤
│ 6. Verify                                       │
│    → re-run related test scenarios              │
│    → update TS state if needed                  │
└─────────────────────────────────────────────────┘
```

**MCP Tools Used:**
- `wit_get_work_item` (expand=relations)
- `wit_get_work_items_batch_by_ids` (children)
- `wit_update_work_item` (state change)
- `wit_add_work_item_comment` (fix details)

---

### 4. Close PBI (close-pbi)

**When:** All tasks done, all tests pass, PR merged

**Steps:**

```
1. MCP: get_work_item(pbiId, expand=relations)
   → check all children states

2. Validate:
   - All Tasks = Done ✅
   - All Test Scenarios = Done/Pass ✅
   - All Bugs = Closed/Resolved ✅
   - (ถ้ามี item ที่ยังไม่ done → แจ้ง user)

3. MCP: update_work_item(pbiId, state → "Done")

4. MCP: add_work_item_comment(pbiId,
     "PBI completed. Summary: X tasks, Y test scenarios, Z bugs resolved.")

5. Update .aidlc/ progress files
```

**MCP Tools Used:**
- `wit_get_work_item`
- `wit_get_work_items_batch_by_ids`
- `wit_update_work_item`
- `wit_add_work_item_comment`

---

### 5. Sprint Report (sprint-report)

**When:** "สรุป sprint" หรือ "sprint report"

**Steps:**

```
1. ถ้ามี querySprintReport.ts → แนะนำ run script
   Path: ai-agent/scripts/azure-devops/query-sprint-report/querySprintReport.ts

2. หรือ ใช้ MCP tools โดยตรง:
   - list_team_iterations(project, team, timeframe="current")
   - get_work_items_for_iteration(iterationId)
   - get_work_items_batch_by_ids(ids)
   → format เป็น MD report ใน chat

3. Output: MD with 2 sections
   - Section 1: PBI ↔ Test Scenario mapping
   - Section 2: Bug mapping (PBI → Bug → Task + TS)
```

---

## Integration with AIDLC

### Phase 0 (Lite Inception) — Enhanced with Azure Data

เมื่อ user ระบุ PBI ID:
- ไม่ต้องถาม requirements — ดึงจาก Azure
- Description → Goal + Persona + Requirements
- AcceptanceCriteria → AC list
- ข้าม user-stories.md generation ถ้า AC ครบอยู่แล้ว

### Phase 2.2 (Test Case Design) — Auto-upload

หลัง test-scenarios-*.md เสร็จ:
- ถาม user: "อัพ Test Scenario ขึ้น Azure ไหม?"
- ถ้า Yes → upload-ts workflow
- ถ้า No → skip (ทำทีหลังได้)

### Phase 3.3 (PR) — Link to PBI

หลัง PR created:
- MCP: link_work_item_to_pull_request(pbiId, prId, repoId)
- MCP: update_work_item(pbiId, state → "Developing" หรือ "Testing")

---

## MCP Tool Reference

| Tool | ใช้ตอนไหน |
|------|-----------|
| `wit_get_work_item` | Fetch PBI/Bug details |
| `wit_get_work_items_batch_by_ids` | Batch fetch children |
| `wit_add_child_work_items` | Upload TS to Azure |
| `wit_update_work_item` | Change state (Active→Done) |
| `wit_add_work_item_comment` | Add fix/completion notes |
| `wit_link_work_item_to_pull_request` | Link PR to PBI |
| `wit_create_work_item` | Create new Bug |
| `wit_query_by_wiql` | Custom queries |
| `work_list_team_iterations` | Get current sprint |
| `wit_get_work_items_for_iteration` | Sprint work items |

---

## Rules

1. **Always fetch fresh data** — ไม่ cache PBI state, ดึงใหม่ทุกครั้ง
2. **Confirm before state change** — ถาม user ก่อน update state ใน Azure
3. **Comment on every state change** — ทุกครั้งที่เปลี่ยน state ต้อง add comment
4. **PBI source file** — ทุก feature ที่มาจาก Azure ต้องมี `pbi-source.md`
5. **Don't close incomplete** — ถ้ามี child ที่ยัง active → ห้าม close PBI
6. **Language** — Comments ใน Azure เป็น English, chat กับ user เป็น Thai
