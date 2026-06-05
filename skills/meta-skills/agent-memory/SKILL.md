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
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Agent Memory

Bootstrap, manage, and reference the agent memory system.

## Memory Structure

```text
agent-memory/
├── memory.md          ← Hot state (2.5KB max) — task/project context
├── user-profile.md    ← User preferences (stable, loaded at session start)
├── playbook.md        ← Problem resolution cases (scored)
├── skill-log.md       ← Skill improvement proposals (append-only)
├── drafts/            ← Temporary resolution drafts (ephemeral)
└── knowledge/         ← Promoted cases + crystallized patterns
    ├── index.md       ← Searchable master index (tags, edges, scores)
    └── archive-playbook.md  ← Zero-score/retired cases
```

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
| "draft format", "playbook format", "memory format" | `references/templates/` — show the relevant template |
| "subagent", "memory curator", "knowledge curation", "delegate memory" | `references/subagent-patterns.md` |
| "skill evolve", "self-improve", "skill proposal", "apply proposal" | `references/session-flow.md` → Skill Self-Evolution section |
| "review rubric", "self-review", "what to save", "grading criteria" | `references/self-review-rubric.md` |

## Quick Reference

- **Session start**: Hook reads `memory.md` + `user-profile.md` → searches `playbook.md`
- **Mid-session**: Hook checkpoints `memory.md` after each task
- **Problem resolved**: Create draft in `drafts/` immediately
- **Skill evolve**: Hook checks if skill can be improved after each task → proposes in `skill-log.md`
- **Session end**: Knowledge-curate hook promotes/crystallizes/archives → Session-save hook evaluates drafts + scores
- **Skill underperformed**: Hook flags in `memory.md` after write ops

## Knowledge Capture

- `memory.md` is the hot state: current task, active decisions, lessons in force, and skill flags.
- `playbook.md` stores repeatable problem cases with scores. It is the staging area for durable lessons.
- `skill-log.md` stores skill improvement proposals only. It is not a knowledge archive.
- `knowledge/biz/` stores business rules and domain logic that should be reused.
- `knowledge/arch/` stores architecture decisions, tradeoffs, and system patterns.
- `knowledge/qa/` stores test patterns, edge cases, and verification lessons.
- `knowledge/bug/` stores bugs, root causes, and the fix that resolved them.
- `drafts/` is the temporary holding area before a draft passes the Save/Discard Gate.

### Promotion Flow

1. Problem is resolved during a task.
2. Create a draft in `drafts/` with trigger, fix, domain, and outcome.
3. At session end, score the draft with Save/Discard Gate.
4. If the draft passes, append it to `playbook.md`.
5. If the same case keeps showing up, promote it to `knowledge/{domain}/{case-id}.md` or a shared pattern file.
6. Use `skill-log.md` only when the skill itself should be improved.

### File Roles

- `memory.md` answers: "What is happening right now?"
- `playbook.md` answers: "What fix worked before?"
- `skill-log.md` answers: "What should the skill system learn or change?"
- `knowledge/` answers: "What should be kept as durable reference knowledge?"

## Hooks (6 total)

| Hook | Event | Role |
|------|-------|------|
| session-load v3.1 | promptSubmit | Load memory + user-profile + playbook search |
| checkpoint v1.0 | postTaskExecution | Save progress mid-session |
| skill-check v1.0 | postToolUse (write) | Flag underperforming skills |
| skill-evolve v1.0 | postTaskExecution | Propose skill improvements |
| knowledge-curate v1.0 | agentStop | Promote/crystallize/archive (subagent when threshold) |
| session-save v4.0 | agentStop | Final state save + scoring + nudges |

## Rules

