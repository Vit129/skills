# AIDLC Routing

## Trigger Signals (route to AIDLC if ANY match)

implement, build, create, develop, write code, add feature, refactor, migrate,
test, QA, automate, test scenario, playwright,
deploy, pipeline, CI/CD, release, API design, database schema, architecture,
or any `<verb> + new software artifact` pattern.

## Route Instruction

When triggered → read `~/.claude/skills/governance/aidlc/SKILL.md` before producing output. Follow it exactly.

## Skip AIDLC (direct action)

- **Fix bug / debug / crash** → `debugging/debug-mantra` skill directly (no AIDLC)
- **Single-file fixes, typos, config changes, version bumps** → just do it with memory protocol
- Pure research / analysis / brainstorming (no code output)
- Finance, fitness, domain-only knowledge tasks
- Config, settings, memory management, agent setup
- `tooling/postman-to-playwright/` (full bypass)

## Non-AIDLC Quick Skills

| Keyword | Action |
|---------|--------|
| fix bug / debug / crash / investigate | `debugging/debug-mantra` skill → fix → commit |
| explain / how does | Read code → explain with citations |
| compare | Analyze → structured tradeoff table |
| review | Read code → structured feedback |
| summarize | Condense → bullet summary |
| search / find | Use grep/code/glob → report |
| document | Generate docs matching project style |
| brainstorm | Generate options → numbered list |
| diagnose | Read logs/errors → root cause analysis |

## Continuation Detection

"ทำต่อ", "continue", "resume" → read `agent-memory/CONTEXT.md` → derive active task domain → route to matching skill.

If `.aidlc/` exists for the feature → scan for first missing phase → resume THERE.
