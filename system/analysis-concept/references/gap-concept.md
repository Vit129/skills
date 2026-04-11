# Gap Analysis Concept

Compare what's required vs what's available, then prioritize what's missing.

Adapted from: `ai-dlc/core/analysis-skills/references/gap.md`

## When to use

- After discovery — know what's reusable, need to find what's not
- Before implementation — need to estimate effort for new work
- Validating completeness of a design or plan

## Thinking Pattern

### Step 1: Extract Required {Items}

- Analyze requirements from Context Analysis
- Extract all {items} needed: rules, actions, structures, logic
- List all distinct {items} needed for completion

### Step 2: Match Against Available {Assets}

- Input: Discovery results (existing {assets}, reusable {items})
- If Discovery was NOT run → treat all required {items} as "No Match"
- Compare required vs available
- Classify:
  - Direct Match (100%) — exists and fits
  - Partial Match (50%) — exists but needs adaptation
  - No Match (0%) — must be created

### Step 3: Calculate Metrics

- Total Required = count of distinct {items} from Step 1
- Reusable = items classified as Direct Match or Partial Match
- Reusable (%) = Reusable / Total Required × 100
- Missing (%) = 100 - Reusable (%)
- Gap = any item where confidence < 80%

### Step 4: Prioritize Gaps by Impact

- **Critical** — system can't function without it
- **High** — wrong results or broken logic without it
- **Medium** — poor experience or quality without it
- **Low** — nice to have, not blocking

### Step 5: Effort Estimation

For each gap item:
- Impact scoring (1-10)
- Effort estimation (hours or relative size)
- Risk assessment (High/Medium/Low)
- Dependency mapping (what must come first)

## Output Pattern

```text
Required {Items}: [N] items
Reusable: [N] ([XX]%)
Missing: [N] ([XX]%)

Critical: [list]
High: [list]
Medium: [list]
Low: [list]

Total estimated effort: [N] {unit}
```

## Tips

- Gap analysis is only as good as the Discovery that feeds it
- If everything shows "No Match" → either Discovery was skipped or the domain is truly new
- Focus effort on Critical + High gaps first — Low gaps can wait
