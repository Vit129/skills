---
id: cand-20260812-launchd-minimal-path
name: launchd-minimal-path-homebrew-binary-not-found
description: a script that works fine run manually hangs/fails silently under launchd because launchd's default PATH excludes Homebrew — use absolute paths or export PATH explicitly
confidence_score: 0.6
hit_count: 1
created_at: 2026-08-12T00:55:00Z
last_used: 2026-08-12T00:55:00Z
source_project: line-claude-bot
status: candidate
trigger_patterns:
  - "launchd script not working"
  - "launchctl load command not found"
  - "works manually but not via launchd"
  - "launchd KeepAlive daemon stuck"
---

# Script works when run manually, hangs/fails silently under launchd

## Context & Problem

A bash wrapper script (invoked via a launchd `.plist`'s `ProgramArguments` as `/bin/bash -c
"script.sh >> log 2>&1"`) worked perfectly when run manually from an interactive shell, but under
launchd it produced no log output at all and appeared to hang — `launchctl list` showed the process
as running (PID assigned, exit status 0) with no visible error.

Took real debugging to isolate: checked the script logic, checked env file sourcing, checked file
permissions — the actual cause was `launchd`'s default `PATH` is minimal
(`/usr/bin:/bin:/usr/sbin:/sbin`), which does **not** include Homebrew's `/opt/homebrew/bin`. A
binary the script depended on (`cloudflared`, but this generalizes to any Homebrew-installed tool)
was silently not found, so the command failed to even start — with `set -uo pipefail` (no `-e`),
this doesn't halt the script loudly, it just fails that one step and whatever depends on its output
never happens.

Confirmed via: `env -i PATH="/usr/bin:/bin:/usr/sbin:/sbin" bash -c "which <tool>"` — reproduces
launchd's minimal environment without needing to actually reload the launch agent to test.

## Learned Solution

For any script driven by launchd (not just this project — applies to any future `.plist`-managed
background job on this Mac):
- Use **absolute paths** for every non-`/usr/bin`/`/bin` binary the script calls (Homebrew tools,
  a specific Python interpreter version, etc.) rather than relying on `PATH` resolution.
- Or explicitly `export PATH="/opt/homebrew/bin:$PATH"` near the top of the wrapper script.
- Test the actual dependency resolution with the `env -i PATH=... bash -c "which <tool>"` trick
  above BEFORE wiring up the `.plist`, not after — it reproduces the exact failure mode without a
  reload/debug cycle each time.
- Also apply this to the interpreter itself: `python3` under launchd's PATH may resolve to a
  different install (e.g. Apple's system stub) than the one used for interactive testing — pin it
  to an absolute path too if the project depends on a specific build.
