---
name: azure-devops-bridge
description: >
  Bridge between Azure DevOps and AIDLC workflow.
  Triggers: "PBI #xxx", "Bug #xxx", "upload TS", "close PBI",
  "sync Azure", "sprint report", "PBI xxx", "bug workflow"
  This skill uses MCP azure-devops tools directly — no scripts needed.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Azure DevOps Bridge

> Connects Azure DevOps ↔ AIDLC workflow via MCP tools.
> No hook needed — agent detects PBI/Bug ID from user message and acts automatically.

---

## Trigger Detection

When a user message matches any of these patterns → activate this skill:

| Pattern | Action |
|---------|--------|
| `PBI #xxx` | → fetch-pbi → AIDLC |
| `Bug #xxx` | → bug-workflow |
| `upload TS` | → upload-ts |
| `upload test result` or `แปะผล test` | → `tooling/upload-test-result/` |
| `close PBI` | → close-pbi |
| `sprint report` | → sprint-report |
| `pipeline status` or `build status` or `CI status` | → pipeline-status |
| `pipeline failed` or `build failed` or `CI error` | → pipeline-fix |
| Azure DevOps URL (dev.azure.com/...) | → extract ID → route |

---

## Workflows

### 1. Fetch PBI → AIDLC (fetch-pbi)

**When:** User specifies a PBI ID or Azure URL containing a work item ID

**Steps:**

```
1. MCP: get_work_item(id, expand="relations")
   → Fetch Title, Description, AcceptanceCriteria, State, Relations

2. Extract:
   - system = AreaPath.split('\\')[0] or project name
   - feature = PBI Title (kebab-case)
   - children = filter relations → Bug, Task, Test Scenario

3. Format PBI data as AIDLC input:
   - Description → Goal + Persona + Requirements
   - AcceptanceCriteria → AC list (Given/When/Then)
   - Children summary → existing work

4. Route to AIDLC:
   - If .aidlc/[system]/[feature]/ already exists → /resume
   - If not → Phase 0 (Lite Inception or Full depending on mode)

5. Store PBI metadata in .aidlc/[system]/[feature]/planning/decisions/pbi-source.md:
   - PBI ID, URL, Title, State, Priority
   - Linked Bugs, Tasks, Test Scenarios
```

**MCP Tools Used:**
- `wit_get_work_item` (expand=relations)
- `wit_get_work_items_batch_by_ids` (for children details)

---

### 2. Upload Test Scenarios (upload-ts)

**When:** Phase 2.2 (Test Case Design) is complete and CSV is approved

**⚡ Uses Script (not MCP) — saves 100% token cost**

```bash
npx ts-node --project ai-agent/scripts/azure-devops/tsconfig.json \
  ai-agent/scripts/azure-devops/upload-ts/uploadTsToAdo.ts \
  --csv <path-to-test-scenarios-api.csv> \
  --pbi-id <PBI_ID> \
  --ado-project "<project>" \
  --company Your Company
```

**Script:** `ai-agent/scripts/azure-devops/upload-ts/uploadTsToAdo.ts`

**Steps:**

```
1. Parse CSV → extract Test Case rows
   (Title 2, Pre_conditions, Test steps, Expected result,
    Priority level, Test_type, Automation status, Effort)

2. For each TS:
   a. POST /wit/workitems/$Test Case (all fields)
   b. PATCH /wit/workitems/{TS_ID} → add Hierarchy-Reverse link to PBI

3. Output: <csv-dir>/ts-azure-ids.md
   → TS title → Azure ID mapping (used in queryTestScenarios.ts next)
```

**Dry run (test before actual upload):**
```bash
... uploadTsToAdo.ts --csv <path> --pbi-id <id> --ado-project <project> --dry-run
```

**Required CSV columns:**
`Work Item Type` | `Title 2` | `Pre_conditions` | `Test steps with test data` |
`Expected test result` | `Priority level` | `Test_type` | `Automation test status` |
`Effort` | `Iteration Path` | `Area Path`

**Output file:** `<csv-dir>/ts-azure-ids.md` — ID mapping for automation workflow

---

### 3. Bug Workflow (bug-workflow)

**When:** User specifies a Bug ID or "view Bugs in PBI xxx"

**Flow:**

