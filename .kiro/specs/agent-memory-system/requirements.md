# Requirements Document

## Introduction

The Agent Memory System provides cross-domain persistent memory for the `.claude` workspace agent. It serves ALL skill domains — coding skills governed by AIDLC (ai-dlc/core, ai-dlc/qa, ai-dlc/dev, ai-dlc/po, ai-dlc/ux-ui), non-coding skills with NO AIDLC governance (finance, fitness, thai-accountant), and system/meta skills (system/ai-techniques, skill-creator, hook-creator, multi-agent-router).

Design inspirations: Hermes Agent (structured memory with hot state) and MemPalace (searchable knowledge rooms). The architecture follows Karpathy's Simplicity First principle — lean base files, no speculative abstractions, minimum viable structure that works across all domains.

The chosen design is **Lean base + Decisions In Force + compact CASES**:

- `agent-memory/memory.md` (2.5KB max) — hot state loaded first at session start
- `agent-memory/skill-log.md` — append-only skill changelog
- `agent-memory/playbook.md` — compact searchable problem resolution table
- `agent-memory/drafts/` — temporary resolution drafts pending save/discard gate
- `agent-memory/knowledge/` — optional detailed lesson files referenced by Playbook entries (not auto-loaded)

The system uses Kiro hooks for automated memory operations — loading memory at session start, saving memory at session end, and checking skill health after write operations — so that memory workflows trigger consistently without manual intervention.

The system must respect existing rules in `.claude/rules/` (agent-core.md, project-rules.md, token_efficient.md) and integrate with the existing `.claude/.kiro/steering/agent-memory-self-improve.md` steering rules. Token efficiency is critical — every byte in `agent-memory/` must earn its place.

## Glossary

- **Agent**: The AI assistant (Claude, Gemini, or Codex) operating within the `.claude` workspace
- **Hot_Memory**: The `agent-memory/memory.md` file containing the four most critical memory sections, loaded first at every session start
- **Task_Ledger**: A section within Hot_Memory tracking up to 5 active tasks across all domains (coding and non-coding)
- **Coding_Task**: A task governed by AIDLC with progress tracked in `.aidlc/` folders; format: system/feature/phase/status
- **Non_Coding_Task**: A task routed directly to a skill with no AIDLC governance and no `.aidlc/` folder; format: domain/goal/status
- **Skill_Flag**: An entry in Hot_Memory indicating a skill that underperformed, spanning any domain (coding, finance, fitness, accounting)
- **Decisions_In_Force**: A section within Hot_Memory recording active architectural or behavioral decisions that persist across sessions
- **Recent_Lessons**: A section within Hot_Memory holding references (IDs only) to the last 5 lessons learned
- **Skill_Log**: The `agent-memory/skill-log.md` append-only file recording all skill improvement proposals and their outcomes
- **Playbook**: The `agent-memory/playbook.md` flat searchable table of resolved problems across all domains
- **Draft**: A temporary file in `agent-memory/drafts/` holding a problem resolution before the save/discard gate evaluates it
- **Save_Discard_Gate**: The 3-criteria evaluation (novel, likely to recur, non-trivial) that determines whether a draft becomes a permanent case
- **Evidence_Gate**: Domain-appropriate verification required before saving: test pass or build pass for coding; user approval or verified outcome for non-coding
- **AIDLC**: AI Development Life Cycle — the governance framework for coding and QA tasks, using `.aidlc/` folder structure
- **Session**: A single continuous interaction between the user and the Agent, from start to end of conversation
- **Memory_File**: The `agent-memory/memory.md` file, synonym for Hot_Memory
- **Stale_Entry**: A Task_Ledger entry that has not been updated for more than 3 sessions
- **Knowledge_Detail**: A detailed lesson file stored in `agent-memory/knowledge/` that a Playbook entry references when the resolution exceeds the 120-character compact format
- **Memory_Hook**: A `.kiro.hook` file stored in `.kiro/hooks/` that automates a memory operation (session load, session save, or skill flag check) by triggering on a specific IDE event