- `memory.md` max 2,500 bytes — capacity indicator in header, consolidate when exceeded
- `user-profile.md` — stable preferences, update only when user explicitly changes them
- Task_Ledger max 5 entries — stale after 3 sessions without update
- Skill_Flags max 5 entries — auto-clear after 3 consecutive successes
- Playbook fields max 120 chars — overflow to `knowledge/`
- Playbook scoring: Applied++ when fix used, Prevented++ when trigger recognized
- Playbook auto-promote: Applied >= 3 → `knowledge/{case-id}.md`
- Playbook archive: Applied+Prevented >= 5 AND no use in 30 days → `knowledge/archive-playbook.md`
- Zero-score archive: Applied=0, Prevented=0, status=done, older than 30 days → archive
- Auto-crystallize: 3+ promoted files same domain + shared keyword → `knowledge/{domain}-pattern.md`
- Skill proposals: max 1 per skill per session, evidence-backed, auto-apply after 2+ sessions evidence
- Subagent delegation: use when 5+ playbook cases OR 3+ knowledge files same domain
- Drafts are ephemeral — deleted after Save/Discard Gate evaluation
- Never store secrets, credentials, or PII in any memory file

## Closed Learning Loops

### Skill Self-Evolution
```
task → skill-check (flag if bad) → skill-evolve (propose if good pattern missing)
  → skill-log.md (proposed) → user approves or auto-apply after 2+ sessions → skill file updated
  → next use verifies → clear flag after 3 successes
```

### Knowledge from Lessons
```
problem resolved → drafts/ → Save/Discard Gate (2/3 criteria)
  → playbook.md (scored each session) → Applied >= 3 → knowledge/{case-id}.md
  → 3+ same domain → knowledge/{domain}-pattern.md (crystallized)
  → auto-create skill draft if pattern is actionable + no existing skill covers it
  → {skills_root}/drafts/{domain}-{name}/SKILL.md (status=draft in skill-log.md)
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
grep_search "auth timeout" in knowledge/ + playbook.md + memory.md

# Search by domain
grep_search in knowledge/qa/ for test patterns
grep_search in knowledge/bug/ for past root causes
```

### Search Priority Order

1. `memory.md` — current session context (always loaded)
2. `playbook.md` — scored cases (search by trigger keyword)
3. `knowledge/{domain}/` — promoted patterns (search by domain + keyword)
4. `knowledge/index.md` — master index with tags and edges
5. `drafts/` — recent unscored resolutions (ephemeral)

### When to Search

| Situation | Search where |
|-----------|-------------|
| Starting a new task in familiar domain | `playbook.md` + `knowledge/{domain}/` |
| Bug looks familiar | `knowledge/bug/` + `playbook.md` (filter by trigger) |
| Need architecture context | `knowledge/arch/` |
| Need business rules | `knowledge/biz/` |
| Skill keeps failing | `memory.md` Skill_Flags + `skill-log.md` |

---

## User Modeling (inspired by Hermes Honcho)

Build a deepening model of the user across sessions via `user-profile.md`.

### What to Track

| Category | Examples | Update frequency |
|----------|---------|-----------------|
| **Preferences** | Language (TH/EN), verbosity, approval style | When user explicitly states |
| **Work patterns** | Preferred frameworks, naming conventions, commit style | Inferred after 3+ consistent observations |
| **Domain expertise** | Strong in QA, learning backend, expert in Playwright | Inferred from task complexity + questions asked |
| **Communication style** | Prefers bullet points, dislikes long explanations | Inferred after 5+ interactions |
| **Active projects** | CPI QA, VitProjects, your-project | Updated each session |

### Modeling Rules

- NEVER assume — only record after 3+ consistent observations
- Mark inferred entries with `(inferred, confidence: 0.7)` until confirmed
- User can override any inference: "ไม่ใช่แบบนั้น" → remove immediately
- Update `user-profile.md` max once per session (not every turn)
- Separate facts from preferences: facts are verifiable, preferences are stated

---

## Context Compression (inspired by Hermes /compress)

When context grows too large mid-session, compress without losing critical information.

### When to Compress

- `memory.md` exceeds 2,500 bytes
- Task_Ledger has 5+ entries (consolidate old ones)
- Playbook has 20+ entries (archive zero-score)
- Session has 50+ turns without resolution

### Compression Strategy

1. **Task_Ledger:** Keep only last 3 active tasks + summarize older ones in 1 line
2. **Playbook:** Archive entries with Applied=0, Prevented=0, older than 30 days
3. **Memory.md:** Consolidate repeated context into single summary line
4. **Knowledge:** Never compress — this is the permanent store

