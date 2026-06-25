---
name: interview
description: >
  Multi-mode interview and review skill. Triggers: "interview me", "ถามมาเลย", "grill me",
  "ถามจนชัด", "interview-doc", "grill with docs", "ถามกับ code", "ตรวจสอบกับ codebase",
  "brainstorm", "3 amigos", "คุยก่อนแบ่งงาน", "ช่วยคิด", "stress-test",
  "doubt-driven", "adversarial review", "challenge this plan",
  "source-driven", "verify against docs", "cite sources", "check framework version".
version: 1.0.0
last_improved: 2026-06-25
---

# Interview — Router

## Mode Detection (auto — do NOT ask)

| Situation | Load |
|-----------|------|
| No codebase, vague/underspecified idea → extract via Q&A | `references/me.md` |
| Has codebase, align language, stress-test plan against code | `references/doc.md` |
| After Phase 1 artifacts exist, before Phase 2, complex feature | `references/amigos.md` |
| High-stakes decision, non-trivial logic, before commit/deploy | `references/doubt.md` |
| Framework/library specific implementation, API version matters | `references/source.md` |
