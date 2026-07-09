# Gap Analysis

Compare what's required vs what's available, then prioritize what's missing.

## When to use
- After domain analysis — know what's reusable, need to find what's not
- Before implementation — need to estimate effort for new logic
- Validating completeness of a design

## How it works

### Step 1: Extract Required Logic
- Analyze PBI requirements from Context Analysis
- Extract: business rules, validation rules, UI actions, calculations
- List all logic items needed for implementation

### Step 2: Match Against Domain Results
- Input: Domain Analysis results (selected domains, reusable BL/UA items)
- If Domain Analysis was NOT run → treat all required logic as "No Match"
- Compare required vs available
- Classify: Direct Match (100%), Partial Match (50%), No Match (0%)

### Step 3: Calculate Metrics
- Total Required = count of distinct logic items from Step 1
- Reusable count = items classified as Direct Match or Partial Match
- Reusable (%) = Reusable count / Total Required × 100
- Missing (%) = 100 - Reusable (%)
- Gap = any item where confidence < 80%

### Step 4: Prioritize Gaps by Impact
- **Critical** — system can't function without it (authentication, core validation)
- **High** — wrong business results (calculations, business rules)
- **Medium** — poor user experience (UI feedback, error handling)
- **Low** — nice to have (advanced features, shortcuts)

### Step 5: Effort Estimation
For each gap item:
- Business impact scoring (1-10)
- Implementation effort estimation (hours)
- Risk assessment (High/Medium/Low)
- Dependency mapping (prerequisite logic)

## Output
```
Required Logic: [N] items
Reusable: [N] ([XX]%)
Missing: [N] ([XX]%)

Critical: [list with BL_NEW_XXX IDs]
High: [list]
Medium: [list]
Low: [list]

Total estimated effort: [N] hours
```

## Step 6: Write to File (MANDATORY — DO NOT SKIP)

Write the full gap analysis output to the appropriate file:
- If actively tracking a feature (`agent-memory/plans/[feature]/CONTEXT.md` exists) → append to its Completed section
- If implementation plan exists → append to `implementationPlan[FEATURE].md` Appendix
- If neither exists → write to `agent-memory/plans/[feature]/outputs/inception/gap-analysis.md`

**OUTPUT TO USER (chat summary only):**
```
✅ Gap Analysis recorded to [file]
Required: [N] items | Reusable: [N] ([XX]%) | Missing: [N] ([XX]%)
Critical gaps: [N] | Estimated effort: [N] hours
```
Full details in file — do NOT dump full analysis in chat.

## Blocking Gap Handling

If Critical gaps are found that cannot be inferred (undefined business rules, missing AC):

```
⚠️ Blocking Gaps Found — ไม่สามารถดำเนินการต่อได้โดยไม่มีข้อมูลเพิ่มเติม:
- [gap 1]: [why it's blocking]
- [gap 2]: [why it's blocking]

กรุณาเลือก:
1. ให้ข้อมูลเพิ่มเติม แล้วพิมพ์ "ทำต่อ"
2. ดำเนินการต่อโดยไม่มีข้อมูลส่วนนั้น (scenario อาจไม่ครบถ้วน)
```

🛑 WAIT for user response before proceeding.

Non-blocking gaps (High/Medium/Low) → document and continue without waiting.
