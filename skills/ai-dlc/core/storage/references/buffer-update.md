# Knowledge Buffer Update

Aggregate findings and update the Knowledge Buffer section in the Implementation Plan.

## When to use
- After any specialist phase completes
- Need to capture decisions, patterns, constraints for downstream use

## Process
1. Read `implementation[SYSTEM_FEATURE_CAMEL].md`
2. Locate `### C. Knowledge Buffer` section (create if missing)
3. Aggregate information based on current phase:
   - **PO Specialist:** business rules, reusable logic, missing logic, domain concepts
   - **Test Scenario:** test patterns, data generation rules, edge cases, CSV lessons
   - **Requirements:** DB strategy, business rules, common logic
   - **Architect:** DB helper patterns, asset discovery, architecture patterns, LATS/CoT decisions
   - **Code Generator:** implementation details, refactoring decisions, coding patterns
   - **Test Validator:** recurring bug patterns, healing strategies, flaky tests, execution lessons
   - **Postman:** auth patterns, header strategies, base URL configs
   - **DevOps:** pipeline patterns, env variable requirements, report artifact paths
4. Write to file under:
   - `#### A. Common/General Logic (Reusable across domains)`
   - `#### B. Specific Business Logic (Domain-specific)`
5. Append new findings (avoid duplicates), replace placeholders

## Rules
- Never overwrite valid existing data — append only
- Replace "(Pending ...)" placeholders with aggregated info
- If file not found → skip with warning

## Score Sync (final step)

After updating the Knowledge Buffer, sync scores back to index files:

1. Check if `agent-memory/palace/wings/agent-memory/rooms/template-health.md` exists
2. If exists → read `template-health.md` and `lesson-effectiveness.md`
3. Apply any pending score changes to index files:
   - `{knowledge_root}/automation/{platform}/{platform}Index.json`
   - `{knowledge_root}/lessons/{platform}/{platform}LessonsIndex.json`
4. Log: "✅ Score sync complete — {n} index files updated"
5. If rooms do not exist → skip sync, scores already updated inline

> **Owner:** This is a READ-ONLY consumer of scores. The authoritative score writer is `automation-save.md` (per-save) and the Stop hook (per-session via `references/session.md`). Buffer-update only reads scores to propagate to index files.
