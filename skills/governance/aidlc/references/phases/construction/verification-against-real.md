# Phase 2.4b: Verification Against Real (3-Round Pipeline)

> **Trigger:** Dev delivers backend/frontend → user says "dev delivered", "verify", "switch to real"
> **Prerequisite:** Phase 2.4 complete (test scripts exist, pass with mock or stub)
> **Tool:** `playwright-cli` (browser CLI for exploratory + capture)
> **Output:** Updated .spec.ts files verified against real system + test results uploaded to Azure

---

## Overview

```
Round 1: Exploratory Play
  → Follow test scenarios → record actual steps → save to knowledge

Round 2: Capture & Spec
  → Play again → capture network/API/req/res/elements → write spec artifacts

Round 3: Final Run
  → Run automation from artifacts → pass → upload result to Azure
```

---

## Round 1: Exploratory Play (Record Actual Flow)

**Goal:** Follow test scenarios designed in Phase 2.2 on real system → record all actual steps

### Steps

1. **Open browser via playwright-cli**
   ```bash
   playwright-cli open <app-url>
   ```

2. **Follow test scenarios one by one** — Follow MD/CSV designed in Phase 2.2

3. **Record actual steps** — Every click, fill, navigate, wait — record to knowledge file:
   ```bash
   # Create knowledge file for this feature
   # Path: agent-memory/knowledge/qa/{feature}-actual-flow.md
   ```

4. **Note discrepancies** — If actual flow differs from designed test scenario:
   - Step order differs
   - Element mismatch (placeholder text changed, button name differs)
   - New step not in design (e.g., confirmation modal, loading state)
   - API endpoint differs from expected

5. **Save knowledge file:**
   ```markdown
   # {Feature} — Actual Flow (Round 1)

   **Date:** {date}
   **Environment:** {SIT/UAT/DEV}
   **URL:** {base-url}

   ## Flow: {scenario-title}

   | Step | Action | Target/Element | Data | Note |
   |------|--------|----------------|------|------|
   | 1 | goto | /login | — | — |
   | 2 | fill | placeholder="ระบุอีเมล" | user@test.com | — |
   | 3 | click | role=button, name="เข้าสู่ระบบ" | — | — |
   | ... | ... | ... | ... | ... |

   ## Discrepancies vs Design
   - [ ] {what's different from Phase 2.2 scenario}
   ```

### Output
- `agent-memory/knowledge/qa/{feature}-actual-flow.md`

### After Round 1
- **Update test scenarios** (Phase 2.2 MD file) if discrepancies found
- Adjust steps, pre-conditions, expected results to match actual flow
- This becomes the **source of truth** for Round 2

---

## Round 2: Capture & Spec Artifacts (Collect Technical Details)

**Goal:** Play again from updated test scenario → capture all technical details → write spec artifacts

### Steps

1. **Open browser + enable network capture**
   ```bash
   playwright-cli open <app-url>
   # playwright-cli has built-in network capture via `requests` command
   ```

2. **Play through each scenario again** — Use updated scenario from Round 1

3. **Capture network requests:**
   ```bash
   playwright-cli requests              # list all requests
   playwright-cli request <index>       # full details of a request
   playwright-cli request-body <index>  # request body
   playwright-cli response-body <index> # response body
   playwright-cli response-headers <index>
   ```

4. **Capture frontend elements:**
   ```bash
   playwright-cli snapshot              # accessibility tree (all elements)
   playwright-cli generate-locator <target>  # get exact locator for element
   ```

