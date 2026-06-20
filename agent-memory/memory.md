# Memory — ~/.claude (Global)

## Decisions
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
