# Deep Comparison: ai-agent/ vs .claude/skills/

Concept-based gap analysis. จัดกลุ่มตาม logical concept ไม่ใช่ตาม workflow file.

---

## Upgrade Plan — Priority Order

แก้ทีละอัน เรียงจาก CRITICAL → IMPORTANT

### CRITICAL (7 items)

| # | Concept | สิ่งที่ขาด | แก้ที่ไฟล์ | สิ่งที่ต้องเพิ่ม |
|---|---------|-----------|-----------|----------------|
| C1 | Quick Automation Mode | ไม่มี mode แก้ test script โดยไม่ต้องรัน full workflow | `playwright-testing/references/quick-automation.md` (NEW) | Decision tree (Quick/Phase2/Phase3/Full), scope check, adversarial review, per-platform compliance |
| C2 | Quick Automation Escalation | ไม่มี logic route กลับ full workflow เมื่อ scope ใหญ่เกิน | `playwright-testing/references/quick-automation.md` (NEW) | Escalation triggers: new multi-file service, DB schema change, locator style change, workflow type change |
| C3 | Healer Impact Analysis | แก้ bug โดยไม่วิเคราะห์ blast radius ก่อน | `playwright-testing/references/workflow.md` | Impact Analysis step: classify Isolated/Shared/Cross-layer ก่อน heal |
| C4 | CoT Test Scenario Pattern | ไม่มี CoT pattern เฉพาะสำหรับ test scenario design | `ai-techniques/references/cot.md` | Pattern 2: 5 steps (Requirements → Scenario ID → Steps Breakdown → Elicitation 5 methods → Coverage %) |
| C5 | LATS Resilience Strategy | เลือก strategy แล้วไม่มี step ออกแบบ resilience | `ai-techniques/references/lats.md` | Resilience step: retry policies, timeouts, mock list per external dependency |
| C6 | Schema Consistency Check | ไม่มีการเทียบ API schema กับ DB schema | `qa-architect/references/test-db-strategy.md` | Extract API fields → Extract DB columns → Compare types/constraints → Report mismatches |
| C7 | Shared Fixtures Detection | ไม่มี logic ตรวจว่า feature มี tests ข้าม layer | `qa-architect/references/api-arch.md` | Detect Web+API+Mobile → create shared-fixtures/ structure |

### IMPORTANT (30 items) — grouped by concept

#### AI Reasoning (6 items)
| # | Concept | แก้ที่ไฟล์ | สิ่งที่ต้องเพิ่ม |
|---|---------|-----------|----------------|
| I1 | CoT Elicitation ขาด 2 methods | `ai-techniques/references/cot.md` | เพิ่ม Constraint Removal + Stakeholder Mapping |
| I2 | CoT Coverage Verification | `ai-techniques/references/cot.md` | เพิ่ม Total AC / Covered AC / Coverage % |
| I3 | LATS Locator Strategy | `ai-techniques/references/lats.md` | เพิ่ม locator strategy step สำหรับ UI (priority + justifications) |
| I4 | LATS Context-specific Scoring | `ai-techniques/references/lats.md` | เพิ่ม scoring criteria: Test Scenario vs Architecture |
| I5 | Step-Back Context Templates | `ai-techniques/references/step-back.md` | เพิ่ม 4 templates: Business, Technical, Domain, Asset Reuse |
| I6 | Domain Common/Specific Classification | `analysis-skills/references/domain.md` | เพิ่ม 3 questions: Q1 any industry? Q2 needs context? Q3 company rules? |

