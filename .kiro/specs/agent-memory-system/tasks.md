# Implementation Plan: Agent Memory System

## Overview

Create the Agent Memory System — a markdown-only persistent memory structure for the `.claude` workspace agent. All deliverables are markdown file templates, JSON hook configuration files, and steering rule updates. No application code, no tests, no build steps. All paths are relative to the `.claude/` workspace root.

## Tasks

- [x] 1. Create directory structure and base memory files
  - [x] 1.1 Create `agent-memory/` directory and `agent-memory/memory.md` with empty four-section template
    - Create the `agent-memory/` directory at the project root
    - Write `agent-memory/memory.md` with exactly four sections: `Task_Ledger`, `Recent_Lessons`, `Skill_Flags`, and `Decisions_In_Force`
    - Each section must have its markdown table header (columns defined) but no data rows
    - Include HTML comments with rules (max 5 entries, stale after 3 sessions, etc.)
    - File must be under 2,500 bytes
    - _Requirements: 1.1, 1.4, 2.1, 3.1_

  - [x] 1.2 Create `agent-memory/playbook.md` with empty table header
    - Write `agent-memory/playbook.md` with the flat table structure
    - Table columns: ID, Trigger, Fix, Domain, Outcome
    - Include HTML comment noting 120-char limit for Trigger/Fix fields
    - Include HTML comment noting knowledge/ overflow rule
    - No data rows — just the header
    - _Requirements: 7.1, 7.6, 7.7_

  - [x] 1.3 Create `agent-memory/skill-log.md` with empty table header
    - Write `agent-memory/skill-log.md` with the append-only log structure
    - Table columns: Date, Skill, Problem, Proposed Change, Status
    - Include HTML comment noting append-only rule and status lifecycle (proposed → approved → applied | rejected)
    - No data rows — just the header
    - _Requirements: 4.2, 4.4_

- [x] 2. Create Kiro hook files for memory automation
  - [x] 2.1 Create `.kiro/hooks/agent-memory-session-load.kiro.hook`
    - Write the Session Load hook JSON file
    - Event type: `promptSubmit` (first prompt only)
    - Action: `askAgent` with prompt instructing to read `memory.md` first, search `playbook.md` for matching cases, then proceed with user's request
    - Must NOT block the user's request — load and proceed in same turn
    - Validate JSON syntax is correct
    - _Requirements: 10.1, 10.5, 10.6_

  - [x] 2.2 Create `.kiro/hooks/agent-memory-checkpoint.kiro.hook`
    - Write the Mid-Session Checkpoint hook JSON file
    - Event type: `postTaskExecution`
    - Action: `askAgent` with prompt instructing to update `memory.md` (Task_Ledger + Decisions_In_Force), create draft if problem resolved, and report summary to user
    - _Requirements: 10.2, 10.5, 10.7_

  - [x] 2.3 Create `.kiro/hooks/agent-memory-session-save.kiro.hook`
    - Write the Session Save hook JSON file
    - Event type: `agentStop`
    - Action: `askAgent` with prompt instructing to check for meaningful changes, skip if none, otherwise perform final sweep (update memory.md, evaluate drafts through Save/Discard Gate, append passing cases to playbook.md, note skill proposals in skill-log.md)
    - Must report summary to user with list of files updated
    - _Requirements: 10.3, 10.5, 10.7_

  - [x] 2.4 Create `.kiro/hooks/agent-memory-skill-check.kiro.hook`
    - Write the Skill Flag Check hook JSON file
    - Event type: `postToolUse` with toolTypes `["write"]`
    - Action: `askAgent` with prompt instructing to evaluate skill correctness, add/update Skill_Flag if errors found, increment success counter if already flagged and successful, clear flag at 3 successes
    - _Requirements: 10.4, 10.5, 10.7_

- [x] 3. Checkpoint — Verify base files and hooks
  - Ensure all files created in tasks 1 and 2 exist and are valid. Verify hook JSON files parse correctly. Verify `memory.md` template is under 2,500 bytes. Ask the user if questions arise.

- [x] 4. Update steering rules
  - [x] 4.1 Update `.kiro/steering/agent-memory-self-improve.md` with new memory structure
    - Replace all old `palace/` and `knowledge/lessons/` references with new `agent-memory/` paths
    - Include the memory directory layout (memory.md, playbook.md, skill-log.md, drafts/, knowledge/)
    - Add mid-session write rules (when to write: problem resolved, task status changed, decision made, skill underperformed, skill flag cleared)
    - Add Save/Discard Gate rules (3 criteria, 2/3 threshold, Evidence Gate)
    - Add bounded state rules (2,500 bytes limit, consolidation steps)
    - Add "What NOT to Create" section listing removed files (palace/, graph.md, tunnels.md, etc.)
    - Include `inclusion: auto` frontmatter
    - _Requirements: 1.3, 5.1, 5.2, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 8.1, 8.2, 8.3, 8.6_

- [x] 5. Final verification checkpoint
  - Verify all files exist: `agent-memory/memory.md`, `agent-memory/playbook.md`, `agent-memory/skill-log.md`
  - Verify all hooks exist: `.kiro/hooks/agent-memory-session-load.kiro.hook`, `.kiro/hooks/agent-memory-checkpoint.kiro.hook`, `.kiro/hooks/agent-memory-session-save.kiro.hook`, `.kiro/hooks/agent-memory-skill-check.kiro.hook`
  - Verify steering file updated: `.kiro/steering/agent-memory-self-improve.md`
  - Verify hook JSON files are valid JSON
  - Verify `memory.md` template is under 2,500 bytes
  - Verify steering rules reference only new file paths (no `palace/`, `graph.md`, `tunnels.md`, `search-index.md`, `evolution.md`, `index.md`)
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- This is a markdown-only system — all tasks create or modify markdown and JSON files, no application code
- All paths are relative to the `.claude/` workspace root
- No property-based tests apply (design explicitly states PBT does not apply)
- Checkpoints ensure incremental validation of file structure and content
- Each task references specific requirements for traceability
