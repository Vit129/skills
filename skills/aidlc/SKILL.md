---
name: aidlc
description: >
  Governance layer for the AI Development Lifecycle.
  Called after interview + dev-architect when building a new feature, system, or architecture.
  Also handles: resume AI-DLC, break down tasks,
  QA only, Dev only, verify against real, dev ส่งแล้ว, เล่นจริง.
version: 3.0.0
last_improved: 2026-06-29
---

# AIDLC — Router

Read `references/workflow.md` for artifact locations and phase steps.

## Routing

| Signal | Action |
|---|---|
| QA / test / automate / playwright / verify against real / dev ส่งแล้ว | Read `references/qa.md` |
| build / implement / dev only | Read `references/dev.md` |
| full / start AI-DLC / new system | Read `references/workflow.md` § Workflow Phases |
| resume / ทำต่อ | Read `agent-memory/CONTEXT.md` → resume at active phase |
