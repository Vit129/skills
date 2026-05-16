---
name: brainstorming
description: >
  This skill should be used when the user wants to explore an idea before committing to a plan.
  Triggers: "brainstorm", "คิดก่อน", "ยังไม่แน่ใจ", "explore", "ลองคิด", "ช่วยคิด",
  "อยากทำ", "มีไอเดีย", "ก่อนเริ่ม", "party mode", "ให้ทุก role ช่วยคิด",
  "what should we build", "help me think through", "not sure what to do",
  "3 amigos", "discuss before task", "คุยก่อนแบ่งงาน".
  Use AFTER Phase 1 (Inception) and BEFORE Phase 2 (Task Design).
  This skill produces refined context that feeds into QA/Dev task design.
  Non-coding ideas (business, product, research) can also use this skill standalone.
---

# Brainstorming — Multi-Role Party Mode (Subagent-Driven)

Collaborative idea refinement through PO, Dev, and QA subagents — each role runs in its own
isolated context with Phase 1 artifacts as input. The orchestrator synthesizes tensions and
produces a structured output that feeds into Phase 2 (QA/Dev Task Design).

Inspired by BMAD Party Mode + Superpowers Subagent-Driven Development.

## Position in AIDLC Pipeline

```text
Phase 1: Inception (user stories, domain design, logical design)
    ↓
Phase 1.8: Brainstorming ← THIS SKILL (3 Amigos review)
    ↓
Phase 2: Construction Planning (QA task design, Dev task design)
```

**Why here?** เหมือนทำงานจริง — PO ให้ requirement มาแล้ว (Phase 1) → ทีมคุยกัน (3 amigos)
→ ตกผลึก → แล้วค่อยแบ่งงาน (Phase 2)

## When to Use

- After Phase 1 completes (user stories + domain design + logical design exist)
- Before Phase 2 starts (QA/Dev task design)
- Feature is complex enough that multiple perspectives matter
- User explicitly asks for multi-role review

## When to Skip

- Small features (1-2 user stories, single endpoint) — go directly to Phase 2
- Resume session where brainstorming already completed
- User explicitly says "ข้าม brainstorming" or "ไปต่อเลย"

## Execution Mode

### Current: Sequential Subagents (default)

Each role runs as a separate `invokeSubAgent` call, one after another.
Orchestrator collects all outputs, then synthesizes.

### Future: Parallel Subagents (when Kiro supports it)

When Kiro adds native parallel `invokeSubAgent` support, dispatch all 3 roles simultaneously.
No logic change needed — just wrap the 3 dispatch calls in a parallel block.
Flag: `PARALLEL_BRAINSTORMING_ENABLED = false` (flip to true when ready)

---

## Input: What Each Subagent Receives

Each subagent gets Phase 1 artifacts as context — not just a rough idea:

| Role | Reads | Focuses On |
|------|-------|------------|
| PO | user-stories.md + domain-decomposition.md | requirement completeness, user value, scope gaps |
| Dev | logical-design.md + domain-design.md | technical feasibility, architecture risks, complexity |
| QA | user-stories.md + logical-design.md | testability, edge cases, acceptance criteria gaps |

**Pre-analysis step:** Before dispatching subagents, orchestrator runs
`core/analysis-skills` (gap.md) to identify known gaps — this feeds into all 3 subagents as context.

---

## How It Works — Orchestrator Flow

```text
[Orchestrator]
    ↓
Step 1: Run analysis-skills (gap.md) on Phase 1 outputs → identify gaps
    ↓
Step 2: Auto-detect scale (Small/Medium/Large) from feature complexity
    ↓
Step 3: Dispatch subagent PO  → invokeSubAgent(po-lens + Phase 1 artifacts + gaps)
    ↓
Step 4: Dispatch subagent Dev → invokeSubAgent(dev-lens + Phase 1 artifacts + gaps + PO output)
    ↓
Step 5: Dispatch subagent QA  → invokeSubAgent(qa-lens + Phase 1 artifacts + gaps + PO + Dev output)
    ↓
Step 6: Orchestrator synthesizes → identify tensions between roles
    ↓
Step 7: Present synthesis to user via userInput — ask if clarification needed
    ↓
Step 8: If user has clarification → dispatch Round 2 (same flow, updated context)
    ↓
Step 9: Produce output-template.md → present to user
    ↓
Step 10: Ask user via userInput: "พร้อมไป Phase 2 (Task Design) ไหม?"
    ↓
Step 11: If yes → proceed to Phase 2.1 (QA Task Design) or 2.5 (Dev Task Design)
```

