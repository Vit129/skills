# Skill Routing

## Principle

`interview` is the entry point for every task, no exceptions — it does a silent 1-line scope check first (Step 0) and only opens full elicitation when scope is genuinely unclear. After Step 0 clears, pick the skill that best fits and call it directly.

## Chained Routes Run to Completion

When the Skill Map entry is a chain (`A → B → C → implement`), execute the whole chain in one pass — do not stop after the first skill and wait for the user to say "continue" or "run the full pipeline." A skill finishing and printing a summary (e.g. interview's "Ready for `/plan`") is a handoff to the next stage, not a checkpoint to pause at.

- Only pause mid-chain for a **genuine unknown** — something no amount of reading code/docs resolves, answered via `AskUserQuestion` inline within a stage.
- Finishing a stage's own output (LANGUAGE.md, design.md, task list) is not itself a reason to stop — immediately invoke the next skill in the chain.
- If a stage is legitimately not applicable (e.g. no new domain term → no LANGUAGE.md write), say so in one line and proceed — don't treat "nothing to do here" as a stopping point either.
- Exception: stop before an action with real-world blast radius (destructive ops, writes to shared/external state, git push, etc.) per the "Executing actions with care" rules — that's a different gate, not a pipeline-stage pause.
- Applies equally to Dev and QA chains — `test-scenario → qa-architect → playwright-rules/robotframework-rules + playwright-testing/robotframework-testing → task-design (QA section) → build/run scripts` runs end-to-end the same as the Dev chain does. Finishing test scenarios/architecture is a handoff into the next stage, not a stop.
  - Skip `test-scenario` only if a `testScenarioPbi{ID}-{platform}.md` already exists for this feature (check before invoking) — `qa-architect` reads that file as its mandatory input either way; don't regenerate scenarios that already exist, but don't skip straight to `qa-architect` on a brand-new feature with no scenario file either.
- Applies to the bug lifecycle chain too — `debug-mantra → regression test → post-mortem → agent-memory` runs through to lesson-capture, not just "fix landed." Don't stop at a validated fix; write the regression test and offer the post-mortem in the same pass.
  - Exception within this one chain: `debug-mantra`'s own **Human-in-the-Loop Points** (repro confirmed, hypothesis picked, fix approved, fix validated) are real gates by design — hypothesis selection needs human judgment, a proposed fix needs sign-off before landing. Don't collapse those into "run to completion" either; they're not the same as the between-skill "should I continue" anti-pattern this section targets.

## Cross-Project Stack Detection

`~/.claude/` is shared across every project — `~/Git/Personal/` alone spans Swift (`kouen-terminal`), Python (`graphify`), Node/React (`My-Investment-Port`), and others. The platform-specific Skill Map rows (`android`, `ios`, `macos-swiftui`, `frontend-dev`, `backend-dev`) are keyed on words the user says — but a generic request ("add a feature", "fix this", "เพิ่ม feature") won't contain a platform word at all.

- Before picking a platform-specific row, check the **current project's actual signal files** if the user's wording doesn't name one: `package.json` (+ its dependencies: React/Vue → `frontend-dev`, Express/Fastify/Nest → `backend-dev`) → JS/TS, `Package.swift`/`*.xcodeproj` → `macos-swiftui`/`ios`, `build.gradle*` → `android`, `requirements.txt`/`pyproject.toml` → `backend-dev` (Python). `pubspec.yaml` (Flutter/Dart) has no dedicated skill (removed — audited full content, confirmed generic best-practice only, zero non-obvious convention) — falls to the "stack genuinely new to this table" fallback below.
- This also grounds `qa-architect`'s own Step 1 ("Identify the platform... If not stated, ask") — check repo signals first, only ask the user if signals are genuinely ambiguous (e.g. a monorepo with both a Swift app and a Node API).
- `dev-architect`'s own Step 0 (`mcp__graphify__query_graph` / reading existing code before designing) already grounds *implementation style* in the real repo regardless of which row got picked — this section is specifically about picking the right platform-specific **coding-standards skill** (with its own reference docs/conventions) before that happens, not about re-deriving style from scratch each time.

**When no signal file matches any row — the stack is genuinely new to this table:**
1. Check the project's own `CLAUDE.md`/`_skills/`/`rules/` first — several personal projects self-host their own domain skill (e.g. `Home-Assistant/_skills/ha-dev/SKILL.md`, `My-Investment-Port/_skills/portfolio-holdings/`). If one exists, use it — don't fall back to a global skill that's actually the wrong domain.
2. Otherwise, don't force-fit into the nearest-sounding global skill (e.g. a Rust CLI is not `backend-dev` just because it's server-adjacent). Fall through to `everything else → interview → pick closest skill`, and let `dev-architect`/general `coding.md` rules (match existing repo conventions) carry the implementation — no skill claim beats reading the actual code.
3. If the same uncovered stack recurs 3+ times across projects (this repo's own memory-promotion threshold, see `agent-memory`'s Self-Learning sections), that's a signal to write a real skill (`skill-creator`) instead of continuing to re-derive conventions from scratch each time. One known case already at 2/3: **Google Apps Script** (`.gs`, `doGet`/`doPost`/`SpreadsheetApp`) backs both `My-Investment-Port/syncLocalStorageToGoogleSheets.gs` and `Fitness-Tracker/fitness-backend.gs` — no skill yet, watch for a 3rd occurrence.

