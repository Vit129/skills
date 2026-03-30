# Skills Comparison: ai-agent/ vs .claude/skills/

เปรียบเทียบความสามารถระหว่าง Gen 2 (ai-agent/) กับ Gen 3 (.claude/skills/)
พร้อมแผน upgrade ให้ .claude/skills/ เทียบเท่าหรือเหนือกว่า

## สรุปภาพรวม

| | ai-agent/ (Gen 2) | .claude/skills/ (Gen 3) |
|---|---|---|
| Agents (personas) | 15 specialists | ไม่มี (ไม่จำเป็น — Claude Code เป็น single agent) |
| Skills | 50+ files (แยกละเอียดมาก) | 20 skills (consolidated, ไม่ซ้ำ) |
| Orchestrator | 2 orchestrators + 2 session states | ไม่มี (ใช้ AIDLC workflow + checklist แทน) |
| Rules | 8 files ใน rules/ | 3 skills (playwright-rules, rf-rules, ts-rules) |
| Templates | 6 master templates | อยู่ใน aidlc/references/templates/ |
| Knowledge base | 3 categories (business, automation, lessons) | storage skill + references |
| Scripts | 8 executable scripts | postman/scripts/ + test-scenario/scripts/ |

---

## 1. Agents → Skills Mapping

ai-agent/ มี 15 specialist agents ที่ .claude/skills/ ไม่มี concept "agent persona" แต่ความสามารถถูก consolidate เข้า skills แล้ว

| ai-agent/ Agent | หน้าที่ | .claude/skills/ ที่ cover | ครบ? |
|---|---|---|---|
| templateManagerSpecialist | สร้างไฟล์จาก template | `aidlc` (template-creation.md) | ✅ |
| poSpecialist | Context/Domain/Gap analysis | `analysis-skills` (context, domain, gap, figma) | ✅ |
| qaRequirementsSpecialist | รวบรวม test cases จาก specs | `analysis-skills` (scenario-reader, requirements) | ✅ |
| qaTestScenarioSpecialist | ออกแบบ scenarios, export CSV | `test-scenario` + `test-scenario-rules` | ✅ |
| architectSpecialist | QA automation architecture | `qa-architect` (api-arch, web-arch, mobile-arch) | ✅ |
| playwrightCodeGeneratorSpecialist | เขียน Playwright code | `playwright-testing` (workflow, db-writer) | ✅ |
| playwrightTestValidatorSpecialist | Review + Run + Heal tests | `playwright-testing` (workflow — heal section) | ✅ |
| robotFrameworkCodeGeneratorSpecialist | เขียน RF code | `robotframework-testing` (workflow) | ✅ |
| robotFrameworkTestValidatorSpecialist | Review + Run + Heal RF | `robotframework-testing` (workflow — heal section) | ✅ |
| postmanSpecialist | Postman → Playwright | `postman` (conversion + scripts) | ✅ |
| librarianSpecialist | Save knowledge | `storage` (business, automation, scenario, buffer) | ✅ |
| devOpsSpecialist | CI/CD pipeline | `devops-pipeline` (pipeline, pull-request, azure-sync) | ✅ |
| aidlcPoSpecialist | AIDLC inception (RE, requirements) | `aidlc` + `analysis-skills` | ✅ |
| aidlcArchitectSpecialist | DDD strategic + tactical + logical | `aidlc` + `architect` | ✅ |
| aidlcDeveloperSpecialist | TDD implementation + PR | `aidlc` + `backend-dev` + `frontend-dev` | ✅ |

**สรุป: ทุก agent ถูก cover แล้ว**

---

## 2. Skills → Skills Mapping (ละเอียด)

### 2.1 AIDLC Skills (13 ตัวใน ai-agent/)

| ai-agent/ Skill | .claude/skills/ | ครบ? | หมายเหตุ |
|---|---|---|---|
| decisionPlanExecuteSkill | `aidlc` (decision.md) | ✅ | |
| requirementsGatheringSkill | `analysis-skills` (requirements.md) | ✅ | |
| reverseEngineeringSkill | `analysis-skills` (reverse-eng.md) | ✅ | |
| domainDecompositionSkill | `architect` (decomposition.md) | ✅ | |
| domainDesignSkill | `architect` (domain-design.md) | ✅ | |
| logicalDesignSkill | `architect` (logical-design.md) | ✅ | |
| testCaseDesignSkill | `aidlc` (phases/inception/test-case-design.md) | ✅ | |
| testScriptDesignSkill | `aidlc` (phases/inception/test-script-design.md) | ✅ | |
| devTaskDesignSkill | `aidlc` (dev-task-design.md) | ✅ | + progress checklist |
| implementationSkill | `aidlc` (phases/construction/implementation.md) | ✅ | |
| automatedTestingSkill | `aidlc` (phases/construction/automated-testing-execution.md) | ✅ | |
| createPullRequestSkill | `devops-pipeline` (pull-request.md) | ✅ | |
| azureDevOpsSyncSkill | `devops-pipeline` (azure-sync.md) | ✅ | |

