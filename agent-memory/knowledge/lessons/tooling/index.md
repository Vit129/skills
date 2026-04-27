# Tooling Lessons

Updated: 2026-04-26

| ID | Type | Status | Applied | Prevented | Confidence | Summary | Detail |
|----|------|--------|---------|-----------|------------|---------|--------|
| LESSON-TOOLING-001 | architecture | active | 1 | 1 | 0.90 | Agent memory has user-level and project-level stores; hooks must route by actual written paths. | LESSON-TOOLING-001.md |
| LESSON-TOOLING-002 | pattern | active | 1 | 0 | 0.85 | Token optimization has four dimensions: output compression, input filtering, smart navigation, context management. | LESSON-TOOLING-002.md |
| LESSON-TOOLING-003 | bug | active | 1 | 1 | 0.95 | Session-save hooks using `~/` can route to the wrong workspace; use absolute paths. | LESSON-TOOLING-003.md |
| LESSON-TOOLING-004 | workflow | active | 1 | 1 | 0.95 | Dirty session saves need a mandatory Knowledge Sync Gate; never fall back to state-only saves. | LESSON-TOOLING-004.md |
| LESSON-TOOLING-005 | workflow | active | 1 | 1 | 0.95 | Always sync both Kiro (.kiro/hooks/) and Claude Code (.claude/hooks/) when updating agent-memory hooks. | LESSON-TOOLING-005.md |
