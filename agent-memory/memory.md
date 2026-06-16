# Memory — ~/.claude (Global)

## Decisions
- [2026-06-16] Agent memory v2: CONTEXT.md + MEMORY.md replaces memory.md
- [2026-05-23] Hermes re-adopted — GitHub Copilot gpt-4o-mini (free); GRAPHIFY_USAGE.md standardized
- [2026-05-18] Auto-create skill drafts: knowledge-curate hook v2.0 → `skills/drafts/` when Applied>=3
- [2026-05-11] Auto Memory = complementary (not replacement); memory update via AIDLC Step 10
- Skill changes sync to both `.claude/skills/` AND `.kiro/skills/`

## Lessons
- CASE-001: memory target routing — global → `.claude/agent-memory/`, project → `{project}/agent-memory/`
- CASE-002: AIDLC detection = Kiro IDE mode, not keyword
- CASE-004: `project_specs.md` at repo root ignored by `.gitignore` — put templates in `rules/`
- CASE-005: hooks askAgent not reliable → use workflow Step 10

## Conventions
- Agent routing: read→Gemini, plan→Claude, code→Codex
- Memory files: UPPERCASE throughout
