# Export Workflow

## Input Sources (auto-detected, priority order)

1. `agent-memory/MEMORY.md` Decisions section — requirements and decisions
2. `agent-memory/plans/[feature]/` phase outputs (inception, task design)
3. User-specified file path — any markdown/text file with requirements
4. Chat context — requirements provided inline by user

## Fields to Extract

| Field | Description | Required |
|-------|-------------|----------|
| ID | Requirement identifier (REQ-001, US-001) | Yes |
| Title | Short title/summary | Yes |
| Description | Full requirement text | Yes |
| Type | Functional / Non-functional / Constraint | No |
| Priority | Must / Should / Could / Won't (MoSCoW) | No |
| Acceptance Criteria | Testable conditions | No |
| Status | Draft / Approved / Implemented / Verified | No |
| Sprint | Sprint assignment | No |

## Steps

### Step 1: Identify Source
```
1. Scan agent-memory/plans/ for existing requirement files
2. If not found → ask user for source file or inline content
3. Parse requirements into structured data
```

### Step 2: Parse
Extract required fields. Auto-generate IDs if missing.

### Step 3: Generate Output
Format as CSV, Text, MD, or PDF (see formats.md).

### Step 4: Save
Output path: `agent-memory/plans/[feature]/exports/requirements-{date}.{ext}`

## AIDLC Integration

```
Phase 1 (Inception) → DECISIONS.md created
                          │
                          ▼
              req-exporter → CSV/MD/PDF/Text
                          │
                          ▼
              Share with stakeholders / Import to PM tool
```