## Requirements

### Requirement 1: Hot Memory File

**User Story:** As an Agent, I want a single compact hot memory file loaded at session start, so that I have immediate context about active work, recent lessons, skill health, and standing decisions without scanning multiple files.

#### Acceptance Criteria

1. THE Agent SHALL maintain a Hot_Memory file at `agent-memory/memory.md` containing exactly four sections: Task_Ledger, Recent_Lessons, Skill_Flags, and Decisions_In_Force
2. THE Agent SHALL load the Hot_Memory file as the first memory operation at session start, before any other `agent-memory/` file
3. WHILE the Hot_Memory file exceeds 2,500 bytes, THE Agent SHALL consolidate content by removing the oldest Stale_Entry or the lowest-priority Skill_Flag before adding new content
4. IF the Hot_Memory file does not exist at session start, THEN THE Agent SHALL create it with empty sections using the defined four-section structure
5. THE Agent SHALL write updates to Hot_Memory immediately when state changes occur during a session, not only at session end

### Requirement 2: Task Awareness

**User Story:** As an Agent, I want the Task_Ledger to track both coding tasks (with AIDLC phases) and non-coding tasks (with simple goal tracking), so that I maintain awareness of active work across all skill domains.

#### Acceptance Criteria

1. THE Task_Ledger SHALL support two entry formats: Coding_Task entries with fields system, feature, phase, and status; and Non_Coding_Task entries with fields domain, goal, and status
2. THE Task_Ledger SHALL contain a maximum of 5 entries at any time
3. WHEN a new task is added and the Task_Ledger already contains 5 entries, THE Agent SHALL remove the oldest Stale_Entry to make room
4. IF all 5 entries are active (none stale), THEN THE Agent SHALL prompt the user to select which entry to archive before adding the new task
5. WHEN a Coding_Task is added, THE Agent SHALL reference the corresponding `.aidlc/` path without duplicating content from PROGRESS.md
6. WHEN a Non_Coding_Task is added, THE Agent SHALL record domain and goal directly in the Task_Ledger without creating any `.aidlc/` folder
7. THE Agent SHALL mark a Task_Ledger entry as stale when it has not been updated for 3 consecutive sessions

### Requirement 3: Skill Usage Signals

**User Story:** As an Agent, I want to track underperforming skills across all domains (coding, finance, fitness, accounting), so that I can identify skills that need improvement regardless of whether they are AIDLC-governed or not.

#### Acceptance Criteria

