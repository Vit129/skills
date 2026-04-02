# Domain Analysis

Map business logic across domains and find reusable patterns.

## When to use
- Starting a new feature and want to know if similar logic exists elsewhere
- Need to estimate how much can be reused vs built from scratch
- Cross-domain pattern recognition
- Assessing domain impact on workflow steps

## How it works

### Step 1: Concept Mapping
- Nano scan `ai-agent/knowledge/business/businessIndex.json` → extract categories keywords and paths
  - If file does not exist → skip Steps 1-2, set Reusability Score = 0%, continue to Step 3
- Nano scan `ai-agent/knowledge/automation/common/commonIndex.json` → extract subCategories
- Compare PBI against ALL available domains using Deep Abstraction:
  - Forget specific context — look at flow: Input → Process → Output
  - Never conclude "no match" based on domain name alone
  - If no surface match, abstract deeper until only flow pattern remains
  - Stop condition: If abstracted to generic I/O with no structural similarity → "no domain match"

### Step 2: Deep Abstraction & Logic Search
- Apply Deep Abstraction Protocol (remove specific context)
- Analyze: Input → Process → Output pattern
- Search reusable logic (BL_XXX, UA_XXX) in matching domains
- Load `ai-agent/knowledge/business/{domain}/business{Domain}Rules.json` for top matches
  - If file doesn't exist → note as "domain identified but no rules file yet" — do NOT hallucinate IDs
- Calculate Reusability Score:
  - Formula: (confirmed BL_XXX + UA_XXX items) / total logic units required × 100
  - Only count items read from actual file content — never estimate

### Step 3: Impact Assessment
- Design Impact: what can be reused in test scenarios
- Data Impact: what test data patterns can be adapted
- Implementation Impact: what new logic needs to be recorded
- Formulate "Lego Assembly" Strategy: combine best logic from multiple domains

### Step 4: Common vs Specific Validation
For each piece of logic, ask 3 questions:
- Q1: Does this work in any industry without modification? → Common
- Q2: Does it need business context to make sense? → Domain-Specific
- Q3: Is it tied to company-specific rules or regulations? → Company-Specific

| Answer | Classification | Example |
|--------|---------------|---------|
| Q1 = Yes | Common | Auth, CRUD, pagination, file upload |
| Q2 = Yes | Domain-Specific | Tax calculation, insurance claim, booking rules |
| Q3 = Yes | Company-Specific | Custom approval workflow, internal pricing formula |

## AI Techniques Used

### Step-Back Prompting
```
"What abstract problem does this PBI solve?
What is the Input → Process → Output pattern?"
```

### Analogical Reasoning
```
"Hotel Room = Product (availability concept)
Patient Bed = Inventory Item (status workflow)
Payment Process = Approval Flow (state machine)"
```

### Deep Abstraction Protocol
```
"Forget 'medicine', 'room', 'product'
Look at Flow: Lookup → Validate → Update
Find Abstract Level Patterns"
```

## Rules
- Never guess IDs — only cite what's confirmed in actual files
- Never conclude "no match" based on domain name alone — abstract deeper
- Combine best parts from multiple domains ("Lego Assembly") rather than forcing one domain to fit
- Must compare with ALL available domains, not just obvious ones
- Must calculate reusability percentage from real items

## Common Pitfalls
- ❌ Checking only "common" or 1 domain → Fix: read businessIndex.json and compare ALL domains
- ❌ Vague logic (no file read, no BL_XXX ID) → Fix: must read business{Domain}Rules.json and cite actual IDs
- ❌ Guessing percentages → Fix: count actual items (total vs reusable) and calculate
- ❌ Giving up too soon (concluding 0% by domain name) → Fix: use Deep Abstraction until only flow pattern remains

## Output
```
Abstract Pattern: [Input → Process → Output]
Domain A (XX%): [why similar] — Reusable: [BL_XXX, UA_XXX]
Domain B (XX%): [why similar] — Reusable: [BL_XXX, UA_XXX]
Gap: [new items needed]
Reusability Score: XX% [🟢 >80% | 🟡 60-80% | 🔴 <60%]

Impact:
- Design: reuse [items] in pre-conditions
- Data: adapt patterns from [domain]
- New: record [new items] to knowledge base

AI Strategy: "Lego Assembly"
1. Deconstruct PBI into sub-features
2. Find domain expert in each sub-feature
3. Assemble logic across domains
4. If selecting only one domain, must explain why it covers >80%
```
