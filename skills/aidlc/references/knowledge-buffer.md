# Knowledge Buffer

Capture reusable patterns, business rules, and lessons learned across features for future reuse.

## Storage Boundary Rules (MANDATORY)

| Store in | Content | Examples |
|----------|---------|---------|
| **`agent-memory/plans/[feature]/`** | Working artifacts — plan, task tracking, outputs | plan.md, dev-tasks.md, qa-tasks.md, outputs/ |
| **`agent-memory/CONTEXT.md`** | Active task + phase history | Now section, Completed section |
| **`agent-memory/MEMORY.md`** | Resolved decisions + lessons | Decisions section |
| **`agent-memory/knowledge/{domain}/`** | Long-term patterns (≥2 features) | arch decisions, QA patterns |
| **`GRAPH_REPORT.md`** | Codebase knowledge graph | updated after feature completes |

**Rules:**

- Working artifacts = **temporary** — scoped to that feature, archive after PR merge
- `knowledge/` = **permanent** — patterns reusable in ≥2 features only
- No duplication between working artifacts and knowledge/
- `GRAPH_REPORT.md` lives at project root

**Correct:**

```text
agent-memory/plans/cash-payment/outputs/logical-design.md  ← working artifact (temporary)
agent-memory/knowledge/qa/web-ordering-patterns.md         ← reusable pattern (permanent)
GRAPH_REPORT.md                                            ← codebase graph (project root)
```

---

## When to use

- After completing any AIDLC phase — capture what was learned
- Before starting a new feature — check what's reusable from past features
- After test execution — record healing patterns and debugging insights

## How it works

### Capture (after each phase)

At the end of each phase, AI silently extracts and appends to `agent-memory/CONTEXT.md` Completed section:

**Phase 1.2 (Requirements Gathering):**

- New business rules discovered
- Reusable logic candidates (from domain analysis)
- Missing logic patterns (from gap analysis)

**Phase 1.3-1.6 (Domain Decomposition → Domain Design → UI/UX → Logical Design):**

- Architecture patterns chosen and why
- Shared components identified
- Database strategy decisions
- UI/UX design decisions and component specs

**Phase 2.1-2.4 (QA Task Design → Test Cases → QA Architecture → Test Scripts):**

- Test patterns (scenario design, data generation)
- Edge cases identified
- Reusable test data structures
- Framework and folder structure decisions

**Phase 2.5-2.7 (Dev Task Design → Mid-Parallel Sync → DevOps Sync):**

- Task decomposition patterns
- Cross-team alignment decisions

**Phase 3.1-3.3 (Implementation → Automated Testing → Pull Request):**

- Implementation patterns used
- Healing strategies that worked/failed (from Reflexion Log)
- Flaky test patterns and fixes

### Storage Format

Append to `agent-memory/CONTEXT.md` Completed section:

```markdown
## Knowledge Buffer

### Common Logic (reusable across features)
- **Auth:** Bearer token pattern — reuse across all API features
- **CRUD:** Base service pattern — extend for each domain
- **DB:** Seed/Verify/Cleanup with testId — standard for all features

### Domain-Specific Logic
- **Booking:** Seat lock expires in 15 min — affects test timing
- **Payment:** Max 3 retry attempts — edge case for test scenarios

### Lessons Learned
- **Pattern:** [description] — reusable in [context]
- **Mistake:** [what went wrong] — avoid by [prevention]
- **Discovery:** [new insight] — apply when [condition]
```

### Reuse (before starting new feature)

At Phase 1.2 of a new feature, AI SHOULD:

1. Scan `agent-memory/CONTEXT.md` Completed section + `agent-memory/plans/*/` for Knowledge Buffer sections
2. Scan `agent-memory/knowledge/{domain}/` for cross-feature patterns
3. Extract patterns relevant to the new feature
4. Apply "Lego Assembly" — combine best parts from multiple features
5. Report: "📚 Found [N] reusable patterns from [feature1], [feature2]"

## Rules

- Capture is silent — show only "✅ Knowledge Buffer updated"
- Never duplicate — check existing entries before appending
- Common logic only if reusable across 2+ features
- Lessons must have: what happened, why, and how to prevent/reuse
- AI reads Knowledge Buffer automatically at Phase 1.2 — no user action needed

## Post-Execution Reflect (Phase 3.2)

After test execution completes, update knowledge scores:

1. PASS → `utility_score += 0.5`, `usage_count += 1`, `last_used = today` for templates used
2. FAIL → `utility_score -= 1.0`, `last_failure = today` for templates that caused failure
3. Extract failure pattern → check for duplicate in lessons index
4. New pattern → auto-capture lesson (`confidence: 0.75`, `auto_captured: true`)
5. Log: "✅ Knowledge Buffer updated"

## Reuse Check (Phase 1.2 — score-aware)

When scanning lessons before task creation:

1. Load `agent-memory/knowledge/{domain}/` index (per-project first, then global fallback `~/.kiro/skills/knowledge/`)
2. Filter: `still_relevant = true` only
3. Sort: `effectiveness.prevented_failures DESC`, then `applied_count DESC`
4. Surface top 3 most effective lessons first
5. Report: "📚 Top lessons: {lesson_id} (prevented {n}x failures)"
6. Note: if `auto_captured = true` AND `confidence < 0.8` → flag as "📝 Auto-captured — verify before applying"

## GRAPH_REPORT Update (after feature completes)

After Phase 2.4 done (first working feature) or all tests PASS + PR merged:

1. Update `{project-root}/GRAPH_REPORT.md` — god nodes, deps, file index, surprising connections
2. Use `meta-skills/graph-report/SKILL.md` process
3. Skip if no new files were created in this phase
