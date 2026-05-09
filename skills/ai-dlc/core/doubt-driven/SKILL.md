---
name: doubt-driven
description: Adversarial self-review for non-trivial decisions. Use when stakes are high (production, security, irreversible), working in unfamiliar code, or when a confident output is cheaper to verify now than debug later.
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

**When NOT to use:**
- Mechanical operations (renaming, formatting, file moves)
- Following clear, unambiguous user instruction
- One-line changes with obvious correctness
- Pure tooling operations (running tests, listing files)
- User explicitly asks for speed over verification

## Process

```
CLAIM ──→ EXTRACT ──→ DOUBT ──→ RECONCILE ──→ STOP
  │          │          │           │            │
  ▼          ▼          ▼           ▼            ▼
 Name      Isolate   Adversarial  Classify    Bounded
 the       smallest  self-review  findings    loop
 decision  unit
```

### Step 1: CLAIM — Name what stands

Write the decision in 2-3 lines:

```
CLAIM: "The new retry logic handles all timeout scenarios
        without causing duplicate API calls."
WHY IT MATTERS: Duplicate calls could charge the user twice.
```

If you can't write it that compactly → you have a vibe, not a decision.

### Step 2: EXTRACT — Smallest reviewable unit

Isolate the artifact + contract:
- **Code:** the diff or function — not the whole file
- **Decision:** proposal in 3-5 sentences + constraints it must satisfy
- **Assertion:** claim + evidence that supports it

Strip your reasoning. If you hand over conclusions, you'll get back validation of conclusions.

### Step 3: DOUBT — Adversarial review

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

Do NOT validate. Find issues, or state explicitly
that you cannot find any after thorough examination.
```

Key rules:
- Pass ARTIFACT + CONTRACT only
- Do NOT pass the CLAIM (biases toward agreement)
- Frame as "find issues" not "is this good?"

### Step 3.5: Cross-Model Escalation (Optional)

A single model shares blind spots with itself. A different model catches them.

After single-model review in Step 3, offer cross-model second opinion:

> "Single-model review complete. Want a cross-model second opinion? (gemini / codex / skip)"

**If user picks gemini or codex:**

```bash
# Write adversarial prompt + ARTIFACT + CONTRACT to temp file
# Then pipe via stdin (keeps shell metacharacters inert)

# Gemini CLI
gemini --approval-mode plan -p "" < /tmp/doubt-prompt.md

# Codex CLI
codex exec --sandbox read-only - < /tmp/doubt-prompt.md
```

**Format of /tmp/doubt-prompt.md:**
```
Adversarial review. Find what is WRONG with this artifact.
[same adversarial prompt as Step 3]

ARTIFACT:
[paste artifact]

CONTRACT:
[paste contract]
```

**Rules:**
- Always use `--approval-mode plan` (Gemini) or `--sandbox read-only` (Codex) — read-only, no workspace writes
- Write to temp file + pipe via stdin — never interpolate artifact into shell argument (breaks on quotes/backticks)
- Pass ARTIFACT + CONTRACT only — do NOT pass the CLAIM
- Take output into Step 4 (RECONCILE) alongside single-model findings
- If CLI unavailable or fails → surface failure, offer manual review or skip
- If user skips → note "Proceeding with single-model findings only" and continue

**Non-interactive contexts (CI, autonomous runs):** Skip cross-model, announce skip in output.

### Step 4: RECONCILE — Classify findings

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