## Browser Automation Tool Priority

When a task needs live browser automation (navigate, click, screenshot, read network/console, inspect DOM) — check tools in this order, don't default straight to `claude-in-chrome`/`chrome-devtools` out of habit:

1. **`mcp__kouen__*` first.** Kouen (`kouen-terminal`) is the user's own terminal multiplexer app — when it's running, browser panes live inside it alongside their other active sessions, which is the more integrated environment. Call `kouenList` (cheap, no side effects, no permission needed) to confirm Kouen is actually running before trying to use it — don't assume.
   - If `kouenBrowserOpen`/`Navigate`/`Interact`/`Evaluate`/`Close` error with "disabled... allow it in `mcp-policy.json` or set `KOUEN_MCP_ALLOW_CONTROL=1`" — that's Kouen's own security gate (`allowControl` in `~/Library/Application Support/Kouen/mcp-policy.json`), off by default on purpose. Don't silently work around it or nag every turn — ask the user once per session whether to enable it, and only edit that policy file with their explicit go-ahead (it's a security-relevant change, same bar as any other access-control edit).
   - Editing the policy file may not take effect immediately — Kouen may not hot-reload it, requiring an app restart. Never restart Kouen yourself if `kouenList` shows other active panes/sessions — that kills whatever's running in them. Tell the user it needs a restart and let them pick the timing.
2. **`mcp__claude-in-chrome__*` next** if Kouen isn't running or the user's regular Chrome (with their real login/session state) is specifically needed.
3. **`mcp__chrome-devtools__*` last** — spins up a separate, disconnected browser instance. Fine for throwaway one-off checks, but prefer 1 or 2 when the user might want to see/interact with the session themselves.

## Tracker Sync (optional — tracker-agnostic, portable across Jira/Azure DevOps/Linear/etc.)

`~/.claude/` is shared across every project regardless of which issue tracker that workspace uses — never hardcode one tracker's API/script path here. The pipeline has 4 generic sync points; whether any of them exist as a real script depends entirely on the current workspace:

