# Discovery & Domain Analysis

Find what already exists (concrete scan) and match abstract patterns across domains (abstract scan) before building anything new.
Combines Resources Discovery with Domain Analysis into a single flow.

## When to use

- Starting work on a new feature in an existing codebase
- About to create a new utility, component, or helper
- Want to avoid duplicating work that's already been done
- Working on a new PBI for an existing system (Incremental Discovery)
- Need to estimate how much can be reused vs built from scratch
- Cross-domain pattern recognition

## How it works

Execute all phases sequentially and silently (🚫 DO NOT output to user until Phase 7).

### Phase 1: Load Implementation Context

- Read `implementation[SYSTEM_FEATURE_CAMEL].md` if it exists
- Extract: "Existing Assets", "Architecture Design", "Templates Found"
- If file doesn't exist → new system/feature → continue with empty context

### Phase 2: Index Scan (Concrete)

- Determine category from workflow_type:
  - `api_automation` | `postman_migration` → api
  - `webui_automation` → webUi
  - `android_automation` | `ios_automation` → mobile
- Load category index directly (no master index needed):
  - API: `{knowledge_root}/automation/api/apiIndex.json`
  - UI: `{knowledge_root}/automation/webUi/webUiIndex.json`
  - Mobile: `{knowledge_root}/automation/mobile/mobileIndex.json`
- Nano scan `{knowledge_root}/automation/common/commonIndex.json` → extract subCategories only
- Nano scan lessons index based on workflow_type:
  - api: `{knowledge_root}/lessons/api/apiLessonsIndex.json`
  - webUi: `{knowledge_root}/lessons/webUi/webUiLessonsIndex.json`
  - mobile: `{knowledge_root}/lessons/mobile/mobileLessonsIndex.json`
- Deep Abstraction Match for lessons:
  1. Identify abstract technical concern of each sub-feature
  2. Analogical Reasoning: "What category handles the same abstract concern?"
     - "login flow" / "token" / "session" → auth
     - "file upload" / "attachment" → file
     - "element not found" / "overlay" → visibility/locator
     - "wait for response" / "async" → timing
  3. Match against ALL category keys + popular_patterns
  4. Never conclude "no match" based on category name alone

### Phase 3: Full Feature Asset Scan (Concrete)

- Read the ENTIRE feature directory to understand the full picture
- Check all directories for `[SYSTEM_FEATURE_KEBAB]`:
  - api: `tests/api-testing/helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/` and `tests/api-testing/fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/`
  - webUi: `tests/web-testing/pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/` and `tests/web-testing/helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/`
  - android: `tests/mobile-testing/pages/android/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/` and `tests/mobile-testing/helpers/shared-services/`
  - ios: `tests/mobile-testing/pages/ios/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/` and `tests/mobile-testing/helpers/shared-services/`
  - ALL: Check `tests/shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/`
- If path not found → listDirectory on `tests/` root to discover actual structure → update paths and retry
- Deep read: extract class names, method signatures, existing locators, internal logic
- Classify (Anti-Redundancy Rule):
  - `reuse` — already does what you need, use as-is
  - `extend` — close enough, add a method or parameter
  - `create` — ONLY if NO existing asset or template can be repurposed

### Phase 3.1: Similar Features (In-Context Learning)

- Search for tests with similar keywords (translate Thai → English abstract terms first)
- Read top 2-3 most relevant similar test files
- Extract: test structure, class/method design, patterns

### Phase 3.2: Test Data Library

- Search `testScenarioIndex.json` for matching system/feature
- Match by data structure similarity, field name patterns
- Extract: field structure, validation rules, relationships, boundary values

### Phase 4: Abstract Domain Matching

- Nano scan `{knowledge_root}/business/businessIndex.json` → extract categories keywords and paths
  - **If file does not exist → skip Phase 4, set Reusability Score = 0%, continue to Phase 5**
