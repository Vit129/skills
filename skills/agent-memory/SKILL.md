---
name: agent-memory
description: >
  This skill should be used when the user asks to "bootstrap agent memory",
  "setup memory", "สร้าง agent memory", "reset memory", "memory template",
  "initialize memory files", "create memory structure",
  or needs guidance on the agent memory file structure, session flow,
  Save/Discard Gate rules, memory hook behavior, skill self-evolution,
  knowledge pipeline, or subagent delegation patterns.
  Non-coding tasks (research, analysis, finance, fitness, accounting)
  use this memory system alongside coding tasks — it is cross-domain.
credit: Inspired by Hermes Agent (https://github.com/NousResearch/hermes-agent) and Memento-Skills (https://github.com/memento-teams/memento-skills) — adapted into our own session flow + knowledge pipeline pattern
version: 2.0.0
last_improved: 2026-06-17
improvement_count: 1
---

# Agent Memory

Bootstrap, manage, and reference the agent memory system.

## Memory Structure (v2)

```text
agent-memory/
├── PLAYBOOK.md        ← Problem resolution cases (scored)
├── SKILL-LOG.md       ← Skill improvement proposals (append-only)
├── EVAL-STATE.md      ← Last eval date tracker (updated by eval-check hook)
├── index.md           ← Catalog of knowledge/ and plans/
├── skill-usage.log    ← Auto-captured skill usage (hook-written, do not edit)
├── plans/             ← Implementation plans (per-feature dev-task-progress.md / qa-task-progress.md)
├── evals/             ← Eval results (skill stocktake, pass@3 reports)
├── drafts/            ← Temporary resolution drafts (ephemeral)
└── knowledge/         ← Promoted cases + crystallized patterns
    └── archive-playbook.md  ← Zero-score/retired cases
```

All files are **UPPERCASE** (except `skill-usage.log` which is hook-written).

## Bootstrap (Auto-Setup)

Before any memory operation, check if `agent-memory/` exists in the current project:

```bash
# Check and auto-create if missing
[ -d agent-memory ] || bash ~/.kiro/scripts/setup/setupMemory.sh .
```

**Rule:** NEVER skip silently if `agent-memory/` is missing — always run `setupMemory.sh .` to create it.
The script is idempotent (safe to run multiple times) and creates all required files from templates.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "bootstrap memory", "setup memory", "initialize", "reset" | Run `bash ~/.kiro/scripts/setup/setupMemory.sh .` then read `references/templates/` |
| "session flow", "how does memory work", "save/discard gate" | `references/session-flow.md` |
| "draft format", "playbook format" | `references/templates/` — show the relevant template |
| "subagent", "memory curator", "knowledge curation", "delegate memory" | `references/subagent-patterns.md` |
| "skill evolve", "self-improve", "skill proposal", "apply proposal" | `references/session-flow.md` → Skill Self-Evolution section |
| "review rubric", "self-review", "what to save", "grading criteria" | `references/self-review-rubric.md` |

## Quick Reference

- **Session start**: Hook searches `PLAYBOOK.md`
- **Problem resolved**: Create draft in `drafts/` immediately
- **Skill evolve**: Hook checks if skill can be improved after each task → proposes in `SKILL-LOG.md`
- **Session end**: Knowledge-curate hook promotes/crystallizes/archives → Session-save hook evaluates drafts + scores
- **Skill underperformed**: Flag goes into `SKILL-LOG.md`

## Knowledge Capture

- `PLAYBOOK.md` stores repeatable problem cases with scores. It is the staging area for durable lessons.
- `SKILL-LOG.md` stores skill improvement proposals only. It is not a knowledge archive.
- `knowledge/biz/` stores business rules and domain logic that should be reused.
- `knowledge/arch/` stores architecture decisions, tradeoffs, and system patterns.
- `knowledge/qa/` stores test patterns, edge cases, and verification lessons.
- `knowledge/bug/` stores bugs, root causes, and the fix that resolved them.
- `drafts/` is the temporary holding area before a draft passes the Save/Discard Gate.

### Promotion Flow

1. Problem is resolved during a task.
2. Create a draft in `drafts/` with trigger, fix, domain, and outcome.
3. At session end, score the draft with Save/Discard Gate.
4. If the draft passes, append it to `PLAYBOOK.md`.
5. If the same case keeps showing up, promote it to `knowledge/{domain}/{case-id}.md` or a shared pattern file.
6. Use `SKILL-LOG.md` only when the skill itself should be improved.

### File Roles

- `PLAYBOOK.md` answers: "What fix worked before?"
- `SKILL-LOG.md` answers: "What should the skill system learn or change?"
- `knowledge/` answers: "What should be kept as durable reference knowledge?"

## Hooks (4 total)

| Hook | Event | Files Touched |
|------|-------|---------------|
| session-load v3.1 | promptSubmit | reads: PLAYBOOK.md |
| skill-evolve v1.0 | postTaskExecution | writes: SKILL-LOG.md |
| knowledge-curate v1.0 | agentStop | writes: PLAYBOOK.md, knowledge/; deletes: drafts/ |
| session-save v4.0 | agentStop | writes: PLAYBOOK.md, SKILL-LOG.md |

## Rules

- PLAYBOOK.md fields max 120 chars — overflow to `knowledge/`
- PLAYBOOK.md scoring: Applied++ when fix used, Prevented++ when trigger recognized
- PLAYBOOK.md auto-promote: Applied >= 3 → `knowledge/{case-id}.md`
- PLAYBOOK.md archive: Applied+Prevented >= 5 AND no use in 30 days → `knowledge/archive-playbook.md`
- Zero-score archive: Applied=0, Prevented=0, status=done, older than 30 days → archive
- Auto-crystallize: 3+ promoted files same domain + shared keyword → `knowledge/{domain}-pattern.md`
- SKILL-LOG.md proposals: max 1 per skill per session, evidence-backed, auto-apply after 2+ sessions evidence
- Subagent delegation: use when 5+ playbook cases OR 3+ knowledge files same domain
- Drafts are ephemeral — deleted after Save/Discard Gate evaluation
- Never store secrets, credentials, or PII in any memory file

## Closed Learning Loops

### Skill Self-Evolution
```
task → skill-check (flag if bad) → skill-evolve (propose if good pattern missing)
  → SKILL-LOG.md (proposed) → user approves or auto-apply after 2+ sessions evidence → skill file updated
  → next use verifies → clear flag after 3 successes
```

### Knowledge from Lessons
```
problem resolved → drafts/ → Save/Discard Gate (2/3 criteria)
  → PLAYBOOK.md (scored each session) → Applied >= 3 → knowledge/{case-id}.md
  → 3+ same domain → knowledge/{domain}-pattern.md (crystallized)
  → auto-create skill draft if pattern is actionable + no existing skill covers it
  → {skills_root}/drafts/{domain}-{name}/SKILL.md (status=draft in SKILL-LOG.md)
  → user approves → move to {skills_root}/{name}/ + sync to all runtimes
```

## Subagent Note

If you want to use `agent-memory` as a utility subagent, read `references/subagent-patterns.md`.

---

## Session Search (inspired by Hermes Agent FTS5)

Cross-session recall — find relevant context from past sessions without re-reading everything.

### How to Search

```bash
# Search across knowledge + playbook for relevant patterns
grep_search "auth timeout" in knowledge/ + PLAYBOOK.md

# Search by domain
grep_search in knowledge/qa/ for test patterns
grep_search in knowledge/bug/ for past root causes
```

### Search Priority Order

1. `PLAYBOOK.md` — scored cases (search by trigger keyword)
2. `knowledge/{domain}/` — promoted patterns (search by domain + keyword)
3. `drafts/` — recent unscored resolutions (ephemeral)

### When to Search

| Situation | Search where |
|-----------|-------------|
| Starting a new task in familiar domain | `PLAYBOOK.md` + `knowledge/{domain}/` |
| Bug looks familiar | `knowledge/bug/` + `PLAYBOOK.md` (filter by trigger) |
| Need architecture context | `knowledge/arch/` |
| Need business rules | `knowledge/biz/` |
| Recurring decisions | `PLAYBOOK.md` (scored cases) |
| Skill keeps failing | `SKILL-LOG.md` |

---

## Context Compression (inspired by Hermes /compress)

When context grows too large mid-session, compress without losing critical information.

### When to Compress

- `PLAYBOOK.md` has 20+ entries (archive zero-score)
- Session has 50+ turns without resolution

### Compression Strategy

1. **PLAYBOOK.md:** Archive entries with Applied=0, Prevented=0, older than 30 days
2. **Knowledge:** Never compress — this is the permanent store

### Compression Rules

- NEVER delete information that hasn't been promoted to `knowledge/`
- ALWAYS archive before deleting (move to `archive-playbook.md`)
- Summarize, don't truncate — preserve the "why" even when removing detail

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `agent-memory/` folder | File system | All memory files live here |
| Hooks (4 total) | Event-driven | Automate load/evolve/curate/save |
| `grep_search` tool | Agent tool | Session search across knowledge |
| `knowledge/` folder | Reference data | Promoted patterns and lessons |
| Git history | Shell tool | Track when memory was last updated |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After Save/Discard Gate scores a draft | Checkbox | User confirms: save to PLAYBOOK.md or discard |
| After skill-evolve proposes improvement | Single select | User picks: apply / defer / reject |
| After auto-promote (Applied >= 3) | Checkbox | User confirms promotion to knowledge/ |
| After compression | Open field | User reviews what was archived |

**Rule:** Never auto-delete or auto-archive without at least logging what was removed.

## Self-Learning

The agent-memory system IS the self-learning mechanism for all other skills. It learns by:

1. **Recording good examples:** Every approved output → draft → PLAYBOOK.md → knowledge
2. **Scoring effectiveness:** Applied/Prevented counters track what actually works
3. **Crystallizing patterns:** 3+ same domain → pattern file (reusable across projects)
4. **Proposing skill improvements:** When patterns are actionable → skill draft
5. **Archiving noise:** Zero-score entries auto-archive after 30 days

## Verification

After memory operations:

- [ ] No secrets/credentials stored in any memory file
- [ ] `PLAYBOOK.md` entries have proper scoring fields
- [ ] Knowledge files have tags in `knowledge/` if using index
- [ ] Drafts are ephemeral (deleted after gate evaluation)

---

## Skill Stocktake (Audit & Health Check)

> Trigger: "skill stocktake", "audit skills", "skill health", "ตรวจ skills"
> Run manually or schedule via eval-check hook (weekly)

### What it checks

| Check | Source | Flag if |
|-------|--------|---------|
| **Unused skills** | `SKILL-LOG.md` — last used date | Not used in 30+ days |
| **Underperforming skills** | `SKILL-LOG.md` flags | Flagged 3+ times without fix |
| **Outdated skills** | SKILL.md `last_improved` field | Not improved in 60+ days + has flags |
| **Duplicate coverage** | AGENTS.md Skill Map keywords | 2+ skills with overlapping keywords |
| **Missing Step 0** | AIDLC Internal Steps | Phase exists but no "Load skill" step |
| **Orphan references** | SKILL.md references section | Points to file that doesn't exist |
| **Draft backlog** | `drafts/` folder | Pending drafts older than 14 days |

### Output format

```markdown
## 📋 Skill Stocktake Report — {date}

### 🟢 Healthy (N skills)
[list of skills with recent use + no flags]

### 🟡 Needs Attention (N skills)
| Skill | Issue | Recommendation |
|-------|-------|----------------|
| ... | unused 45d | Archive or remove from Skill Map |
| ... | flagged 3x | Read SKILL-LOG.md → apply fix |

### 🔴 Critical (N skills)
| Skill | Issue | Action Required |
|-------|-------|-----------------|
| ... | orphan reference | Fix path or remove reference |
| ... | duplicate keywords | Merge or differentiate |

### Summary
- Total: N skills | Healthy: N | Attention: N | Critical: N
- Last stocktake: {previous date}
```

### Integration

- Add to `qa/eval-harness/` eval rotation (weekly)
- Results stored in `agent-memory/evals/skill-stocktake-{date}.md`
- If Critical > 0 → block session-save from marking session as healthy

---

## Continuous Learning v2 (Confidence-Based Instincts)

> Enhances existing Knowledge from Lessons pipeline with confidence scoring + auto-evolve

### Confidence Scoring

Every PLAYBOOK.md entry and knowledge file gets a confidence score:

```markdown
## Entry Format (enhanced)
| Field | Description |
|-------|-------------|
| confidence | 0.0–1.0 (auto-calculated) |
| source | user-approved / auto-captured / inferred |
| last_validated | date when last confirmed still valid |
| applied_count | times successfully applied |
| contradicted_count | times found incorrect |
```

**Confidence formula:**
```
confidence = (applied_count - contradicted_count * 2) / max(applied_count + contradicted_count, 1)
clamp(confidence, 0.0, 1.0)
```

**Thresholds:**
| Confidence | Status | Action |
|-----------|--------|--------|
| 0.9–1.0 | ✅ Verified | Trust fully, auto-apply |
| 0.7–0.89 | ⚠️ Probable | Trust but verify on new contexts |
| 0.5–0.69 | 🟡 Uncertain | Ask user before applying |
| < 0.5 | 🔴 Unreliable | Archive or delete |

### Auto-Evolve (Instinct → Skill)

When patterns accumulate enough confidence:

```
PLAYBOOK.md entries (confidence > 0.8, same domain, 3+ entries)
  │
  ▼
Auto-cluster by keyword similarity
  │
  ▼
Generate skill draft: drafts/{domain}-{pattern}/SKILL.md
  │
  ▼
Log in SKILL-LOG.md: "auto-evolve proposal"
  │
  ▼
User approves → move to skills/{category}/{name}/SKILL.md
```

**Rules:**
- Never auto-evolve without 3+ high-confidence entries from same domain
- Always create as draft first — never auto-promote to final skills
- Include source entries as evidence in the draft SKILL.md
- User must explicitly approve evolve (at session end or via direct command)

### Integration with existing pipeline

| Existing mechanism | Enhanced with |
|-------------------|--------------|
| PLAYBOOK.md Applied counter | + confidence score + last_validated date |
| knowledge/ promotion (Applied >= 3) | + confidence >= 0.8 requirement |
| SKILL-LOG.md proposals | + auto-evolve proposals from clustered entries |
| Save/Discard Gate (2/3 criteria) | + initial confidence = 0.5 (uncertain until validated) |
| Session end (`session-end.sh`) | + confidence decay: -0.05 if not validated in 30 days |

### Commands

| Trigger | Action |
|---------|--------|
| "confidence report" | Show all entries sorted by confidence |
| "evolve skills" | Cluster high-confidence patterns → propose drafts |
| "validate playbook" | Re-check all entries against current codebase |
| "decay check" | Flag entries not validated in 30+ days |