---

## Subagent Dispatch Instructions

For each role, call `invokeSubAgent` with:

```text
invokeSubAgent(
  name: "general-task-execution",
  explanation: "Dispatching [PO/Dev/QA] role for brainstorming Phase 1.8 round [N]",
  prompt: """
    You are the [PO/Dev/QA] role in a 3 Amigos brainstorming session.
    Read your lens file: ai-agent/skills/ai-dlc/core/brainstorming/references/[po/dev/qa]-lens.md

    ## Phase 1 Artifacts (your primary input)
    - User Stories: .aidlc/[system]/[feature]/outputs/inception/user-stories.md
    - Domain Design: .aidlc/[system]/[feature]/outputs/inception/domain-design.md
    - Logical Design: .aidlc/[system]/[feature]/outputs/construction/logical-design.md
    [include relevant paths]

    ## Gap Analysis Results
    {output from analysis-skills gap.md}

    ## Context from Previous Roles  ← include for Dev and QA only
    {PO output}   ← include for Dev
    {PO + Dev output} ← include for QA

    ## Scale
    {Small / Medium / Large}

    ## Your Task
    1. Read your lens file fully
    2. Read the Phase 1 artifacts listed above
    3. Analyze from your role's perspective — focus on what's MISSING or RISKY
    4. Pick 1-2 questions from your lens and answer them yourself based on artifacts
       (flag as "Open Question" only if truly unknown from available context)
    5. Produce your section of output-template.md format
    6. Flag any tensions with other roles if context is available

    Return ONLY your role's output section. No preamble.
  """,
  contextFiles: [
    { path: "ai-agent/skills/ai-dlc/core/brainstorming/references/[role]-lens.md" },
    { path: "ai-agent/skills/ai-dlc/core/brainstorming/references/output-template.md" },
    { path: ".aidlc/[system]/[feature]/outputs/inception/user-stories.md" },
    { path: ".aidlc/[system]/[feature]/outputs/construction/logical-design.md" }
  ]
)
```

**Key rules:**
- Subagents do NOT ask the user questions — they analyze artifacts and flag unknowns
- Only the orchestrator uses `userInput` to interact with the user
- Each subagent gets progressively more context (PO → Dev gets PO → QA gets PO+Dev)

---

## Scale Adaptation

| Idea Size | Signals | Rounds | Depth per Role |
|-----------|---------|--------|----------------|
| Small | 1-2 user stories, 1 endpoint | 1 | 1 question answered per role |
| Medium | 3-5 user stories, multi-page | 2 | 2 questions answered per role |
| Large | 6+ user stories, multi-context | 3 | Full lens exploration |

Agent auto-detects size from Phase 1 output volume. User can override: "ขอแบบ quick" or "ขอแบบ deep".

---

## Role Lenses

Each subagent reads its own lens file for question bank and output format:

- **PO Subagent** → `references/po-lens.md`
- **Dev Subagent** → `references/dev-lens.md`
- **QA Subagent** → `references/qa-lens.md`

---

## Output Format

After all subagents complete, orchestrator synthesizes into → `references/output-template.md`

Orchestrator responsibilities:
1. Merge PO + Dev + QA sections into the template
2. Identify and record tensions (where roles disagree)
3. Consolidate open questions from all roles
4. Determine if Phase 1 artifacts need refinement before proceeding

---

## Output Destination

Write brainstorming output to:
```text
.aidlc/[system]/[feature]/outputs/inception/brainstorming-summary.md
```

This file is referenced by Phase 2.1 (QA Task Design) and Phase 2.5 (Dev Task Design) as context.

---

## Handoff Rule

When user approves (confirms via userInput):

1. Present the full output summary (output-template.md format)
2. Ask via userInput: "พร้อมไป Phase 2 ไหม?"
3. If yes → proceed to Phase 2.1 (QA Task Design) or 2.5 (Dev Task Design) based on mode
4. If Phase 1 artifacts need changes → loop back to relevant Phase 1 sub-phase first

---

## 2-Stage Review (for Round 2+ only)

When a clarification round is triggered, apply 2-stage review before producing final output:

**Stage 1 — Completeness:** All 3 roles have contributed. No role output is missing or empty.