1. THE Skill_Flags section SHALL contain a maximum of 5 entries at any time
2. WHEN a skill produces an incorrect or suboptimal result in any domain, THE Agent SHALL add a Skill_Flag entry with the skill path, domain, failure description, and session date
3. WHEN a flagged skill completes 3 consecutive successful uses, THE Agent SHALL remove the corresponding Skill_Flag entry
4. THE Skill_Flags section SHALL accept entries from all skill domains: coding skills (ai-dlc/*), non-coding skills (finance/*, fitness/*, thai-accountant/*), and system skills (system/*)
5. IF a new Skill_Flag is added and the section already contains 5 entries, THEN THE Agent SHALL replace the oldest entry that has the most consecutive successes since flagging

### Requirement 4: Skill Self-Evolution

**User Story:** As an Agent, I want to propose and track improvements to any skill (coding or non-coding) based on Skill_Flags, so that skills evolve based on real usage failures.

#### Acceptance Criteria

1. WHEN a Skill_Flag exists for a skill, THE Agent SHALL generate at most 1 improvement proposal per session for that skill
2. THE Agent SHALL record each proposal in the Skill_Log at `agent-memory/skill-log.md` as an append-only entry with fields: date, skill path, problem summary, proposed change, and status (proposed/approved/applied/rejected)
3. THE Agent SHALL require explicit user approval before applying any proposed change to a SKILL.md file
4. THE Skill_Log SHALL accept entries for all skill types: coding skills (ai-dlc/*), non-coding skills (finance/*, fitness/*, thai-accountant/*), and system skills (system/*)
5. WHEN a proposal is approved and applied, THE Agent SHALL update the Skill_Log entry status from proposed to applied
6. WHEN a proposal is rejected by the user, THE Agent SHALL update the Skill_Log entry status to rejected and retain the entry for historical reference

### Requirement 5: Problem Resolution Capture

**User Story:** As an Agent, I want to immediately capture problem resolutions as drafts when they occur in any domain, so that valuable troubleshooting knowledge is not lost between sessions.

#### Acceptance Criteria

1. WHEN the Agent resolves a problem during a session, THE Agent SHALL create a Draft file in `agent-memory/drafts/` with fields: trigger (what went wrong), fix (what resolved it), domain, and outcome
2. THE Agent SHALL create the Draft immediately upon resolution, not deferred to session end
3. THE Draft format SHALL be domain-agnostic, supporting problems from all domains: Playwright test failures, tax calculation errors, nutrition miscalculations, stock analysis mistakes, build failures, and any other domain-specific errors
4. THE Agent SHALL use a filename format of `{YYYY-MM-DD}-{short-slug}.md` for Draft files
5. IF the `agent-memory/drafts/` directory does not exist, THEN THE Agent SHALL create it before writing the Draft

### Requirement 6: Save/Discard Gate

**User Story:** As an Agent, I want a structured gate that evaluates drafts against three criteria before saving them permanently, so that only valuable, evidence-backed resolutions enter the Playbook.

#### Acceptance Criteria

1. THE Save_Discard_Gate SHALL evaluate each Draft against three criteria: novel (not already covered by an existing case), likely to recur (the problem pattern may appear again), and non-trivial (the fix is not obvious or single-step)
2. WHEN a Draft meets at least 2 of the 3 criteria, THE Agent SHALL proceed to the Evidence_Gate
3. WHEN a Draft meets fewer than 2 of the 3 criteria, THE Agent SHALL delete the Draft file from `agent-memory/drafts/`
4. WHEN the Evidence_Gate is reached for a Coding_Task resolution, THE Agent SHALL require a passing test or passing build as evidence before saving
5. WHEN the Evidence_Gate is reached for a Non_Coding_Task resolution, THE Agent SHALL require user approval or a verified outcome as evidence before saving
6. WHEN a Draft passes both the Save_Discard_Gate and the Evidence_Gate, THE Agent SHALL append the resolution to the Playbook and delete the Draft file
7. THE Agent SHALL evaluate all remaining Draft files in `agent-memory/drafts/` before session end

### Requirement 7: Playbook — Problem Resolution Table

**User Story:** As an Agent, I want a flat, searchable table of resolved problems across all domains, so that I can quickly find relevant past fixes when encountering similar issues.

#### Acceptance Criteria

1. THE Playbook SHALL be stored at `agent-memory/playbook.md` as a flat markdown table with columns: ID, Trigger, Fix, Domain, and Outcome
2. THE Agent SHALL assign each case a sequential ID in the format `CASE-{NNN}` starting from `CASE-001`
3. WHEN a new session starts and the Task_Ledger contains an active task, THE Agent SHALL search the Playbook for entries with matching domain or similar trigger keywords
4. THE Playbook SHALL support entries from all domains without domain-specific schema variations
5. WHEN the Agent finds a matching case during search, THE Agent SHALL reference the case ID in the current session context
6. THE Agent SHALL keep each table row concise: Trigger and Fix fields limited to 120 characters each to maintain scannability
7. WHEN a Playbook entry needs more detail than 120 characters, THE Agent SHALL store the detail in `agent-memory/knowledge/` and include the file path in the Playbook row

### Requirement 8: Storage Boundaries

**User Story:** As an Agent, I want strict boundaries on where memory files are stored and what they contain, so that the memory system does not interfere with AIDLC progress tracking, leak secrets, or create files outside its designated directory.

#### Acceptance Criteria

1. THE Agent SHALL store all memory files exclusively within the `agent-memory/` directory at the project root
2. THE Agent SHALL NOT write to, modify, or create files within any `.aidlc/` directory as part of memory operations
3. THE Agent SHALL NOT store secrets, credentials, API keys, or personally identifiable information in any `agent-memory/` file
4. THE Agent SHALL treat all files in `agent-memory/drafts/` as ephemeral and delete them after the Save_Discard_Gate evaluation completes
5. THE Agent SHALL operate correctly when `.aidlc/` directories exist (coding task context) and when they do not exist (non-coding task context)
6. THE Agent SHALL NOT create subdirectories within `agent-memory/` beyond the defined structure: `memory.md`, `playbook.md`, `skill-log.md`, `drafts/`, and `knowledge/`
7. WHEN the Agent reads from `.aidlc/` directories for Coding_Task context, THE Agent SHALL treat those reads as read-only references and not cache their content in `agent-memory/` files

### Requirement 9: Knowledge Detail Files

**User Story:** As an Agent, I want an optional folder for storing detailed lesson files that the Playbook references, so that complex resolutions can be preserved in full without bloating the compact Playbook table.

#### Acceptance Criteria

1. THE Agent SHALL maintain an optional `agent-memory/knowledge/` directory for storing detailed lesson files
2. THE Agent SHALL NOT auto-load files from `agent-memory/knowledge/` at session start
3. WHEN a Playbook entry references a knowledge detail file, THE Agent SHALL load the referenced file on-demand only when the matching case is relevant to the current task
4. THE Agent SHALL use a filename format of `{YYYY-MM-DD}-{short-slug}.md` for knowledge detail files
5. THE knowledge detail files SHALL be domain-agnostic, supporting detailed resolutions from all domains: coding (api, webUi, mobile), finance, fitness, accounting, and system
6. IF the `agent-memory/knowledge/` directory does not exist, THEN THE Agent SHALL create it only when a Playbook entry requires a detail file

### Requirement 10: Memory Hooks

**User Story:** As an Agent, I want automated hooks that load memory at session start, checkpoint mid-session, save memory at session end, and check skill health after tool use, so that memory operations happen consistently and survive session interruptions.

#### Acceptance Criteria

1. THE Memory_System SHALL include a Session Load hook that triggers on the first `promptSubmit` event of a session only and instructs the Agent to read `agent-memory/memory.md` first, then search `agent-memory/playbook.md` for cases matching the current task context before proceeding with the user's request. Subsequent prompts within the same session SHALL NOT re-trigger this hook
2. THE Memory_System SHALL include a Mid-Session Checkpoint hook that triggers on `postTaskExecution` events and instructs the Agent to update `agent-memory/memory.md` (Task_Ledger status and Decisions_In_Force) and create a Draft in `agent-memory/drafts/` if a problem was resolved during the task. This ensures memory is saved incrementally even if the session is interrupted
3. THE Memory_System SHALL include a Session Save hook that triggers on `agentStop` events and instructs the Agent to check whether the session produced meaningful state changes (task progress, new decisions, problem resolutions, or skill flags). IF no meaningful changes occurred (e.g., Q&A, comparison, research without decisions), THEN the Agent SHALL skip the save operation entirely. IF meaningful changes occurred, THEN the Agent SHALL perform a final sweep: update `agent-memory/memory.md`, evaluate all pending drafts in `agent-memory/drafts/` through the Save_Discard_Gate, append passing resolutions to `agent-memory/playbook.md`, and note skill proposals in `agent-memory/skill-log.md`
4. THE Memory_System SHALL include a Skill Flag Check hook that triggers on `postToolUse` events for `write` tool types and instructs the Agent to evaluate whether the skill used in the current task produced correct results, and if not, add or update a Skill_Flag entry in `agent-memory/memory.md`
5. ALL hooks SHALL be stored as `.kiro.hook` files in the `.kiro/hooks/` directory of the workspace
6. THE Session Load hook SHALL NOT block the user's request — it SHALL load memory context and then proceed with the user's message in the same turn
7. ALL hooks that write to `agent-memory/` files SHALL report a brief summary to the user indicating which files were updated (e.g., `📝 Checkpoint: memory.md updated, 1 draft created`)

#### Hook File Specifications

**Hook 1: agent-memory-session-load.kiro.hook**

```json
{
  "name": "Agent Memory — Session Load",
  "version": "1.0.0",
  "description": "Load agent memory on first prompt of session. Reads memory.md and searches playbook.md for relevant cases.",
  "when": {
    "type": "promptSubmit"
  },
  "then": {
    "type": "askAgent",
    "prompt": "This is the first message of the session. Before responding, read agent-memory/memory.md for current task context, decisions, skill flags, and recent lessons. If the Task_Ledger has active tasks, search agent-memory/playbook.md for cases with matching domain or trigger keywords. Then proceed with the user's request. Do NOT re-read memory on subsequent prompts in this session."
  }
}
```

**Hook 2: agent-memory-checkpoint.kiro.hook**

```json
{
  "name": "Agent Memory — Mid-Session Checkpoint",
  "version": "1.0.0",
  "description": "After each spec task completes, checkpoint memory state so progress survives session interruptions.",
  "when": {
    "type": "postTaskExecution"
  },
  "then": {
    "type": "askAgent",
    "prompt": "A task just completed. Checkpoint agent memory: 1) Update agent-memory/memory.md — refresh Task_Ledger entry for the completed task and update Decisions_In_Force if any decisions were made. 2) If a problem was resolved during this task, create a draft in agent-memory/drafts/ with trigger, fix, domain, and outcome. 3) Report to user: 📝 Checkpoint: [list of files updated]."
  }
}
```

**Hook 3: agent-memory-session-save.kiro.hook**

```json
{
  "name": "Agent Memory — Session Save",
  "version": "1.0.0",
  "description": "Final memory sweep at session end. Evaluates drafts, updates playbook, and reports summary.",
  "when": {
    "type": "agentStop"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Check if this session produced meaningful state changes (task progress, new decisions, problem resolutions, or skill flags). If the session was only Q&A, comparison, research, or exploration without decisions — skip saving and report: 📝 No memory changes. If meaningful changes occurred: 1) Update agent-memory/memory.md — final refresh of Task_Ledger, Decisions_In_Force, Recent_Lessons, and Skill_Flags. 2) Evaluate all files in agent-memory/drafts/ through the Save/Discard Gate (novel + recur + non-trivial, 2/3 = save). 3) For passing drafts: append to agent-memory/playbook.md and delete the draft. For failing drafts: delete the draft. 4) If any Skill_Flag has sufficient evidence, note a proposal in agent-memory/skill-log.md. 5) Report to user: 📝 Session saved: [list of files updated, cases added/discarded, proposals noted]."
  }
}
```

**Hook 4: agent-memory-skill-check.kiro.hook**

```json
{
  "name": "Agent Memory — Skill Flag Check",
  "version": "1.0.0",
  "description": "After write operations, check if the skill used produced correct results. Flag underperforming skills.",
  "when": {
    "type": "postToolUse",
    "toolTypes": ["write"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "After this write operation, briefly evaluate: did the skill used produce the correct result? If the output has errors, incorrect logic, or required significant rework, add or update a Skill_Flag entry in agent-memory/memory.md with the skill path, domain, and failure description. If the skill is already flagged and this was a success, increment its success counter. If success counter reaches 3, remove the flag. Report any flag changes to user: 📝 Skill flag: [skill] [added/updated/cleared]."
  }
}
```
