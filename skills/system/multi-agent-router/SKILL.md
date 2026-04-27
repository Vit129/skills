---
name: multi-agent-router
description: >
  Routes tasks to the right AI agent (Gemini, Codex, Claude) based on token cost and task type.
  Use when: "read all files", "scan entire codebase", "read entire structure",
  "plan the implementation", "design the system", "lay out the architecture",
  "give me an overview of the project", "summarize the repo",
  "refactor the entire project", "migrate all files", "large codebase analysis", "token budget".
  Works for: any task where routing to a cheaper/larger-context agent saves Claude tokens.
concurrency: safe
isolation: stateless
---

# Multi-Agent Router

Route tasks to the right agent before burning Claude tokens on large reads or planning.

```text
Gemini / Codex  = large context reads, planning, codebase summarization
Claude          = verification, reasoning, surgical implementation, test writing
```

## Routing Decision Table

| Task Type | Route To | Reason |
|-----------|----------|--------|
| Read entire project structure (>50 files) | **Gemini / Codex** | Larger context window, saves Claude tokens |
| Large-scale planning / architecture design | **Gemini / Codex** | Gemini thinking mode / Codex reasoning excels at planning |
| Summarize codebase / repo overview | **Gemini / Codex** | Reduces token burn on Claude's side |
| Verify correctness of plan/design | **Claude** | Claude excels at reasoning + verification |
| Implementation / code writing | **Claude** | Claude excels at surgical code changes |
| Small targeted edits (<5 files) | **Claude directly** | Not worth routing overhead |
| Test writing + auto-heal | **Claude** | Needs implementation context |

## Token Budget Rule

| Estimated Token Read | Action |
|----------------------|--------|
| > 100K tokens | **Must use Gemini / Codex** |
| 50K – 100K tokens | **Prefer Gemini / Codex** |
| < 50K tokens | Claude directly |

## Workflow

```
Step 1 — Gemini / Codex reads & plans
  → Output: structured plan (markdown)

Step 2 — Claude verifies
  → Check: correctness, edge cases, alignment with project rules

Step 3 — Claude implements
  → Surgical changes based on verified plan
  → Run tests + auto-heal if needed
```

Announce routing decision before starting: `[Routing: Gemini/Codex → Claude]`

## Trigger Keywords

Route to Gemini / Codex first when request contains:

- "read all files", "scan entire codebase", "read entire structure"
- "plan the implementation", "design the system", "lay out the architecture"
- "give me an overview", "summarize the repo"
- "refactor the entire project", "migrate all files"

## CLI Commands

### Gemini

```bash
# อ่าน structure + plan
gemini -p "Analyze the project structure in {path}. List all key files, their purpose, and dependencies. Output as markdown."

# Planning mode (thinking)
gemini --thinking -p "Design the implementation plan for: {task}. Consider: {constraints}. Output structured plan."

# Summarize large codebase
gemini -p "Read all files under {path}. Summarize: architecture, patterns used, entry points, and key abstractions."
```

### Codex

```bash
# อ่าน structure + plan
codex "Analyze the project structure in {path}. List all key files, their purpose, and dependencies. Output as markdown."

# Planning mode (full-auto)
codex --approval-mode full-auto "Design the implementation plan for: {task}. Consider: {constraints}. Output structured plan."

# Summarize large codebase
codex "Read all files under {path}. Summarize: architecture, patterns used, entry points, and key abstractions."
```

## Adding a New Agent

1. Add a row to the Routing Decision Table above
2. Add CLI Commands section for the new agent
3. Update trigger keywords if needed
4. Update `CLAUDE.md` Section 6 reference (no other changes needed)