**Stage 2 — Consistency:** Tensions are recorded (not silently resolved). Open questions are
listed (not assumed away). Output matches output-template.md structure exactly.

If either stage fails → orchestrator fixes inline before presenting to user.

---

## Standalone Mode (without AIDLC)

For non-coding ideas (business, product, research) where AIDLC is not running:

- Skip Phase 1 artifact reading
- Orchestrator asks user for idea via userInput (Step 1 becomes "ask user")
- Subagents analyze from rough idea instead of artifacts
- Output still uses output-template.md format
- No handoff to Phase 2 — output is the final deliverable

---

## ⚠️ Gotchas

- **Subagents must NOT use userInput** — only orchestrator interacts with user
- **Don't skip roles** — all 3 roles must run unless user explicitly excludes one
- **Don't merge rounds silently** — if Round 2 is triggered, clearly label outputs as Round 1 / Round 2
- **Don't skip gap analysis** — always run analysis-skills (gap.md) before dispatching subagents
- **Roles can disagree** — Dev saying "this is too complex" while PO says "users need it" is healthy tension. Record it in Tensions & Tradeoffs, don't resolve it silently
- **Context chain matters** — Dev subagent receives PO output as context. QA subagent receives PO + Dev output. This is intentional — later roles build on earlier ones
- **Phase 1 artifacts are the source of truth** — subagents analyze what's written, not what they imagine
- **One userInput per question** — orchestrator must never combine multiple questions in one userInput call

---

## Parallel-Ready Notes (Future)

When Kiro supports parallel `invokeSubAgent`:

1. Steps 3-5 become a single parallel dispatch block
2. Step 6 (synthesis) waits for all 3 to complete
3. Context chain (Dev gets PO output, QA gets PO+Dev) must be handled differently:
   - Option A: All 3 run independently (no cross-role context) — faster but less integrated
   - Option B: PO runs first, then Dev+QA run in parallel with PO context — balanced
4. Recommended: Option B when parallel support arrives

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "The feature is simple enough — I'll skip gap analysis and go straight to subagent dispatch" | Gap analysis (Step 1) feeds ALL 3 subagents with known unknowns. Without it, roles brainstorm in the dark and miss obvious holes already visible in Phase 1 artifacts. |
| "I'll combine all 3 role outputs in one subagent call to save tokens" | The context chain is intentional — Dev builds on PO output, QA builds on PO+Dev. Merging them removes the progressive refinement that catches cross-role tensions. |
| "The user didn't explicitly ask for brainstorming, so I'll skip Phase 1.8" | If the feature has 3+ user stories or multi-context complexity, brainstorming is the default. Skipping it means Phase 2 task design starts without multi-perspective validation. |
| "I'll let the subagent ask the user clarifying questions directly" | Only the orchestrator uses userInput. Subagents analyze artifacts and flag unknowns — they never interact with the user. Breaking this rule creates chaotic multi-agent conversations. |
| "Round 2 isn't needed — the first round covered everything" | If any role flagged Open Questions or tensions exist between roles, Round 2 is required. Silently resolving tensions without user input violates the synthesis step. |

---

## Red Flags

- 🚩 Output has no "Tensions & Tradeoffs" section → Roles were not allowed to disagree; re-run synthesis and explicitly look for conflicts between PO/Dev/QA perspectives.
- 🚩 All 3 role outputs look identical in structure and depth → Subagents were not given their specific lens files; verify each subagent loaded its own `po-lens.md`, `dev-lens.md`, or `qa-lens.md`.
- 🚩 Brainstorming output references information not in Phase 1 artifacts → Subagents are hallucinating context instead of analyzing what's written; re-anchor them to actual artifact content.
- 🚩 No `brainstorming-summary.md` written to `.aidlc/` folder → Output was presented in chat only and will be lost; always persist to the designated output path.
- 🚩 Phase 2 started without user confirming "พร้อมไป Phase 2 ไหม?" via userInput → Handoff rule violated; go back and get explicit user approval before proceeding.

---

## Verification

Before handing off to Phase 2, confirm:

- [ ] Gap analysis ran on Phase 1 artifacts (Step 1 complete)
- [ ] All 3 roles produced output (PO, Dev, QA)
- [ ] Tensions & Tradeoffs section exists (roles disagreed on something)
- [ ] `brainstorming-summary.md` written to `.aidlc/` folder
- [ ] User confirmed "พร้อมไป Phase 2" via userInput
- [ ] Open Questions listed (not silently resolved)
