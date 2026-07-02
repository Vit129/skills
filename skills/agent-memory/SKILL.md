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
├── CONTEXT.md         ← Hot state — current task, handoff, claims, open questions, key files, session notes
├── MEMORY.md          ← Persistent decisions + lessons (append-only)
├── PLAYBOOK.md        ← Problem resolution cases (scored)
├── SKILL-LOG.md       ← Skill improvement proposals (append-only)
├── USER-PROFILE.md    ← User preferences (stable, loaded at session start)
├── EVAL-STATE.md      ← Last eval date tracker (updated by eval-check hook)
├── index.md           ← Catalog of knowledge/ and plans/
├── skill-usage.log    ← Auto-captured skill usage (hook-written, do not edit)
├── plans/             ← Implementation plans
├── evals/             ← Eval results (skill stocktake, pass@3 reports)
├── drafts/            ← Temporary resolution drafts (ephemeral)
└── knowledge/         ← Promoted cases + crystallized patterns
    └── archive-playbook.md  ← Zero-score/retired cases
```

> **v2 change:** `memory.md` (single hot-state file) is replaced by two files:
> - `CONTEXT.md` — session-scoped hot state (rewritten each session)
> - `MEMORY.md` — append-only persistent decisions and lessons

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
| "draft format", "playbook format", "memory format", "context format" | `references/templates/` — show the relevant template |
| "subagent", "memory curator", "knowledge curation", "delegate memory" | `references/subagent-patterns.md` |
| "skill evolve", "self-improve", "skill proposal", "apply proposal" | `references/session-flow.md` → Skill Self-Evolution section |
| "review rubric", "self-review", "what to save", "grading criteria" | `references/self-review-rubric.md` |

## Quick Reference

- **Session start**: Hook reads `CONTEXT.md` + `MEMORY.md` + `USER-PROFILE.md` → searches `PLAYBOOK.md`
- **Mid-session**: Hook checkpoints `CONTEXT.md` (Now/Open Questions) after each task
- **Problem resolved**: Create draft in `drafts/` immediately
- **Skill evolve**: Hook checks if skill can be improved after each task → proposes in `SKILL-LOG.md`
- **Session end**: Knowledge-curate hook promotes/crystallizes/archives → Session-save hook evaluates drafts + scores
- **Skill underperformed**: Flag goes into `CONTEXT.md` (session-scoped) or `MEMORY.md` (if recurring)

## Knowledge Capture

- `CONTEXT.md` is the hot state: current task, handoff, claims, open questions, key files, session notes. Rewritten each session.
- `MEMORY.md` is append-only: decisions, lessons (CASE-xxx), conventions. Never overwrite — only append.
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

- `CONTEXT.md` answers: "What is happening right now?"
- `MEMORY.md` answers: "What decisions and lessons persist across sessions?"
- `PLAYBOOK.md` answers: "What fix worked before?"
- `SKILL-LOG.md` answers: "What should the skill system learn or change?"
- `knowledge/` answers: "What should be kept as durable reference knowledge?"

## Multi-Agent / Multi-Session Handoff

Same project, different AI tool (Codex, Gemini, Kiro) or a different Claude Code session — everything lives in `CONTEXT.md`, no separate file, since it's rewritten every session anyway:

- **Sequential** (one finishes, another continues later): run `Skill(handoff)` — fills `CONTEXT.md`'s `## Handoff` section (`From` / `To` / `Suggested skills` / `Note`), summarizing rather than dumping transcript, referencing artifacts instead of duplicating them, and redacting secrets. Name-only skill (frontmatter `disable-model-invocation: true`, mirrored in `settings.json` → `skillOverrides`) — invoke explicitly, it won't fire on every session end. `session-start.sh` prints the block automatically next session if non-empty.
- **Parallel** (agents working at the same time): add a line to `CONTEXT.md`'s `## Claims` section before starting a sub-task; delete your line when done. `session-start.sh` prints unreleased claims so the next agent sees what's already in flight before picking overlapping work.

`## Claims` is advisory, not a hard lock — since `CONTEXT.md` is rewritten wholesale (not appended) at session end, two agents writing at the exact same instant can still clobber each other. Acceptable tradeoff for a single operator orchestrating multiple tools; if true concurrent writes ever become a real problem, the upgrade path is back to a dedicated append-only file.

## Hooks (6 total)

| Hook | Event | Files Touched |
|------|-------|---------------|
| session-load v3.1 | promptSubmit | reads: CONTEXT.md, MEMORY.md, USER-PROFILE.md, PLAYBOOK.md |
| checkpoint v1.0 | postTaskExecution | writes: CONTEXT.md, drafts/ |
| skill-check v1.0 | postToolUse (write) | writes: CONTEXT.md (session flags) |
| skill-evolve v1.0 | postTaskExecution | writes: SKILL-LOG.md |
| knowledge-curate v1.0 | agentStop | writes: PLAYBOOK.md, knowledge/; deletes: drafts/ |
| session-save v4.0 | agentStop | writes: CONTEXT.md, MEMORY.md, PLAYBOOK.md, SKILL-LOG.md |

