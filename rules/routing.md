# Skill Routing

## Principle

Pick the skill that best fits the task. Call it directly.

**When intent or scope is unclear → always call `interview` first.**

## Skill Map

| Task signal | Skill |
|-------------|-------|
| fix bug / debug / crash / investigate | `debug-mantra` |
| hunt bugs / audit / find mismatch / scan | `find-mismatch` |
| write test / add test / xctest / swift test / unit test | `xctest-macos` |
| playwright / web ui test / api test | `qa-architect` → `playwright-rules` + `playwright-testing` |
| robot framework / rf / mobile test | `qa-architect` → `robotframework-rules` + `robotframework-testing` |
| postman → playwright | `postman-to-playwright` |
| review / code review / critique | `review-personas` |
| new feature / architecture / unclear scope / requirements unclear | `interview` → write CONTEXT.md → `dev-architect` → `aidlc` |
| macos / swiftui / appkit / metal / swift | `macos-swiftui` |
| finance / stocks / portfolio / earnings | matching finance skill |
| explain / summarize / search / brainstorm / diagnose | direct — no skill needed |
| everything else | `interview` → then pick closest skill |

## Continuation

"ทำต่อ" / "continue" / "resume" → read `agent-memory/CONTEXT.md` → resume at the active phase/skill.
