# Task Progress — Scheduled agent-memory Maintenance Rollout

See `design.md` for full context, known limitations, and why the "apply" stage is
report-only in practice.

## Done

- [x] Build `memory-link-check.sh`, `memory-maintenance-report.sh`,
      `memory-maintenance-apply.sh`, `memory-maintenance-all.sh` (2026-07-24)
- [x] Add wikilink cross-reference rule to `agent-memory/SKILL.md` (2026-07-24)
- [x] Extend `session-start.sh` to surface pending `maintenance.log` (2026-07-24)
- [x] Install + load Hanashi job (Sunday 04:00) (2026-07-24)
- [x] Fix link-checker to support bare-name `[[slug]]` links, not just path-style
      (found via kouen-terminal false-positive) (2026-07-24)
- [x] Install + load kouen-terminal job (Sunday 04:15) (2026-07-24)
- [x] Commit + push all touched repos (`~/.claude`, Hanashi, Accountant-Learning,
      Fitness-Tracker, QA-Automation-Coding-Course) (2026-07-24)

## Next (waiting on real Sunday data, not blocked on anything technical)

- [ ] Review Hanashi's first real Sunday run — check `maintenance.log` content, and
      **check whether PLAYBOOK/knowledge files actually got edited** (not just
      reasoning logged) — this is the open question from `design.md`: our own
      testing (nested inside this background-job session) got unattended writes
      denied, but that may not represent how a plain launchd process behaves.
      Update `design.md`'s verdict once this is known either way.
- [ ] Review kouen-terminal's first real Sunday run — same file-change check, plus
      confirm the `[[feedback_infoplist_staging]]` dangling link gets a human
      decision (fix or remove the reference) if the apply stage didn't already
      handle it
- [ ] Fix the one confirmed dangling link: `kouen-terminal/agent-memory/COMPLETED-TASKS-ARCHIVE.md`
      references `[[feedback_infoplist_staging]]` — no such file exists anywhere in
      the project. Needs a human to decide: was it renamed, or should the reference
      just be dropped.

## Pending — remaining projects (not scheduled yet)

For each: run `memory-maintenance-report.sh` manually once first, confirm no schema
surprise, then create + load its plist (copy the Hanashi/kouen-terminal plist as a
template, offset the Minute field by 15 from the last one added).

- [ ] Accountant-Learning
- [ ] agy-plugin-cc
- [ ] agy-plugin-codex
- [ ] Fitness-Tracker
- [ ] graphify
- [ ] Home-Assistant
- [ ] My-Investment-Port
- [ ] QA-Automation-Coding-Course
- [ ] `~/.claude` itself

Once confidence is high across a few of these, consider switching all installed
plists to call `memory-maintenance-all.sh` (no args) instead of maintaining one
plist per project.
