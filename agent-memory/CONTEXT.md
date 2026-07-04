# Context — ~/.claude (Global)

## Now
- **Task:** idle
- **Status:** idle
- **Deferred plan:** mobilewright install (iOS/Android native testing, Playwright-style) — `agent-memory/plans/mobilewright-install/plan.md`. Installed+verified once via `mobilewright doctor`, then uninstalled (no active task). Known npm issue: pin `mobilewright@0.0.46`, `0.0.47` 404s on unpublished `@mobilewright/inspector`.

## Handoff
<!-- Filled by Skill(handoff) when work continues in a different agent or session. Summarize, don't dump transcript — reference plans/diffs/ADRs by path instead of duplicating them. Redact secrets. Clear once picked up. -->
- **From:** (none)
- **To:** (none — open)
- **Suggested skills:** (none)
- **Note:**

## Claims
<!-- Who's actively working on what right now, so parallel agents/sessions don't duplicate work. -->
<!-- Add a line before starting a sub-task; delete your line when done (this file is rewritten each session anyway). Advisory only, not a hard lock. -->
- (none)

## Completed (2026-07-02)

### Cross-agent/multi-session handoff
- Added `## Handoff` + `## Claims` sections to `CONTEXT.md` (template + this file) — single-file design, no separate CLAIMS.md or temp-file, since CONTEXT.md is already rewritten every session per existing lifecycle rule
- Created `skills/handoff/SKILL.md` (name-only, `skillOverrides.handoff` in `settings.json` — not tracked by git, see README "Setup on a New Machine") — summarizes, redacts secrets, references artifacts instead of duplicating, suggests next skill
- `session-start.sh`/`session-end.sh` updated to print/checklist the new sections

### Retention fix
- `prune-agent-memory.py` was silently **deleting** (not archiving) MEMORY.md entries past cutoff despite MEMORY.md being documented "append-only, never overwrite" — fixed: pruned content now archives to `COMPLETED-TASKS-ARCHIVE.md` before removal
- Default retention shortened 30 → 7 days (session-start.sh, session-end.sh, prune-all-agent-memory.sh) to match actual session cadence

## Completed (2026-06-26)

### Step 1 — Global skill-trigger hook
- Created `~/.claude/hooks/skill-trigger.py` (ported from harness-terminal project hook)
- Created `~/.claude/hooks/skill-keywords.json` — global keywords for finance, language, post-mortem, review-personas, aidlc
- Added to `settings.json` UserPromptSubmit as second hook
- Verified: `portfolio` keyword → `Skill(portfolio)` fires correctly

### Step 2 — disable-model-invocation (name-only) via skillOverrides
- Added 8 new skills to `skillOverrides` in `settings.json`:
  - Finance: `portfolio`, `stock-deep-analysis`, `stock-peer-comparison`, `tradingagents-orchestrator`
  - Language: `english-practice`, `japanese-practice`
  - Other: `shipping-launch`, `skill-creator`

### Step 3 — 3-tier ladder PoC: macos-swiftui
- SKILL.md: 440 lines → 57 lines (flow + decision tables only)
- 6 reference files created in `references/`: swift-lang, state-management, ui-components, drag-drop, appkit-swiftui, filesystem

## Next Candidates for 3-tier ladder
- japanese-practice (459L), english-practice (428L), tradingagents-orchestrator (272L), ui-to-text (396L)

## Key Files
- `rules/` — behavior, routing, skill map
- `skills/` — global skills
- `hooks/` — global skill-trigger + keywords
- `agent-memory/knowledge/` — durable cross-project patterns
