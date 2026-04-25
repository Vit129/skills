---
name: Agent Rules Evolution Log
description: Track new rules, capabilities, and mandatory guidelines added to agent configs
location: palace/wings/agent-memory/rooms/
updated: 2026-04-24
---

# Agent Rules Evolution Log

## v2.0 — Premium Standards & Safety Gates (2026-04-24)

**What was added:**
1. **Plan Mode (Mandatory)** — Elevation rule: enter EnterPlanMode before non-trivial work
   - Clear criteria: new features, multiple approaches, multi-file changes, unclear requirements
   - Skip-conditions: single-line fixes, explicit instructions, research tasks
   - Template header: prominently at top with 🚨 emoji

2. **Design & Craftsmanship Rules** — Premium standards for UI/code quality
   - Foundational Tokens: color, typography (hierarchy), spacing, shadows, borders, animation
   - Reusable Components: props-based, accessible, dark mode built-in
   - Typography Hierarchy: display → heading → body → label → caption (no skipping levels)
   - Anti-AI-Slop Checklist: 8-point quality gate (placeholder text, spacing, contrast, states, etc.)
   - Code Craftsmanship: naming (clear), functions (<20 lines), comments (why), DRY, testing (AAA), performance

3. **Escalation & Handoff Rules** — Safety boundary (when to STOP)
   - Triggers: ambiguous requirements, blocked by external dependency, destructive operation, security concern, 3+ different attempts failed, unclear performance impact, user preference matters
   - Philosophy: escalate early, escalate clearly

4. **Quality Gates (Pre-Done Checklist)** — Shipping criteria
   - Build passes, tests pass, edge cases handled, backwards compat or documented, code clarity, git log tells story, user can verify, no new tech debt

5. **Error Recovery Strategy** — Systematic failure handling
   - 4-step loop: Diagnose (root cause) → Adjust (different approach) → Verify (works) → Loop/Escalate
   - Max 3 *different* attempts (not retries)
   - Escalate when: root cause unknown, 3 different approaches failed, user decision needed

6. **Communication Style Guide** (separate file: `.claude/shared/communication-style.md`)
   - Core: lead with what matters, terse, evidence-based, decisive
   - Before/while: initial response, updates, when stuck
   - End-of-turn: 1-2 sentences only
   - Trade-offs: recommend one approach, let user decide
   - Evidence: cite sources, avoid vague claims
   - Tone: professional, collaborative, humble, energetic
   - Over-explain when: learning context, decision points, gotchas, security

---

## v1.0 — SSOT Foundation (2026-04-24)

**What was added:**
1. **Plan Mode (Mandatory)** — Basic rule (was added in first round)
2. **Design & Craftsmanship Rules** — Initial version
3. **Reading Order & Trust Priority** — Removed non-existent AGENTS.md reference
4. **Karpathy Principles** — Think, Simplicity, Surgical, Goal-Driven
5. **State Management (Mandatory Checklist)** — Turn start/end workflow

---

## Architecture Changes

| Version | agent-core.md | Synced to | Notes |
|---------|---------------|-----------|-------|
| v2.0 | +5 mandatory rules | ~/.codex/CODEX.md, ~/.gemini/GEMINI.md | All agents see rules prominently |
| v1.0 | Removed AGENTS.md ref | Same | Fixed trust priority |

---

## Design Philosophy

**Elevation of Expectations:**
- v1.0: "Do planning" → v2.0: "Plan is mandatory (EnterPlanMode)"
- v1.0: "Simplicity first" → v2.0: "Design & craftsmanship to premium standard"
- v1.0: "State management" → v2.0: "Quality gates enforce sign-off"

**Safety & Clarity:**
- Added escalation boundaries (when to STOP)
- Added quality gates (when to SHIP)
- Added error recovery strategy (how to handle failure)
- Added communication style (how to present work)

**Goal:** Every agent config is now a "premium standard rulebook" not just an "instruction list"

---

## Knowledge Created

Lessons extracted to `agent-memory/knowledge/`:
- `design-craftsmanship-tokens.md` — Design token system + anti-slop checklist
- `error-recovery-strategy.md` — 4-step error recovery + escalation patterns
- (Communication style guide available in `.claude/shared/communication-style.md`)

---

## What's Working Well

✅ Plan Mode as elevation rule (clear entry point)
✅ Design tokens systematized (repeatable across projects)
✅ Escalation rules prevent infinite loops
✅ Quality gates establish sign-off criteria
✅ Error recovery reduces waste (stop after 3 different tries)
✅ Communication style explicit (not assumed)

---

## Future Considerations

- [ ] Add "Performance Awareness" rule (token budgeting, batch operations)
- [ ] Add "Security Checklist" (data handling, OWASP compliance)
- [ ] Add "Testing Strategy" (unit/integration/e2e guidelines)
- [ ] Track effectiveness of escalation rule (is 3-attempt threshold right?)
- [ ] Refine anti-slop checklist based on real failures
