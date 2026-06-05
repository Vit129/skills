---
name: query-pipeline
description: >
  Azure DevOps Pipeline monitoring — view status, fetch error logs, 
  download Playwright traces, list pipeline definitions.
  Triggers: "pipeline status", "build status", "CI status", 
  "pipeline failed", "build log", "pipeline trace", "download trace"
version: 1.0.0
last_improved: 2026-06-02
improvement_count: 0
---

# Query Pipeline

> Monitor Azure DevOps pipelines without opening a browser.
> View status, fetch error logs, download traces — all from terminal.

---

## Trigger Detection

| Pattern | Action |
|---------|--------|
| `pipeline status` / `build status` / `CI status` | → status |
| `pipeline failed` / `build log` / `CI error` / `view error` | → logs |
| `pipeline trace` / `download trace` / `get trace` | → trace |
| `pipeline list` / `pipeline definitions` | → releases |
| `pipeline fix` / `fix build` | → diagnose |

---

## Scripts Location

```
~/.kiro/scripts/azure-devops/query-pipeline/
├── pipeline-status.sh      # View recent builds
├── pipeline-logs.sh        # Fetch error log from failed build
├── pipeline-trace.sh       # Download Playwright trace + screenshots
└── pipeline-releases.sh    # List pipeline definitions
```

---

## Prerequisites

- `AZURE_DEVOPS_PAT` — set in `~/.kiro/scripts/azure-devops/query-pipeline/.env` or export
- `jq` — `brew install jq`

---

## Workflows

### 1. Pipeline Status (status)

**When:** User asks about pipeline health, recent builds, or CI status

**Command:**
```bash
~/.kiro/scripts/azure-devops/query-pipeline/pipeline-status.sh [org] [project] [top] [status]
```

**Defaults:** your-ado-org / your-project / top 5

**Examples:**
```bash
./pipeline-status.sh                                    # defaults
./pipeline-status.sh your-ado-org "your-project" 10 # other project, top 10
./pipeline-status.sh your-ado-org your-project 5 completed # only completed
```

**Output:** Build list + summary (✅ passed / ❌ failed / 🔄 running)

---

### 2. Pipeline Logs (logs)

**When:** Pipeline failed — user wants to see the error

**Command:**
```bash
~/.kiro/scripts/azure-devops/query-pipeline/pipeline-logs.sh <buildId|latest> [org] [project]
```

**Examples:**
```bash
./pipeline-logs.sh latest                              # latest failed build
./pipeline-logs.sh 405052                              # specific build ID
./pipeline-logs.sh latest your-ado-org "your-project"
```

**Output:** Build details + timeline + last 50 lines of failed step log

**Follow-up:** After getting the error → analyze and suggest fix

---

### 3. Pipeline Trace (trace)

**When:** Need Playwright trace/screenshots from a failed pipeline test

**Command:**
```bash
~/.kiro/scripts/azure-devops/query-pipeline/pipeline-trace.sh <buildId|latest> [org] [project] [output-dir]
```

**Examples:**
```bash
./pipeline-trace.sh latest                             # latest failed build
./pipeline-trace.sh 12345                              # specific build
./pipeline-trace.sh latest your-ado-org your-project ./my-traces
```

**Output Paths:**

| Scenario | Path |
|----------|------|
| Default (run from project root) | `{project-root}/pipeline-traces/` |
| Explicit override | 4th argument: `./pipeline-trace.sh latest your-ado-org your-project /path/to/output` |

**Rule:** Always run from project root so traces land inside the project.
If uncertain which project → ask user: "จะให้ save trace ไว้ใน project ไหน?"

**Directory structure:**
```
{project-root}/pipeline-traces/
├── SUMMARY.md                          ← overview of all failures
└── run-{buildId}/
    └── {Test_Name}/
        ├── trace.zip                   ← open with playwright show-trace
        └── screenshot-on-failure.png
```

**View trace:** `npx playwright show-trace pipeline-traces/run-{id}/{test}/trace.zip`

---

### 4. Pipeline Definitions (releases)

**When:** Need to find pipeline ID or list available pipelines

**Command:**
```bash
~/.kiro/scripts/azure-devops/query-pipeline/pipeline-releases.sh [org] [project] [top]
```

**Output:** Pipeline ID + name + path

---

### 5. Diagnose & Fix (diagnose)

**When:** "pipeline failed fix it", "CI error", "build broken"

**Flow:**

```
1. Run pipeline-logs.sh latest → get error
2. Analyze error pattern (see Common Errors table)
3. If code issue → identify file + fix + run test + commit
4. If config/permission → recommend Azure DevOps UI steps
5. If env issue → recommend SIT health check
```

---

## Common Errors

| Error | Root Cause | Fix |
|-------|-----------|-----|
| `page.waitForURL: timeout 60000ms` | SIT env down or slow login | Check env / increase timeout / retry |
| `ECONNRESET` | Network from agent cannot reach API | Check SIT env health |
| `TF401027: GenericContribute` | Build identity has no push permission | Project Settings → Repos → Security → Allow |
| `npm ERR! ERESOLVE` | Dependency conflict | `npm ci --legacy-peer-deps` |
| `exit code 1` (generic) | Script failure | Check lines above the error in log |
| `Error: Timeout 30000ms exceeded` | Playwright locator not found | Fix locator or increase timeout |

---

## Workflows

### Workflow A: Pipeline Fails → Diagnose → Fix → Re-trigger

```
1. pipeline-status.sh → see which build failed
2. pipeline-logs.sh latest → read error
3. pipeline-trace.sh latest → get trace if it's a UI test failure
4. Analyze → fix code → run test locally
5. Commit + push
6. pipeline-trigger.sh <definitionId> refs/heads/<branch> → re-run pipeline
7. Wait 2-5 min → pipeline-status.sh → confirm passed
8. If still fails → loop back to step 2
```

