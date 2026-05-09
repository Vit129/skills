# Grading Rubric

Score each skill/knowledge file on 3 dimensions (1-5 each, total max 15):

## 1. Usage Score (1-5)

| Score | Criteria |
|-------|----------|
| 5 | Used 5+ times in last 30 days (check playbook Applied or knowledge index) |
| 4 | Used 3-4 times in last 30 days |
| 3 | Used 1-2 times in last 30 days |
| 2 | Used in last 60 days but not last 30 |
| 1 | No usage in 60+ days |

**How to check usage:**
- `agent-memory/playbook.md` → Applied + Prevented columns
- `knowledge/index.md` → usage counts (if maintained)
- File modified date as proxy when no explicit tracking

## 2. Recency Score (1-5)

| Score | Criteria |
|-------|----------|
| 5 | Modified in last 7 days |
| 4 | Modified in last 30 days |
| 3 | Modified in last 60 days |
| 2 | Modified in last 90 days |
| 1 | Not modified in 90+ days |

## 3. Quality Score (1-5)

| Score | Criteria |
|-------|----------|
| 5 | Complete, has examples, no TODOs, actionable |
| 4 | Complete, minor gaps (e.g., missing one example) |
| 3 | Functional but sparse — works but could be better |
| 2 | Incomplete — has TODOs, placeholder sections |
| 1 | Stub or broken — missing critical content |

## Composite Score & Actions

| Total (out of 15) | Health | Action |
|--------------------|--------|--------|
| 12-15 | Healthy | No action needed |
| 8-11 | Moderate | Flag for review if quality < 3 |
| 4-7 | At risk | Candidate for consolidation or improvement |
| 1-3 | Critical | Archive candidate (confirm with pruning rules) |

## Exceptions (Do NOT grade)

- `core/aidlc/` — governance, always needed
- `rules/*` — standards, usage is implicit
- Files modified in last 7 days — too new to judge