### Compression Rules

- NEVER delete information that hasn't been promoted to `knowledge/`
- ALWAYS archive before deleting (move to `archive-playbook.md`)
- Summarize, don't truncate — preserve the "why" even when removing detail
- After compression, verify `memory.md` is under 2,500 bytes

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `agent-memory/` folder | File system | All memory files live here |
| Hooks (6 total) | Event-driven | Automate load/save/checkpoint/evolve |
| `grep_search` tool | Agent tool | Session search across knowledge |
| `knowledge/` folder | Reference data | Promoted patterns and lessons |
| Git history | Shell tool | Track when memory was last updated |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After Save/Discard Gate scores a draft | Checkbox | User confirms: save to playbook or discard |
| After skill-evolve proposes improvement | Single select | User picks: apply / defer / reject |
| After auto-promote (Applied >= 3) | Checkbox | User confirms promotion to knowledge/ |
| After compression | Open field | User reviews what was archived |
| After user-profile inference | Checkbox | User confirms or corrects inferred preference |

**Rule:** Never auto-delete or auto-archive without at least logging what was removed.

## Self-Learning

The agent-memory system IS the self-learning mechanism for all other skills. It learns by:

1. **Recording good examples:** Every approved output → draft → playbook → knowledge
2. **Scoring effectiveness:** Applied/Prevented counters track what actually works
3. **Crystallizing patterns:** 3+ same domain → pattern file (reusable across projects)
4. **Proposing skill improvements:** When patterns are actionable → skill draft
5. **Archiving noise:** Zero-score entries auto-archive after 30 days

## Verification

After memory operations:

- [ ] `memory.md` is under 2,500 bytes
- [ ] Task_Ledger has max 5 entries
- [ ] No secrets/credentials stored in any memory file
- [ ] Playbook entries have proper scoring fields
- [ ] Knowledge files have tags in `index.md`
- [ ] Drafts are ephemeral (deleted after gate evaluation)
- [ ] User-profile inferences marked with confidence level

---

## Skill Stocktake (Audit & Health Check)

> Trigger: "skill stocktake", "audit skills", "skill health", "ตรวจ skills"
> Run manually or schedule via eval-check hook (weekly)

### What it checks

| Check | Source | Flag if |
|-------|--------|---------|
| **Unused skills** | `skill-log.md` — last used date | Not used in 30+ days |
| **Underperforming skills** | `memory.md` Skill_Flags | Flagged 3+ times without fix |
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
| ... | flagged 3x | Read skill-log.md → apply fix |

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

Every playbook entry and knowledge file gets a confidence score:

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
playbook entries (confidence > 0.8, same domain, 3+ entries)
  │
  ▼
Auto-cluster by keyword similarity
  │
  ▼
Generate skill draft: drafts/{domain}-{pattern}/SKILL.md
  │
  ▼
Log in skill-log.md: "auto-evolve proposal"
  │
  ▼
User approves → move to skills/{category}/{name}/SKILL.md
```

**Rules:**
- Never auto-evolve without 3+ high-confidence entries from same domain
- Always create as draft first — never auto-promote to final skills
- Include source entries as evidence in the draft SKILL.md
- User must explicitly approve evolve (via session-save nudge or direct command)

### Integration with existing pipeline

| Existing mechanism | Enhanced with |
|-------------------|--------------|
| playbook.md Applied counter | + confidence score + last_validated date |
| knowledge/ promotion (Applied >= 3) | + confidence >= 0.8 requirement |
| skill-log.md proposals | + auto-evolve proposals from clustered entries |
| Save/Discard Gate (2/3 criteria) | + initial confidence = 0.5 (uncertain until validated) |
| session-save hook | + confidence decay: -0.05 if not validated in 30 days |

### Commands

| Trigger | Action |
|---------|--------|
| "confidence report" | Show all entries sorted by confidence |
| "evolve skills" | Cluster high-confidence patterns → propose drafts |
| "validate playbook" | Re-check all entries against current codebase |
| "decay check" | Flag entries not validated in 30+ days |

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
