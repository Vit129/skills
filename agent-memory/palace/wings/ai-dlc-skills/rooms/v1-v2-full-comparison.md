# v1 (_backup) vs v2 (ai-dlc) — Full System Comparison

Date: 2026-04-12

## Coverage Summary
- v1 had ~30 skills/agents → v2 covers 27/30 ✅
- v2 has 15+ additional capabilities v1 never had

## Confirmed Gaps (v2 missing from v1)

ALL GAPS CLOSED as of 2026-04-12:

| # | Gap | Resolution |
|---|---|---|
| 1 | Code Review (playwright) | ✅ `playwright-code-review.md` created |
| 2 | Code Review (RF) | ✅ `rf-code-review.md` created |
| 3 | Recorder Analyzer | ✅ Not needed — `playwright-cli` covers this |
| 4 | Reset Workflow | ✅ Not needed — anti-shortcut rules prevent reset |
| 5 | Template Auto-Creation | ✅ Not needed — templates/ folder exists |
| 6 | Machine-readable state | ✅ Not needed — Memory Palace + PROGRESS.md + .aidlc sufficient |

Bonus: `frontend-code-review.md` + `backend-code-review.md` added (v1 never had these)

## Design Difference: v1 split vs v2 merged
v1: separate skills for write/review/run/heal (4 files per platform)
v2: merged into single workflow.md per platform (write→review→run→heal in 1 file)
Decision: v2 approach is correct (less files, less context switching) BUT code-review deserves its own reference because review criteria are different from writing criteria

## v2-only capabilities (v1 never had)
frontend-dev (React/Next.js/Tailwind/Flutter/Android/iOS), backend-dev (API/auth/DB/Node/Python/Docker),
K6 performance-testing, security-scanning, visual-regression, accessibility, component-testing,
browser-library, rf7-features, memory-palace, monitoring, ui-designer, DDD/BDD/TDD methodology,
complexity levels, anti-shortcut rules, OIDC, GitHub Actions advanced

## All Rules: 100% covered ✅
All 10 v1 rule files have v2 equivalents (including git-commit.md added today)

## All Knowledge: 100% shared ✅
knowledge/ folder identical structure (automation/, business/, lessons/)