#### Architecture & Design (6 items)
| # | Concept | แก้ที่ไฟล์ | สิ่งที่ต้องเพิ่ม |
|---|---------|-----------|----------------|
| I7 | Multi-tenancy Decision Framework | `architect/references/decomposition.md` | เพิ่ม 3 options: Single-Tenant / Shared DB / Schema-per-Tenant |
| I8 | Mermaid Sequence Diagrams | `architect/references/logical-design.md` | เพิ่ม mandate: every API endpoint MUST have sequence diagram |
| I9 | API Test Checklist per Endpoint | `architect/references/logical-design.md` | เพิ่ม mandate: every endpoint MUST have test case checklist |
| I10 | Logical Design Completeness Validation | `architect/references/logical-design.md` | เพิ่ม 6 checks: stories→specs, endpoints→contracts, test checklists, diagrams, frontend, MVP |
| I11 | API Architect Blueprint Format | `qa-architect/references/api-arch.md` | เพิ่ม describe blocks, TC-to-service mapping, lifecycle hooks, tags |
| I12 | API Architect Template Integration | `qa-architect/references/api-arch.md` | เพิ่ม extract templates from discovery + import pattern |

#### Test Scenario & QA (7 items)
| # | Concept | แก้ที่ไฟล์ | สิ่งที่ต้องเพิ่ม |
|---|---------|-----------|----------------|
| I13 | Scenario HTML Format for CSV | `test-scenario/references/designer.md` | เพิ่ม Pre_conditions=HTML ul/li, Steps=HTML br สำหรับ Azure DevOps |
| I14 | Scenario Tester Assignment | `test-scenario/references/designer.md` | เพิ่ม read qaAssignTo.json for tester email |
| I15 | Scenario Edge Case Types | `test-scenario/references/designer.md` | เพิ่ม temporal mismatch, semantic equivalence, rollback |
| I16 | Quick Scenario Adversarial Review | `test-scenario/references/quick-scenario.md` | เพิ่ม checklist: title format, ID duplication, section, priority |
| I17 | Test Case Regression/Obsolete Analysis | `aidlc/references/phases/inception/test-case-design.md` | เพิ่ม step: review previous sprint test cases |
| I18 | Scenario Reader Derive Mode | `analysis-skills/references/scenario-reader.md` | เพิ่ม derive API from UI scenarios with [DERIVED-FROM-UI] tag |
| I19 | Reverse Engineering Incremental Update | `analysis-skills/references/reverse-eng.md` | เพิ่ม Step 0: compare existing context, update only changed |

#### Code Quality & Healing (5 items)
| # | Concept | แก้ที่ไฟล์ | สิ่งที่ต้องเพิ่ม |
|---|---------|-----------|----------------|
| I20 | Code Review Adversarial Classification | `playwright-testing/references/workflow.md` | เพิ่ม classify: logic_bug / arch_mismatch / code_quality / forbidden_pattern |
| I21 | Healer Visual Debugging Checklist | `playwright-testing/references/workflow.md` | เพิ่ม checklist: opacity, z-index, overlay, blank screen, text variation |
| I22 | DB Writer Health Check | `playwright-testing/references/db-writer.md` | เพิ่ม mandatory checkConnection() method |
| I23 | Mobile Healer Impact Analysis | `robotframework-testing/references/workflow.md` | เพิ่ม Isolated/Shared/Cross-platform classification |
| I24 | Code Writer Template Integration | `playwright-testing/references/workflow.md` | เพิ่ม extract templates from discovery |

#### Governance & DevOps (4 items)
| # | Concept | แก้ที่ไฟล์ | สิ่งที่ต้องเพิ่ม |
|---|---------|-----------|----------------|
| I25 | Approval Keyword Mapping | `aidlc/references/decision.md` | เพิ่ม table: "yes"/"อนุมัติ"/"โอเค" = approve |
| I26 | Azure DevOps Field Mapping Config | `devops-pipeline/references/azure-sync.md` | เพิ่ม explicit reference to field mapping config |
| I27 | Azure DevOps Post-creation Validation | `devops-pipeline/references/azure-sync.md` | เพิ่ม validation step: query via MCP to verify |
| I28 | DB Strategy Mocking Fallback | `qa-architect/references/test-db-strategy.md` | เพิ่ม fallback: page.route() mock, hardcoded fixture, [PARTIAL_MOCK] tag |

#### Figma & UI Analysis (2 items)
| # | Concept | แก้ที่ไฟล์ | สิ่งที่ต้องเพิ่ม |
|---|---------|-----------|----------------|
| I29 | Figma Visual-to-Business Mapping | `analysis-skills/references/figma.md` | เพิ่ม table: UI Element → Visual State → Business Rule |
| I30 | Figma Visual Error Simulation | `analysis-skills/references/figma.md` | เพิ่ม network failure, loading, empty state, concurrent override |

