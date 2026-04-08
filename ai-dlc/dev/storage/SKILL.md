---
name: storage
description: >
  This skill should be used when the user asks to "save knowledge", "update knowledge base",
  "index automation patterns", "save business rules", "update knowledge buffer",
  or needs to persist automation patterns, business logic, lessons learned, or test data to the knowledge base.
---

# Storage

Knowledge persistence, data indexing, and backup management.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "save automation pattern", "index API pattern", "save web UI pattern" | `references/automation-save.md` |
| "save business rule", "save UI action", "save domain config" | `references/business-save.md` |
| "save test scenario", "index PBI", "extract test data" | `references/scenario-save.md` |
| "update knowledge buffer", "aggregate findings", "update implementation plan" | `references/buffer-update.md` |
| "backup data", "data safety", "data integrity" | `references/data-backup.md` |

- **Automation Save** — Save technical automation patterns (API/Web UI/Mobile). (Read `references/automation-save.md`)
- **Business Save** — Save business rules, UI actions, domain config. (Read `references/business-save.md`)
- **Scenario Save** — Save test scenario PBIs to index and extract test data. (Read `references/scenario-save.md`)
- **Buffer Update** — Aggregate findings and update Knowledge Buffer in implementation plan. (Read `references/buffer-update.md`)
- **Data Backup** — Standards for data safety and integrity. (Read `references/data-backup.md`)
