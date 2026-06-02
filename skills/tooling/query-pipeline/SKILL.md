---
name: query-pipeline
description: >
  Azure DevOps Pipeline monitoring — view status, fetch error logs,
  download Playwright traces, trigger builds, download artifacts.
  Triggers: "pipeline status", "build status", "CI status",
  "pipeline failed", "build log", "pipeline trace", "pipeline trigger"
version: 1.0.0
last_improved: 2026-06-02
improvement_count: 0
---

# Query Pipeline

> Monitor Azure DevOps pipelines without opening a browser.
> View status, fetch error logs, download traces, trigger builds — all from terminal.

---

## Trigger Detection

| Pattern | Action |
|---------|--------|
| `pipeline status` / `build status` / `CI status` | → status |
| `pipeline failed` / `build log` / `CI error` / `view error` | → logs |
| `pipeline trace` / `download trace` / `get trace` | → trace |
| `pipeline list` / `pipeline definitions` | → releases |
| `pipeline trigger` / `re-run pipeline` | → trigger |
| `pipeline fix` / `fix build` | → diagnose |
| `pipeline artifacts` / `download artifacts` | → artifacts |

---

## Scripts Naming Convention

Scripts live in a `query-pipeline/` folder. Each script follows this naming:

| Script Name | Purpose | Key Arguments |
|-------------|---------|---------------|
| `pipeline-status.sh` | View recent builds (pass/fail/running) | `[org] [project] [top] [status]` |
| `pipeline-logs.sh` | Fetch error log from failed build | `<buildId\|latest> [org] [project]` |
| `pipeline-trace.sh` | Download Playwright trace + screenshots | `<buildId\|latest> [org] [project] [output-dir]` |
| `pipeline-releases.sh` | List pipeline definitions (find definitionId) | `[org] [project] [top]` |
| `pipeline-trigger.sh` | Queue a new build | `<definitionId> [branch] [org] [project]` |
| `pipeline-artifacts.sh` | Download all build artifacts | `<buildId\|latest> [org] [project] [output-dir]` |

**Naming rules:**
- Prefix: `pipeline-`
- Suffix: action verb (`status`, `logs`, `trace`, `trigger`, `releases`, `artifacts`)
- Format: kebab-case `.sh`

---

## Prerequisites

- `AZURE_DEVOPS_PAT` — Personal Access Token (env var or `.env` file)
- `jq` — JSON parser (`brew install jq`)
- `curl` — HTTP client (pre-installed on macOS)

---

## Workflows

### A: Pipeline Fails → Diagnose → Fix → Re-trigger

```
1. pipeline-status → see which build failed
2. pipeline-logs latest → read error message
3. pipeline-trace latest → get trace (if UI test failure)
4. Analyze error → fix code → run test locally
5. Commit + push
6. pipeline-trigger <definitionId> refs/heads/<branch>
7. Give URL to user → they check when ready (~5-15 min)
8. If still fails → loop back to step 2
```

### B: Fix Done → Trigger → Monitor

```
1. pipeline-trigger <definitionId> [branch]
   → Get build ID + browser URL from output
2. Tell user: "Build queued (#ID). ~5-15 min."
   → Provide browser URL for monitoring
3. (User comes back later) → pipeline-status → check result
4. If ✅ passed → done
5. If ❌ failed → pipeline-logs <buildId> → diagnose
```

### C: Download Artifacts

```
1. pipeline-status → get build ID
2. pipeline-artifacts <buildId>
   → Downloads + extracts + opens in Finder
3. Open relevant files (html report, trace, screenshots)
```

---

## Pipeline Registry (per-project)

> Stored at: `{project-root}/agent-memory/knowledge/pipeline-registry.md`
> If file doesn't exist → ask user for pipeline URL → create it.

**Registry format (multi-type):**

```markdown
| Type | Definition ID | Pipeline Name | Path Pattern | Org | Project |
|------|--------------|---------------|--------------|-----|---------|
| web  | 2195 | Web-QA | tests/web-testing/** | DM-Sales | Ordering Management |
| api  | 2157 | API-QA | tests/api-testing/** | DM-Sales | Ordering Management |
```

**Routing logic:**

```
1. Check which files were edited in this session
2. Match file path against "Path Pattern" column
3. If 1 match → use that definitionId
4. If multiple matches → ask user: "trigger pipeline ไหน?"
5. If no match → ask user
```

**URL extraction:** `https://dev.azure.com/{org}/{project}/_build?definitionId=XXXX` → extract `XXXX`

---

## Common Errors

| Error | Root Cause | Fix |
|-------|-----------|-----|
| `page.waitForURL: timeout` | SIT env down or slow | Check env / retry |
| `ECONNRESET` | Network issue | Check SIT env health |
| `TF401027: GenericContribute` | No push permission | Project Settings → Repos → Security → Allow |
| `npm ERR! ERESOLVE` | Dependency conflict | `npm ci --legacy-peer-deps` |
| `exit code 1` (generic) | Script failure | Check lines above error |
| `Error: Timeout 30000ms exceeded` | Locator not found | Fix locator or increase timeout |

---

## Azure DevOps URLs

| Page | URL Pattern |
|------|-------------|
| Pipeline runs | `https://dev.azure.com/{org}/{project}/_build` |
| Specific pipeline | `https://dev.azure.com/{org}/{project}/_build?definitionId={id}` |
| Build result | `https://dev.azure.com/{org}/{project}/_build/results?buildId={id}` |
| Build log | `...?buildId={id}&view=logs` |
| Test results | `...?buildId={id}&view=ms.vss-test-web.build-test-results-tab` |

---

## Agent Rules

1. **Do NOT run scripts directly** — provide ready-to-paste command, user runs on terminal
2. **Never hardcode definitionId** — read from project registry or ask user
3. **Do NOT poll/wait for build** — trigger → give URL → user checks when ready
4. **Always include browser URL** when a build ID is known
5. **Trace viewer:** remind user `npx playwright show-trace <path>`
6. **"latest" = latest FAILED** build (not most recent)
7. **Run from project root** so output lands in the project
8. **If uncertain which pipeline** → ask user before triggering
