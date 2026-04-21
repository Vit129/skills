# Unified Memory — Gotchas & Fixes

All known failure modes with root causes and solutions.

---

## Memory Palace Gotchas

### 1. Recalled facts treated as truth
**Symptom:** AI acts on hall.md/closet info without verifying → wrong decisions  
**Root cause:** Closets are AAAK-compressed summaries, not verified facts  
**Fix:** Always `grep`/`glob` to verify before acting on recalled information. Treat closets as "hints, not facts."

### 2. hall.md drift
**Symptom:** hall.md lists rooms that no longer exist, misses new ones  
**Root cause:** Rooms renamed/added without updating hall.md  
**Fix:** Update hall.md **synchronously** (same step as) creating/archiving any room. Never skip.

### 3. Stale closet after room edit
**Symptom:** Closet shows old summary, room has changed  
**Root cause:** Room edited, closet not regenerated  
**Fix:** After any room edit >10 lines → regenerate its closet immediately.

### 4. Room >80 lines not compressed
**Symptom:** Rooms grow to 200+ lines, slow to load, no closet exists  
**Root cause:** Compression check only runs on new writes, misses gradual growth  
**Fix:** At session end, explicitly check line count of all modified rooms. Compress if >80.

### 5. state.md overflow
**Symptom:** state.md exceeds 100 lines, fails ≤100 line rule  
**Root cause:** Wings accumulate without archiving  
**Fix:** Archive wings not touched in >30 days. Move to archive/index.md.

### 6. Tunnel references break on archive
**Symptom:** tunnels.md points to archived rooms → dead links  
**Root cause:** Wing archived, tunnels.md not updated  
**Fix:** Update tunnels.md **synchronously** when archiving any wing.

### 7. Token budget overflow on session start
**Symptom:** Loading too many Hot wings, exceeds context  
**Root cause:** Too many wings classified as Hot  
**Fix:** If Hot wings total >2000 tokens → warn user, ask which to prioritize. Load max 3 Hot wings.

---

## Knowledge Evolution Gotchas

### 8. Score drift (all templates converge to same score)
**Symptom:** All templates score 7.5+, no differentiation  
**Root cause:** Only successes recorded, no failures; or success_boost too high  
**Fix:** Quarterly: review distribution. If top 80% score >7.0 → recalibrate by setting to (score × 0.85). Preserve relative ranking.

### 9. Auto-capture overconfidence
**Symptom:** Low-quality patterns auto-added as lessons, mislead routing  
**Root cause:** confidence = 0.75 lessons routed without review  
**Fix:** confidence < 0.8 → flag in routing, warn user: "⚠️ Auto-captured, not yet verified." Never route confidence <0.6.

### 10. Contradictory lessons
**Symptom:** Two lessons say opposite things — routing conflict  
**Root cause:** Lessons captured independently, no contradiction check  
**Fix:** Before writing new lesson: search existing lessons for same domain/subject. If conflict → flag both, ask human to resolve. Never auto-overwrite.

### 11. Routing loop
**Symptom:** Template A routes to lesson B which recommends template A  
**Root cause:** Circular intent pattern matching  
**Fix:** Log all routing decisions to routing-log.md. Check for cycles (same template ID in same session path). If cycle → break, warn user.

### 12. Stale lessons (still_relevant not updated)
**Symptom:** Old lessons recommended that no longer apply  
**Root cause:** still_relevant never set to false  
**Fix:** Auto-stale if: `last_used` > 90 days AND `applied_count < 2`. Set still_relevant=false, add note: "auto-staled: {date}".

---

## Unified-Specific Gotchas

### 13. knowledge-evolution wing missing on first session
**Symptom:** Hall.md doesn't exist, session start crashes  
**Root cause:** Wing never created  
**Fix:** At session start, check if `.unified-memory/palace/wings/knowledge-evolution/hall.md` exists. If not → create empty template automatically.

### 14. Write-back sync fails silently
**Symptom:** .unified-memory/palace/wings/ updated, .unified-memory/knowledge/index.json not updated → scores lost next session  
**Root cause:** Sync step skipped or errored  
**Fix:** At session end, compare score in memory wing vs index.json. If mismatch → re-sync. Log: "✅ Synced: {template_id} {before}→{after}" or "❌ Sync failed: {reason}".

### 15. Admission control too strict (nothing gets saved)
**Symptom:** User asks to save, score <0.6, session notes lost  
**Root cause:** Threshold too high, or content type prior penalizes valid content  
**Fix:** If score fails, explain why: "Score: 0.45 (low future utility: this was Q&A only). Save anyway? [y/n]". Let user override.