### Workflow B: Fix Done → Trigger → Monitor

After code fix is committed and pushed:

```
1. pipeline-trigger.sh <definitionId> [branch]
   → Get build ID + URL from output
2. Tell user: "Build queued (#ID). ใช้เวลาประมาณ 5-15 นาที"
   → Provide browser URL to monitor
   → Suggest: "พิมพ์ 'pipeline status' เมื่อพร้อมเช็คผล"
3. (User comes back later) → pipeline-status.sh → check result
4. If ✅ passed → done
5. If ❌ failed → pipeline-logs.sh <buildId> → diagnose
```

**Rule:** Do NOT poll/wait for pipeline completion.
Trigger → give URL → let user check when ready.
Agent context is too expensive to sit idle 10+ minutes.

### Workflow C: Download Artifacts After Build

```
1. pipeline-status.sh → get build ID
2. pipeline-artifacts.sh <buildId>
   → Downloads + extracts + opens in Finder
3. Open relevant files (html report, trace, screenshots)
```

### Known Pipeline Definitions (reference only)

> Stored per-project at: `{project-root}/agent-memory/knowledge/pipeline-registry.md`
> Agent reads this file to get definitionId — NOT hardcoded in skill.
> If file doesn't exist yet → ask user for pipeline URL → create it.

**Registry format (multi-type support):**

```markdown
| Type | Definition ID | Pipeline Name | Path Pattern | Org | Project |
|------|--------------|---------------|--------------|-----|---------|
| web  | 2195 | Web-Ordering-QA | tests/web-testing/** | your-ado-org | your-project |
| api  | 2196 | API-Ordering-QA | tests/api-testing/** | your-ado-org | your-project |
| ios  | 2300 | iOS-App | tests/ios-testing/** | your-ado-org | Mobile |
| android | 2301 | Android-App | tests/android-testing/** | your-ado-org | Mobile |
```

**Pipeline routing logic:**

```
1. Check which files were edited in this session
2. Match file path against "Path Pattern" column in registry
3. If 1 match → use that pipeline's definitionId
4. If multiple matches → ask user: "แก้ไฟล์หลาย type — จะ trigger pipeline ไหน?"
5. If no match → ask user: "ไม่แน่ใจว่า trigger pipeline ไหน — ช่วยบอกหน่อย"
```

**How to populate:** User sends Azure DevOps pipeline URL → agent extracts `definitionId` from query param → asks user for type + path pattern → saves to project's `pipeline-registry.md`

**Example:** `https://dev.azure.com/{org}/{project}/_build?definitionId=2195` → definitionId = `2195`

---

## Agent Behavior Rules

1. **Agent does NOT run pipeline scripts directly** — agent provides the correct command, user runs it on terminal
2. **Never hardcode definitionId** — always ask user or look up via `pipeline-releases.sh`
3. **Output format:** Give user a ready-to-paste command with all arguments filled in
4. **After trigger:** Provide browser URL for monitoring, don't poll
5. **On pipeline failure → auto-route to debug-mantra:**
   - Read error log → classify (code bug vs env vs config)
   - If **code bug** → Load `debugging/debug-mantra/SKILL.md` → root-cause → fix → re-run locally → re-push → re-trigger pipeline
   - If **env issue** → Report to user: "SIT/UAT ดูเหมือน down — ไม่ใช่ code issue"
   - If **config/permission** → Recommend Azure DevOps UI steps
   - **Loop:** fix → local pass → push → trigger → check status → repeat until ✅
   - **Max retries:** 3 attempts. After 3 fails → escalate to user with full diagnosis

---

## Azure DevOps URLs (Browser)

When agent needs to provide a clickable link or user wants to open in browser:

| Page | URL Pattern |
|------|-------------|
| Pipeline runs | `https://dev.azure.com/{org}/{project}/_build` |
| Specific pipeline | `https://dev.azure.com/{org}/{project}/_build?definitionId={id}` |
| Build result | `https://dev.azure.com/{org}/{project}/_build/results?buildId={id}` |
| Build log | `https://dev.azure.com/{org}/{project}/_build/results?buildId={id}&view=logs` |
| Test results | `https://dev.azure.com/{org}/{project}/_build/results?buildId={id}&view=ms.vss-test-web.build-test-results-tab` |

**Defaults:** org=`your-ado-org`, project=`your-project`

**Rule:** After running any script that returns a build ID → always include the browser URL in output.

---

## Rules

1. **Script-first** — Always prefer scripts over raw curl (saves tokens, handles errors)
2. **Latest = failed** — `latest` resolves to most recent FAILED build (not just most recent)
3. **Don't guess build ID** — If user doesn't specify, use `latest`
4. **Trace viewer** — Always remind user: `npx playwright show-trace <path>`
5. **Escalation** — If error is unclear after log fetch → ask user for more context

---

## Verification

Before declaring pipeline query complete:

- [ ] Correct script was run with correct arguments
- [ ] Output was summarized clearly (not just raw dump)
- [ ] If error found → root cause identified or escalated
- [ ] If trace downloaded → path communicated + viewer command shown

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `AZURE_DEVOPS_PAT` | Credential | API authentication |
| `jq` | CLI tool | JSON parsing |
| Scripts at `~/.kiro/scripts/azure-devops/query-pipeline/` | Shell scripts | Pipeline queries |

---

## Self-Learning

After pipeline diagnosis:

1. **New error pattern** → append to Common Errors table
2. **Repeated failure** → note in `playbook.md` with fix
3. **False positive** (env down, not code bug) → record to avoid wasting time next occurrence
