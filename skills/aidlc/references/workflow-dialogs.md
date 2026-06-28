# Dialog & Artifact Integration (Kiro)

> Load this file when using Kiro IDE tools (userInput, invokeSubAgent) or when setting up dialog format.

How AIDLC interacts with users and stores artifacts — applies to ALL AI agents and ALL modes.

## Core Rules

1. **ALL artifacts → `agent-memory/`** — see `workflow.md` § Artifact Locations
2. **Dialog message format** — ALL AIDLC interactions use structured dialog, not plain chat
3. **Agent-agnostic** — applies to Kiro, Claude Code, Gemini, and any other AI agent
4. **⛔ ONE question per message** — Present options as numbered list. STOP and WAIT before asking next.

## Artifact Path

```text
agent-memory/plans/[feature]/
├── plan.md
├── dev-tasks.md
├── qa-tasks.md
└── outputs/
agent-memory/CONTEXT.md     ← progress + phase history
agent-memory/MEMORY.md      ← resolved decisions
```

AIDLC does NOT write to `.kiro/specs/` or any other location.

## Dialog Message Format

### Phase Announcement
```text
📋 Phase {N}: {Phase Name}
Mode: {Full/QA Only/Dev Only}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{Phase description}
📎 Prerequisites: {list or "✅ all met"}
📂 Output: {expected file path}
```

### Decision Dialog
```text
🔷 Decision Required — {topic}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{Context}
Options:
1. {Option A} — {rationale}
2. {Option B} — {rationale}
💡 Recommendation: {N} — {why}
```

### Progress Update
```text
✅ {Task/Phase} Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 Output: {file path}
📊 Progress: {N}/{Total} tasks done
⏭️ Next: {next phase or task}
```

## Kiro Tool Mapping (MANDATORY)

| AIDLC Interaction | Kiro Tool | Usage |
|-------------------|-----------|-------|
| Decision Dialog | `userInput` | Use `options` param with title/description/recommended |
| Phase Approval | `userInput` | options: ["Proceed", "Wait", "Change approach"] |
| Mode Selection | `userInput` | options: ["Full", "QA Only", "Dev Only"] |
| Brainstorming Scale | `userInput` | options: ["Quick", "Normal", "Full"] |
| Brainstorming Questions | `userInput` | ONE role per call — wait for answer — then next role |
| Task Execution (Phase 3.1) | `invokeSubAgent` | name="general-task-execution" |

**Rules:**
- **NEVER plain chat text** for decisions/approvals — always `userInput` with structured options
- **ONE question per `userInput` call** — never combine
- **NEVER skip `invokeSubAgent`** when Phase 3.1 has 3+ independent tasks

## Sub-Agent Mapping (MANDATORY)

Use `invokeSubAgent` at these specific AIDLC phases. Each sub-agent has a defined role — do NOT substitute.

| Phase | Sub-Agent | `name` param | When to invoke | What to pass in `contextFiles` |
|-------|-----------|-------------|----------------|-------------------------------|
| **Phase 0** (Project Detection) | context-gatherer | `"context-gatherer"` | ALWAYS — before writing any artifact | workspace root path |
| **Phase 1.1** (Reverse Engineering) | context-gatherer | `"context-gatherer"` | Brownfield only — scan existing codebase | source folder(s) |
| **Phase 1.2** (Requirements) | requirement-detailer | `"requirement-detailer"` | When detailing each user story / PBI | PBI text or user-stories draft |
| **Phase 1.8** (Brainstorming 3 Amigos) | general-task-execution | `"general-task-execution"` | Dispatch PO / Dev / QA roles in parallel | all Phase 1 artifacts + gap.md output |
| **Phase 2.1** (QA Task Design) | context-gatherer | `"context-gatherer"` | Before designing tasks — scan existing test patterns | `knowledge/automation/` + existing test root |
| **Phase 2.4** (Test Script Design) | general-task-execution | `"general-task-execution"` | When writing 3+ spec files in parallel | `implementation-plan.md`, `testid-map.md`, coding rules |
| **Phase 2.5** (Dev Task Design) | context-gatherer | `"context-gatherer"` | Before designing dev tasks — scan existing source patterns | source root, `logical-design.md` |
| **Phase 3.1** (Implementation) | general-task-execution | `"general-task-execution"` | MANDATORY when 3+ independent tasks exist | `dev-task-progress.md`, `logical-design.md`, relevant source files |
| **Phase 3.2** (Automated Testing) | general-task-execution | `"general-task-execution"` | When running/healing 3+ test files in parallel | spec files, `implementation-plan.md` |
| **Phase 3.3** (Pull Request / Review) | general-task-execution | `"general-task-execution"` | Dispatch review-personas (code + test + security) in parallel | changed files, `audit.md` |

### Sub-Agent Selection Guide

| Sub-Agent | Role | Use when |
|-----------|------|----------|
| `context-gatherer` | Explore & map | Starting unfamiliar phase, need to find relevant files before acting |
| `requirement-detailer` | Detail & refine | Expanding a single requirement — edge cases, AC, QA angles |
| `general-task-execution` | Execute & parallelize | Implementing tasks, dispatching roles, running parallel workstreams |
| `custom-agent-creator` | Create new agent | User asks to build a new recurring-task agent |

### Trigger Rules

- **context-gatherer** — invoke ONCE per phase at the START, before writing any file. Do not re-invoke mid-phase.
- **requirement-detailer** — invoke ONCE per user story / PBI item. If 3+ stories exist, invoke in parallel.
- **general-task-execution** — invoke per independent task batch. Group tasks that share no file dependency into one batch.
- **NEVER invoke sub-agents for**: decision dialogs, plan creation, audit updates, or single-file edits — do those inline.

## Examples

**Decision Dialog:**
```text
userInput(
  question: "🔷 D1: ต้องการเริ่มจาก PBI ไหนก่อนครับ?",
  options: [
    { title: "PBI-001 Travel Core", description: "Flight, JR Pass & AI Trip Planner (Medium)", recommended: true },
    { title: "PBI-002 Health & Safety", description: "Insurance, Allergy & Emergency SOS (Hard)" }
  ]
)
```

**Brainstorming Question:**
```text
userInput(
  question: "🧑‍💼 PO Lens (Round 1): ถ้าต้องตัด scope ให้เหลือ MVP — must-have 3 อันดับแรกคืออะไร?",
  reason: "general-question"
)
```

**Subagent Dispatch:**
```text
invokeSubAgent(
  name: "general-task-execution",
  prompt: "Implement task 3.1.2: Create flight search mock handler...",
  explanation: "Dispatching independent task to subagent",
  contextFiles: [
    { path: "agent-memory/plans/pbi-001/outputs/construction/logical-design.md" }
  ]
)
```
