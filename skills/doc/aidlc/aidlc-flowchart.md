# AIDLC Workflow — Flowchart

> Color legend: 🟢 Start/End &nbsp; ⬜ Phase 0 &nbsp; 🟡 Inception (Phase 1) &nbsp; 🌸 QA (Phase 2) &nbsp; 🔵 Construction (Phase 3) &nbsp; 🟣 Deploy &nbsp; 🔴 Stop

## High-Level Overview

```mermaid
flowchart TD
    Start([Start AIDLC]) --> P0[Phase 0: Project Detection<br/>Test Root, Data Storage,<br/>Server Logic, Client App]
    P0 --> ProjectType{Project Type?}
    ProjectType -->|Brownfield| RE[1.1 Reverse Engineering<br/>Analyze Existing Codebase]
    ProjectType -->|Greenfield| RG[1.2 Requirements Gathering]
    RE --> RG

    RG --> DD[1.3 Domain Decomposition<br/>Bounded Contexts + Architecture]

    DD --> ArchChoice{Architecture?}
    ArchChoice -->|Monolith| DM[1.4 Domain Design<br/>Single File]
    ArchChoice -->|Microservices| DMS[1.4 Domain Design<br/>Per Context]

    DM --> LDM[1.5 Logical Design<br/>Data Storage / Server Logic / Client App]
    DMS --> LDMS[1.5 Logical Design<br/>Per Context]

    LDM --> UIUX[1.6 UI/UX Design<br/>Figma Analysis — ui-designer skill]
    LDMS --> UIUX
    UIUX --> DevTask[1.7 Dev Task Design<br/>Task Breakdown]

    DevTask --> TC[2.1 Test Case Design<br/>BDD Scenarios]
    TC --> QAArch[2.2 QA Architecture<br/>API / Web / Mobile / DB Strategy]
    QAArch --> TS[2.3 Test Script Design<br/>Playwright / Robot Framework]
    TS --> QATask[2.4 QA Task Design<br/>Task Breakdown]
    QATask --> ADO[2.5 DevOps Sync<br/>Azure DevOps Work Items]

    ADO --> IMP[3.1 Implementation<br/>TDD: GREEN]
    IMP --> AT[3.2 Automated Testing<br/>TDD: REFACTOR]
    AT --> TestResult{Tests Pass?}
    TestResult -->|No| BugFix[Self-Healing<br/>Max 3 Attempts]
    BugFix --> AT
    TestResult -->|Yes| PR[3.3 Create Pull Request]

    PR --> Review{PR Approved?}
    Review -->|No| Rework[Address Comments]
    Rework --> PR
    Review -->|Yes| Deploy[4.1 Deployment]

    Deploy --> End([End])

    style Start fill:#16a34a,color:#fff,stroke:#15803d
    style End fill:#16a34a,color:#fff,stroke:#15803d
    style P0 fill:#475569,color:#fff,stroke:#334155
    style RE fill:#d97706,color:#fff,stroke:#b45309
    style RG fill:#d97706,color:#fff,stroke:#b45309
    style DD fill:#d97706,color:#fff,stroke:#b45309
    style DM fill:#d97706,color:#fff,stroke:#b45309
    style DMS fill:#d97706,color:#fff,stroke:#b45309
    style LDM fill:#d97706,color:#fff,stroke:#b45309
    style LDMS fill:#d97706,color:#fff,stroke:#b45309
    style UIUX fill:#d97706,color:#fff,stroke:#b45309
    style DevTask fill:#d97706,color:#fff,stroke:#b45309
    style TC fill:#e11d48,color:#fff,stroke:#be123c
    style QAArch fill:#e11d48,color:#fff,stroke:#be123c
    style TS fill:#e11d48,color:#fff,stroke:#be123c
    style QATask fill:#e11d48,color:#fff,stroke:#be123c
    style ADO fill:#e11d48,color:#fff,stroke:#be123c
    style IMP fill:#2563eb,color:#fff,stroke:#1d4ed8
    style AT fill:#2563eb,color:#fff,stroke:#1d4ed8
    style BugFix fill:#dc2626,color:#fff,stroke:#b91c1c
    style PR fill:#2563eb,color:#fff,stroke:#1d4ed8
    style Rework fill:#dc2626,color:#fff,stroke:#b91c1c
    style Deploy fill:#7c3aed,color:#fff,stroke:#6d28d9
```

## Decision-Plan-Execute Pattern (Every Phase)

