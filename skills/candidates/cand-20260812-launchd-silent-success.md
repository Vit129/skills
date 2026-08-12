---
id: cand-20260812-launchd-silent-success
name: launchd-silent-success-looks-broken
description: a launchd-triggered script that only echoes on its failure/skip branches produces zero stdout on a genuinely successful run — an empty log file is not proof of a broken pipeline, check the actual side effect instead
confidence_score: 0.6
hit_count: 1
created_at: 2026-08-12T09:40:00Z
last_used: 2026-08-12T09:40:00Z
source_project: stock-report-bot
status: candidate
trigger_patterns:
  - "launchd log file empty"
  - "cron.log empty after success"
  - "script works manually but log is blank under launchd"
---

# An empty launchd log file can mean "succeeded silently," not "broken"

## Context & Problem

Debugged a launchd job whose log file (`StandardOutPath`/redirected stdout) stayed at 0 bytes even
after the underlying work clearly succeeded (a downstream side effect — a pushed message, a
database write, a state file update — was confirmed present). Spent real time chasing this as if
it were a broken redirect/capture mechanism (tried different plist patterns, `plutil -lint`,
`env -i` reproduction, etc.) before realizing the actual cause: the wrapper script's only `echo`
statements were on its SKIP and FAILURE branches (e.g. a throttle "NOT_DUE" message, a "failed,
rc=N" message) — the success path fell through with no unconditional print at all, and the
payload script itself (a Python worker) used structured file-based logging instead of `print()`,
so it never wrote to stdout either. A clean success run was *supposed* to produce zero console
output — the empty log was correct, not evidence of a bug.

## Learned Solution

Before treating an empty launchd log as a symptom of a broken pipeline:
1. **Check the actual side effect first** (the state file that should have advanced, the message
   that should have been delivered, the DB row that should exist) — if that's present and correct,
   the pipeline worked; the empty log is just missing observability, not a bug.
2. **Audit the script's own print/log statements for the success path specifically** — it's easy to
   add logging only on error/skip branches (since those are what you think to test first) and
   forget the happy path needs a heartbeat too, especially once the payload's own logging moved to
   a structured file sink instead of stdout.
3. Add one unconditional line on the success branch (e.g. a timestamped `"report sent OK"` echo)
   so future debugging has a visible signal without needing to re-derive "is this actually working"
   from indirect evidence every time.
4. This is a distinct failure mode from an actually-broken redirect (which `plutil -lint` +
   `StandardOutPath`/`StandardErrorPath` vs. shell-redirect testing can rule out) — don't conflate
   the two; check "does the script even try to print anything here" before suspecting the capture
   mechanism itself.
