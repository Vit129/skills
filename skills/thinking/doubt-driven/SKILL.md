---
name: doubt-driven
description: Adversarial self-review for non-trivial decisions. Use when stakes are high (production, security, irreversible), working in unfamiliar code, or when a confident output is cheaper to verify now than debug later. Also serves as outsider-perspective review of plans, PRs, or code changes.
credit: Inspired by 9arm-skills (https://github.com/thananon/9arm-skills) — engineering/scrutinize
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Doubt-Driven Development

## Overview

A confident answer is not a correct one. Long sessions accumulate context that quietly turns assumptions into "facts." This skill materializes a structured adversarial review before any non-trivial output stands — while course-correction is still cheap.

## When to Use

A decision is **non-trivial** when at least one is true:

- Introduces or modifies branching logic
- Crosses a module or service boundary
- Asserts something the type system cannot verify (thread safety, idempotence, ordering)
- Correctness depends on context the future reader cannot see
- Blast radius is irreversible (production deploy, data migration, public API)
- Reviewing a plan, PR, or design doc (outsider perspective)

**When NOT to use:**
- Mechanical operations (renaming, formatting, file moves)
- Following clear, unambiguous user instruction
- One-line changes with obvious correctness
- Pure tooling operations (running tests, listing files)
- User explicitly asks for speed over verification

## Process

```
CLAIM ──→ SIMPLIFY? ──→ EXTRACT ──→ DOUBT ──→ RECONCILE ──→ STOP
  │           │            │          │           │            │
  ▼           ▼            ▼          ▼           ▼            ▼
 Name      Simpler      Isolate   Adversarial  Classify    Bounded
 the       way?         smallest  self-review  findings    loop
 decision               unit
```

### Step 1: CLAIM — Name what stands

Write the decision in 2-3 lines:

```
CLAIM: "The new retry logic handles all timeout scenarios
        without causing duplicate API calls."
WHY IT MATTERS: Duplicate calls could charge the user twice.
```

If you can't write it that compactly → you have a vibe, not a decision.

### Step 2: SIMPLIFY? — Is there a simpler way?

Before diving into review, ask:
- **Do nothing** — is the problem real / load-bearing?
- **Use what exists** — does the codebase already have something that solves this?
- **Smaller change** — can 90% of the goal be achieved with 10% of the risk?
- **Different layer** — config vs code, framework vs app, build vs runtime?

If a better alternative exists, name it with rationale. This is the most valuable output — surface it before line-by-line review. Skip only if user explicitly says "don't question scope."

### Step 3: EXTRACT — Smallest reviewable unit

Isolate the artifact + contract:
- **Code:** the diff or function — not the whole file
- **Decision:** proposal in 3-5 sentences + constraints it must satisfy
- **Assertion:** claim + evidence that supports it

Strip your reasoning. If you hand over conclusions, you'll get back validation of conclusions.

### Step 4: DOUBT — Adversarial review (trace end-to-end)

Review with this framing (mentally reset context):

```
Adversarial review. Find what is WRONG with this artifact.
Assume the author is overconfident. Look for:
- Unstated assumptions
- Edge cases not handled
- Hidden coupling or shared state
- Ways the contract could be violated
- Existing conventions this might break
- Failure modes under unexpected input
```

**Trace the actual code path, not just the diff:**
- Entry point → call sites → branches taken → state mutated → exit / side effect
- Include unchanged code on either side. Bugs hide at the seams.
- For plans: trace proposed flow against existing system. What does it assume that isn't true?
- Note every surprise (unexpected branch, dead code reached, unknown state). Surprises are signal.

Key rules:
- Pass ARTIFACT + CONTRACT only
- Do NOT pass the CLAIM (biases toward agreement)
- Frame as "find issues" not "is this good?"
- **Cite file:line** — every claim about code references a specific path. No vague "this might break under load."

### Step 5: RECONCILE — Classify findings

For each finding, classify (first match wins):

| Class | Action |
|-------|--------|
| **Contract misread** | Fix the contract, re-classify next cycle |
| **Valid + actionable** | Real issue → change the artifact, re-loop |
| **Valid trade-off** | Real but cost of fixing > cost of accepting → document explicitly |
| **Noise** | Correct under context reviewer didn't have → note and move on |

Don't rubber-stamp findings. Re-read the artifact against each one.

### Step 5: STOP — Bounded loop

Stop when:
- Next iteration returns only trivial/already-considered findings, OR
- **3 cycles completed** (escalate to user, don't grind a fourth), OR
- User says "ship it"

If after 3 cycles still substantive issues → artifact may not be ready. Tell the user.

## External Review Mode (formerly "scrutinize")

When reviewing **someone else's** artifact (PR, plan, diff, design doc) rather than your own decision, use this streamlined flow:

**Trigger:** `/scrutinize`, "review this PR", "audit this", "sanity-check this plan"

### Flow

1. **Intent** — State the goal in one sentence. Ask: is there a simpler way to achieve this?
2. **Trace** — Walk the actual code path end-to-end (not just the diff). Include unchanged code on either side.
3. **Verify** — For each claim the change makes: does the traced path actually produce that behavior? What inputs would break it?
4. **Report** — One section per finding, ordered by severity:

### Report Format

```
### [Blocker|Major|Nit] — [Title]

- **Finding:** One sentence, cite `file:line`
- **Why it matters:** The consequence
- **Evidence:** The trace step or input that exposes it
- **Suggested change:** Concrete, minimal
```

**Close with verdict:** `ship` / `fix-then-ship` / `rework` / `reject` — with the single biggest reason.

### External Review Rules

- **No rubber-stamps.** "LGTM" is not an output. State what you traced.
- **One simpler-alternative pass is mandatory.** Skip only if user says "don't question scope."
- **Don't pad with nits when there's a structural problem.** Lead with blockers.
- **No flattery, no hedging.** State the finding directly.

---

## Integration with AIDLC

- **Phase 2 (Task Design):** Apply to architecture decisions, API contracts
- **Phase 3 (Execute):** Apply to non-trivial implementation decisions
- **With TDD:** A failing test IS the doubt step for behavioral claims
- **With debugging skill:** When doubt surfaces a failure mode → switch to debugging triage

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "I'm confident, skip doubt" | Confidence correlates poorly with correctness on novel problems. Certainty is when blind spots hide. |
| "It's expensive" | Debugging a wrong commit in production is more expensive. The check is bounded; the bug isn't. |
| "The review will just nitpick" | Constrain to "issues that would make this fail under the contract." |
| "I'll review at the end" | End-of-PR review catches issues when course-correction is expensive. Doubt catches them early. |
| "If I doubt every step I'll never ship" | Only non-trivial decisions. Re-read "When NOT to Use." |

## Red Flags

- Doubting a one-line rename (overkill)
- Treating review findings as authoritative without re-reading artifact
- Looping >3 cycles without escalating to user
- Prompting with "is this good?" instead of "find issues"
- Skipping doubt under time pressure on high-stakes decision
- Doubt theater: across 2+ cycles, zero findings classified as actionable (you're validating, not doubting)

## Verification

After applying doubt-driven:

- [ ] Every non-trivial decision named as CLAIM before standing
- [ ] At least one adversarial review per non-trivial artifact
- [ ] Review framed as "find issues" not "validate"
- [ ] Findings classified against artifact text (not rubber-stamped)
- [ ] Stop condition met (trivial findings, 3 cycles, or user override)
- [ ] Any valid+actionable findings resulted in artifact changes
- [ ] `knowledge/lessons/` checked for similar past decisions

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Artifact under review | Code/Plan/PR | The thing being doubted |
| Codebase (surrounding code) | Read access | Trace end-to-end paths beyond the diff |
| Git history | Shell tool | Understand why code exists (Chesterton's Fence) |
| `knowledge/lessons/` | Lessons learnt | Check if this decision pattern failed before |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After SIMPLIFY (Step 2) | Single select | Present 2-3 simpler alternatives — user picks or says "proceed as-is" |
| After DOUBT findings (Step 4) | Checkbox review | User classifies each finding: actionable / trade-off / noise |
| After 3 cycles | Open field | Escalate: "Still substantive issues — ship anyway or rework?" |
| External Review verdict | Single select | User picks: ship / fix-then-ship / rework / reject |

**Rule:** Never present a single "this is fine" — always surface at least one alternative or concern.

## Self-Learning

After user accepts the final decision:

1. **Record decision pattern:** If the doubt process caught a real issue → save to `knowledge/lessons/{domain}/{decision-type}.md`
2. **Record false positives:** If findings were mostly noise → note what context was missing to avoid next time
3. **Progressive update:** If a new doubt heuristic proved valuable, append to this skill's Red Flags section
4. **Confidence:** `confidence: 1.0` (user validated) vs `confidence: 0.5` (doubt found nothing actionable)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
