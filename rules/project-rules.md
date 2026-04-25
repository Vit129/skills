# Project Rules (overrides/extends shared)

- **AIDLC first:** All dev/QA work goes through `ai-dlc/core/aidlc/` — never call qa/dev skills directly unless AIDLC routes there
- **AIDLC modes:** Support 3 modes — Full (default), QA Only, Dev Only. See `workflow.md` → "Execution Modes" for phase matrix and routing tables.
  - `"start AI-DLC QA scenario only"` → QA Scenario Only (Lite Inception → 2.1 → 2.2)
  - `"start AI-DLC QA automation"` → QA Automation (Lite Inception → 2.1 → 2.2 → 2.3 → 2.4, then asks: API / Web UI / Android / iOS)
  - `"start AI-DLC Dev only"` → Dev Only (Lite Inception → 2.5 → 3.1 → 3.2 → 3.3)
- **AIDLC mode hard rules:** ALL modes MUST use `.aidlc/` folder + DECISIONS→PLAN→EXECUTE. QA modes MUST NOT skip qa-task-design. Dev mode MUST NOT skip dev-task-design.
- **AIDLC exception — Postman migration:** `postman-to-playwright/postman/` skill bypasses AIDLC entirely — source of truth is the Postman collection, not requirements. Use migration flow in `postman-to-playwright/postman/SKILL.md` directly (Step 1→2→2.5→3→4). No `.aidlc/` folder needed.
- **Phase gates:** If prerequisites missing → STOP, tell user what's needed first
- **Phase gate check (MANDATORY):** Before ANY dev/QA work → scan `.aidlc/[system]/[feature]/` for existing outputs → find first missing phase → start THERE, not at the user's requested phase. If no `.aidlc/` folder exists for the feature → start from Phase 0/1.2 (Full mode) or Lite Inception (QA/Dev Only mode). NEVER skip to a later phase. This check MUST happen BEFORE reading spec docs or generating any output.
- **No shortcuts:** "เขียน code เลย" without prerequisites = STOP, not proceed
- **Knowledge check:** Before writing test code, check `ai-dlc/knowledge/` for existing templates + lessons
- **Language:** English for all generated files, Thai for user interaction
- **Test:** After every edit → run matching test (mapping: `rules/test-coverage.md`)
- **Build:** Build must pass + commit hash required before task is done
- **Playwright:** no `waitForTimeout()` · `getByTestId` > `getByRole` · AAA pattern
- **Escalate:** Don't retry the same failing approach 3+ times — hand off or ask