- Nano scan `{knowledge_root}/automation/common/commonIndex.json` → extract subCategories
- Compare PBI against ALL available domains using Deep Abstraction:
  - Forget specific context — look at flow: Input → Process → Output
  - Never conclude "no match" based on domain name alone
  - If no surface match, abstract deeper until only flow pattern remains
  - Stop condition: If abstracted to generic I/O with no structural similarity → "no domain match", set Reusability Score = 0%, continue to Phase 5

#### Deep Abstraction Protocol

```text
"Forget 'medicine', 'room', 'product'
Look at Flow: Lookup → Validate → Update
Find Abstract Level Patterns"
```

#### Step-Back for Domain Matching

```text
"What abstract problem does this PBI solve?
What is the Input → Process → Output pattern?"
```

#### Analogical Reasoning

```text
"Hotel Room = Product (availability concept)
Patient Bed = Inventory Item (status workflow)
Payment Process = Approval Flow (state machine)"
```

### Phase 4.1: Deep Logic Search

- Apply Deep Abstraction Protocol (remove specific context)
- Analyze: Input → Process → Output pattern
- Search reusable logic (BL_XXX, UA_XXX) in matching domains
- Load `{knowledge_root}/business/{domain}/business{Domain}Rules.json` for top matches
  - If file doesn't exist → note as "domain identified but no rules file yet" — do NOT hallucinate IDs
- 🚫 DO NOT output to user

### Phase 4.2: Common vs Specific Validation

For each logic item, ask 3 questions:
- Q1: Does this work in any industry without modification? → Common
- Q2: Does it need business context to make sense? → Domain-Specific
- Q3: Is it tied to company-specific rules or regulations? → Company-Specific

| Answer | Classification | Example |
|--------|---------------|---------|
| Q1 = Yes | Common | Auth, CRUD, pagination, file upload |
| Q2 = Yes | Domain-Specific | Tax calculation, insurance claim, booking rules |
| Q3 = Yes | Company-Specific | Custom approval workflow, internal pricing formula |

### Phase 5: Dynamic Matching with Templates

- Analyze existing assets (Phase 3) + architecture pattern + requirements
- Match templates ONLY for parts classified as "create"
- Filter: keep only matching items

### Phase 5.1: Gap Analysis (from Discovery)

- Compare required vs available assets (from Phase 3 + Phase 4)
- Identify missing assets with estimated effort
- Prioritize: Critical > High > Medium > Low

### Phase 5.2: Business Logic Extraction

- From matched domains (Phase 4), extract:
  - Validation rules
  - Business constraints
  - Data format requirements
  - Workflow logic
- Load `{knowledge_root}/business/{domain}/business{Domain}Rules.json` for matched domains only
  - If file doesn't exist → note as "domain identified but no rules file yet" — do NOT hallucinate IDs
- If no business rules found → continue to Phase 6

### Phase 6: Reusability Score & Knowledge Buffer

**Reusability Score:**
- Formula: (confirmed reuse + extend items from Phase 3 + confirmed BL_XXX/UA_XXX from Phase 4) / total required × 100
- Only count items read from actual file content — never estimate
- 🟢 >80% | 🟡 60-80% | 🔴 <60%

**Impact Assessment:**
- Design Impact: what can be reused in test scenarios
- Data Impact: what test data patterns can be adapted
- Implementation Impact: what new logic needs to be recorded
- Formulate "Lego Assembly" Strategy: combine best logic from multiple domains

**Knowledge Buffer Capture:**
- Identify new patterns NOT in templates and NOT in codebase
- "Reusable 2+ features" = abstract concern appears in ≥2 distinct sub-features or is cross-cutting (auth, error handling, file ops)
- Determine strategy: Reuse / Adapt / Create

### Phase 7: Write to File (MANDATORY — DO NOT SKIP)