## Rules

- `CONTEXT.md` max 2,500 bytes — rewritten each session; consolidate when exceeded
- `MEMORY.md` is append-only — never overwrite or delete entries, only append
- `USER-PROFILE.md` — stable preferences, update only when user explicitly changes them
- Task entry in CONTEXT.md max 5 active — stale after 3 sessions without update
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
grep_search "auth timeout" in knowledge/ + PLAYBOOK.md + MEMORY.md

# Search by domain
grep_search in knowledge/qa/ for test patterns
grep_search in knowledge/bug/ for past root causes
```

### Search Priority Order

1. `CONTEXT.md` — current session context (always loaded)
2. `MEMORY.md` — persistent decisions + lessons (search by CASE-xxx or keyword)
3. `PLAYBOOK.md` — scored cases (search by trigger keyword)
4. `knowledge/{domain}/` — promoted patterns (search by domain + keyword)
5. `drafts/` — recent unscored resolutions (ephemeral)

### When to Search

| Situation | Search where |
|-----------|-------------|
| Starting a new task in familiar domain | `PLAYBOOK.md` + `knowledge/{domain}/` |
| Bug looks familiar | `knowledge/bug/` + `PLAYBOOK.md` (filter by trigger) |
| Need architecture context | `knowledge/arch/` |
| Need business rules | `knowledge/biz/` |
| Recurring decisions | `MEMORY.md` (Decisions section) |
| Skill keeps failing | `CONTEXT.md` flags + `SKILL-LOG.md` |

---

## User Modeling (inspired by Hermes Honcho)

Build a deepening model of the user across sessions via `USER-PROFILE.md`.

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
- Update `USER-PROFILE.md` max once per session (not every turn)
- Separate facts from preferences: facts are verifiable, preferences are stated

---

## Context Compression (inspired by Hermes /compress)

When context grows too large mid-session, compress without losing critical information.

### When to Compress

- `CONTEXT.md` exceeds 2,500 bytes
- Active task list has 5+ entries (consolidate old ones)
- `PLAYBOOK.md` has 20+ entries (archive zero-score)
- Session has 50+ turns without resolution

### Compression Strategy

1. **CONTEXT.md:** Keep only current task + open questions + key files. Archive stale tasks to `MEMORY.md` as a lesson.
2. **PLAYBOOK.md:** Archive entries with Applied=0, Prevented=0, older than 30 days
3. **MEMORY.md:** Never compress — this is the permanent append-only store
4. **Knowledge:** Never compress — this is the permanent store

### Compression Rules

- NEVER delete information that hasn't been promoted to `knowledge/` or `MEMORY.md`
- ALWAYS archive before deleting (move to `archive-playbook.md`)
- Summarize, don't truncate — preserve the "why" even when removing detail
- After compression, verify `CONTEXT.md` is under 2,500 bytes

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
| After Save/Discard Gate scores a draft | Checkbox | User confirms: save to PLAYBOOK.md or discard |
| After skill-evolve proposes improvement | Single select | User picks: apply / defer / reject |
| After auto-promote (Applied >= 3) | Checkbox | User confirms promotion to knowledge/ |
| After compression | Open field | User reviews what was archived |
| After user-profile inference | Checkbox | User confirms or corrects inferred preference |

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

- [ ] `CONTEXT.md` is under 2,500 bytes and reflects current session state
- [ ] `MEMORY.md` only has new entries appended (no overwriting)
- [ ] Active task list has max 5 entries in CONTEXT.md
- [ ] No secrets/credentials stored in any memory file
- [ ] `PLAYBOOK.md` entries have proper scoring fields
- [ ] Knowledge files have tags in `knowledge/` if using index
- [ ] Drafts are ephemeral (deleted after gate evaluation)
- [ ] `USER-PROFILE.md` inferences marked with confidence level

---

## Skill Stocktake (Audit & Health Check)

> Trigger: "skill stocktake", "audit skills", "skill health", "ตรวจ skills"
> Run manually or schedule via eval-check hook (weekly)

### What it checks

| Check | Source | Flag if |
|-------|--------|---------|
| **Unused skills** | `SKILL-LOG.md` — last used date | Not used in 30+ days |
| **Underperforming skills** | `CONTEXT.md` flags | Flagged 3+ times without fix |
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
- User must explicitly approve evolve (via session-save nudge or direct command)

### Integration with existing pipeline

| Existing mechanism | Enhanced with |
|-------------------|--------------|
| PLAYBOOK.md Applied counter | + confidence score + last_validated date |
| knowledge/ promotion (Applied >= 3) | + confidence >= 0.8 requirement |
| SKILL-LOG.md proposals | + auto-evolve proposals from clustered entries |
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

- **Hook:** `session-save.json` appends to `agent-memory/SKILL-LOG.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in SKILL-LOG.md → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `CONTEXT.md`
