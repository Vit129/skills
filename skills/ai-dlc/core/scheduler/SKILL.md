---
name: scheduler
description: >
  Scheduled automation for recurring dev/QA tasks. Cron-like scheduling using
  markdown-based job definitions — no external services needed.
  Triggers: "schedule task", "daily update", "cron", "ตั้งเวลา", "run every day",
  "nightly test", "weekly report", "scheduled curator", "recurring task".
  Works with any IDE hook system that supports userTriggered or time-based events.
---

# Scheduler — Recurring Task Automation

Cron-like scheduling for dev/QA workflows. Define jobs in markdown, trigger via
IDE hooks (userTriggered) or external cron (system crontab / CI scheduler).

## When to Use

- Daily standup summaries (what changed, what's blocked)
- Nightly regression test runs
- Weekly curator pass (grade/prune skills)
- Periodic knowledge consolidation
- Scheduled code quality reports

## How It Works

```
schedule.md (job definitions)
    ↓
Trigger (hook / system cron / manual)
    ↓
Agent reads schedule.md → finds due jobs
    ↓
Executes each job → writes output to logs/
    ↓
Updates schedule.md (last_run, next_run)
```

## Job Definition Format

Jobs live in `agent-memory/schedule.md`:

```markdown
# Scheduled Jobs

| ID | Name | Schedule | Command/Prompt | Last Run | Status |
|----|------|----------|----------------|----------|--------|
| J1 | Daily Dev Update | daily 09:00 | Summarize git log --since yesterday, list open tasks from dev-task-progress.md | 2026-05-04 | ✅ |
| J2 | Daily QA Update | daily 09:00 | Summarize test results, list failing tests, check qa-task-progress.md | 2026-05-04 | ✅ |
| J3 | Weekly Curator | weekly monday | Run curator pass: grade knowledge, consolidate duplicates, archive stale | 2026-05-01 | ✅ |
| J4 | Nightly Regression | daily 22:00 | Run full test suite, report failures | 2026-05-04 | ✅ |
```

## Schedule Syntax

| Format | Meaning | Example |
|--------|---------|---------|
| `daily HH:MM` | Every day at time | `daily 09:00` |
| `weekly DAY` | Every week on day | `weekly monday` |
| `every Nd` | Every N days | `every 7d` |
| `on-session` | Every session start | `on-session` |
| `on-stop` | Every session end | `on-stop` |
| `manual` | Only when user triggers | `manual` |

## Built-in Job Templates

### Daily Dev Update
```markdown
Prompt: |
  Read dev-task-progress.md for active project.
  Run: git log --oneline --since="yesterday"
  Summarize:
  - Commits since yesterday
  - Tasks completed [x] vs remaining [ ]
  - Blockers or stale tasks (no update in 2+ days)
  Output: agent-memory/logs/dev-update-{date}.md
```

### Daily QA Update
```markdown
Prompt: |
  Read qa-task-progress.md for active project.
  Check test results (last run output).
  Summarize:
  - Test pass/fail counts
  - New failures since yesterday
  - QA tasks completed vs remaining
  - Flaky tests (passed then failed)
  Output: agent-memory/logs/qa-update-{date}.md
```

### Weekly Curator
```markdown
Prompt: |
  Load core/curator skill.
  Run full curator pass:
  1. Grade all knowledge files
  2. Consolidate duplicates (70%+ overlap)
  3. Archive stale items (0 usage, 30+ days)
  4. Write curator-report.md
  Output: agent-memory/curator-report.md
```

### Nightly Regression
```markdown
Prompt: |
  Detect test framework (playwright.config.ts or robot.yaml).
  Run full test suite.
  If failures:
  - List failing test names + error summary
  - Check if failure is new (compare with previous run)
  - Suggest fix or flag as flaky
  Output: agent-memory/logs/regression-{date}.md
```

## Trigger Mechanisms

Since IDE agents don't have true background processes, use one of these:

### Option 1: Hook-based (Recommended for Kiro)
- `on-session` jobs → run via `promptSubmit` hook (check schedule on first message)
- `on-stop` jobs → run via `agentStop` hook (check schedule before saving)

### Option 2: System Crontab
```bash
# Run daily update at 9:00 AM
0 9 * * * cd /path/to/project && echo "run scheduled jobs" | kiro --prompt
```

### Option 3: CI/CD Scheduler
```yaml
# GitHub Actions
on:
  schedule:
    - cron: '0 9 * * *'  # Daily 9:00 UTC
jobs:
  daily-update:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Run daily dev/QA update"
```

### Option 4: Manual
User says "run scheduled jobs" or "check schedule" → agent reads schedule.md and executes due jobs.

## Output Location

```
agent-memory/
├── schedule.md          ← Job definitions + status
└── logs/
    ├── dev-update-2026-05-05.md
    ├── qa-update-2026-05-05.md
    ├── regression-2026-05-05.md
    └── curator-report.md
```

## Adding a New Job

1. Add row to `agent-memory/schedule.md`
2. Define prompt (what the agent should do)
3. Set schedule (daily/weekly/manual)
4. Agent picks it up on next trigger

## Constraints

- **Markdown only** — no external scheduler service
- **Idempotent** — running a job twice on same day = same result (check last_run)
- **No background process** — jobs run within agent session, not as daemon
- **Logs are append-only** — never overwrite previous day's log
- **Max 10 active jobs** — prevent schedule bloat

## ⚠️ Gotchas

- **Time-based triggers need external help** — IDE hooks are event-based, not time-based. Use system cron or CI for true time triggers.
- **Long-running jobs block session** — keep jobs under 5 minutes. For longer tasks, dispatch as subagent.
- **No notification delivery** — unlike Hermes, we can't send to Telegram/Discord. Output goes to log files only.
- **Timezone** — schedule times are local to the machine running the agent.