### 16. Dirty flag not triggered (session content lost silently)
**Symptom:** Session had decisions/code changes but no save reminder appeared  
**Root cause:** Dirty flag conditions too narrow, or trivial-looking work had hidden value  
**Fix:** Err on the side of marking dirty. If in doubt → dirty = true. Better to remind unnecessarily than lose data. Review dirty conditions quarterly.

### 17. Reminder fatigue (user ignores all reminders)
**Symptom:** User always says "skip save" → system stops being useful  
**Root cause:** Too many false-positive reminders, or user doesn't see value  
**Fix:** Max 2 reminders per session. If user skips 3 sessions in a row → reduce sensitivity (only remind for decisions + architecture, not code changes). Track skip_count in session metadata.

---

### 18. Wing Split creates orphan tunnels
**Symptom:** After splitting wing, tunnels.md still points to old parent wing rooms  
**Root cause:** Split moves rooms to child wings but tunnels not remapped  
**Fix:** During split, remap ALL tunnel references from `{parent}/rooms/{room}` → `{child}/rooms/{room}`. Verify tunnels.md has zero references to parent rooms after split.

### 19. Burst Mode not deactivated after sprint ends
**Symptom:** Scores still dampened (factor 0.90) weeks after sprint ended  
**Root cause:** Rolling 7-day count dropped but sprint mode flag not cleared  
**Fix:** Check rolling count at EVERY session start. If ≤10 → deactivate immediately. Log: "⚡ Sprint mode OFF: {domain}". Never persist sprint mode across sessions without re-checking.

### 20. Cross-project promote duplicates in global
**Symptom:** Same template/lesson appears multiple times in global knowledge  
**Root cause:** Promoted from different projects without dedup check  
**Fix:** Before promoting, search global by `id` AND semantic similarity. If match exists → merge `projects_used_in[]` into existing entry, don't create new. Log: "🌐 Merged into existing: {id}".

### 21. Domain-aware settling misclassifies wing domain
**Symptom:** Architecture wing uses ui threshold (2 sessions) → distilled too early  
**Root cause:** Wing domain not explicitly tagged, auto-detection guessed wrong  
**Fix:** Add `domain_type: arch|api|ui|default` field to hall.md metadata. If missing → use `default` (3). Never auto-assign `ui` or `arch` without explicit tag.

### 22. Hook prompt drift from skill spec (partial save)
**Symptom:** state.md updated at session end but wings/rooms/halls/closets/knowledge all stale — data drift accumulates across sessions  
**Root cause:** Hook prompt (settings.json) references old paths (`.memory/`) or partial workflow (only state.md) after a restructure — doesn't match SKILL.md architecture or session.md save workflow  
**Fix:** After ANY restructure that changes paths or workflow: 1) Cross-check settings.json hook prompts against SKILL.md Storage Architecture paths. 2) Verify Stop hook covers ALL session.md Session End steps (not just state.md). 3) Verify SessionStart hook loads from correct path. Checklist: `grep -n '.memory/' settings.json` should return 0 hits after migration to `.unified-memory/`.

---

### 23. Skill crystallization from false pattern (noise skill)
**Symptom:** Skill created from 2 similar-looking tasks that were actually different contexts  
**Root cause:** Pattern matching in routing-log too loose — matched on domain + keywords without checking actual intent  
**Fix:** Before crystallizing: verify both source sessions had same intent (Input → Process → Output pattern match). If intent differs → don't crystallize. Always ask user confirmation before writing skill file.

### 24. Search index grows unbounded
**Symptom:** search-index.md exceeds 500 rows, grep becomes slow  
**Root cause:** No archival triggered, or consolidation skipped  
**Fix:** At consolidation: archive rows >180 days old to search-index-archive.md. Remove rows pointing to archived rooms. Hard cap: 500 rows in active index.

### 25. Nudge fatigue — user ignores all nudges
**Symptom:** User always says "skip" → nudges become noise  
**Root cause:** Too many low-priority nudges, or nudges not actionable  
**Fix:** Track skip count per nudge type. If same nudge skipped 3x → suppress for 30 days. Reduce to max 2 nudges if user skip rate >80%. Only show High priority after 3 consecutive skips.