```mermaid
flowchart LR
    A[1. Load Phase<br/>Instructions] --> B[2. Create<br/>Decision File]
    B --> C[3. User Resolves<br/>Decisions]
    C --> D[4. Create<br/>Execution Plan]
    D --> E{5. Plan<br/>Approved?}
    E -->|No| D
    E -->|Yes| F[6. Execute<br/>Incrementally]
    F --> G[7. Update<br/>Audit Trail]
    G --> H{More<br/>Phases?}
    H -->|Yes| A
    H -->|No| I([Complete])

    style A fill:#16a34a,color:#fff,stroke:#15803d
    style B fill:#d97706,color:#fff,stroke:#b45309
    style C fill:#e11d48,color:#fff,stroke:#be123c
    style D fill:#d97706,color:#fff,stroke:#b45309
    style E fill:#475569,color:#fff,stroke:#334155
    style F fill:#2563eb,color:#fff,stroke:#1d4ed8
    style G fill:#7c3aed,color:#fff,stroke:#6d28d9
    style H fill:#475569,color:#fff,stroke:#334155
    style I fill:#16a34a,color:#fff,stroke:#15803d
```

## Routing Logic (Auto-Detection)

```mermaid
flowchart TD
    Start([User says: ทำ PBI / build / test]) --> Scan[Scan .aidlc/system/feature/]
    Scan --> HasNothing{Has nothing?}
    HasNothing -->|Yes| P0[Phase 0 → 1.2]
    HasNothing -->|No| HasUS{Has user-stories.md?}
    HasUS -->|No| P12[Phase 1.2 Requirements]
    HasUS -->|Yes| HasDD{Has domain-decomposition.md?}
    HasDD -->|No| P13[Phase 1.3 Domain Decomposition]
    HasDD -->|Yes| HasDesign{Has domain-design.md?}
    HasDesign -->|No| P14[Phase 1.4 Domain Design]
    HasDesign -->|Yes| HasLogical{Has logical-design.md?}
    HasLogical -->|No| P15[Phase 1.5 Logical Design]
    HasLogical -->|Yes| HasTC{Has test-cases?}
    HasTC -->|No| P21[Phase 2.1 Test Case Design]
    HasTC -->|Yes| HasArch{Has QA architecture?}
    HasArch -->|No| P22[Phase 2.2 QA Architecture]
    HasArch -->|Yes| HasScripts{Has test-scripts?}
    HasScripts -->|No| P23[Phase 2.3 Test Script Design]
    HasScripts -->|Yes| HasTasks{Has task breakdown?}
    HasTasks -->|No| P17[Phase 1.7 or 2.4 Task Design]
    HasTasks -->|Yes| P31[Phase 3.1 Implementation]

    style Start fill:#16a34a,color:#fff,stroke:#15803d
    style Scan fill:#475569,color:#fff,stroke:#334155
    style P0 fill:#475569,color:#fff,stroke:#334155
    style P12 fill:#d97706,color:#fff,stroke:#b45309
    style P13 fill:#d97706,color:#fff,stroke:#b45309
    style P14 fill:#d97706,color:#fff,stroke:#b45309
    style P15 fill:#d97706,color:#fff,stroke:#b45309
    style P21 fill:#e11d48,color:#fff,stroke:#be123c
    style P22 fill:#e11d48,color:#fff,stroke:#be123c
    style P23 fill:#e11d48,color:#fff,stroke:#be123c
    style P17 fill:#e11d48,color:#fff,stroke:#be123c
    style P31 fill:#2563eb,color:#fff,stroke:#1d4ed8
```

## Anti-Shortcut Rules

```mermaid
flowchart TD
    UserSays([User: เขียน code เลย]) --> Check{Has logical-design<br/>+ task breakdown?}
    Check -->|No| STOP[🛑 STOP<br/>ต้องทำ logical design<br/>+ dev-task-design ก่อน]
    Check -->|Yes| OK[✅ Proceed to Implementation]

    UserSays2([User: เขียน test script เลย]) --> Check2{Has test scenarios<br/>+ QA architecture?}
    Check2 -->|No| STOP2[🛑 STOP<br/>ต้องทำ test scenario<br/>+ QA architecture ก่อน]
    Check2 -->|Yes| OK2[✅ Proceed to Test Script]

    UserSays3([User: สร้าง PR เลย]) --> Check3{Has tests passed?}
    Check3 -->|No| STOP3[🛑 STOP<br/>ต้องรัน test ให้ PASS ก่อน]
    Check3 -->|Yes| OK3[✅ Proceed to PR]

    style STOP fill:#dc2626,color:#fff,stroke:#b91c1c
    style STOP2 fill:#dc2626,color:#fff,stroke:#b91c1c
    style STOP3 fill:#dc2626,color:#fff,stroke:#b91c1c
    style OK fill:#16a34a,color:#fff,stroke:#15803d
    style OK2 fill:#16a34a,color:#fff,stroke:#15803d
    style OK3 fill:#16a34a,color:#fff,stroke:#15803d
```

