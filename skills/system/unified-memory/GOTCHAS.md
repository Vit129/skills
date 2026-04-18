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