5. **Write spec artifact file:**
   ```markdown
   # {Feature} — API & Element Spec (Round 2)

   **Date:** {date}
   **Environment:** {SIT/UAT/DEV}

   ## API Endpoints Captured

   ### {Endpoint 1}: POST /api/v1/orders
   **Request:**
   ```json
   {
     "customerId": "C001",
     "items": [{ "productId": "P001", "qty": 1 }]
   }
   ```
   **Response (200):**
   ```json
   {
     "orderId": "ORD-001",
     "status": "pending",
     "createdAt": "2026-06-20T10:00:00Z"
   }
   ```
   **Response (400 — validation error):**
   ```json
   {
     "error": "INVALID_QUANTITY",
     "message": "Quantity must be > 0"
   }
   ```

   ## Frontend Elements

   | Element | Locator | Page |
   |---------|---------|------|
   | Email input | `getByPlaceholder('ระบุอีเมล')` | Login |
   | Submit button | `getByRole('button', { name: 'เข้าสู่ระบบ' })` | Login |
   | Order table | `getByTestId('order-list')` | Dashboard |
   | ... | ... | ... |

   ## State Transitions Observed

   | From State | Event | To State | API Call |
   |-----------|-------|----------|---------|
   | — | create order | pending | POST /orders |
   | pending | confirm | confirmed | PATCH /orders/:id/confirm |
   | ... | ... | ... | ... |
   ```

6. **Save to:**
   - `agent-memory/knowledge/qa/{feature}-api-element-spec.md`

### Output
- `agent-memory/knowledge/qa/{feature}-api-element-spec.md`

### After Round 2
- **Update .spec.ts files** — Use spec artifacts to update:
  - Fixtures: Add real request/response data
  - Locators: Update to match captured elements
  - Assertions: Add real response schema + values
  - Mock data: Update mock responses to match actual (for CI without backend)
  - Page Objects: Update locators to match captured elements
  - Helpers: Update API calls to match real endpoints + payloads

---

## Round 3: Final Run + Upload + Pipeline

**Goal:** Run updated automation → all pass → upload results to Azure DevOps → setup CI pipeline

### Part A: Local Final Run

1. **Run full test suite against real backend:**
   ```bash
   # API tests
   npm run api:{env}:{feature}:cliMode

   # Web UI tests
   npm run ui:{env}:{feature}:cliMode

   # Or specific file
   npx playwright test {spec-file} --reporter=list
   ```

2. **Triage failures (if any):**

   | Failure Type | Action |
   |---|---|
   | Test bug (wrong locator/assertion) | Fix .spec.ts → re-run |
   | App bug (backend returns wrong data) | File Bug in Azure → notify dev |
   | Environment issue (timeout, network) | Retry → if persistent → file infra bug |
   | Flaky (pass on retry) | Add retry annotation + investigate root cause |

3. **Self-heal loop (max 3x):**
   - Fix test → re-run → if still fail → `debugging/debug-mantra/` → root cause
   - If app bug → create Bug work item in Azure:
     ```
     MCP: wit_create_work_item(type=Bug, fields=[
       title, repro steps, expected, actual, severity, linked PBI
     ])
     ```

### Part B: Upload Result to Azure DevOps (per TS card)

4. **All pass → Upload result to Azure DevOps:**
   ```
   Trigger: a script to upload test results to your project management tool
   → Auto-detect: PASS/FAIL, environment, date, branch, commit
   → Ask user: FE Version, BE Version (one question at a time)
   → Resolve TS IDs from Quick Review Summary table
   → Compile result (screenshot for UI / req+res for API)
   → Confirm with user → update Azure via MCP wit_update_work_item
   ```

   **MCP calls:**
   - `wit_update_work_item(tsId, [Custom.ActualTestResult = <HTML>, Custom.TestResult = "Passed"])`

### Part C: CI/CD Pipeline Setup (Azure Pipelines)

5. **Create pipeline YAML for automated CI runs:**

   **Template:** `~/.kiro/skills/templates/pipeline-templates/linux-pipeline-template.md`
   **Pool:** `linux-agent-pool` (Linux self-hosted)

   **Steps:**
   ```
   a. Read linux-pipeline-template.md → fill placeholders:
      - [TYPE] = SIT/UAT
      - [SystemFeaturePascal] = feature PascalCase
      - [system-feature-kebab] = feature kebab-case
      - [RELATIVE-TEST-PATH] = path from repo root to test project
      - [TEST-FOLDERS] = list of test sub-folders
      - [SERVICE-CONNECTION-NAME] = service connection for templates repo

   b. Write pipeline YAML to:
      pipeline/{type}-{system-feature-kebab}.yml

   c. Ask user: "Register pipeline in Azure DevOps?"
      → If Yes: MCP pipelines_create_pipeline(name, yamlPath, repositoryType=AzureReposGit)
      → If No: skip (manual registration later)

   d. Ask user: "Set schedule? (cron)" → if yes, uncomment schedules block
   ```

   **Pipeline produces:**
   - JUnit XML → published to Azure DevOps Test tab
   - HTML report → published as artifact (per-folder index)
   - Teams notification → webhook (if configured)
   - `templates/publish-test-results-artifacts.yaml@templates` → shared template from QA repo

