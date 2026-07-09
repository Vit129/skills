# Knowledge Base — Ingest & Maintenance Guide

> Centralized guide for all squads. Defines HOW to build and maintain per-project KB.
> Inspired by [Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) (2026-04): compile knowledge once, don't re-derive every query.

---

## Architecture: 2 Layers

| Layer | Location | Content | Owner |
|-------|----------|---------|-------|
| **Global (generic)** | `~/.kiro/skills/knowledge/` | Templates, generic business rules (UA001-UA012), lessons | Shared — all squads |
| **Per-project (specific)** | `{project}/agent-memory/knowledge/biz/` | App pages, clickable flows, role permissions, navigation maps | Each squad |

**Rule:** Never put project-specific UI/business data in global. Never put generic patterns in per-project.

---

## Ingest Workflow

### When to Ingest

| Source | Trigger | Output |
|--------|---------|--------|
| Screenshot (UI page) | User sends image | `biz/{feature}.md` — clickable elements table |
| Requirement doc (PBI/AC) | User shares PBI text or URL | `biz/{feature}.md` — business rules section |
| DevTools snapshot | Agent explores live app | `biz/{feature}.md` — locator hints (optional) |
| Approved test scenario | Phase 2.2 approved | `qa/{feature}-patterns.md` — reusable test patterns |
| Bug fix (promoted from playbook) | Applied >= 3 | `bug/{case-id}.md` — root cause + fix |

### Ingest Steps (for screenshots — most common)

```text
1. Receive source (image/doc)
2. Identify page name and entry point (how to get here)
3. Extract ONLY clickable elements:
   - Buttons, links, tabs, inputs, cards with actions
   - Skip: static text, decorative images, layout info
4. Note status/states if applicable (enabled/disabled, active tab, role-based access)
5. Write to `agent-memory/knowledge/biz/{feature}.md`
6. Update navigation map (if exists)
7. Mark missing sub-pages with 🟡 for future ingest
```

### KB File Format (per-project biz)

```markdown
# {Feature Name} — UI Knowledge Base

> Source: Screenshots | Role: {role name}
> App: {app URL}
> Last updated: {date}

---

## Navigation Map

\`\`\`text
Login → Dashboard → My Features → {Feature}
  ├── {Sub-page 1}
  ├── {Sub-page 2}
  └── {Sub-page 3}
\`\`\`

---

## 1. {Page Name}

### Entry Point
- From: {parent page} → {click what}

### Clickable Elements

| Element | Type | Label | Action/Notes |
|---------|------|-------|-------------|
| {name} | Button/Tab/Link/Input | {visible text} | {what happens on click} |

### States (if applicable)

| State | Indicator | Meaning |
|-------|-----------|---------|
| {state} | {color/icon/badge} | {what it means} |

---

## N. Missing Pages (Checklist)

- [ ] {Sub-page 1} — need screenshot
- [ ] {Sub-page 2} — need screenshot
```

---

## What to Capture vs What to Skip

| ✅ Capture | ❌ Skip |
|-----------|---------|
| Buttons, tabs, links | Static labels, decorative text |
| Search bars, filters | Data values (counts, amounts) |
| Navigation paths | CSS/styling details |
| Role-based access (can/cannot click) | Field-level validation rules (save for Phase 2.2) |
| Status indicators (colors, badges) | Exact pixel positions |
| Entry points (how to get to this page) | Internal API endpoints (save for arch/) |

---

## Cross-Linking Rules

When ingesting a new page:

1. **Update parent page** — add link in navigation map
2. **Check siblings** — if related pages exist, note the relationship
3. **Mark sub-pages** — use 🟡 for pages you know exist but haven't captured yet
4. **Don't duplicate** — if info already in global `business/` rules, just reference it

---

## Lint Operations (Periodic Health Check)

### When to Lint

- Before starting new PBI (check if KB is current)
- After major UI release (pages may have changed)
- Monthly (general health check)

### What to Check

| Check | Signal | Action |
|-------|--------|--------|
| **Stale pages** | App UI changed since last update | Update with new screenshot |
| **Orphan pages** | No link from navigation map | Add to parent or remove if obsolete |
| **Missing pages** | 🟡 markers in files | Request screenshot from user |
| **Contradiction** | Two pages claim different navigation paths | Resolve by checking live app |
| **Dead links** | Referenced page doesn't exist | Create the page or remove reference |

### Lint Trigger

```text
User says: "lint KB", "check KB health", "scan stale", "KB ครบมั้ย"
→ Agent scans agent-memory/knowledge/biz/*.md
→ Reports: pages found, 🟡 missing count, last-updated dates
→ Suggests actions
```

---

## Per-Project vs Global Decision Matrix

| Question | If Yes → | If No → |
|----------|----------|---------|
| Is this a UI-specific interaction for this app? | Per-project `biz/` | — |
| Would another squad's app have the same pattern? | Global `business/` | — |
| Is this a Playwright/RF coding pattern? | Global `automation/` or `lessons/` | — |
| Is this a bug fix that only applies here? | Per-project `bug/` | — |
| Is this an architecture decision for this project? | Per-project `arch/` | — |

---

## Integration with the QA Flow

| Stage | KB Role |
|-------|---------|
| **QA Task Design** | Agent reads `biz/{feature}.md` → knows page structure → plans tasks accurately |
| **Test Scenario Writing** | Agent reads `biz/{feature}.md` → writes entry points + clickable elements into scenarios |
| **Test Script Writing** | Agent reads `biz/{feature}.md` + `qa/{feature}-patterns.md` → writes locators correctly first try |
| **Scenario Reuse Check** | Agent reads `qa/` patterns → avoids duplicate scenarios |

---

## Compound Effect

```text
Session 1: Ingest 3 pages → KB has navigation map + clickable elements
Session 2: Write test scenarios → uses KB → 0 "what does this page look like?" questions
Session 3: Write test scripts → uses KB + lessons → correct locators first try
Session 4: New PBI same feature → KB already there → scenario + script in 1 session
         ↓
Each session builds on previous KB → less human effort → better AI output → faster delivery
```

---

## Summary

> "The human's job is to curate sources and ask good questions.
>  The LLM's job is everything else." — Karpathy

For QA automation:
- **Human curates**: screenshots, requirements, PBI acceptance criteria
- **AI maintains**: KB files, cross-links, navigation maps, test patterns
- **Result**: compounding knowledge that makes every subsequent feature faster
