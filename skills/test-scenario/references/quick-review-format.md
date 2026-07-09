# Quick Review Summary Format

Every scenario file MUST have this section at the top, before the first batch.

**Why:** Users don't read 50+ lines of HTML on first open. Summary enables approve/reject in 10 seconds.

## Required Format

```markdown
<!-- 📋 Quick Review สำหรับคนอ่าน | Full Detail (ด้านล่าง) = สำหรับ md2csv.sh export จริง -->
<!-- 💡 TIP: Full Detail ส่วนล่างเป็น HTML กด Cmd+Shift+V (Markdown Preview) จะอ่านง่ายกว่า raw text -->

## 📋 Quick Review Summary

| # | Tracker ID | Scenario | Spec File | Priority | Effort | Domain |
|---|----------|----------|-----------|----------|--------|--------|
| TS-001 | — | [title] | — | Critical | 2h | [domain] |
...

**Total: N scenarios | Effort: Xh | Critical: N | High: N | Medium: N**

**Coverage domain:**
- Domain A: N (description)
- Domain B: N (description)

**Properties (invariants from Property-based testing step):**
- any [input] → [property] must hold
- (if no business logic → state "N/A — UI flow only")
```

## Column Timeline

- `Tracker ID`: populated when the upload-to-tracker script runs (e.g. `uploadTestScenarioToJira.ts` / PBI equivalent — write your own for your tracker) — start as "—"
- `Spec File`: populated when the test script is written — start as "—"

## Divider (MANDATORY between Quick Review and Full Detail)

```markdown
📄 (ด้านล่างนี้คือเนื้อหาจริงสำหรับ automation)
═══════════════════════════════════════════════════════════
---
```

## Format Rules

- Quick Review = plain markdown (readable without preview)
- Full Detail = HTML format (`<ul><li>`, `<div><ol>`) — required if your tracker's import expects rich-text test steps (e.g. Azure DevOps, Jira); plain markdown is fine for CSV-only trackers
- Do NOT convert HTML in Full Detail to plain markdown — breaks `md2csv.sh`
- Add `💡 TIP: กด Cmd+Shift+V` comment so reviewers know how to read HTML section