- Write complete Discovery & Domain Analysis output to the appropriate file:
  - If workflow = test_scenario → `testScenarioPbi{pbi_id}.md` Appendix A
  - If workflow = api_automation | webui_automation → `implementation[SYSTEM_FEATURE_CAMEL].md` Appendix A
  - If no implementation plan exists → write to `.aidlc/[system]/[feature]/outputs/inception/domain-gap-analysis.md`
- OUTPUT TO USER: "✅ Discovery & Domain Analysis recorded to file" (ONLY this message, NOT the analysis itself)

## Output Format (written to file, not chat)

```markdown
## Discovery & Domain Analysis

### Existing Assets
- [N] assets found (reuse/extend/create classification)
- Templates Found: [N] matched
- Lessons Learned: [N] applicable
- Similar Features: [N] found
- Test Data Library: Found/Not found

### Abstract Pattern
- Core Function: [abstract description]
- Input Pattern: [data/request type]
- Process Pattern: [transformation logic]
- Output Pattern: [result/response type]

### Domain Match Analysis
- Domain A (XX%): [why similar] — Reusable: [BL_XXX, UA_XXX]
- Domain B (XX%): [why similar] — Reusable: [BL_XXX, UA_XXX]

### Common vs Specific Validation
| Logic Item | Q1 | Q2 | Q3 | Classification |
|---|---|---|---|---|
| [item] | Yes/No | Yes/No | Yes/No | Common/Domain-Specific/Company-Specific |

### Reusability Score: XX% [🟢 >80% | 🟡 60-80% | 🔴 <60%]

### Impact Assessment
- Design: [what can be reused]
- Data: [what test data patterns can be adapted]
- New: [what needs to be built from scratch]

### Lego Assembly Strategy
1. [sub-feature] → [domain expert / existing asset]
2. [sub-feature] → [domain expert / existing asset]

### Knowledge Buffer
- [N] new patterns captured
- Strategy: [Reuse / Adapt / Create]
```

## Classification Decision Tree

```text
Does existing code do exactly what I need?
  → Yes: reuse
  → Partially: extend
  → No match at all: create
```

## Smart-Copy Rule

When using templates or existing code:
1. Read source template file
2. Select only the needed function/class
3. Trace its dependencies
4. Copy function + dependencies only
- ❌ Forbidden: bulk copy entire file
- ✅ Allowed: copy only function + dependencies

## Rules

- Never guess IDs — only cite what's confirmed in actual files
- Never conclude "no match" based on domain name alone — abstract deeper
- Combine best parts from multiple domains ("Lego Assembly") rather than forcing one domain to fit
- Must compare with ALL available domains, not just obvious ones
- Must calculate reusability percentage from real items
- Always search before creating — the #1 source of tech debt is duplicate code nobody knew existed
- Search by abstract concept, not exact name — "auth flow" might be called `loginService`, `authHelper`, or `tokenManager`
- If PBI keywords are Thai → translate to English abstract terms first before searching
- **MUST write results to file — never output analysis in chat**

## Common Pitfalls

- ❌ Checking only "common" or 1 domain → Fix: read businessIndex.json and compare ALL domains
- ❌ Vague logic (no file read, no BL_XXX ID) → Fix: must read business{Domain}Rules.json and cite actual IDs
- ❌ Guessing percentages → Fix: count actual items (total vs reusable) and calculate
- ❌ Giving up too soon (concluding 0% by domain name) → Fix: use Deep Abstraction until only flow pattern remains
- ❌ Outputting analysis in chat → Fix: write to file, only say "✅ Discovery & Domain Analysis recorded to file"
- ❌ Creating new asset without checking existing → Fix: always run Phase 3 Asset Scan first
- ❌ Bulk copying entire template file → Fix: Smart-Copy Rule — function + dependencies only

## Tips

- If >60% can be reused, the feature is cheaper than it looks
- If <30% can be reused, consider whether the existing architecture fits at all
- This takes 30 seconds of thinking but saves hours of rework