```
┌─────────────────────────────────────────────────┐
│ 1. Fetch Bug details                            │
│    MCP: get_work_item(bugId, expand=relations)  │
│    → Title, Repro Steps, State, Parent PBI      │
├─────────────────────────────────────────────────┤
│ 2. Analyze                                      │
│    → Read Description + Repro Steps             │
│    → Review Parent PBI context (related ACs)    │
│    → Review linked Test Scenarios               │
├─────────────────────────────────────────────────┤
│ 3. Plan Fix                                     │
│    → Identify root cause                        │
│    → Propose fix approach                       │
│    → Identify tests that need to verify         │
├─────────────────────────────────────────────────┤
│ 4. Implement Fix (if user approves)             │
│    → Fix code                                   │
│    → Run related tests                          │
│    → Commit                                     │
├─────────────────────────────────────────────────┤
│ 5. Update Azure                                 │
│    MCP: update_work_item(bugId,                 │
│      state → "Resolved" or "Closed")            │
│    MCP: add_work_item_comment(bugId,            │
│      "Fixed in commit {hash}. Root cause: ...")  │
├─────────────────────────────────────────────────┤
│ 6. Verify                                       │
│    → Re-run related test scenarios              │
│    → Update TS state if needed                  │
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
   → Check all children states

2. Validate:
   - All Tasks = Done ✅
   - All Test Scenarios = Done/Pass ✅
   - All Bugs = Closed/Resolved ✅
   - (If any item is not done → notify user)

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

**When:** "sprint report" or "sprint summary"

**Steps:**

```
1. If querySprintReport.ts exists → recommend running the script
   Path: ai-agent/scripts/azure-devops/query-sprint-report/querySprintReport.ts

2. Or use MCP tools directly:
   - list_team_iterations(project, team, timeframe="current")
   - get_work_items_for_iteration(iterationId)
   - get_work_items_batch_by_ids(ids)
   → Format as MD report in chat

3. Output: MD with 2 sections
   - Section 1: PBI ↔ Test Scenario mapping
   - Section 2: Bug mapping (PBI → Bug → Task + TS)
```

---

### 6. Pipeline Status (pipeline-status)

> **⚡ Delegated to:** `tooling/query-pipeline/SKILL.md`

**When:** "pipeline status", "build status", "CI status", "view latest build"

**Action:** Read and follow `tooling/query-pipeline/SKILL.md` — it contains all scripts, workflows, URLs, and common error patterns.

---

### 7. Pipeline Diagnose & Fix (pipeline-fix)

> **⚡ Delegated to:** `tooling/query-pipeline/SKILL.md` (diagnose workflow)

**When:** "pipeline failed", "build failed fix it", "view error in pipeline", "CI error"

**Action:** Read and follow `tooling/query-pipeline/SKILL.md` → "Diagnose & Fix" section.

---

## Integration with AIDLC

### Phase 0 (Lite Inception) — Enhanced with Azure Data

When user specifies a PBI ID:
- No need to ask for requirements — fetch from Azure
- Description → Goal + Persona + Requirements
- AcceptanceCriteria → AC list
- Skip user-stories.md generation if AC is already complete

### Phase 2.4 (Test Script) — Auto-upload Test Result

After all tests pass in Phase 2.4:
- Ask user: "Upload test result to Azure?"
- If Yes → upload-test-result workflow (ask FE/BE version → compile → update TS card)
- If No → skip (can be done later with "upload test result" command)

### Phase 2.2 (Test Case Design) — Auto-upload

After test-scenarios-*.md is complete:
- Ask user: "Upload Test Scenarios to Azure?"
- If Yes → upload-ts workflow
- If No → skip (can be done later)

### Phase 3.3 (PR) — Link to PBI

After PR is created:
- MCP: link_work_item_to_pull_request(pbiId, prId, repoId)
- MCP: update_work_item(pbiId, state → "Developing" or "Testing")

---

## MCP Tool Reference

| Tool | When to use |
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

1. **Always fetch fresh data** — Do not cache PBI state; fetch fresh every time
2. **Confirm before state change** — Ask user before updating state in Azure
3. **Comment on every state change** — Every state change must include a comment
4. **PBI source file** — Every feature sourced from Azure must have a `pbi-source.md`
5. **Don't close incomplete** — If any child is still active → do not close PBI
6. **Language** — Comments in Azure in English, chat with user in Thai


---

## Verification

Before declaring Azure DevOps bridge operation complete, confirm:

- [ ] Fresh data fetched (not cached) for all work item reads
- [ ] State changes confirmed with user before execution
- [ ] Comment added on every state change (English)
- [ ] `pbi-source.md` created for features sourced from Azure
- [ ] No incomplete children when closing PBI
- [ ] Upload script ran with correct flags (dry-run first if uncertain)

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| MCP `azure-devops` tools | Integration | Direct API access to work items, iterations, queries |
| `.aidlc/` folder | Artifact store | Store PBI source, link decisions to work items |
| Azure DevOps project/team context | Configuration | Route to correct project and team |
| Upload scripts (`ai-agent/scripts/azure-devops/`) | Automation | Batch upload test scenarios to ADO |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| Before state changes | Single select (confirm new state) | Before updating work item state in Azure |
| Before uploading Test Scenarios | Checkbox (confirm CSV + PBI ID) | Before running upload script |
| Before closing PBI | Checkbox (all children verified) | Before marking PBI as Done |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/tooling/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