### 26. Evolution audit trail bloats index.json
**Symptom:** index.json grows large, slow to parse  
**Root cause:** evolution_log[] never archived  
**Fix:** Cap at 50 entries per template. When exceeded: archive oldest 25 to template-health.md room, keep newest 25 in index.json. Run check during consolidation.

### 27. Skill version regression not caught
**Symptom:** Skill updated to v3 but v3 performs worse than v2, no rollback  
**Root cause:** Self-improvement overwrites Steps without preserving previous version  
**Fix:** On regression (outcome worse than previous version): keep previous Steps, log regression in Improvement Log, flag "⚠️ Regression in v{n}". Never auto-overwrite Steps on negative outcome.

### 28. First session crashes — no .unified-memory/ exists
**Symptom:** Session start fails reading state.md or hall.md — files don't exist  
**Root cause:** No bootstrap/init flow, system assumes data already exists  
**Fix:** Step 0 Bootstrap in session.md: check if `.unified-memory/` exists. If not → auto-create full directory tree with empty templates. Log "🏛️ Memory Palace initialized". Skip to Execute.

### 29. AAAK closet loses critical information (over-compression)
**Symptom:** Closet exists but next session can't reconstruct decisions from it — key reasoning missing  
**Root cause:** Compressed too aggressively, dropped Decision+Reason or Core Business Logic  
**Fix:** Follow AAAK Priority Order (in storage.md): NEVER drop Decision+Reason, Core Business Logic, Current State, Open Questions. When in doubt → keep it. A slightly verbose closet beats a lossy one. If closet feels wrong → user says "recompress {room}" to redo.

### 30. Dirty flag missed in long sessions
**Symptom:** Session had meaningful work but save reminder never triggered — data lost  
**Root cause:** Session >50 messages → early dirty items fall out of active context window  
**Fix:** 
- PostToolUse write hook catches most cases automatically
- For long sessions: save incrementally ("save session + learn" mid-session), don't wait for end
- Rule: if session >50 messages → treat as dirty=true regardless of content
- Max 2 save reminders per session to avoid fatigue (Gotcha #17)

---

## Quick Reference: Fix Matrix

| Gotcha | When | Fix |
|--------|------|-----|
| hall.md drift (#2) | Adding/removing room | Update hall.md same step |
| Stale closet (#3) | Room edit >10 lines | Regenerate closet immediately |
| Room compression (#4) | Session end | Check all modified rooms |
| state.md overflow (#5) | Wing count grows | Archive after 30 days inactive |
| Tunnel breaks (#6) | Archiving wing | Update tunnels.md same step |
| Score drift (#8) | Quarterly | Recalibrate: score × 0.85 |
| Auto-capture (#9) | Always | Route only confidence ≥0.8 |
| Contradictions (#10) | Before writing lesson | Search + flag existing |
| Routing loop (#11) | During routing | Check routing-log.md for cycles |
| KE wing missing (#13) | First session | Auto-create empty template |
| Sync fails (#14) | Session end | Compare + re-sync + log |
| Admission too strict (#15) | Score <0.6 | Explain + let user override |
| Dirty flag missed (#16) | Session with hidden value | Err on side of dirty=true |
| Reminder fatigue (#17) | User skips 3x in a row | Reduce sensitivity, max 2/session |
| Wing split orphan tunnels (#18) | After wing split | Remap all tunnel refs to child wings |
| Burst mode stuck (#19) | Session start | Re-check 7-day count, deactivate if ≤10 |
| Cross-project dupe (#20) | Before promote | Search global by id + semantic before writing |
| Domain settling misclass (#21) | Auto-dream | Require explicit domain_type in hall.md |
| Hook prompt drift (#22) | After restructure | Cross-check settings.json paths + workflow against SKILL.md |
| Noise skill (#23) | Before crystallizing | Verify intent match, always ask user confirmation |
| Search index unbounded (#24) | Consolidation | Archive >180 days, remove archived room refs, cap 500 |
| Nudge fatigue (#25) | Session start | Track skips, suppress after 3x, reduce to High-only |
| Audit trail bloat (#26) | Consolidation | Cap 50/template, archive oldest 25 to template-health.md |
| Skill regression (#27) | After skill use | Keep prev Steps on negative outcome, flag regression |
| Bootstrap missing (#28) | First session | Auto-create full tree with empty templates |
| AAAK over-compression (#29) | Creating closet | Never drop Decision+Reason/Core Logic; when in doubt keep it |
| Dirty missed in long session (#30) | Session >50 msgs | Save incrementally; treat >50 msgs as dirty=true |