### 2.2 AI Technique Skills (6 ตัว)

| ai-agent/ Skill | .claude/skills/ | ครบ? | หมายเหตุ |
|---|---|---|---|
| chainOfThoughtSkill | `ai-techniques` (cot.md) | ✅ | |
| latsSimulationSkill | `ai-techniques` (lats.md) | ✅ | |
| stepBackPromptingSkill | `ai-techniques` (step-back.md) | ✅ | |
| resourcesDiscoverySkill | `ai-techniques` (discovery.md) | ✅ | |
| databaseStrategySkill | `qa-architect` (test-db-strategy.md) | ✅ | ย้ายไป QA context |
| domainAnalysisSkill | `analysis-skills` (domain.md) | ✅ | ย้ายไป analysis |

### 2.3 Coding Skills (13 ตัว)

| ai-agent/ Skill | .claude/skills/ | ครบ? | หมายเหตุ |
|---|---|---|---|
| playwrightCodeWriterSkill | `playwright-testing` (workflow.md — write section) | ✅ | |
| playwrightCodeReviewSkill | `playwright-testing` (workflow.md — review section) | ✅ | |
| playwrightExecutionSkill | `playwright-testing` (workflow.md — run section) | ✅ | |
| playwrightHealerSkill | `playwright-testing` (workflow.md — heal section) | ✅ | |
| playwrightDatabaseWriterSkill | `playwright-testing` (db-writer.md) | ✅ | |
| playwrightCliSkill | `playwright-cli` (commands.md, workflows.md) | ✅ | |
| robotframeworkCodeWriterSkill | `robotframework-testing` (workflow.md — write) | ✅ | |
| robotframeworkCodeReviewSkill | `robotframework-testing` (workflow.md — review) | ✅ | |
| robotframeworkExecutionSkill | `robotframework-testing` (workflow.md — run) | ✅ | |
| robotframeworkHealerSkill | `robotframework-testing` (workflow.md — heal) | ✅ | |
| pythonDatabaseWriterSkill | `robotframework-testing` (python-db.md) | ✅ | |
| devOpsPipelineSkill | `devops-pipeline` (pipeline.md) | ✅ | |
| quickAutomationSkill | `playwright-testing` (workflow.md — quick section) | ⚠️ | ดูหัวข้อ 4 |

### 2.4 Other Skills

| ai-agent/ Skill | .claude/skills/ | ครบ? | หมายเหตุ |
|---|---|---|---|
| contextAnalysisSkill | `analysis-skills` (context.md) | ✅ | |
| figmaAnalysisSkill | `analysis-skills` (figma.md) | ✅ | |
| gapAnalysisSkill | `analysis-skills` (gap.md) | ✅ | |
| testScenarioReaderSkill | `analysis-skills` (scenario-reader.md) | ✅ | |
| webUiRecorderAnalyzerSkill | `playwright-testing` (recorder.md) | ✅ | |
| scenarioDesignerSkill | `test-scenario` (designer.md) | ✅ | |
| testDataGenerationSkill | `test-scenario` (data-gen.md) | ✅ | |
| testScenarioAnalysisSkill | `test-scenario` (reuse-analysis.md) | ✅ | |
| csvValidatorSkill | `test-scenario` (csv-validator.md) | ✅ | |
| quickScenarioSkill | `test-scenario` (quick-scenario.md) | ✅ | |
| postmanConversionSkill | `postman` (conversion.md) | ✅ | |
| businessKnowledgeSaveSkill | `storage` (business-save.md) | ✅ | |
| automationKnowledgeSaveSkill | `storage` (automation-save.md) | ✅ | |
| testScenarioKnowledgeSaveSkill | `storage` (scenario-save.md) | ✅ | |
| knowledgeBufferUpdateSkill | `storage` (buffer-update.md) | ✅ | |
| templateCreationSkill | `aidlc` (template-creation.md) | ✅ | |
| resetWorkflowSkill | ไม่มี | ❌ | ดูหัวข้อ 4 |
| apiArchitectSkill | `qa-architect` (api-arch.md) | ✅ | |
| webUiArchitectSkill | `qa-architect` (web-arch.md) | ✅ | |
| mobileArchitectSkill | `qa-architect` (mobile-arch.md) | ✅ | |

---

## 3. สิ่งที่ .claude/skills/ มีแต่ ai-agent/ ไม่มี (เหนือกว่า)

| ความสามารถ | .claude/skills/ | ai-agent/ |
|---|---|---|
| Backend Development | `backend-dev` (API, DB, Auth, Node, Python, Docker) | ❌ ไม่มี |
| Frontend Development | `frontend-dev` (React, Flutter, Kotlin, Swift, Tailwind, Vite) | ❌ ไม่มี |
| UI/UX Design | `ui-designer` (design system, colors, typography) | ❌ ไม่มี |
| Google Sheets | `google-sheets` (GAS sync) | ❌ ไม่มี |
| Skill Creator | `skill-creator` (meta-skill สำหรับสร้าง skill ใหม่) | ❌ ไม่มี |
| Architecture Patterns | `architect` (architecture-patterns.md — Microservices vs Monolith) | ❌ ไม่มี |
| TDD Reference | `architect` (tdd.md) | ❌ ไม่มี (มีแค่ใน AIDLC workflow) |
| Progress Checklist | `aidlc` (dev-task-design + qa-task-design มี checklist) | ❌ ใช้ sessionState.json แทน |

