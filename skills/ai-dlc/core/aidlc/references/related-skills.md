# Related Skills Routing

## Pre-AIDLC (mandatory ก่อน Phase 0 ทุก new feature)
- Brainstorming → `core/brainstorming` (Party Mode: PO+Dev+QA ช่วยกันคิด → output เป็น input ของ DECISIONS phase; scale auto-detect: Small/Medium/Large)

## Standalone Tools (ไม่เข้า AIDLC loop)
- Postman migration → `postman-to-playwright/postman` (Postman collection → Playwright tests, trigger ตรงจาก SKILL.md)

## Phase 1-4 (Recurring Loop)
- Analysis → `core/analysis-skills`
- Architecture → `po/architect`, QA architecture → `qa/qa-architect`
- AI reasoning → `system/ai-techniques` (CoT for linear, LATS for compare, AoT for complex branching, Step-Back for big picture, Discovery for reuse scan)
- Test scenarios → `qa/test-scenario`
- Code writing/testing → `qa/playwright-testing`, `qa/robotframework-testing`
- Frontend → `dev/frontend-dev`, Backend → `dev/backend-dev`
- Pipeline & PR & DevOps sync → `dev/devops-pipeline`
- UI/UX → `ux-ui/ui-designer`
- **Phase 3.1 (large task sets)** → `core/subagent-driven` (dispatch subagent per task, 2-stage review)

## Phase 5: Reflect (Every Session End)
- Knowledge scoring + Memory persistence → `system/agent-memory` (score templates, auto-capture lessons, save context, update wings/rooms)
