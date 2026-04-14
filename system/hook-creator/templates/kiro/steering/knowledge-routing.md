---
inclusion: manual
---

# Knowledge Routing Context

> Load manually with `#knowledge-routing` when working with AI-DLC knowledge base.

## Knowledge Root

```
{project_root}/skills/knowledge/
├── automation/
│   ├── api/          — API test templates + lessons
│   ├── webUi/        — Web UI test templates + lessons
│   └── mobile/       — Mobile test templates + lessons
├── business/         — Domain indexes (auth, common, document, finance)
└── lessons/          — Cross-platform lessons
```

## Routing Logic

### Step 1 — Extract Intent
"What is the Input → Process → Output of this feature?"

### Step 2 — Intent Match
Compare against `intent_patterns` in `businessIndex.json`
Match = pattern overlap ≥ 2 steps → load domain

### Step 3 — Utility-Weighted Selection
When multiple templates match:
1. Sort by `utility_score` DESC
2. If top score < 3.0 → warn: "⚠️ Template มีปัญหาบ่อย — review ก่อนใช้"
3. If `auto_captured: true` AND `confidence < 0.8` → note: "📝 Auto-captured — ยังไม่ verified"

### Step 4 — Load Lessons
- Filter: `still_relevant: true`
- Sort: `effectiveness.prevented_failures` DESC, then `applied_count` DESC
- Surface top 3 most effective lessons first

## Score Update (after test run)

- PASS → `utility_score += 0.5`, `usage_count += 1`, `last_used = today`
- FAIL → `utility_score -= 1.0`, `last_failure = today`
- New pattern → auto-capture lesson (`confidence: 0.75`, `auto_captured: true`)

→ Full protocol: `system/knowledge-evolution/references/utility-scoring.md` (relative to SKILLS_ROOT)
→ Full routing: `system/knowledge-evolution/references/smart-routing.md` (relative to SKILLS_ROOT)
