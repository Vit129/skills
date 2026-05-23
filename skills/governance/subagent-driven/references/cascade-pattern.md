# Cascade Pattern for Multi-Agent Orchestration

> Adapted from ECC's parallelization strategies.
> Use when multiple tasks can be worked in parallel or when orchestrating subagents.

---

## When to Use

- Phase 3 has 5+ independent tasks
- Tasks span different domains (API + UI + DB)
- Research + Implementation can overlap

---

## Pattern: Cascade Method

Organize parallel work with a sweep pattern:

```text
┌─────────────────────────────────────────────┐
│  Tab 1 (oldest)  │  Tab 2  │  Tab 3 (newest) │
│  Task A (done)   │  Task B │  Task C (active) │
│  ← sweep left    │         │  → new tasks right│
└─────────────────────────────────────────────┘
```

### Rules:
1. Open new tasks in new tabs/sessions to the RIGHT
2. Sweep LEFT to RIGHT, oldest to newest
3. Focus on at most 3-4 tasks at a time
4. Each task gets its own git worktree (if overlapping files)

---

## Pattern: Two-Instance Kickoff

For new features, start with 2 parallel agents:

| Instance | Role | Output |
|----------|------|--------|
| Agent 1 | Scaffolding | Project structure, configs, base files |
| Agent 2 | Deep Research | PRD, architecture diagrams, API docs |

**Merge point:** Both complete → combine outputs → start implementation.

---

## Pattern: Iterative Retrieval (Subagent Context)

Subagents lack the orchestrator's semantic context. Compensate:

```text
Orchestrator                    Sub-agent
     │                              │
     ├── Query + objective ────────►│
     │                              ├── Research
     │◄── Summary ──────────────────┤
     │                              │
     ├── Follow-up question ───────►│  (if insufficient)
     │                              ├── Deeper research
     │◄── Refined answer ───────────┤
     │                              │
     └── Accept (max 3 cycles) ─────┘
```

### Key: Pass OBJECTIVE context, not just the query

```markdown
❌ "Find the login endpoint"
✅ "Find the login endpoint — I need to write an auth test 
    that validates token refresh. I need the URL, required 
    headers, and response schema."
```

---

## Pattern: Sequential Phases (AIDLC-native)

```text
Phase 1: RESEARCH (context-gatherer subagent) → research-summary.md
Phase 2: PLAN (planner) → PLAN.md
Phase 3: IMPLEMENT (per-task agent) → code changes
Phase 4: REVIEW (review-personas) → review-comments.md
Phase 5: VERIFY (verification-loop) → commit or loop back
```

### Rules:
1. Each agent gets ONE clear input → produces ONE clear output
2. Outputs become inputs for next phase
3. Never skip phases
4. Store intermediate outputs in `.aidlc/` files
5. Compact between phases (natural breakpoint)

---

## Anti-Patterns

| Anti-Pattern | Why Bad | Fix |
|---|---|---|
| 5+ parallel agents on same files | Merge conflicts | Use git worktrees |
| Agent without clear scope | Wasted tokens, drift | Define input/output contract |
| Skipping research phase | Implementation based on assumptions | Always research first |
| Carrying all context forward | Context bloat | Compact between phases |
| Arbitrary parallelism | Overhead > benefit | Add agents only when truly needed |

---

## Cost Awareness

| Approach | Token Cost | When to Use |
|----------|-----------|-------------|
| Single agent, sequential | 1x | Simple tasks, < 3 files |
| Subagent delegation | 1.5x | Research + implement |
| Parallel agents (worktrees) | 2-3x | Independent features |
| Full cascade (4+ agents) | 4x+ | Only for large, time-critical work |

**Default:** Single agent. Escalate to subagents only when task complexity demands it.
