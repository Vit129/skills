# AIDLC Routing

## Trigger Signals (route to AIDLC if ANY match)

implement, build, create, develop, write code, add feature, refactor, migrate,
test, QA, automate, test scenario, playwright,
deploy, pipeline, CI/CD, release, API design, database schema, architecture,
or any `<verb> + new software artifact` pattern.

## Route Instruction

When triggered → read `~/.claude/skills/aidlc/SKILL.md` before producing output. Follow it exactly.

## Skip AIDLC (direct action)

- **Fix bug / debug / crash** → `debug-mantra` skill directly (no AIDLC)
- **Hunt bugs / audit / systematic scan** → `find-mismatch` skill (no AIDLC)
- **Single-file fixes, typos, config changes, version bumps** → just do it with memory protocol
- Pure research / analysis / brainstorming (no code output)
- Finance / stocks → `stock-deep-analysis`, `stock-peer-comparison`, `portfolio`, `idea-generation`, `earnings-preview`, `tradingagents-orchestrator`
- Domain-only knowledge tasks (fitness, language, accounting) → matching skill by description
- Config, settings, memory management, agent setup
- `postman-to-playwright` (full bypass)
- **XCTest / swift test / unit test / write test / add test / test model / test logic** → `xctest-macos` skill directly (no AIDLC)

## Non-AIDLC Quick Skills

| Keyword | Action |
|---------|--------|
| fix bug / debug / crash / investigate | `debug-mantra` skill → fix → commit |
| hunt bugs / audit / find mismatch / scan | `find-mismatch` skill → DETECT→FIX lifecycle |
| explain / how does | Read code → explain with citations |
| compare | Analyze → structured tradeoff table |
| review / code review / critique | `review-personas` skill → structured feedback |
| summarize | Condense → bullet summary |
| search / find | Use grep/code/glob → report |
| document | Generate docs matching project style |
| brainstorm | Generate options → numbered list |
| diagnose | Read logs/errors → root cause analysis |

## Continuation Detection

"ทำต่อ", "continue", "resume" → read `agent-memory/CONTEXT.md` → derive active task domain → route to matching skill.

If `.aidlc/` exists for the feature → scan for first missing phase → resume THERE.
