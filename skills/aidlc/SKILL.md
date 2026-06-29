---
name: aidlc
description: >
  This skill should be used when the user asks to "start AIDLC", "start AI-DLC",
  "create a decision file", "plan the execution",
  "break down tasks", "resume AI-DLC",
  "start from domain design", "start from logical design",
  "build web", "build api", "build feature", "create app", "build",
  "test scenario", "test case", "create test", "write test",
  "automate", "automation", "QA", "testing",
  "QA only", "Dev only", "QA scenario only", "QA automation", "QA scenario automation",
  "dev ส่งแล้ว", "dev delivered", "verify against real", "switch to real", "เล่นจริง",
  or needs governance for the AI Development Lifecycle.
  ALL coding, development, and QA work MUST go through this skill first.
  Supports 4 modes: Full (default), QA Only, Dev Only, Micro (small tasks).
  Non-coding tasks (research, analysis, finance, presentation, knowledge management)
  can go directly to the relevant skill or knowledge without AIDLC governance.
version: 2.1.0
last_improved: 2026-06-29
improvement_count: 1
---

# AIDLC — Router

## Gate

- AIDLC artifacts (DECISIONS + PLAN) must exist before any coding phase
- Artifacts live in `agent-memory/plans/[feature]/` — read `references/workflow.md` § Artifact Locations for the full mapping
- Exception: pure investigation/analysis (no code changes)
- Exception: **Micro mode** — small additions to existing systems skip artifacts entirely

## Routing (auto — do NOT ask)

Detect from user's first message → load immediately:

| Signal words | Route | Action |
|---|---|---|
| test, QA, automate, playwright, test scenario, write test, QA only, QA scenario, QA automation, verify against real, dev ส่งแล้ว, dev delivered | **QA** | Read `references/qa.md` → follow it. Stop here. |
| build, implement, create feature, build web, build api, dev only | **Dev** | Read `references/full.md` § Dev Only phases — then apply autonomy rules |
| start AIDLC, start AI-DLC, full | **Full** | Read `references/full.md` — then apply autonomy rules |
| *(any dev/impl task)* | **Auto** | Read `references/workflow.md` § Autonomy-first → self-calibrate depth → execute |

**Autonomy-first is the default for all dev tasks.** Read `references/workflow.md` § Essential Rules before producing any output. Let complexity drive depth — not mode selection.