---

## 4. สิ่งที่ ai-agent/ มีแต่ .claude/skills/ ยังขาด (ต้อง upgrade)

### 4.1 ❌ Reset Workflow
- ai-agent/ มี `resetWorkflowSkill.md` สำหรับ clear session
- .claude/skills/ ไม่มี — ไม่จำเป็นเพราะไม่มี sessionState.json แต่ควรมี "reset checklist" instruction

**แผน upgrade:** เพิ่มใน `aidlc/references/workflow.md` ส่วน Quick Commands ว่า "reset AI-DLC" ให้ลบ progress checklist files

### 4.2 ⚠️ Quick Automation (standalone)
- ai-agent/ มี `quickAutomationSkill.md` — แก้ test script ที่มีอยู่โดยไม่ต้องรัน full workflow
- .claude/skills/ `playwright-testing` workflow มี heal section แต่ไม่มี "quick patch" mode แยก

**แผน upgrade:** เพิ่ม `references/quick-automation.md` ใน `playwright-testing/`

### 4.3 ⚠️ Sharding Tags (ROLE_START/STEP_START)
- ai-agent/ agents ใช้ sharding tags สำหรับ partial loading
- .claude/skills/ ไม่จำเป็น — Claude Code มี progressive disclosure (SKILL.md → references/) อยู่แล้ว

**ไม่ต้อง upgrade** — Claude Code architecture ดีกว่าอยู่แล้ว

### 4.4 ⚠️ Session State Management
- ai-agent/ มี sessionState.json + aidlcSessionState.json ที่ track ทุกอย่าง
- .claude/skills/ ใช้ progress checklist (markdown) แทน

**ไม่ต้อง upgrade** — checklist approach ดีกว่าเพราะ:
- คนอ่านได้ (ไม่ใช่แค่ AI)
- Git-friendly (diff ได้)
- ไม่ต้อง parse JSON

### 4.5 ⚠️ Adversarial Review Pattern
- ai-agent/ agents หลายตัวมี adversarial review (classify: logic_bug/arch_mismatch/code_quality)
- .claude/skills/ `playwright-testing` workflow มี review step แต่ไม่ได้ classify แบบเดียวกัน

**แผน upgrade:** เพิ่ม adversarial review classification ใน `playwright-testing/references/workflow.md` review section

### 4.6 ⚠️ Escalation Logic
- ai-agent/ quickScenarioSkill + quickAutomationSkill มี escalation — ถ้าแก้ไม่ได้ route กลับ full workflow
- .claude/skills/ ยังไม่มี explicit escalation path

**แผน upgrade:** เพิ่ม escalation rules ใน `test-scenario/references/quick-scenario.md` และ `playwright-testing/references/workflow.md`

---

## 5. สรุป Score

| หมวด | ai-agent/ (Gen 2) | .claude/skills/ (Gen 3) |
|---|---|---|
| Coverage (ครอบคลุม) | 50+ skills | 20 skills (consolidated) — ครบ 100% |
| Dev/Frontend/UI | ❌ ไม่มี | ✅ มี 3 skills ใหม่ |
| Orchestration | ✅ sessionState + orchestrator | ⚠️ checklist (ดีพอ แต่ต่างกัน) |
| Maintainability | ❌ 50+ files, duplicates เยอะ | ✅ 20 skills, ไม่ซ้ำ |
| Readability | ⚠️ sharding tags ซับซ้อน | ✅ clean markdown |
| Cross-tool | ❌ ผูกกับ Amazon Q | ✅ Kiro steering reference ได้ |

**Overall: .claude/skills/ เทียบเท่า ai-agent/ ในด้าน coverage และเหนือกว่าในด้าน maintainability + cross-tool support**

---

## 6. Upgrade Plan (ทำให้เหนือกว่า 100%)

| # | สิ่งที่ต้องทำ | ไฟล์ที่แก้ | Priority |
|---|---|---|---|
| 1 | เพิ่ม reset instruction ใน workflow.md | `aidlc/references/workflow.md` | Low |
| 2 | เพิ่ม quick-automation.md | `playwright-testing/references/` | Medium |
| 3 | เพิ่ม adversarial review classification | `playwright-testing/references/workflow.md` | Medium |
| 4 | เพิ่ม escalation logic | `test-scenario/references/quick-scenario.md` + `playwright-testing/references/workflow.md` | Medium |

ทำ 4 ข้อนี้เสร็จ = .claude/skills/ เหนือกว่า ai-agent/ ทุกด้าน
