# Skill Routing

## Principle

Pick the skill that best fits the task. Call it directly. No mandatory gate.

AIDLC is one skill among many — use it when it actually helps, not by default.

## Skill Map

| Task signal | Skill |
|-------------|-------|
| fix bug / debug / crash / investigate | `debug-mantra` |
| hunt bugs / audit / find mismatch / scan | `find-mismatch` |
| write test / add test / xctest / swift test / unit test | `xctest-macos` |
| robot framework / robotframework / rf test | `robotframework-testing` + `robotframework-rules` |
| postman → playwright | `postman-to-playwright` |
| review / code review / critique | `review-personas` |
| new system / new domain / multi-session feature / architecture / requirements unclear | `interview` → จด CONTEXT.md → `aidlc` |
| macos / swiftui / appkit / metal / swift | `macos-swiftui` |
| finance / stocks / portfolio / earnings | matching finance skill |
| explain / how does / summarize / search / brainstorm / diagnose | direct — no skill needed |
| small addition to existing code (≤ 4 files, pattern exists) | direct — read → implement → build/test |
| everything else | judgment call — pick closest skill or go direct |

## Continuation

"ทำต่อ" / "continue" / "resume" → read `agent-memory/CONTEXT.md` → resume at the active phase/skill.
