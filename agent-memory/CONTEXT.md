# Context — ~/.claude (Global)

## Now
- **Task:** idle
- **Status:** idle
- **Deferred plan:** mobilewright install (iOS/Android native testing, Playwright-style) — `agent-memory/plans/mobilewright-install/plan.md`. Installed+verified once via `mobilewright doctor`, then uninstalled (no active task). Known npm issue: pin `mobilewright@0.0.46`, `0.0.47` 404s on unpublished `@mobilewright/inspector`.

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