6. **Trigger first pipeline run (optional):**
   ```
   MCP: pipelines_run_pipeline(pipelineId, project)
   → Wait for completion → check status
   → If fail → pipelines_get_build_log → diagnose
   ```

### Part D: Final Verification

7. **Final verification checklist:**
   - [ ] All test scenarios PASS against real system (local)
   - [ ] Spec artifacts saved to knowledge (Round 1 + Round 2)
   - [ ] .spec.ts files updated with real data
   - [ ] Test results uploaded to Azure DevOps (per TS card)
   - [ ] Pipeline YAML created and registered
   - [ ] Pipeline first run PASS (if triggered)
   - [ ] Bugs filed (if any) and linked to PBI
   - [ ] Git commit: `test: {feature} — verified against real ({env})`

---

## playwright-cli Quick Reference

| Command | Purpose | Used in |
|---------|---------|---------|
| `open <url>` | Open browser | Round 1, 2 |
| `goto <url>` | Navigate | Round 1, 2 |
| `click <target>` | Click element | Round 1, 2 |
| `fill <target> <text>` | Fill input | Round 1, 2 |
| `snapshot` | Get page accessibility tree | Round 2 |
| `generate-locator <target>` | Generate locator for element | Round 2 |
| `requests` | List network requests | Round 2 |
| `request <index>` | Full request details | Round 2 |
| `request-body <index>` | Request body | Round 2 |
| `response-body <index>` | Response body | Round 2 |
| `response-headers <index>` | Response headers | Round 2 |
| `route <pattern>` | Mock network requests | Testing mock setup |
| `console` | List console messages | Debugging |
| `tracing-start` / `tracing-stop` | Record trace | Performance capture |

---

## Integration with AIDLC

### Phase Routing (updated)

```
QA Automation:
  Lite Inception → 2.1 → 2.2 → 2.3 → 2.4 → [dev delivers] → 2.4b → DONE

QA Scenario + Automation:
  Lite Inception → 2.1 → 2.2 → [pause] → 2.3 → 2.4 → [dev delivers] → 2.4b → DONE
```

### Trigger Detection

| User says | Action |
|-----------|--------|
| "dev delivered" | → Enter Phase 2.4b |
| "verify", "switch to real" | → Enter Phase 2.4b |
| "exploratory", "round 1" | → Phase 2.4b Round 1 only |
| "capture", "round 2" | → Phase 2.4b Round 2 only |
| "run final", "round 3" | → Phase 2.4b Round 3 only |

### Knowledge Files Produced

| File | Content | Created in |
|------|---------|-----------|
| `agent-memory/knowledge/qa/{feature}-actual-flow.md` | Actual steps from exploratory play | Round 1 |
| `agent-memory/knowledge/qa/{feature}-api-element-spec.md` | API spec + element locators + state transitions | Round 2 |

### Files Updated

| File | What changes | Updated in |
|------|-------------|-----------|
| `testScenarioPbi{ID}-*.md` | Steps/expected results adjusted to match reality | After Round 1 |
| `*.spec.ts` | Locators, fixtures, assertions from real data | After Round 2 |
| `*Data.ts` / `*Labels.ts` | Real test data + label strings | After Round 2 |
| `*Page.ts` / `*Helper.ts` | Updated locators + API endpoints | After Round 2 |
| Azure DevOps TS cards | Actual result + pass/fail status | Round 3 |
