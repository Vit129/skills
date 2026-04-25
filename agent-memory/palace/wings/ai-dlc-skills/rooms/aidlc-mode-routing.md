# AIDLC Mode Routing — Design Decision

Created: 2026-04-25
Status: Approved (pending implementation)

## Context

User wants AIDLC to support 3 execution modes: Full, Dev Only, QA Only — without maintaining separate workflow systems. Compared with orchestrator v1 (_backup-v1-archived) which had dedicated "Test Scenario" workflow (4 phases: Template→PO→QA Scenario→Librarian).

## Decision

Add mode routing to existing AIDLC workflow.md — not a separate system.

### 3 Modes

| Mode | Command | Inception (1.1-1.7) | QA (2.1-2.4) | Dev (2.5) | Construction (3.1-3.3) |
|------|---------|---------------------|--------------|-----------|----------------------|
| Full | `start AI-DLC` | ✅ | ✅ | ✅ | ✅ |
| QA Only | `start AI-DLC QA only` | ⏭️ skip | ✅ | ⏭️ skip | ⏭️ skip |
| Dev Only | `start AI-DLC Dev only` | ⏭️ skip | ⏭️ skip | ✅ | ✅ |

### Prerequisite Rules (mode-aware)

| Mode | Has specs | No specs (PBI only) |
|------|-----------|---------------------|
| Full | Full inception | Full inception |
| QA Only | Skip inception → Phase 2.1 | Lite Inception → mini-spec → Phase 2.1 |
| Dev Only | Skip inception → Phase 2.5 | Lite Inception → mini-spec → Phase 2.5 |

### Lite Inception (new concept)

Mini phase for when only PBI exists (no Business/Architecture specs):
1. Read PBI from MCP/Azure DevOps → description, AC
2. Read Figma from link (if available) → UI structure
3. Read web/wiki (if link provided) → business context
4. Generate mini-spec.md (1-2 pages) → user approves
5. Use mini-spec as input for QA/Dev phases

### Hard Rules (unchanged)

- ALL modes still use `.aidlc/` folder structure
- ALL modes still require DECISIONS → PLAN → EXECUTE
- ALL modes still require task design (qa-task-design or dev-task-design)
- Anti-shortcut rules still apply within each mode's active phases

## QA Sub-Modes (refined from v1 analysis)

| QA Sub-Mode | Phases | Equivalent v1 Workflow |
|---|---|---|
| QA Scenario Only | Lite Inception (if needed) → 2.1 → 2.2 → done | Test Scenario (4 phases) |
| QA Automation (API/Web/Android/iOS) | Lite Inception (if needed) → 2.1 → 2.2 → 2.3 → 2.4 → done | API/Web/Mobile Automation (6 phases) |

Platform selection: after `"start AI-DLC QA automation"` → agent asks: 1.API 2.Web UI 3.Android 4.iOS

Platform difference:
- API → qa-architect uses api-arch.md, playwright-rules/api.md, no Labels.ts, no TestId Map
- Web → qa-architect uses web-arch.md, playwright-rules/web-ui.md, Labels.ts MANDATORY, TestId Map MANDATORY
- Android → qa-architect uses mobile-arch.md, robotframework-rules/android.md
- iOS → qa-architect uses mobile-arch.md, robotframework-rules/ios.md

## Lite Inception ≈ v1 PO Specialist

Maps to v1 poSpecialist.md steps:
- Step 1 (Context Analysis) → read PBI + extract requirements
- Step 2 (Domain Analysis) → check knowledge base for reuse
- Step 3 (Gap Analysis) → identify missing logic
- Step 4 (Figma Analysis) → read Figma if link provided
- Output: mini-spec.md (replaces v1's draft_path template sections)

## v1 ↔ v2 Gap Analysis

| v1 Component | v2 Equivalent | Gap |
|---|---|---|
| PO Specialist | ❌ none | Need Lite Inception |
| Template Manager | ❌ none | Not needed — .aidlc folder replaces templates |
| Workflow type detection | ❌ none | Need mode detection prompt |
| QA Requirements Specialist | Phase 2.1 QA Task Design | Covered |
| QA Test Scenario Specialist | Phase 2.2 Test Case Design | Covered |
| Architect Specialist | Phase 2.3 QA Architecture | Covered |
| Playwright Code Generator | Phase 2.4 Test Script Design | Covered |
| Playwright Test Validator | Phase 2.4 (included) | Covered |
| Librarian | ❌ none | Not needed — agent-memory replaces |

## Files to Modify

1. `workflow.md` — Add "Execution Modes" section + Lite Inception + mode-aware routing + QA sub-modes
2. `KIRO.md` — Add quick commands + mode rules
3. `phase-entry.md` — Add QA Only / Dev Only entry points

## Comparison with Orchestrator v1

| Capability | Orchestrator v1 | AIDLC + Modes |
|---|---|---|
| QA-only (PBI→Scenario) | ✅ Test Scenario workflow | ✅ QA Scenario Only mode |
| QA+Automation | ✅ API/Web Automation workflow | ✅ QA Automation mode |
| Dev only | ❌ not supported | ✅ Dev Only mode |
| Governance (.aidlc) | ❌ sessionState.json only | ✅ full .aidlc folder |
| PBI-only input | ✅ PO Specialist handled | ✅ Lite Inception |
| Mode detection | ✅ workflow_type auto-detect | 🔄 Need to add prompt |