#### Discovery & Knowledge (3 items — from resourcesDiscoverySkill)
| # | Concept | แก้ที่ไฟล์ | สิ่งที่ต้องเพิ่ม |
|---|---------|-----------|----------------|
| I31 | Discovery Index-first Scan | `ai-techniques/references/discovery.md` | เพิ่ม specific index file paths per workflow type |
| I32 | Discovery Test Data + Business Logic Scan | `ai-techniques/references/discovery.md` | เพิ่ม scan testScenarioIndex.json + businessIndex.json |
| I33 | Discovery Knowledge Buffer Capture | `ai-techniques/references/discovery.md` | เพิ่ม capture new patterns for 2+ features |

---

## MINOR (20 items) — nice to have, ทำทีหลัง

| # | Concept | แก้ที่ไฟล์ |
|---|---------|-----------|
| M1 | Plan status lifecycle (4 states) | `aidlc/references/decision.md` |
| M2 | Audit trail explicit update step | `aidlc/references/workflow.md` |
| M3 | Negative scenario generation | `analysis-skills/references/requirements.md` |
| M4 | MVP scope definition | `analysis-skills/references/requirements.md` |
| M5 | Reverse engineering output templates | `analysis-skills/references/reverse-eng.md` |
| M6 | Bounded context priority ordering | `architect/references/decomposition.md` |
| M7 | Per-context iteration for microservices | `architect/references/domain-design.md` |
| M8 | Technical questions framework fallback | `architect/references/logical-design.md` |
| M9 | Automation status default rules | `aidlc/references/phases/inception/test-case-design.md` |
| M10 | TDD REFACTOR cycle detail | `aidlc/references/phases/construction/implementation.md` |
| M11 | Local-first development guidance | `aidlc/references/phases/construction/implementation.md` |
| M12 | Bug documentation format | `aidlc/references/phases/construction/automated-testing-execution.md` |
| M13 | HTML formatting rules for Azure DevOps | `devops-pipeline/references/azure-sync.md` |
| M14 | ID sync-back step detail | `devops-pipeline/references/azure-sync.md` |
| M15 | LATS tie-breaking rule | `ai-techniques/references/lats.md` |
| M16 | Gap analysis confidence scoring | `analysis-skills/references/gap.md` |
| M17 | Recorder cleanup step | `playwright-testing/references/workflow.md` |
| M18 | Knowledge buffer phase-specific extraction | `storage/references/buffer-update.md` |
| M19 | Directory creation step in code writer | `playwright-testing/references/workflow.md` |
| M20 | Context cost management guidance | `ai-techniques/references/discovery.md` |

---

## Final Count

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 7 | ❌ Pending |
| IMPORTANT | 33 | ❌ Pending |
| MINOR | 20 | ❌ Pending |
| Total | 60 | |

---

## ✅ RESOLVED

### Folder Structure & Naming Convention
- `playwright-testing/references/workflow.md` — SYSTEM_KEBAB/SYSTEM_FEATURE_KEBAB + legend
- `robotframework-testing/references/workflow.md` — same + platform level
- `qa-architect/references/api-arch.md` — fixed from [system]/[feature]
- `qa-architect/references/web-arch.md` — same
- `qa-architect/references/mobile-arch.md` — same + platform level
- `test-scenario/references/designer.md` — output file structure added

### Progress File System (replaces sessionState.json)
- `aidlc/references/dev-task-design.md` — added Context + Artifacts sections to template
- `aidlc/references/qa-task-design.md` — added Context + Artifacts sections to template
- Both files now include:
  - File Behavior: reuse within iteration, archive as `.v{N}.md` on rerun
  - Master Index: `.aidlc/PROGRESS.md` — single-file overview of all iterations
  - Resume Protocol: "ทำต่อ" → read PROGRESS.md → find 🔄 → read progress file → find first `[ ]` → continue
