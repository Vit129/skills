# Vibe Mode

Fast-track execution for small features, prototypes, and exploratory work.
Skips design phases — goes straight from Lite Inception to implementation.

## When to Use

Vibe mode is appropriate when:

- Feature is small (1-2 user stories)
- User wants to try something quickly before committing to full design
- No cross-domain impact expected
- No QA automation required yet

## Detection

Agent detects Vibe vs Spec mode from the **IDE/tool context** — not from keywords in chat.

### Kiro IDE

Kiro has built-in Vibe mode and Spec mode. User selects in the IDE UI.
Agent reads the Kiro mode context automatically — user never types "vibe" or "spec".

### Other AI agents (Claude Code, Gemini, etc.)

When running outside Kiro, detect mode from context:

| Signal | Mode |
|--------|------|
| `.aidlc/` folder already exists for this feature | Spec (resume) |
| Request mentions "test", "QA", "architecture", "full" | Spec |
| Complexity = Small (1-2 stories) | Vibe |
| Complexity = Medium/Large (3+ stories) | Spec |
| Ambiguous | ASK user |

If ambiguous → ASK:

```text
ต้องการ mode ไหน?
1. 🎸 Vibe — เร็ว implement เลย (skip design phases)
2. 📋 Spec — Full AIDLC workflow ทั้งหมด
```

## Dialog Message Format (Global Rule)

**ALL AIDLC interactions MUST use dialog message format** — structured step-by-step conversation, not plain chat.

This applies to:
- Every mode (Vibe, Spec, Full, QA Only, Dev Only)
- Every AI agent (Kiro, Claude Code, Gemini, or any other)
- Every phase (Brainstorming, Inception, QA, Dev, Construction)

Reason: dialog format is easier to read and easier to track progress.

## Vibe Mode Flow

```text
1. Brainstorming Quick (1 round, 1 คำถาม/role)
   ↓
2. Lite Inception → mini-spec.md
   ↓
3. [SKIP: Phase 1.3 Domain Decomp]
   [SKIP: Phase 1.4 Domain Design]
   [SKIP: Phase 1.5 UI/UX Design]
   [SKIP: Phase 1.6 Logical Design]
   [SKIP: Phase 1.7 TestId Map]
   ↓
4. Dev Task Design (lightweight) → dev-task-progress.md
   ↓
5. Phase 3.1 Implementation
   ↓
6. Phase 3.2 Automated Testing (optional)
   ↓
7. Phase 3.3 PR
```

All artifacts go to `.aidlc/[system]/[feature]/` — same as every other mode.

## Required Artifacts (Vibe)

Even in Vibe mode, these are MANDATORY:

- `.aidlc/[system]/[feature]/planning/decisions/01-vibe-decision.md` — lightweight decision record
- `.aidlc/[system]/[feature]/outputs/inception/mini-spec.md` — from Lite Inception
- `.aidlc/[system]/[feature]/dev-task-progress.md` — task tracking
- `.aidlc/[system]/[feature]/audit.md` — audit trail

## Vibe DECISIONS Format (lightweight)

```markdown
# Vibe Decision — {Feature}

Mode: Vibe
Date: {YYYY-MM-DD}

## Scope
{1-2 sentences describing what will be built}

## Approach
{chosen implementation approach}

## Skip Rationale
{why full design phases are not needed for this feature}

## Escalation Trigger
{what would cause this to escalate to Spec mode}
```

## Escalation: Vibe → Spec

Trigger escalation when ANY of these occur during a Vibe session:

| Trigger | Signal |
|---------|--------|
| Scope creep | User adds 3rd+ story during session |
| Cross-domain | Feature touches 2+ bounded contexts |
| QA demand | User requests test scenarios or automation |
| Architecture decision | Trade-off requiring DB schema or API contract |
| Production intent | User says "จะ deploy", "จะ merge to main" |

**Escalation message:**

```text
⚠️ Complexity เพิ่มขึ้น — แนะนำ escalate เป็น Spec mode
เหตุผล: {trigger}

ต้องการ:
1. Escalate → Spec (สร้าง full design artifacts ก่อน implement)
2. ทำต่อใน Vibe (รับ risk ที่ไม่มี design docs)
```

If user chooses Spec → pause, create full DECISIONS file, run missing phases (1.3-1.7), then resume.

## Anti-Shortcut Rules (Vibe)

| User tries to | Prerequisite missing | Action |
|---|---|---|
| "เขียน code เลย" | No mini-spec | STOP → "ต้องทำ Lite Inception ก่อน (สั้นมาก ~5 นาที)" |
| "ข้าม Lite Inception" | — | STOP → "Lite Inception บังคับแม้ใน Vibe mode" |
| Skip dev-task-progress | — | STOP → "ต้องมี task list ก่อน implement" |
