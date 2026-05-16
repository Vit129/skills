---
name: interview-me
version: 1.0.0
keywords: [interview, สัมภาษณ์, ถามทีละข้อ, clarify requirements, ไม่ชัด, underspecified, grill me, ถามจนชัด]
last-updated: 2026-05-16
dependencies: [core/aidlc, core/brainstorming]
---

# Interview Me

> One-question-at-a-time interview that extracts what the user actually wants
> until ~95% confidence — before writing any spec or code.
> Adapted from Addy Osmani's agent-skills `interview-me` concept.

---

## When to Use

- The ask is vague or underspecified ("ทำระบบ booking", "เพิ่ม feature ใหม่")
- User says "interview me", "ถามมาเลย", "grill me", "ถามจนชัด"
- Multiple interpretations exist and you can't pick one confidently
- Before AIDLC Phase 0 (Inception) — to gather enough context to START inception
- When brainstorming is overkill (single person, not multi-role)

## When NOT to Use

- Requirements are already clear and specific
- User provides a detailed spec/PBI/AC
- User says "เขียนเลย" with enough context
- Mid-implementation (use `core/debugging/` or `core/doubt-driven/` instead)

---

## Process

### Step 1: Assess Confidence

Before asking anything, internally rate your confidence:

```
Current confidence: [X]%
What I know: [list]
What I don't know: [list]
```

**Target: 95% confidence before proceeding to spec/plan.**

### Step 2: Ask ONE Question at a Time

Rules:
- **ONE question per message** — never batch multiple questions
- Ask the MOST important unknown first
- Frame questions to reduce ambiguity maximally
- Offer options when possible (easier to pick than to generate)
- Accept "ไม่รู้" / "ยังไม่แน่ใจ" — note it and move on

### Step 3: Track Progress

After each answer, internally update:

```
Confidence: [old]% → [new]%
Resolved: [what this answer clarified]
Remaining unknowns: [list]
Next most important question: [...]
```

### Step 4: Summarize When Done

When confidence ≥ 95%, present a summary:

```markdown
## 📋 Interview Summary

**What we're building:**
[1-2 sentence description]

**Key decisions made:**
- [Decision 1]
- [Decision 2]

**Scope:**
- In: [what's included]
- Out: [what's explicitly excluded]

**Assumptions (unconfirmed):**
- [Assumption 1] — flagged for later verification

**Confidence: 95%+**
→ Ready to proceed to /spec (AIDLC Phase 0)
```

---

## Question Categories (Priority Order)

Ask in this order — skip categories where you already have answers:

### 1. WHAT (Goal)
- "อยากได้อะไรจริงๆ? ผลลัพธ์สุดท้ายที่ต้องการคืออะไร?"
- "ใครเป็นคนใช้? (end user, admin, API consumer)"

### 2. WHY (Motivation)
- "ทำไมถึงต้องการตอนนี้? มี pain point อะไร?"
- "ถ้าไม่ทำ จะเกิดอะไรขึ้น?"

### 3. SCOPE (Boundaries)
- "อะไรที่ต้องมีใน version แรก? อะไรที่เอาไว้ทีหลังได้?"
- "มี constraint อะไรบ้าง? (เวลา, budget, tech stack)"

### 4. HOW (Technical Direction)
- "มี existing system ที่ต้อง integrate ไหม?"
- "มี preference เรื่อง tech stack ไหม?"

### 5. EDGE CASES (Completeness)
- "ถ้า [scenario X] เกิดขึ้น ควรทำยังไง?"
- "มี case พิเศษที่ต้องรองรับไหม?"

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I can infer what they want" | No. Inference = assumption. Assumptions cause rework. ASK. |
| "It's a simple feature, no need to interview" | Simple features with unclear scope become complex features. 2 minutes of questions saves 2 hours of rework. |
| "The user will get annoyed by questions" | Users get MORE annoyed by wrong implementations. Frame it: "ขอถาม 2-3 ข้อก่อนเริ่มนะครับ" |
| "I'll figure it out as I go" | That's called prototyping without consent. The user expects a finished product, not a discovery session. |
| "The PBI/ticket has enough info" | PBIs are summaries. They omit edge cases, priorities, and implicit assumptions. Always verify. |

---

## Red Flags (Signs Something's Wrong)

- 🚩 You're making decisions without asking → STOP, interview first
- 🚩 You said "I assume..." more than twice → STOP, verify assumptions
- 🚩 User's answer contradicts a previous answer → clarify the conflict
- 🚩 You're at question 10+ and confidence is still < 70% → summarize what you know, ask if scope is too big
- 🚩 User says "แล้วแต่เลย" to everything → they might not be the right person to interview

---

## Integration with AIDLC

```text
User request (vague)
      │
      ▼
interview-me (this skill) — until 95% confidence
      │
      ▼
/spec → AIDLC Phase 0 (Inception) — now with clear context
      │
      ▼
Phase 1 → Phase 2 → Phase 3 (normal flow)
```

**Position:** BEFORE Phase 0. This skill gathers the raw material that Phase 0 formalizes.

**vs brainstorming:** Interview-me is 1-on-1 (user + agent). Brainstorming is multi-role (PO + Dev + QA subagents). Use interview-me when the problem is "what do we want?" Use brainstorming when the problem is "how should we approach it?"

---

## Rules

- **ONE question per message** — never batch
- **Thai for questions** — match user's language
- **Don't guess** — if unsure, ask
- **Accept uncertainty** — "ยังไม่แน่ใจ" is a valid answer, note it and move on
- **Max 10 questions** — if you need more, the scope is probably too big → suggest splitting
- **Always end with summary** — never proceed without explicit user confirmation of the summary

---

## Verification

Before proceeding from interview to /spec, confirm:

- [ ] Confidence ≥ 95% (explicitly stated)
- [ ] Summary presented to user with all key decisions
- [ ] User explicitly confirmed the summary (not assumed)
- [ ] Scope (in/out) clearly defined
- [ ] Unconfirmed assumptions flagged (not hidden)
- [ ] Max 10 questions asked (or scope split suggested)
