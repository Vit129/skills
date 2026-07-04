# Memory — ~/.claude (Global)

## Decisions
- [2026-07-02] Cross-agent/multi-session handoff lives entirely in `CONTEXT.md` (`## Handoff`, `## Claims` sections) — no separate CLAIMS.md or temp-file, matching Matt Pocock's `handoff` skill mechanics (`skills/handoff/SKILL.md`, name-only invocation) but adapted to write into the single hot-state file instead of the OS temp dir. See CASE-011.
- [2026-07-02] agent-memory retention shortened 30 → 7 days; pruning now archives instead of deletes. See CASE-010.
- [2026-07-01] mobilewright (iOS/Android native mobile testing, Playwright-style API) evaluated as RF+AppiumLibrary alternative — not wrapped in a skill (it's a plain CLI like playwright-cli, not skill-worthy). Install plan kept at `agent-memory/plans/mobilewright-install/plan.md`, not currently installed.
- [2026-06-16] Agent memory v2: CONTEXT.md + MEMORY.md replaces memory.md
- [2026-06-16] Skill conflict resolution added to `rules/skill-auto-detect.md` — priority: debugging > qa > dev > thinking > review > tooling > personal
- [2026-05-23] Hermes re-adopted — GitHub Copilot gpt-4o-mini (free); GRAPHIFY_USAGE.md standardized
- [2026-05-18] Auto-create skill drafts: knowledge-curate hook v2.0 → `skills/drafts/` when Applied>=3
- [2026-05-11] Auto Memory = complementary (not replacement); memory update via AIDLC Step 10
- Skill changes sync to both `.claude/skills/` AND `.kiro/skills/`

## Lessons
- CASE-001: memory target routing — global → `.claude/agent-memory/`, project → `{project}/agent-memory/`
- CASE-002: AIDLC detection = Kiro IDE mode, not keyword
- CASE-004: `project_specs.md` at repo root ignored by `.gitignore` — put templates in `rules/`
- CASE-005: hooks askAgent not reliable → use workflow Step 10
- CASE-006: `skill-usage.log` contains `---END---|{project}` noise entries from harness job system — benign; filter `/skill-review` parsing by validating line format `YYYY-MM-DD|skill-name` before counting
- CASE-007: `PostToolUse:Skill` hook verified working (2026-06-16) — hook in `settings.json` correctly captures `DATE|skill` entries; updated to guard against `unknown` writes
- CASE-008: skill trigger = file path/domain, not user wording — if user asks "why X broken" and diagnosis leads to editing HA YAML, invoke `ha-dev` at the moment of deciding to edit, not at the moment user says "fix/apply". Wording-based detection misses diagnostic→edit flows.
- CASE-009: skill auto-detect scope = ANY intent word — "why", "what", "fix", "find", "explain", any verb qualifies. The routing table is a starting point, not an exhaustive list. Prefer over-invoking to under-invoking. [2026-06-20]
- CASE-010: `prune-agent-memory.py` deleted MEMORY.md/CONTEXT.md entries past the age cutoff outright (`path.write_text`, no archive step) despite MEMORY.md being documented "append-only, never overwrite" in `skills/agent-memory/SKILL.md` — a real contradiction, not just a tuning question. Fixed by archiving pruned content to `COMPLETED-TASKS-ARCHIVE.md` before removal. Lesson: a retention-window question ("is 30 days too long?") can mask a correctness bug ("does pruning lose data?") — check both before just changing the number. [2026-07-02]
- CASE-011: multi-agent/multi-session coordination (handoff notes, parallel-work claims) belongs in `CONTEXT.md` itself, not a separate file — CONTEXT.md is already rewritten every session per the existing lifecycle rule, so a second file (CLAIMS.md, temp-file) only adds sync-drift risk without saving real effort. Tradeoff accepted: whole-file rewrite can clobber a concurrent writer's claim line, worse than an append-only file would — acceptable because the mechanism was already advisory/best-effort, not a hard lock, and the actual use case is one operator orchestrating multiple tools, not truly concurrent agents. [2026-07-02]

## Lesson Capture Gate (lowered)
Write a new CASE when ANY of these are true — don't wait for 2+ recurrences:
- A wrong assumption caused wasted time (even once)
- A correct decision was non-obvious and could easily go wrong next time
- An infrastructure component (hook, script, path) was verified working or broken

## Language Learning
- English patterns log: `knowledge/english-patterns.md` — update inline when correction recurs 2+ times
- Japanese patterns log: `knowledge/japanese-patterns.md` — update inline as errors/progress appear
- Both files are cross-project (global `~/.claude/agent-memory/`) — available in every session

## Conventions
- Agent routing: read→Gemini, plan→Claude, code→Codex
- Memory files: UPPERCASE throughout
- Skill conflict: debugging > qa > dev > thinking (see `rules/skill-auto-detect.md`)