## Complexity Levels

```mermaid
flowchart LR
    Feature([Feature]) --> Assess{QA Impact?}
    Assess -->|1 page, no regression| Light[Lightweight<br/>Concise output]
    Assess -->|2-5 pages, some regression| Standard[Standard<br/>Normal depth]
    Assess -->|5+ pages, cross-module| Full[Full<br/>Sequence diagrams + checklists]

    Light --> AllPhases[All phases run<br/>Only depth changes]
    Standard --> AllPhases
    Full --> AllPhases

    style Light fill:#16a34a,color:#fff,stroke:#15803d
    style Standard fill:#d97706,color:#fff,stroke:#b45309
    style Full fill:#dc2626,color:#fff,stroke:#b91c1c
    style AllPhases fill:#475569,color:#fff,stroke:#334155
```

## File Structure

```mermaid
flowchart TD
    Root[.aidlc/] --> System[system-kebab/]
    System --> Progress[PROGRESS.md<br/>Master Index]
    System --> Feature[feature-kebab/]
    Feature --> Audit[audit.md]
    Feature --> DevProg[dev-task-progress.md]
    Feature --> QAProg[qa-task-progress.md]
    Feature --> Planning[planning/]
    Feature --> Outputs[outputs/]
    Planning --> Decisions[decisions/<br/>01-requirements.md ...]
    Planning --> Plans[plans/<br/>01-requirements.md ...]
    Outputs --> Inception[inception/<br/>user-stories.md<br/>domain-decomposition.md]
    Outputs --> Construction[construction/<br/>domain-design.md<br/>logical-design.md]

    style Root fill:#475569,color:#fff,stroke:#334155
    style Progress fill:#d97706,color:#fff,stroke:#b45309
    style Audit fill:#e11d48,color:#fff,stroke:#be123c
    style DevProg fill:#2563eb,color:#fff,stroke:#1d4ed8
    style QAProg fill:#e11d48,color:#fff,stroke:#be123c
    style Inception fill:#d97706,color:#fff,stroke:#b45309
    style Construction fill:#2563eb,color:#fff,stroke:#1d4ed8
```

## Data Flow

```mermaid
flowchart TD
    Req[Requirements<br/>PBI / Business Spec] --> US[1.2 User Stories]
    US --> DDec[1.3 Domain Decomposition]
    DDec --> DDes[1.4 Domain Design]
    DDes --> LD[1.5 Logical Design]
    LD --> DevTask[1.7 Dev Task Design]
    LD --> TC[2.1 Test Cases<br/>testScenario.md + .csv]
    TC --> QAArch[2.2 QA Architecture]
    QAArch --> TS[2.3 Test Scripts<br/>Playwright / Robot Framework]
    TS --> QATask[2.4 QA Task Design]
    DevTask --> IMP[3.1 Implementation]
    QATask --> AT[3.2 Automated Testing]
    IMP --> AT
    AT --> PR[3.3 Pull Request]
    PR --> Deploy[4.1 Deployment]

    style Req fill:#475569,color:#fff,stroke:#334155
    style US fill:#d97706,color:#fff,stroke:#b45309
    style DDec fill:#d97706,color:#fff,stroke:#b45309
    style DDes fill:#d97706,color:#fff,stroke:#b45309
    style LD fill:#d97706,color:#fff,stroke:#b45309
    style DevTask fill:#d97706,color:#fff,stroke:#b45309
    style TC fill:#e11d48,color:#fff,stroke:#be123c
    style QAArch fill:#e11d48,color:#fff,stroke:#be123c
    style TS fill:#e11d48,color:#fff,stroke:#be123c
    style QATask fill:#e11d48,color:#fff,stroke:#be123c
    style IMP fill:#2563eb,color:#fff,stroke:#1d4ed8
    style AT fill:#2563eb,color:#fff,stroke:#1d4ed8
    style PR fill:#2563eb,color:#fff,stroke:#1d4ed8
    style Deploy fill:#7c3aed,color:#fff,stroke:#6d28d9
```

## Postman Migration Path