| Stage | When | Purpose |
|-------|------|---------|
| Pull Requirements | Before `test-scenario`, if requirements live in a tracker ticket not yet pulled | Fetch ticket → local requirements doc (`test-scenario`'s own Requirements Source step already says: "pull with a script you write for that tracker's API, or paste manually") |
| Upload Scenarios | After `test-scenario`'s CSV/export + sign-off, before `qa-architect` | Push approved scenarios to the tracker as child items, capture the tracker-ID↔TS-ID mapping for automation to reference later |
| Upload Result | After a test script runs (Pass/Fail/Blocked) | Write the result back onto the tracker item |
| Create Bug | On confirmed test failure, mid `debug-mantra`/`find-mismatch` | File a bug linked to the parent ticket + failed TS + related tasks |

**Resolving the concrete implementation for the current workspace:**
1. Check this workspace's own rules/CLAUDE.md for a tracker integration path (e.g. a `scripts/<tracker>/` dir) before assuming one doesn't exist.
2. Known example (company workspace, Azure DevOps): `~/.kiro/scripts/azure-devops/` (`pull-pbi/`, `upload-ts/`, `upload-result/`, `create-bug/`) — only valid under `~/.kiro/**`, `~/Git/Company/**` per Core Rules → VCS Remote by Path. Do not assume this path or Azure DevOps outside those directories.
3. If no script exists for this workspace's tracker, don't invent an API call — ask the user, or write a small script for that tracker's API if asked to.
4. Ask before running any write stage (Upload Scenarios/Result, Create Bug) — don't assume every ticket/project wants every scenario/result mirrored automatically.

## Skill Map

| Task signal | Skill |
|-------------|-------|
| fix bug / debug / crash / investigate | `debug-mantra` (REPRODUCE→FIX) → `playwright-testing`/`robotframework-testing` (regression test, GUARD) → `post-mortem` (CLOSED) → `agent-memory` (playbook/lessons) — optional: Create Bug stage on confirmed failure, see Tracker Sync |
| hunt bugs / audit / find mismatch / scan **the whole codebase**, systematic bug detection | `find-mismatch` — on confirmed finding, chain into the `debug-mantra` row above |
| xctest / swift test / write test or unit test **in a Swift/macOS project** | `xctest-macos` |
| write test / add test / unit test in a non-Swift project (JS/TS, Python, etc.) | no dedicated skill — check the project's existing test framework (e.g. `tests/vitest/*.test.js` → Vitest) and match its convention directly; don't default to `xctest-macos` just because "unit test" is generic |
| playwright / web ui test / api test | `test-scenario` (scenarios are qa-architect's mandatory input) → `qa-architect` → `playwright-rules` + `playwright-testing` → `task-design` (QA section) → build/run scripts — optional tracker sync at each stage, see Tracker Sync |
| robot framework / rf / mobile test | `test-scenario` (scenarios are qa-architect's mandatory input) → `qa-architect` → `robotframework-rules` + `robotframework-testing` → `task-design` (QA section) → build/run scripts — optional tracker sync at each stage, see Tracker Sync |
| postman → playwright | `postman-to-playwright` — reads `playwright-rules` + `playwright-testing` before writing/reviewing generated code (required deps, not just triggers) |
| review / code review / critique | `review-personas` — findings hand off downstream: bugs → `debug-mantra`, design issues surfaced during `/plan` → `dev-architect`, unresolved pre-commit ambiguity → `interview` (doubt mode) |
| scrutinize / sanity-check / second opinion on **a single plan, PR, diff, or design doc** / is this necessary | `scrutinize` |
| analyze codebase / gap analysis / extract requirements / **what exists before building** / step by step analysis / chain of thought / lats / compare approaches / big picture thinking / วิเคราะห์ | `analysis-skills` (`ai-techniques` was merged in — CoT/LATS/AoT now live here too) |
| new feature / architecture / unclear scope / requirements unclear | `interview` (full gather) → write LANGUAGE.md → `dev-architect` (design + graphify) → `task-design` (Dev section) → implement |
| huge project / spans multiple sessions / too big to spec in one interview / wayfinder / chart the way | `wayfinder` (chart destination as a decision map, resolve tickets one at a time across sessions) → per resolved ticket, re-enter this table normally (`interview`/`dev-architect`/`debug-mantra`/etc.) |
| macos / swiftui / appkit / metal / swift | `macos-swiftui` — for testing `@Observable`/`@MainActor` models, chain into `xctest-macos` |
| finance / stocks / portfolio / earnings | matching finance skill |
| android / kotlin / jetpack compose | `android` |
| ios / uikit / swift ui kit / xcode (non-mac) | `ios` |
| react / vue / next.js / frontend / html / css / browser dom | `frontend-dev` → `web` |
| api server / express / fastapi / django / go service / backend / C#/.NET / C/C++ / dockerize | `backend-dev` (covers Node.js, Python, C#/.NET, C/C++, Docker per its own description — not just JS APIs) |
| database schema / db design / migration | `backend-dev` (schema design, dev-side) — test data seed/verify/cleanup for automation is a separate concern, see `qa-architect`'s `test-db-strategy.md` (QA-side) |
| security / vulnerability / owasp / cve / pentest | `security` |
| ci/cd / github actions / docker / kubernetes / deploy pipeline | `devops-pipeline` |
| simplify code / reduce complexity / too complex | `code-simplification` |
| load test / performance test / k6 / jmeter / stress test | `performance-testing` |
| test scenario / test case design / scenario list | `test-scenario` (design standards + CSV rules now live in its own `references/ts-standards.md`+`references/csv-export.md` — `test-scenario-rules` was merged in) |
| create hook / new hook / hook builder | `hook-creator` |
| create skill / new skill / skill template | `skill-creator` |
| verify this / self-verify / verification loop | `verification-loop` |
| graph report / knowledge graph / project graph | `mcp__graphify__query_graph` |
| ui design / wireframe / mockup / design component | `ui-designer` |
| domain model / ubiquitous language / ddd / bounded context / glossary | `ubiquitous-language` |
| stakeholder update / write for management / exec summary / slack message / standup | `management-talk` |
| launch checklist / ship to prod / pre-release / staged rollout | `shipping-launch` |
| industry rules / compliance / healthcare design / finance design / ecommerce rules | `industry-rules` |
| workout / exercise plan / nutrition / diet / meal plan / macro | `fitness` |
| ภาษี / vat / บัญชี / thai tax / thai accounting / withholding tax | `thai-accountant` |
| bootstrap memory / setup agent memory / reset memory | `agent-memory` |
| handoff / hand off / ส่งต่องาน / pass to codex/gemini/kiro / switch agent | `handoff` |
| ask agy / second opinion from agy / have agy try | `agy` |
| management talk / เขียนสำหรับ management / rewrite for vp | `management-talk` |
| explain / summarize / search / brainstorm / diagnose | `interview` Step 0 clears in 1 line → direct, no further skill |
| everything else | `interview` → then pick closest skill |

## Continuation

"ทำต่อ" / "continue" / "resume" → read the active feature's `agent-memory/plans/[FEATURE]/dev-task-progress.md` or `qa-task-progress.md` → resume at the first unchecked task.
