# Knowledge Buffer

Capture reusable patterns, business rules, and lessons learned across features for future reuse.

## Storage Boundary Rules (MANDATORY)

Prevents AI from confusing `.aidlc/` with `.memory/`:

| Store in | Content | Examples |
|----------|---------|---------|
| **`.aidlc/[system]/[feature]/`** | Working directory — plans and technical evidence for that specific project | decisions, plans, outputs, audit.md, task progress |
| **`.aidlc/[system]/PROGRESS.md`** | Task status for that system (short-term, project-scoped) | feature status, task counts |
| **`.memory/wings/`** | Long-term context — patterns, lessons, decisions reusable across projects | architecture decisions, reusable patterns, session summaries |
| **`.memory/state.md`** | Palace map — active wings, recent sessions, open threads (cross-project) | NOT project status |

**Rules:**
- `.aidlc/` = **temporary** — used during that project, can be archived after PR merge
- `.memory/` = **permanent** — information worth remembering across projects and sessions
- No duplication: if data is already in `.aidlc/`, do NOT copy it to `.memory/`
- Move to `.memory/` only: patterns reusable in ≥2 projects, decisions affecting long-term architecture

**Correct:**
```
.aidlc/japan-travel/flight-booking/audit.md  ← technical evidence (temporary)
.memory/wings/ai-dlc-skills/rooms/japan-travel-patterns.md  ← reusable patterns (permanent)
```

**Wrong:**
```
❌ copying entire PROGRESS.md into .memory/state.md
❌ storing the same architecture decision in both .aidlc/ and .memory/
```

---

## When to use
- After completing any AIDLC phase — capture what was learned
- Before starting a new feature — check what's reusable from past features
- After test execution — record healing patterns and debugging insights

## How it works

### Capture (after each phase)

At the end of each phase, AI silently extracts and appends to `audit.md`:

**Phase 1.2 (Requirements):**
- New business rules discovered
- Reusable logic candidates (from domain analysis)
- Missing logic patterns (from gap analysis)

**Phase 1.3-1.5 (Architecture & Design):**
- Architecture patterns chosen and why
- Shared components identified
- Database strategy decisions

**Phase 2.1-2.4 (QA):**
- Test patterns (scenario design, data generation)
- Edge cases identified
- Reusable test data structures

**Phase 3.1-3.2 (Implementation & Testing):**
- Implementation patterns used
- Healing strategies that worked/failed (from Reflexion Log)
- Flaky test patterns and fixes

### Storage Format

Append to `.aidlc/[system]/[feature]/audit.md`:

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
1. Scan `.aidlc/[system]/*/audit.md` for Knowledge Buffer sections in sibling features
2. Extract patterns relevant to the new feature
3. Apply "Lego Assembly" — combine best parts from multiple features
4. Report: "📚 Found [N] reusable patterns from [feature1], [feature2]"

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

1. Load `{knowledge_root}/lessons/{platform}/` index
2. Filter: `still_relevant = true` only
3. Sort: `effectiveness.prevented_failures DESC`, then `applied_count DESC`
4. Surface top 3 most effective lessons first
5. Report: "📚 Top lessons: {lesson_id} (prevented {n}x failures)"
6. Note: if `auto_captured = true` AND `confidence < 0.8` → flag as "📝 Auto-captured — verify before applying"