```mermaid
flowchart TD
    PM([Postman Collection]) --> PMSkill[postman skill<br/>Parse collection + environment]
    PMSkill --> PMArch[2.2 QA Architecture<br/>qa-architect skill]
    PMArch --> PMScript[2.3 Test Script Design<br/>playwright-testing + playwright-rules]
    PMScript --> PMTask[2.4 QA Task Design]
    PMTask --> PMRun[3.2 Automated Testing]
    PMRun --> PMPR[3.3 Pull Request]
    Note1[Skips Phase 1.x + 2.1<br/>Starts from existing Postman specs]

    style PM fill:#d97706,color:#fff,stroke:#b45309
    style PMSkill fill:#e11d48,color:#fff,stroke:#be123c
    style PMArch fill:#e11d48,color:#fff,stroke:#be123c
    style PMScript fill:#e11d48,color:#fff,stroke:#be123c
    style PMTask fill:#e11d48,color:#fff,stroke:#be123c
    style PMRun fill:#2563eb,color:#fff,stroke:#1d4ed8
    style PMPR fill:#2563eb,color:#fff,stroke:#1d4ed8
    style Note1 fill:#475569,color:#fff,stroke:#334155
```

## System Skills Integration (Unified Memory + Knowledge)

```mermaid
flowchart TD
    SessionStart([Session Start]) --> Bootstrap{unified-memory exists?}
    Bootstrap -->|No| Init[Step 0: Auto-init]
    Bootstrap -->|Yes| MemLoad[Load state.md + user-profile.md]
    Init --> MemLoad
    MemLoad --> HasContext{Has saved context?}
    HasContext -->|Yes| Resume[Resume from checkpoint]
    HasContext -->|No| Fresh[Start fresh]
    Resume --> Nudge[Nudge check: max 3]
    Fresh --> Nudge
    Nudge --> SkillSuggest[Skill suggestions: ACTIVE only]
    SkillSuggest --> AIDLC[AIDLC Workflow]

    AIDLC --> KnowCheck[Check knowledge index]
    KnowCheck --> HasTemplate{Existing template?}
    HasTemplate -->|Yes| Reuse[Reuse + adapt]
    HasTemplate -->|No| NewCode[Write new + auto-capture]
    Reuse --> Execute[Execute Phase]
    NewCode --> Execute

    Execute --> Phase32[Phase 3.2 Test Run]
    Phase32 --> TestResult{Tests Pass?}
    TestResult -->|Pass| ScoreUp[score +0.5 + evolution_log]
    TestResult -->|Fail| ScoreDown[score -1.0 + capture failure]
    ScoreUp --> SessionEnd
    ScoreDown --> Heal[Self-Healing] --> Phase32

    SessionEnd([Session End]) --> MemSave[Save to palace]
    MemSave --> SearchIdx[Update search indexes: keyword-index + date-index + search-index.md]
    SearchIdx --> SkillCrystal{Pattern repeated?}
    SkillCrystal -->|Yes| AutoDraft[Auto-crystallize DRAFT]
    SkillCrystal -->|No| ProfileUpdate[Update user-profile.md]
    AutoDraft --> ProfileUpdate
    ProfileUpdate --> KnowSync[Sync scores + evolution_log]
    KnowSync --> Done([Done])

    style SessionStart fill:#16a34a,color:#fff,stroke:#15803d
    style SessionEnd fill:#16a34a,color:#fff,stroke:#15803d
    style Done fill:#16a34a,color:#fff,stroke:#15803d
    style Init fill:#475569,color:#fff,stroke:#334155
    style MemLoad fill:#16a34a,color:#fff,stroke:#15803d
    style MemSave fill:#16a34a,color:#fff,stroke:#15803d
    style Nudge fill:#7c3aed,color:#fff,stroke:#6d28d9
    style SkillSuggest fill:#7c3aed,color:#fff,stroke:#6d28d9
    style KnowCheck fill:#2563eb,color:#fff,stroke:#1d4ed8
    style KnowSync fill:#2563eb,color:#fff,stroke:#1d4ed8
    style SearchIdx fill:#2563eb,color:#fff,stroke:#1d4ed8
    style SkillCrystal fill:#475569,color:#fff,stroke:#334155
    style AutoDraft fill:#d97706,color:#fff,stroke:#b45309
    style ProfileUpdate fill:#7c3aed,color:#fff,stroke:#6d28d9
    style Reuse fill:#16a34a,color:#fff,stroke:#15803d
    style NewCode fill:#d97706,color:#fff,stroke:#b45309
    style ScoreUp fill:#16a34a,color:#fff,stroke:#15803d
    style ScoreDown fill:#dc2626,color:#fff,stroke:#b91c1c
    style Heal fill:#dc2626,color:#fff,stroke:#b91c1c
    style AIDLC fill:#475569,color:#fff,stroke:#334155
    style Execute fill:#475569,color:#fff,stroke:#334155
```
